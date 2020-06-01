import wildcardMiddleware from 'socketio-wildcard';
import { TreeItem, Color, Plane, Camera, LDRImage, Disc, Label, Material, GeomItem, Xfo, Vec3, VideoStreamImage2D, Cuboid, Lines, Quat, BaseItem, typeRegistry } from '@zeainc/zea-engine';
import { UndoRedoManager, SelectionManager } from '@zeainc/zea-ux';

// Note: this import is disabled for the rawimport version of collab

// import debug from 'debug'

const private_actions = {
  JOIN_ROOM: 'join-room',
  PING_ROOM: 'ping-room',
  LEAVE_ROOM: 'leave-room',
};

class Session {
  constructor(userData, socketUrl) {
    this.userData = userData;
    this.socketUrl = socketUrl;
    this.users = {};
    this.userStreams = {};
    this.callbacks = {};

    this.envIsBrowser = typeof window !== 'undefined';

    // this.debugCollab = debug('zea-collab')
  }

  stopCamera(publish = true) {
    if (this.stream) {
      this.stream.getVideoTracks()[0].enabled = false;
      if (publish) this.pub(Session.actions.USER_VIDEO_STOPPED, {});
    }
  }

  startCamera(publish = true) {
    if (this.stream) {
      this.stream.getVideoTracks()[0].enabled = true;
      if (publish) this.pub(Session.actions.USER_VIDEO_STARTED, {});
    }
  }

  muteAudio(publish = true) {
    if (this.stream) {
      this.stream.getAudioTracks()[0].enabled = false;
      if (publish) this.pub(Session.actions.USER_VIDEO_STOPPED, {});
    }
  }

  unmuteAudio(publish = true) {
    if (this.stream) {
      this.stream.getAudioTracks()[0].enabled = true;
      if (publish) this.pub(Session.actions.USER_AUDIO_STARTED, {});
    }
  }

  getVideoStream(userId) {
    return this.userStreams[userId]
  }

  setVideoStream(remoteStream, userId) {
    if (this.userStreams[userId]) {
      return
    }

    const video = document.createElement('video');
    video.srcObject = remoteStream;
    this.userStreams[userId] = video;

    video.onloadedmetadata = () => {
      video.play();
    };

    document.body.appendChild(video);
  }

  isJoiningTheSameRoom(roomId) {
    return (
      this.roomId === roomId
    )
  }

  joinRoom(roomId) {
    this.roomId = roomId;

    /*
     * Socket actions.
     */
    this.leaveRoom();

    this.socket = io(this.socketUrl, {
      'sync disconnect on unload': true,
      query: `userId=${this.userData.id}&roomId=${this.roomId}`,
    });

    const patch = wildcardMiddleware(io.Manager);
    patch(this.socket);

    // Emit all messages, except the private ones.
    this.socket.on('*', (packet) => {
      const [messageType, message] = packet.data;
      if (messageType in private_actions) return
      this._emit(messageType, message.payload, message.userId);
    });

    if (this.envIsBrowser) {
      window.addEventListener('beforeunload', () => {
        this.leaveRoom();
      });
    }

    this.pub(private_actions.JOIN_ROOM);

    this.socket.on(private_actions.JOIN_ROOM, (message) => {
      // this.debugCollab(`${private_actions.JOIN_ROOM}:\n%O`, message)

      const incomingUserData = message.userData;
      this._addUserIfNew(incomingUserData);

      this.pub(private_actions.PING_ROOM);
    });

    this.socket.on(private_actions.LEAVE_ROOM, (message) => {
      // this.debugCollab(`${private_actions.LEAVE_ROOM}:\n%O`, message)

      const outgoingUserData = message.userData;
      const outgoingUserId = outgoingUserData.id;
      if (outgoingUserId in this.users) {
        delete this.users[outgoingUserId];
        this._emit(Session.actions.USER_LEFT, outgoingUserData);
        return
      }
      // this.debugCollab('Outgoing user was not found in room.')
    });

    this.socket.on(private_actions.PING_ROOM, (message) => {
      // this.debugCollab(`${private_actions.PING_ROOM}:\n%O`, message)

      const incomingUserData = message.userData;
      this._addUserIfNew(incomingUserData);
    });

    /*
     * RTC
    const myPhoneNumber = `${this.roomId}${this.userData.id}`
    // this.debugCollab('myPhoneNumber:', myPhoneNumber)

    this.peer = new Peer(myPhoneNumber, {
      debug: 2,
    })

    // Receive calls.
    this.peer.on('call', mediaConnection => {
      this._prepareMediaStream()
        .then(() => {
          mediaConnection.answer(this.stream)
          mediaConnection.on('stream', remoteStream => {
            const remoteUserId = mediaConnection.peer.substring(
              mediaConnection.peer.length - 16
            )
            this.setVideoStream(remoteStream, remoteUserId)
          })
        })
        .catch(err => {
          // this.debugCollab('Failed to get local stream', err)
        })
    })

    this.peer.on('error', err => {
      // this.debugCollab('Peer error:', err)
    })

    window.addEventListener('beforeunload', () => {
      this.peer.destroy()
    })

    this.socket.on(private_actions.JOIN_ROOM, message => {
      const { userData: newUserData } = message.payload
      this._prepareMediaStream()
        .then(() => {

          // Make call to the user who just joined the room.
          const roommatePhoneNumber = `${this.roomId}${newUserData.id}`

          if (this.peer.disconnected) {
            // this.debugCollab('Peer disconnected. Reconnecting.')
            this.peer.reconnect()
          }

          const mediaConnection = this.peer.call(
            roommatePhoneNumber,
            this.stream
          )
          mediaConnection.on('stream', remoteStream => {
            this.setVideoStream(remoteStream, newUserData.id)
          })
        })
        .catch(err => {
          // this.debugCollab('Failed to get local stream', err)
        })
    })
     */
  }

  _prepareMediaStream() {
    if (this.__streamPromise) return this.__streamPromise
    this.__streamPromise = new window.Promise((resolve, reject) => {
      if (this.stream) {
        resolve();
        return
      }

      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            width: 400,
            height: 300,
          },
        })
        .then((stream) => {
          this.stream = stream;
          this.stopCamera(false);
          this.muteAudio(false);
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });

    return this.__streamPromise
  }

  leaveRoom() {
    // Instruct Collab's clients to cleanup session user data.
    this._emit(Session.actions.LEFT_ROOM);
    this.users = {};
    // Notify room peers and close socket.
    if (this.socket) {
      this.pub(private_actions.LEAVE_ROOM, undefined, () => {
        this.socket.close();
      });
    }
  }

  _addUserIfNew(userData) {
    if (!(userData.id in this.users)) {
      this.users[userData.id] = userData;

      this._emit(Session.actions.USER_JOINED, userData);
    }
  }

  getUsers() {
    return this.users
  }

  getUser(id) {
    return this.users[id]
  }

  pub(messageType, payload, ack) {
    if (!messageType) throw new Error('Missing messageType')

    this.socket.emit(
      messageType,
      {
        userData: this.userData,
        userId: this.userData.id,
        payload,
      },
      ack
    );
  }

  _emit(messageType, payload, userId) {
    const callbacks = this.callbacks[messageType];
    if (callbacks) {
      callbacks.forEach((callback) => callback(payload, userId));
    }
  }

  sub(messageType, callback) {
    if (!messageType) throw new Error('Missing messageType')
    if (!callback) throw new Error('Missing callback')

    const callbacks = this.callbacks[messageType];
    this.callbacks[messageType] = this.callbacks[messageType] || [];
    this.callbacks[messageType].push(callback);

    const unsub = () => {
      this.callbacks[messageType].splice(
        this.callbacks[messageType].indexOf(callback),
        1
      );
    };

    return unsub
  }
}

Session.actions = {
  USER_JOINED: 'user-joined',
  USER_VIDEO_STARTED: 'user-video-started',
  USER_VIDEO_STOPPED: 'user-video-stopped',
  USER_AUDIO_STARTED: 'user-audio-started',
  USER_AUDIO_STOPPED: 'user-audio-stopped',
  USER_LEFT: 'user-left',
  LEFT_ROOM: 'left-room',
  TEXT_MESSAGE: 'text-message',
  POSE_CHANGED: 'pose-message',
  COMMAND_ADDED: 'command-added',
  COMMAND_UPDATED: 'command-updated',
  FILE_WITH_PROGRESS: 'file-with-progress',
};

class SessionFactory {
  static setSocketURL(socketUrl) {
    this.socketUrl = socketUrl;
  }

  static getInstance(user, projectId, fileId, roomId) {
    if (!this.session) {
      if (!this.socketUrl) {
        throw new Error('Missing #socketUrl. Call #setSocketURL first.')
      }

      this.session = new Session(user, this.socketUrl);
    }

    if (!this.session.isJoiningTheSameRoom(projectId, fileId, roomId)) {
      this.session.joinRoom(projectId, fileId, roomId);
    }

    return this.session
  }

  static getCurrentSession() {
    return this.session
  }
}

function genID() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return (
    '_' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  )
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

class SessionRecorder {
  constructor(session) {
    this.session = session;

    // TODO: Check for credentials on the user.
    {
      const pictures = [
        'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
      ];

      const data = {};
      let recording = false;
      let presenter;
      let pub;
      let stream;
      this.__startRecording = () => {
        if (recording) return
        recording = true;
        const picIndex = getRandomInt(pictures.length);
        presenter = {
          id: genID(),
          picture: pictures[picIndex],
          name: 'Presenter' + Object.keys(data).length,
        };

        stream = [];
        let msg = {
          messageType: 'user-joined',
          payload: presenter,
        };
        let prev_t = performance.now();
        pub = this.session.pub;
        this.session.pub = (messageType, payload) => {
          // Record the time since the previous
          // message and save it to the previous message.
          const t = performance.now();
          msg.ms = t - prev_t;
          stream.push(msg);
          msg = {
            messageType,
            payload,
          };
          prev_t = t;
          pub.call(this.session, messageType, payload);
        };
      };

      this.__stopRecording = () => {
        stream.push({
          messageType: 'user-left',
          payload: presenter,
        });

        data[presenter.id] = stream;

        this.session.pub = pub;

        this.__playRecording(data);
      };
    }
  }
  
  startRecording() {
    this.__startRecording();
  }
  
  stopRecording() {
    this.__stopRecording();
  }

  __stopPlayback() {
    for (let key in this.__timeoutIds) clearTimeout(this.__timeoutIds[key]);
    this.__timeoutIds = {};
  }

  __play(id, stream, done) {
    let i = 0;
    const next = () => {
      const msg = stream[i];
      this.session._emit(msg.messageType, msg.payload, id);
      i++;
      if (i < stream.length) {
        this.__timeoutIds[id] = setTimeout(next, msg.ms);
      } else {
        done();
      }
    };
    this.__timeoutIds[id] = setTimeout(next, 1000);
  }

  __playRecording(recording) {
    this.__stopPlayback();
    let count = 0;
    this.__timeoutIds = {};
    for (let key in recording) {
      count++;
      this.__play(key, recording[key], () => {
        count--;
        if (count == 0) this.__playRecording(recording);
      });
    }
  }
  
  downloadAndPlayRecording(url) {
    const file = this.__recordings[name];
    fetch(new Request(url))
      .then(response => {
        if (response.ok) {
          response.json().then(recording => {
            this.__playRecording(recording);
          });
        }
        else {
          throw new Error('404 Error: File not found.');
        }
      });
  }
}

const up = new Vec3(0, 0, 1);

/** Class representing an avatar. */
class Avatar {
  /**
   * Create an avatar.
   * @param {any} appData - The appData value.
   * @param {any} userData - The userData value.
   * @param {boolean} currentUserAvatar - The currentUserAvatar value.
   */
  constructor(appData, userData, currentUserAvatar = false) {
    this.__appData = appData;
    this.__userData = userData;
    this.__currentUserAvatar = currentUserAvatar;

    this.__treeItem = new TreeItem(this.__userData.id);
    this.__appData.renderer.addTreeItem(this.__treeItem);

    this.__avatarColor = new Color(userData.color || '#0000ff');
    this.__hilightPointerColor = this.__avatarColor;

    this.__plane = new Plane(1, 1);
    this.__uiGeomIndex = -1;

    if (!this.__currentUserAvatar) {
      this.__camera = new Camera();
      this.__cameraBound = false;

      let avatarImage;
      let geom;
      if (this.__userData.picture && this.__userData.picture != '') {
        avatarImage = new LDRImage('user' + this.__userData.id + 'AvatarImage');
        avatarImage.setImageURL(this.__userData.picture);
        geom = new Disc(0.5, 64);
      } else {
        const firstName = this.__userData.name || this.__userData.given_name || "";
        const lastName = this.__userData.lastName || this.__userData.family_name || "";
        avatarImage = new Label("Name");
        const bgColor = new Color(1, 1, 1, 0);
        avatarImage.getParameter('BackgroundColor').setValue(bgColor);
        avatarImage.getParameter('FontSize').setValue(42);
        avatarImage.getParameter('BorderRadius').setValue(42);
        avatarImage.getParameter('BorderWidth').setValue(1);
        avatarImage.getParameter('Margin').setValue(18);
        avatarImage.getParameter('Text').setValue(`${firstName.charAt(0)} ${lastName.charAt(0)}`);

        geom = new Plane(1, 1);
        avatarImage.labelRendered.connect((event) => {
          console.log(event);
          const aspect = event.width / event.height;
          // geom.getParameter('SizeX').setValue(0.1 * aspect)
          this.__avatarImageXfo.sc.set(0.15 * aspect, 0.15, 1);
          this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo);
        });
      }

      const avatarImageMaterial = new Material(
        'user' + this.__userData.id + 'AvatarImageMaterial',
        'FlatSurfaceShader'
      );
      avatarImageMaterial.getParameter('BaseColor').setValue(this.__avatarColor);
      avatarImageMaterial.getParameter('BaseColor').setImage(avatarImage);

      avatarImageMaterial.visibleInGeomDataBuffer = false;
      this.__avatarImageGeomItem = new GeomItem(
        'avatarImage',
        geom,
        avatarImageMaterial
      );

      this.__avatarImageXfo = new Xfo();
      this.__avatarImageXfo.sc.set(0.2, 0.2, 1);
      this.__avatarImageXfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI);
      this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo);
    }
  }

  /**
   * The attachRTCStream method.
   * @param {any} video - The video param.
   */
  attachRTCStream(video) {
    if (!this.__avatarCamGeomItem) {
      const videoItem = new VideoStreamImage2D('webcamStream');
      videoItem.setVideoStream(video);

      this.__avatarCamMaterial = new Material(
        'user' + this.__userData.id + 'AvatarImageMaterial',
        'FlatSurfaceShader'
      );
      this.__avatarCamMaterial
        .getParameter('BaseColor')
        .setValue(this.__avatarColor);
      this.__avatarCamMaterial.getParameter('BaseColor').setImage(videoItem);
      this.__avatarCamMaterial.visibleInGeomDataBuffer = false;
      this.__avatarCamGeomItem = new GeomItem(
        'avatarImage',
        this.__plane,
        this.__avatarCamMaterial
      );

      const sc = 0.02;
      this.__avatarCamXfo = new Xfo();
      this.__avatarCamXfo.sc.set(16 * sc, 9 * sc, 1);
      this.__avatarCamXfo.tr.set(0, 0, -0.1 * sc);
      this.__avatarCamGeomItem.setLocalXfo(this.__avatarCamXfo);

      const aspect = video.videoWidth / video.videoHeight;
      this.__avatarCamXfo.sc.x = this.__avatarCamXfo.sc.y * aspect;
      this.__avatarImageGeomItem.setLocalXfo(this.__avatarCamXfo);
    }

    if (this.__currentViewMode == 'CameraAndPointer') {
      this.__treeItem.getChild(0).removeAllChildren();
      this.__treeItem.getChild(0).addChild(this.__avatarCamGeomItem, false);
    }
  }

  /**
   * The detachRTCStream method.
   */
  detachRTCStream() {
    if (this.__currentViewMode == 'CameraAndPointer') {
      this.__treeItem.getChild(0).removeAllChildren();

      const sc = 0.02;
      this.__avatarImageXfo.sc.set(9 * sc, 9 * sc, 1);
      this.__avatarImageXfo.tr.set(0, 0, -0.1 * sc);
      this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo);
      this.__treeItem.getChild(0).addChild(this.__avatarImageGeomItem, false);
    }
  }

  /**
   * The getCamera method.
   * @return {any} The return value.
   */
  getCamera() {
    return this.__camera
  }

  /**
   * The bindCamera method.
   */
  bindCamera() {
    this.__cameraBound = true;

    const cameraOwner = this.__camera.getOwner();
    if (cameraOwner) {
      cameraOwner.traverse((subTreeItem) => {
        if (subTreeItem != this.__camera) subTreeItem.setVisible(false);
      });
    }
  }

  /**
   * The unbindCamera method.
   */
  unbindCamera() {
    this.__cameraBound = false;

    const cameraOwner = this.__camera.getOwner();
    if (cameraOwner) {
      cameraOwner.traverse((subTreeItem) => {
        if (subTreeItem != this.__camera) subTreeItem.setVisible(true);
      });
    }
  }

  /**
   * The setCameraAndPointerRepresentation method.
   */
  setCameraAndPointerRepresentation() {
    this.__treeItem.removeAllChildren();
    this.__currentViewMode = 'CameraAndPointer';

    if (this.__currentUserAvatar) return
    const sc = 0.02;
    const shape = new Cuboid(16 * sc, 9 * sc, 3 * sc, true); // 16:9
    const pinch = new Vec3(0.1, 0.1, 1);
    shape.getVertex(0).multiplyInPlace(pinch);
    shape.getVertex(1).multiplyInPlace(pinch);
    shape.getVertex(2).multiplyInPlace(pinch);
    shape.getVertex(3).multiplyInPlace(pinch);

    shape.computeVertexNormals();
    const material = new Material(
      'user' + this.__userData.id + 'Material',
      'SimpleSurfaceShader'
    );
    material.visibleInGeomDataBuffer = false;
    material.getParameter('BaseColor').setValue(this.__avatarColor);
    const geomItem = new GeomItem('camera', shape, material);
    const geomXfo = new Xfo();
    geomItem.setGeomOffsetXfo(geomXfo);

    const line = new Lines();
    line.setNumVertices(2);
    line.setNumSegments(1);
    line.setSegment(0, 0, 1);
    line.getVertex(0).set(0.0, 0.0, 0.0);
    line.getVertex(1).set(0.0, 0.0, 1.0);
    line.setBoundingBoxDirty();
    this.pointerXfo = new Xfo();
    this.pointerXfo.sc.set(1, 1, 0);

    this.__pointermat = new Material('pointermat', 'LinesShader');
    this.__pointermat.getParameter('BaseColor').setValue(this.__avatarColor);

    this.__pointerItem = new GeomItem('Pointer', line, this.__pointermat);
    this.__pointerItem.setLocalXfo(this.pointerXfo);

    // If the webcam stream is available, attach it
    // else attach the avatar image. (which should always be available)
    if (this.__avatarCamGeomItem) {
      geomItem.addChild(this.__avatarCamGeomItem, false);
    } else if (this.__avatarImageGeomItem) {
      this.__avatarImageXfo.sc.set(9 * sc, 9 * sc, 1);
      this.__avatarImageXfo.tr.set(0, 0, -0.1 * sc);
      this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo);
      geomItem.addChild(this.__avatarImageGeomItem, false);
    }

    if (this.__audioItem) {
      geomItem.addChild(this.__audioItem, false);
    }

    this.__treeItem.addChild(geomItem, false);
    this.__treeItem.addChild(this.__pointerItem, false);

    this.__treeItem.addChild(this.__camera, false);
    if (this.__cameraBound) {
      geomItem.setVisible(false);
    }
  }

  /**
   * The updateCameraAndPointerPose method.
   * @param {any} data - The data param.
   */
  updateCameraAndPointerPose(data) {
    if (this.__currentUserAvatar) return

    if (data.viewXfo) {
      if (data.focalDistance) {
        // After 10 meters, the avatar scales to avoid getting too small.
        const sc = data.focalDistance / 5;
        if (sc > 1) data.viewXfo.sc.set(sc, sc, sc);
      }
      this.__treeItem.getChild(0).setLocalXfo(data.viewXfo);
      this.pointerXfo.sc.z = 0;
      this.__treeItem.getChild(1).setLocalXfo(this.pointerXfo);
    } else if (data.movePointer) {
      this.pointerXfo.tr = data.movePointer.start;
      this.pointerXfo.ori.setFromDirectionAndUpvector(data.movePointer.dir, up);
      this.pointerXfo.sc.z = data.movePointer.length;
      this.__treeItem.getChild(1).setLocalXfo(this.pointerXfo);
    } else if (data.hilightPointer) {
      this.__pointermat
        .getParameter('BaseColor')
        .setValue(this.__hilightPointerColor);
    } else if (data.unhilightPointer) {
      this.__pointermat.getParameter('BaseColor').setValue(this.__avatarColor);
    } else if (data.hidePointer) {
      this.pointerXfo.sc.z = 0;
      this.__treeItem.getChild(1).setLocalXfo(this.pointerXfo);
    }
  }

  /**
   * The setVRRepresentation method.
   * @param {any} data - The data param.
   */
  setVRRepresentation(data) {
    this.__treeItem.removeAllChildren();
    this.__currentViewMode = 'VR';

    const hmdHolder = new TreeItem('hmdHolder');
    if (this.__audioItem) {
      hmdHolder.addChild(this.__audioItem);
    }

    if (this.__avatarImageGeomItem) {
      this.__avatarImageXfo.sc.set(0.12, 0.12, 1);
      this.__avatarImageXfo.tr.set(0, -0.04, -0.135);
      this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo);
      hmdHolder.addChild(this.__avatarImageGeomItem, false);
    }

    this.__treeItem.addChild(hmdHolder);

    if (this.__camera) hmdHolder.addChild(this.__camera, false);

    if (this.__hmdGeomItem) {
      if (!this.__currentUserAvatar)
        hmdHolder.addChild(this.__hmdGeomItem, false);
      if (this.__cameraBound) {
        this.__hmdGeomItem.setVisible(false);
      }
    } else {
      const resourceLoader = this.__appData.scene.getResourceLoader();

      let assetPath;
      switch (data.hmd) {
        case 'Vive':
          assetPath = 'ZeaEngine/Vive.vla';
          break
        case 'Oculus':
          assetPath = 'ZeaEngine/Oculus.vla';
          break
        default:
          assetPath = 'ZeaEngine/Vive.vla';
          break
      }

      if (!this.__vrAsset) {
        const hmdAssetId = resourceLoader.resolveFilePathToId(assetPath);
        if (hmdAssetId) {
          this.__vrAsset = this.__appData.scene.loadCommonAssetResource(
            hmdAssetId
          );
          this.__vrAsset.geomsLoaded.connect(() => {
            const materialLibrary = this.__vrAsset.getMaterialLibrary();
            const materialNames = materialLibrary.getMaterialNames();
            for (const name of materialNames) {
              const material = materialLibrary.getMaterial(name, false);
              if (material) {
                material.visibleInGeomDataBuffer = false;
                material.setShaderName('SimpleSurfaceShader');
              }
            }

            if (!this.__currentUserAvatar) {
              const hmdGeomItem = this.__vrAsset.getChildByName('HMD').clone();
              const xfo = hmdGeomItem.getLocalXfo();
              xfo.tr.set(0, -0.03, -0.03);
              xfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI);
              xfo.sc.set(0.001); // VRAsset units are in mm. convert meters
              hmdGeomItem.setLocalXfo(xfo);

              this.__hmdGeomItem = hmdGeomItem;

              if (this.__cameraBound) {
                this.__hmdGeomItem.setVisible(false);
              }
              hmdHolder.addChild(this.__hmdGeomItem, false);
            }
          });
        }
      }
    }

    this.__controllerTrees = [];
  }

  /**
   * The updateVRPose method.
   * @param {any} data - The data param.
   */
  updateVRPose(data) {
    const setupController = (i) => {
      if (this.__controllerTrees[i]) {
        this.__treeItem.addChild(this.__controllerTrees[i], false);
      } else {
        const treeItem = new TreeItem('handleHolder' + i);
        this.__controllerTrees[i] = treeItem;
        this.__treeItem.addChild(this.__controllerTrees[i], false);

        const setupControllerGeom = () => {
          let srcControllerTree;
          if (i == 0)
            srcControllerTree = this.__vrAsset.getChildByName('LeftController');
          else if (i == 1)
            srcControllerTree = this.__vrAsset.getChildByName('RightController');
          if (!srcControllerTree)
            srcControllerTree = this.__vrAsset.getChildByName('Controller');
          const controllerTree = srcControllerTree.clone();
          const xfo = new Xfo(
            new Vec3(0, -0.035, -0.085),
            new Quat({
              setFromAxisAndAngle: [new Vec3(0, 1, 0), Math.PI],
            }),
            new Vec3(0.001, 0.001, 0.001) // VRAsset units are in mm. convert meters
          );
          controllerTree.setLocalXfo(xfo);
          treeItem.addChild(controllerTree, false);
        };
        this.__vrAsset.geomsLoaded.connect(() => {
          setupControllerGeom();
        });
      }
    };

    if (data.viewXfo) this.__treeItem.getChild(0).setGlobalXfo(data.viewXfo);

    if (data.controllers) {
      for (let i = 0; i < data.controllers.length; i++) {
        if (data.controllers[i] && !this.__controllerTrees[i]) {
          setupController(i);
        }
        this.__controllerTrees[i].setGlobalXfo(data.controllers[i].xfo);
      }
    }
    if (data.showUIPanel) {
      if (!this.__uiGeomItem) {
        const uimat = new Material('uimat', 'FlatSurfaceShader');
        uimat.getParameter('BaseColor').setValue(this.__avatarColor);

        this.__uiGeomOffsetXfo = new Xfo();
        this.__uiGeomOffsetXfo.sc.set(
          data.showUIPanel.size.x,
          data.showUIPanel.size.y,
          1
        );
        // Flip it over so we see the front.
        this.__uiGeomOffsetXfo.ori.setFromAxisAndAngle(
          new Vec3(0, 1, 0),
          Math.PI
        );

        this.__uiGeomItem = new GeomItem('VRControllerUI', this.__plane, uimat);
        this.__uiGeomItem.setGeomOffsetXfo(this.__uiGeomOffsetXfo);

        const localXfo = new Xfo();
        localXfo.fromJSON(data.showUIPanel.localXfo);
        this.__uiGeomItem.setLocalXfo(localXfo);
      }
      this.__uiGeomIndex = this.__controllerTrees[
        data.showUIPanel.controllerId
      ].addChild(this.__uiGeomItem, false);
    } else if (data.updateUIPanel) {
      if (this.__uiGeomItem) {
        this.__uiGeomOffsetXfo.sc.set(
          data.updateUIPanel.size.x,
          data.updateUIPanel.size.y,
          1
        );
        this.__uiGeomItem.setGeomOffsetXfo(this.__uiGeomOffsetXfo);
      }
    } else if (data.hideUIPanel) {
      if (this.__uiGeomIndex >= 0) {
        this.__controllerTrees[data.hideUIPanel.controllerId].removeChild(
          this.__uiGeomIndex
        );
        this.__uiGeomIndex = -1;
      }
    }
  }

  /**
   * The updatePose method.
   * @param {any} data - The data param.
   */
  updatePose(data) {
    switch (data.interfaceType) {
      case 'CameraAndPointer':
        if (this.__currentViewMode !== 'CameraAndPointer') {
          this.setCameraAndPointerRepresentation();
        }
        this.updateCameraAndPointerPose(data);
        break
      case 'Vive': // Old recordings.
      case 'VR':
        if (this.__currentViewMode !== 'VR') {
          this.setVRRepresentation(data);
        }
        this.updateVRPose(data);
        break
    }
  }

  /**
   * The destroy method.
   */
  destroy() {
    this.__appData.renderer.removeTreeItem(this.__treeItem);
  }
}

const convertValuesToJSON = (value) => {
  if (value == undefined) {
    return undefined
  } else if (value instanceof BaseItem) {
    return '::' + value.getPath()
  } else if (value.toJSON) {
    const result = value.toJSON();
    result.typeName = typeRegistry.getTypeName(value.constructor);
    return result
  } else if (Array.isArray(value)) {
    const arr = [];
    for (const element of value) arr.push(convertValuesToJSON(element));
    return arr
  } else if (typeof value === 'object') {
    const dict = {};
    for (const key in value) dict[key] = convertValuesToJSON(value[key]);
    return dict
  } else {
    return value
  }
};

const convertValuesFromJSON = (value, scene) => {
  if (value == undefined) {
    return undefined
  } else if (typeof value === 'string' && value.startsWith('::')) {
    return scene.getRoot().resolvePath(value, 1)
  } else if (value.typeName) {
    const newval = typeRegistry.getType(value.typeName).create();
    newval.fromJSON(value);
    return newval
  } else if (Array.isArray(value)) {
    const arr = [];
    for (const element of value) arr.push(convertValuesFromJSON(element, scene));
    return arr
  } else if (typeof value === 'object') {
    const dict = {};
    for (const key in value)
      dict[key] = convertValuesFromJSON(value[key], scene);
    return dict
  } else {
    return value
  }
};

/* * Class representing a session sync. */
class SessionSync {
  /**
   * Create a session sync.
   * @param {any} session - The session value.
   * @param {any} appData - The appData value.
   * @param {any} currentUser - The currentUser value.
   */
  constructor(session, appData, currentUser, options) {
    // const currentUserAvatar = new Avatar(appData, currentUser, true);

    const userDatas = {};

    session.sub(Session.actions.USER_JOINED, (userData) => {
      if (!(userData.id in userDatas)) {
        userDatas[userData.id] = {
          undoRedoManager: new UndoRedoManager(),
          avatar: new Avatar(appData, userData),
          selectionManager: new SelectionManager(appData, {
            ...options,
            enableXfoHandles: false,
            setItemsSelected: false,
          }),
        };
      }
    });
    session.sub(Session.actions.USER_LEFT, (userData) => {
      if (!userDatas[userData.id]) {
        console.warn('User id not in session:', userData.id);
        return
      }
      userDatas[userData.id].avatar.destroy();
      delete userDatas[userData.id];
    });

    // ///////////////////////////////////////////
    // Video Streams
    session.sub(Session.actions.USER_VIDEO_STARTED, (data, userId) => {
      if (!userDatas[userId]) {
        console.warn('User id not in session:', userId);
        return
      }
      const video = session.getVideoStream(userId);
      if (video) userDatas[userId].avatar.attachRTCStream(video);
    });

    session.sub(Session.actions.USER_VIDEO_STOPPED, (data, userId) => {
      if (!userDatas[userId]) {
        console.warn('User id not in session:', userId);
        return
      }
      console.log('USER_VIDEO_STOPPED:', userId, ' us:', currentUser.id);
      if (userDatas[userId].avatar)
        userDatas[userId].avatar.detachRTCStream(session.getVideoStream(userId));
    });

    // ///////////////////////////////////////////
    // Pose Changes
    if (appData.renderer) {
      
      const viewport = appData.renderer.getViewport();

      this.mouseDownId = viewport.mouseDown.connect((event) => {
        const data = {
          interfaceType: 'CameraAndPointer',
          hilightPointer: {},
        };
        session.pub(Session.actions.POSE_CHANGED, data);
      });
      this.mouseUpId = viewport.mouseUp.connect((event) => {
        const data = {
          interfaceType: 'CameraAndPointer',
          unhilightPointer: {},
        };
        session.pub(Session.actions.POSE_CHANGED, convertValuesToJSON(data));
      });
      this.mouseMoveId = viewport.mouseMove.connect((event) => {
        const intersectionData = event.viewport.getGeomDataAtPos(
          event.mousePos,
          event.mouseRay
        );
        const rayLength = intersectionData ? intersectionData.dist : 5.0;
        const data = {
          interfaceType: 'CameraAndPointer',
          movePointer: {
            start: event.mouseRay.start,
            dir: event.mouseRay.dir,
            length: rayLength,
          },
        };
        session.pub(Session.actions.POSE_CHANGED, convertValuesToJSON(data));
      });
      viewport.mouseLeave.connect((event) => {
        const data = {
          interfaceType: 'CameraAndPointer',
          hidePointer: {},
        };
        session.pub(Session.actions.POSE_CHANGED, data);
      });

      let tick = 0;

      appData.renderer.viewChanged.connect((event) => {
        tick++;
        const isVRView = event.interfaceType == 'VR';
        if (isVRView) {
          // only push every second pose of a vr stream.
          if (tick % 2 != 0) return
        }

        const data = {
          interfaceType: event.interfaceType,
          viewXfo: event.viewXfo,
        };
        if (event.focalDistance) {
          data.focalDistance = event.focalDistance;
        } else if (isVRView) {
          data.controllers = [];
          for (const controller of event.controllers) {
            data.controllers.push({
              xfo: controller.getTreeItem().getGlobalXfo(),
            });
          }
        }

        // currentUserAvatar.updatePose(data);

        session.pub(Session.actions.POSE_CHANGED, convertValuesToJSON(data));
      });

      session.sub(Session.actions.POSE_CHANGED, (jsonData, userId) => {
        if (!userDatas[userId]) {
          console.warn('User id not in session:', userId);
          return
        }
        const data = convertValuesFromJSON(jsonData, appData.scene);
        const avatar = userDatas[userId].avatar;
        avatar.updatePose(data);
      });

      // Emit a signal to configure remote avatars to the current camera transform.
      session.pub(
        Session.actions.POSE_CHANGED,
        convertValuesToJSON({
          interfaceType: 'CameraAndPointer',
          viewXfo: appData.renderer.getViewport().getCamera().getGlobalXfo(),
        })
      );
    }

    // ///////////////////////////////////////////
    // Scene Changes
    // const otherUndoStack = new UndoRedoManager();
    if (appData.undoRedoManager) {

      const root = appData.scene.getRoot();
      appData.undoRedoManager.changeAdded.connect((change) => {
        const context = {
          appData,
          makeRelative: (path) => path,
          resolvePath: (path, cb) => {
            // Note: Why not return a Promise here?
            // Promise evaluation is always async, so
            // all promisses will be resolved after the current call stack
            // has terminated. In our case, we want all paths
            // to be resolved before the end of the function, which
            // we can handle easily with callback functions.
            if (!path) throw 'Path not spcecified'
            const item = root.resolvePath(path);
            if (item) {
              cb(item);
            } else {
              console.warn('Path unable to be resolved:' + path);
            }
          },
        };
        const data = {
          changeData: change.toJSON(context),
          changeClass: UndoRedoManager.getChangeClassName(change),
        };
        session.pub(Session.actions.COMMAND_ADDED, data);

        // const otherChange = otherUndoStack.constructChange(data.changeClass);
        // otherChange.fromJSON(data.changeData, { appData })
        // otherUndoStack.addChange(otherChange);
      });

      appData.undoRedoManager.changeUpdated.connect((data) => {
        const jsonData = convertValuesToJSON(data);
        session.pub(Session.actions.COMMAND_UPDATED, jsonData);

        // const changeData2 = convertValuesFromJSON(jsonData, appData.scene);
        // otherUndoStack.getCurrentChange().update(changeData2);
      });

      session.sub(Session.actions.COMMAND_ADDED, (data, userId) => {
        // console.log("Remote Command added:", data.changeClass, userId)
        if (!userDatas[userId]) {
          console.warn('User id not in session:', userId);
          return
        }
        const undoRedoManager = userDatas[userId].undoRedoManager;
        const change = undoRedoManager.constructChange(data.changeClass);

        const context = {
          appData: {
            selectionManager: userDatas[userId].selectionManager,
            scene: appData.scene,
          },
        };
        change.fromJSON(data.changeData, context);
        undoRedoManager.addChange(change);
      });

      session.sub(Session.actions.COMMAND_UPDATED, (data, userId) => {
        if (!userDatas[userId]) {
          console.warn('User id not in session:', userId);
          return
        }
        const undoRedoManager = userDatas[userId].undoRedoManager;
        const changeData = convertValuesFromJSON(data, appData.scene);
        undoRedoManager.getCurrentChange().update(changeData);
      });

      // ///////////////////////////////////////////
      // Undostack Changes.
      // Synchronize undo stacks between users.

      appData.undoRedoManager.changeUndone.connect(() => {
        session.pub('UndoRedoManager_changeUndone', {});
      });

      session.sub('UndoRedoManager_changeUndone', (data, userId) => {
        const undoRedoManager = userDatas[userId].undoRedoManager;
        undoRedoManager.undo();
      });

      appData.undoRedoManager.changeRedone.connect(() => {
        session.pub('UndoRedoManager_changeRedone', {});
      });

      session.sub('UndoRedoManager_changeRedone', (data, userId) => {
        const undoRedoManager = userDatas[userId].undoRedoManager;
        undoRedoManager.redo();
      });
    }

    // ///////////////////////////////////////////
    // State Machine Changes.
    // Synchronize State Machine changes between users.

    // sgFactory.registerCallback('StateMachine', (stateMachine) => {
    //   stateMachine.stateChanged.connect((name) => {
    //     session.pub('StateMachine_stateChanged', {
    //       stateMachine: stateMachine.getPath(),
    //       stateName: name,
    //     })
    //   })
    // })

    // session.sub('StateMachine_stateChanged', (data, userId) => {
    //   const stateMachine = appData.scene
    //     .getRoot()
    //     .resolvePath(data.stateMachine, 1)
    //   stateMachine.activateState(data.stateName)
    // })
  }
}

export { Avatar, Session, SessionFactory, SessionRecorder, SessionSync };
