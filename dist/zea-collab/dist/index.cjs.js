"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e,t=(e=require("socketio-wildcard"))&&"object"==typeof e&&"default"in e?e.default:e,a=require("@zeainc/zea-engine"),s=require("@zeainc/zea-ux");const o=globalThis.debug?debug("zea-collab"):function(){const e=new URLSearchParams(window.location.search).has("zea-collab");return t=>{e&&console.log(t)}}(),r={JOIN_ROOM:"join-room",PING_ROOM:"ping-room",LEAVE_ROOM:"leave-room"};class i{constructor(e,t){this.userData=e,this.socketUrl=t,this.users={},this.userStreams={},this.callbacks={},this.envIsBrowser="undefined"!=typeof window}stopCamera(e=!0){this.stream&&(this.stream.getVideoTracks()[0].enabled=!1,e&&this.pub(i.actions.USER_VIDEO_STOPPED,{}))}startCamera(e=!0){this.stream&&(this.stream.getVideoTracks()[0].enabled=!0,e&&this.pub(i.actions.USER_VIDEO_STARTED,{}))}muteAudio(e=!0){this.stream&&(this.stream.getAudioTracks()[0].enabled=!1,e&&this.pub(i.actions.USER_AUDIO_STOPPED,{}))}unmuteAudio(e=!0){this.stream&&(this.stream.getAudioTracks()[0].enabled=!0,e&&this.pub(i.actions.USER_AUDIO_STARTED,{}))}getVideoStream(e){return this.userStreams[e]}setVideoStream(e,t){if(this.userStreams[t])return;const a=document.createElement("video");a.srcObject=e,this.userStreams[t]=a,a.onloadedmetadata=()=>{a.play()},document.body.appendChild(a)}isJoiningTheSameRoom(e){return this.roomId===e}joinRoom(e){this.roomId=e,this.leaveRoom(),this.socket=io(this.socketUrl,{"sync disconnect on unload":!0,query:`userId=${this.userData.id}&roomId=${this.roomId}`}),t(io.Manager)(this.socket),this.socket.on("*",e=>{const[t,a]=e.data;t in r||this._emit(t,a.payload,a.userId)}),this.envIsBrowser&&window.addEventListener("beforeunload",()=>{this.leaveRoom()}),this.pub(r.JOIN_ROOM),this.socket.on(r.JOIN_ROOM,e=>{o(`${r.JOIN_ROOM}:\n%O`,e),this.pub(r.PING_ROOM);const t=e.userData;this._addUserIfNew(t)}),this.socket.on(r.LEAVE_ROOM,e=>{o(`${r.LEAVE_ROOM}:\n%O`,e);const t=e.userData,a=t.id;if(a in this.users)return delete this.users[a],void this._emit(i.actions.USER_LEFT,t);o("Outgoing user was not found in room.")}),this.socket.on(r.PING_ROOM,e=>{o(`${r.PING_ROOM}:\n%O`,e);const t=e.userData;this._addUserIfNew(t)})}_prepareMediaStream(){return this.__streamPromise||(this.__streamPromise=new window.Promise((e,t)=>{this.stream?e():navigator.mediaDevices.getUserMedia({audio:!0,video:{width:400,height:300}}).then(t=>{this.stream=t,this.stopCamera(!1),this.muteAudio(!1),e()}).catch(e=>{t(e)})})),this.__streamPromise}leaveRoom(){this._emit(i.actions.LEFT_ROOM),this.users={},this.socket&&this.pub(r.LEAVE_ROOM,void 0,()=>{this.socket.close()})}_addUserIfNew(e){e.id in this.users||(this.users[e.id]=e,this._emit(i.actions.USER_JOINED,e))}getUsers(){return this.users}getUser(e){return this.users[e]}pub(e,t,a){if(!e)throw new Error("Missing messageType");this.socket.emit(e,{userData:this.userData,userId:this.userData.id,payload:t},a)}_emit(e,t,a){if(a&&!this.users[a])return void o(`Ignoring message for user not in session: ${e}. User id: ${a}`);const s=this.callbacks[e];s&&s.forEach(e=>e(t,a))}sub(e,t){if(!e)throw new Error("Missing messageType");if(!t)throw new Error("Missing callback");this.callbacks[e];this.callbacks[e]=this.callbacks[e]||[],this.callbacks[e].push(t);return()=>{this.callbacks[e].splice(this.callbacks[e].indexOf(t),1)}}}i.actions={USER_JOINED:"user-joined",USER_VIDEO_STARTED:"user-video-started",USER_VIDEO_STOPPED:"user-video-stopped",USER_AUDIO_STARTED:"user-audio-started",USER_AUDIO_STOPPED:"user-audio-stopped",USER_LEFT:"user-left",LEFT_ROOM:"left-room",TEXT_MESSAGE:"text-message",COMMAND_ADDED:"command-added",COMMAND_UPDATED:"command-updated",FILE_WITH_PROGRESS:"file-with-progress"};const n=new a.Vec3(0,0,1);class h{constructor(e,t,s=!1){if(this.__appData=e,this.__userData=t,this.__currentUserAvatar=s,this.__treeItem=new a.TreeItem(this.__userData.id),this.__appData.renderer.addTreeItem(this.__treeItem),this.__avatarColor=new a.Color(t.color||"#0000ff"),this.__hilightPointerColor=this.__avatarColor,this.__plane=new a.Plane(1,1),this.__uiGeomIndex=-1,!this.__currentUserAvatar){let e;this.__camera=new a.Camera,this.__cameraBound=!1;let t=new a.Disc(.5,64);if(this.__userData.picture&&""!=this.__userData.picture)e=new a.LDRImage("user"+this.__userData.id+"AvatarImage"),e.setImageURL(this.__userData.picture);else{const t=this.__userData.name||this.__userData.given_name||"",s=this.__userData.lastName||this.__userData.family_name||"";e=new a.Label("Name"),e.getParameter("BackgroundColor").setValue(this.__avatarColor),e.getParameter("FontSize").setValue(42),e.getParameter("BorderRadius").setValue(0),e.getParameter("BorderWidth").setValue(0),e.getParameter("Margin").setValue(12),e.getParameter("StrokeBackgroundOutline").setValue(!1),e.getParameter("Text").setValue(`${t.charAt(0)}${s.charAt(0)}`),e.on("labelRendered",e=>{this.__avatarImageXfo.sc.set(.15,.15,1),this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo)})}const s=new a.Material("user"+this.__userData.id+"AvatarImageMaterial","FlatSurfaceShader");s.getParameter("BaseColor").setValue(this.__avatarColor),s.getParameter("BaseColor").setImage(e),s.visibleInGeomDataBuffer=!1,this.__avatarImageGeomItem=new a.GeomItem("avatarImage",t,s),this.__avatarImageXfo=new a.Xfo,this.__avatarImageXfo.sc.set(.2,.2,1),this.__avatarImageXfo.ori.setFromAxisAndAngle(new a.Vec3(0,1,0),Math.PI),this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo);const o=new a.Material("avatarImageBorderMaterial","FlatSurfaceShader");o.getParameter("BaseColor").setValue(new a.Color(0,0,0,1)),o.visibleInGeomDataBuffer=!1;const r=new a.GeomItem("avatarImageBorder",t,o),i=new a.Xfo;i.sc.set(1.1,1.1,1.1),i.tr.set(0,0,-.001),r.setLocalXfo(i),this.__avatarImageGeomItem.addChild(r,!1)}}attachRTCStream(e){if(!this.__avatarCamGeomItem){const t=new a.VideoStreamImage2D("webcamStream");t.setVideoStream(e),this.__avatarCamMaterial=new a.Material("user"+this.__userData.id+"AvatarImageMaterial","FlatSurfaceShader"),this.__avatarCamMaterial.getParameter("BaseColor").setValue(this.__avatarColor),this.__avatarCamMaterial.getParameter("BaseColor").setImage(t),this.__avatarCamMaterial.visibleInGeomDataBuffer=!1,this.__avatarCamGeomItem=new a.GeomItem("avatarImage",this.__plane,this.__avatarCamMaterial);const s=.02;this.__avatarCamXfo=new a.Xfo,this.__avatarCamXfo.sc.set(16*s,9*s,1),this.__avatarCamXfo.tr.set(0,0,-.1*s),this.__avatarCamGeomItem.setLocalXfo(this.__avatarCamXfo);const o=e.videoWidth/e.videoHeight;this.__avatarCamXfo.sc.x=this.__avatarCamXfo.sc.y*o,this.__avatarImageGeomItem.setLocalXfo(this.__avatarCamXfo)}"CameraAndPointer"==this.__currentViewMode&&(this.__treeItem.getChild(0).removeAllChildren(),this.__treeItem.getChild(0).addChild(this.__avatarCamGeomItem,!1))}detachRTCStream(){if("CameraAndPointer"==this.__currentViewMode){this.__treeItem.getChild(0).removeAllChildren();const e=.02;this.__avatarImageXfo.sc.set(9*e,9*e,1),this.__avatarImageXfo.tr.set(0,0,-.1*e),this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo),this.__treeItem.getChild(0).addChild(this.__avatarImageGeomItem,!1)}}getCamera(){return this.__camera}bindCamera(){this.__cameraBound=!0;const e=this.__camera.getOwner();e&&e.traverse(e=>{e!=this.__camera&&e.setVisible(!1)})}unbindCamera(){this.__cameraBound=!1;const e=this.__camera.getOwner();e&&e.traverse(e=>{e!=this.__camera&&e.setVisible(!0)})}setCameraAndPointerRepresentation(){if(this.__treeItem.removeAllChildren(),this.__currentViewMode="CameraAndPointer",this.__currentUserAvatar)return;const e=new a.Cuboid(.32,.18,.06,!0),t=new a.Vec3(.1,.1,1);e.getVertex(0).multiplyInPlace(t),e.getVertex(1).multiplyInPlace(t),e.getVertex(2).multiplyInPlace(t),e.getVertex(3).multiplyInPlace(t),e.computeVertexNormals();const s=new a.Material("user"+this.__userData.id+"Material","SimpleSurfaceShader");s.visibleInGeomDataBuffer=!1,s.getParameter("BaseColor").setValue(new a.Color(.5,.5,.5,1));const o=new a.GeomItem("camera",e,s),r=new a.Xfo;o.setGeomOffsetXfo(r);const i=new a.Lines;i.setNumVertices(2),i.setNumSegments(1),i.setSegment(0,0,1),i.getVertex(0).set(0,0,0),i.getVertex(1).set(0,0,1),i.setBoundingBoxDirty(),this.pointerXfo=new a.Xfo,this.pointerXfo.sc.set(1,1,0),this.__pointermat=new a.Material("pointermat","LinesShader"),this.__pointermat.getParameter("BaseColor").setValue(this.__avatarColor),this.__pointerItem=new a.GeomItem("Pointer",i,this.__pointermat),this.__pointerItem.setLocalXfo(this.pointerXfo),this.__avatarCamGeomItem?o.addChild(this.__avatarCamGeomItem,!1):this.__avatarImageGeomItem&&(this.__avatarImageXfo.sc.set(.18,.18,1),this.__avatarImageXfo.tr.set(0,0,-.002),this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo),o.addChild(this.__avatarImageGeomItem,!1)),this.__audioItem&&o.addChild(this.__audioItem,!1),this.__treeItem.addChild(o,!1),this.__treeItem.addChild(this.__pointerItem,!1),this.__treeItem.addChild(this.__camera,!1),this.__cameraBound&&o.setVisible(!1)}updateCameraAndPointerPose(e){if(!this.__currentUserAvatar)if(e.viewXfo){if(e.focalDistance){const t=e.focalDistance/5;t>1&&e.viewXfo.sc.set(t,t,t)}this.__treeItem.getChild(0).setLocalXfo(e.viewXfo),this.pointerXfo.sc.z=0,this.__treeItem.getChild(1).setLocalXfo(this.pointerXfo)}else e.movePointer?(this.pointerXfo.tr=e.movePointer.start,this.pointerXfo.ori.setFromDirectionAndUpvector(e.movePointer.dir,n),this.pointerXfo.sc.z=e.movePointer.length,this.__treeItem.getChild(1).setLocalXfo(this.pointerXfo)):e.hilightPointer?this.__pointermat.getParameter("BaseColor").setValue(this.__hilightPointerColor):e.unhilightPointer?this.__pointermat.getParameter("BaseColor").setValue(this.__avatarColor):e.hidePointer&&(this.pointerXfo.sc.z=0,this.__treeItem.getChild(1).setLocalXfo(this.pointerXfo))}setVRRepresentation(e){this.__treeItem.removeAllChildren(),this.__currentViewMode="VR";const t=new a.TreeItem("hmdHolder");if(this.__audioItem&&t.addChild(this.__audioItem),this.__avatarImageGeomItem&&(this.__avatarImageXfo.sc.set(.12,.12,1),this.__avatarImageXfo.tr.set(0,-.04,-.135),this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo),t.addChild(this.__avatarImageGeomItem,!1)),this.__treeItem.addChild(t),this.__camera&&t.addChild(this.__camera,!1),this.__hmdGeomItem)this.__currentUserAvatar||t.addChild(this.__hmdGeomItem,!1),this.__cameraBound&&this.__hmdGeomItem.setVisible(!1);else{const s=this.__appData.scene.getResourceLoader();let o;switch(e.hmd){case"Vive":o="ZeaEngine/Vive.vla";break;case"Oculus":o="ZeaEngine/Oculus.vla";break;default:o="ZeaEngine/Vive.vla"}if(!this.__vrAsset){const e=s.resolveFilePathToId(o);e&&(this.__vrAsset=this.__appData.scene.loadCommonAssetResource(e),this.__vrAsset.on("geomsLoaded",()=>{const e=this.__vrAsset.getMaterialLibrary(),s=e.getMaterialNames();for(const t of s){const a=e.getMaterial(t,!1);a&&(a.visibleInGeomDataBuffer=!1,a.setShaderName("SimpleSurfaceShader"))}if(!this.__currentUserAvatar){const e=this.__vrAsset.getChildByName("HMD").clone(),s=e.getLocalXfo();s.tr.set(0,-.03,-.03),s.ori.setFromAxisAndAngle(new a.Vec3(0,1,0),Math.PI),s.sc.set(.001),e.setLocalXfo(s),this.__hmdGeomItem=e,this.__cameraBound&&this.__hmdGeomItem.setVisible(!1),t.addChild(this.__hmdGeomItem,!1)}}))}}this.__controllerTrees=[]}updateVRPose(e){const t=e=>{if(this.__controllerTrees[e])this.__treeItem.addChild(this.__controllerTrees[e],!1);else{const t=new a.TreeItem("handleHolder"+e);this.__controllerTrees[e]=t,this.__treeItem.addChild(this.__controllerTrees[e],!1);const s=()=>{let s;0==e?s=this.__vrAsset.getChildByName("LeftController"):1==e&&(s=this.__vrAsset.getChildByName("RightController")),s||(s=this.__vrAsset.getChildByName("Controller"));const o=s.clone(),r=new a.Xfo(new a.Vec3(0,-.035,-.085),new a.Quat({setFromAxisAndAngle:[new a.Vec3(0,1,0),Math.PI]}),new a.Vec3(.001,.001,.001));o.setLocalXfo(r),t.addChild(o,!1)};this.__vrAsset.on("geomsLoaded",()=>{s()})}};if(e.viewXfo&&this.__treeItem.getChild(0).setGlobalXfo(e.viewXfo),e.controllers)for(let a=0;a<e.controllers.length;a++)e.controllers[a]&&!this.__controllerTrees[a]&&t(a),this.__controllerTrees[a].setGlobalXfo(e.controllers[a].xfo);if(e.showUIPanel){if(!this.__uiGeomItem){const t=new a.Material("uimat","FlatSurfaceShader");t.getParameter("BaseColor").setValue(this.__avatarColor),this.__uiGeomOffsetXfo=new a.Xfo,this.__uiGeomOffsetXfo.sc.set(e.showUIPanel.size.x,e.showUIPanel.size.y,1),this.__uiGeomOffsetXfo.ori.setFromAxisAndAngle(new a.Vec3(0,1,0),Math.PI),this.__uiGeomItem=new a.GeomItem("VRControllerUI",this.__plane,t),this.__uiGeomItem.setGeomOffsetXfo(this.__uiGeomOffsetXfo);const s=new a.Xfo;s.fromJSON(e.showUIPanel.localXfo),this.__uiGeomItem.setLocalXfo(s)}this.__uiGeomIndex=this.__controllerTrees[e.showUIPanel.controllerId].addChild(this.__uiGeomItem,!1)}else e.updateUIPanel?this.__uiGeomItem&&(this.__uiGeomOffsetXfo.sc.set(e.updateUIPanel.size.x,e.updateUIPanel.size.y,1),this.__uiGeomItem.setGeomOffsetXfo(this.__uiGeomOffsetXfo)):e.hideUIPanel&&this.__uiGeomIndex>=0&&(this.__controllerTrees[e.hideUIPanel.controllerId].removeChild(this.__uiGeomIndex),this.__uiGeomIndex=-1)}updatePose(e){switch(e.interfaceType){case"CameraAndPointer":"CameraAndPointer"!==this.__currentViewMode&&this.setCameraAndPointerRepresentation(),this.updateCameraAndPointerPose(e);break;case"Vive":case"VR":"VR"!==this.__currentViewMode&&this.setVRRepresentation(e),this.updateVRPose(e)}}destroy(){this.__appData.renderer.removeTreeItem(this.__treeItem)}}const _=e=>{if(null!=e){if(e instanceof a.BaseItem)return"::"+e.getPath();if(e.toJSON){const t=e.toJSON();return t.typeName=a.Registry.getBlueprintName(e.constructor),t}if(Array.isArray(e)){const t=[];for(const a of e)t.push(_(a));return t}if("object"==typeof e){const t={};for(const a in e)t[a]=_(e[a]);return t}return e}},m=(e,t)=>{if(null!=e){if("string"==typeof e&&e.startsWith("::"))return t.getRoot().resolvePath(e,1);if(e.typeName){const t=a.Registry.getBlueprint(e.typeName).create();return t.fromJSON(e),t}if(Array.isArray(e)){const a=[];for(const s of e)a.push(m(s,t));return a}if("object"==typeof e){const a={};for(const s in e)a[s]=m(e[s],t);return a}return e}};exports.Avatar=h,exports.Session=i,exports.SessionFactory=class{static setSocketURL(e){this.socketUrl=e}static getInstance(e,t,a,s){if(!this.session){if(!this.socketUrl)throw new Error("Missing #socketUrl. Call #setSocketURL first.");this.session=new i(e,this.socketUrl)}return this.session.isJoiningTheSameRoom(t,a,s)||this.session.joinRoom(t,a,s),this.session}static getCurrentSession(){return this.session}},exports.SessionRecorder=class{constructor(e){this.session=e;{const e=["https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"],t={};let a,s,o,r=!1;this.__startRecording=()=>{if(r)return;r=!0;const i=(n=e.length,Math.floor(Math.random()*Math.floor(n)));var n;a={id:"_"+Math.random().toString(36).substr(2,9),picture:e[i],name:"Presenter"+Object.keys(t).length},o=[];let h={messageType:"user-joined",payload:a},_=performance.now();s=this.session.pub,this.session.pub=(e,t)=>{const a=performance.now();h.ms=a-_,o.push(h),h={messageType:e,payload:t},_=a,s.call(this.session,e,t)}},this.__stopRecording=()=>{o.push({messageType:"user-left",payload:a}),t[a.id]=o,this.session.pub=s,this.__playRecording(t)}}}startRecording(){this.__startRecording()}stopRecording(){this.__stopRecording()}__stopPlayback(){for(let e in this.__timeoutIds)clearTimeout(this.__timeoutIds[e]);this.__timeoutIds={}}__play(e,t,a){let s=0;const o=()=>{const r=t[s];this.session._emit(r.messageType,r.payload,e),s++,s<t.length?this.__timeoutIds[e]=setTimeout(o,r.ms):a()};this.__timeoutIds[e]=setTimeout(o,1e3)}__playRecording(e){this.__stopPlayback();let t=0;this.__timeoutIds={};for(let a in e)t++,this.__play(a,e[a],()=>{t--,0==t&&this.__playRecording(e)})}downloadAndPlayRecording(e){this.__recordings[name];fetch(new Request(e)).then(e=>{if(!e.ok)throw new Error("404 Error: File not found.");e.json().then(e=>{this.__playRecording(e)})})}},exports.SessionSync=class{constructor(e,t,a,o){this.session=e,this.appData=t;const r={},n=()=>{const a=t.renderer.getViewport().getCamera();e.pub("poseChanged",_({interfaceType:"CameraAndPointer",viewXfo:a.getGlobalXfo(),focalDistance:a.getParameter("focalDistance").getValue()}))};if(e.sub(i.actions.USER_JOINED,e=>{e.id in r||(r[e.id]={undoRedoManager:new s.UndoRedoManager,avatar:new h(t,e),selectionManager:new s.SelectionManager(t,{...o,enableXfoHandles:!1,setItemsSelected:!1})},t.renderer&&n())}),e.sub(i.actions.USER_LEFT,e=>{r[e.id]?(r[e.id].avatar.destroy(),delete r[e.id]):console.warn("User id not in session:",e.id)}),e.sub(i.actions.USER_VIDEO_STARTED,(t,a)=>{if(!r[a])return void console.warn("User id not in session:",a);const s=e.getVideoStream(a);s&&r[a].avatar.attachRTCStream(s)}),e.sub(i.actions.USER_VIDEO_STOPPED,(t,s)=>{r[s]?(console.log("USER_VIDEO_STOPPED:",s," us:",a.id),r[s].avatar&&r[s].avatar.detachRTCStream(e.getVideoStream(s))):console.warn("User id not in session:",s)}),t.renderer){const a=t.renderer.getViewport();this.mouseDownId=a.on("mouseDown",t=>{e.pub("poseChanged",{interfaceType:"CameraAndPointer",hilightPointer:{}})}),this.mouseUpId=a.on("mouseUp",t=>{e.pub("poseChanged",_({interfaceType:"CameraAndPointer",unhilightPointer:{}}))}),this.mouseMoveId=a.on("mouseMove",t=>{const a=t.viewport.getGeomDataAtPos(t.mousePos,t.mouseRay),s=a?a.dist:5,o={interfaceType:"CameraAndPointer",movePointer:{start:t.mouseRay.start,dir:t.mouseRay.dir,length:s}};e.pub("poseChanged",_(o))}),a.on("mouseLeave",t=>{e.pub("poseChanged",{interfaceType:"CameraAndPointer",hidePointer:{}})});let s=0;t.renderer.on("viewChanged",t=>{s++;const a="VR"==t.interfaceType;if(a&&s%2!=0)return;const o={interfaceType:t.interfaceType,viewXfo:t.viewXfo};if(t.focalDistance)o.focalDistance=t.focalDistance;else if(a){o.controllers=[];for(const e of t.controllers)o.controllers.push({xfo:e.getTreeItem().getGlobalXfo()})}e.pub("poseChanged",_(o))}),e.sub("poseChanged",(e,a)=>{if(!r[a])return void console.warn("User id not in session:",a);const s=m(e,t.scene);r[a].avatar.updatePose(s)}),n()}if(t.undoRedoManager){const a=t.scene.getRoot();t.undoRedoManager.on("changeAdded",o=>{const{change:r}=o,n={appData:t,makeRelative:e=>e,resolvePath:(e,t)=>{if(!e)throw"Path not spcecified";const s=a.resolvePath(e);s?t(s):console.warn("Path unable to be resolved:"+e)}},h={changeData:r.toJSON(n),changeClass:s.UndoRedoManager.getChangeClassName(r)};e.pub(i.actions.COMMAND_ADDED,h)}),t.undoRedoManager.on("changeUpdated",t=>{const a=_(t);e.pub(i.actions.COMMAND_UPDATED,a)}),e.sub(i.actions.COMMAND_ADDED,(e,a)=>{if(!r[a])return void console.warn("User id not in session:",a);const s=r[a].undoRedoManager,o=s.constructChange(e.changeClass),i={appData:{selectionManager:r[a].selectionManager,scene:t.scene}};o.fromJSON(e.changeData,i),s.addChange(o)}),e.sub(i.actions.COMMAND_UPDATED,(e,a)=>{if(!r[a])return void console.warn("User id not in session:",a);const s=r[a].undoRedoManager,o=m(e,t.scene);s.getCurrentChange().update(o)}),t.undoRedoManager.on("changeUndone",()=>{e.pub("UndoRedoManager_changeUndone",{})}),e.sub("UndoRedoManager_changeUndone",(e,t)=>{r[t].undoRedoManager.undo()}),t.undoRedoManager.on("changeRedone",()=>{e.pub("UndoRedoManager_changeRedone",{})}),e.sub("UndoRedoManager_changeRedone",(e,t)=>{r[t].undoRedoManager.redo()})}}syncStateMachines(e){e.on("stateChanged",t=>{this.session.pub("StateMachine_stateChanged",{stateMachine:e.getPath(),stateName:t.name})}),this.session.sub("StateMachine_stateChanged",(t,a)=>{e.activateState(t.stateName)})}};