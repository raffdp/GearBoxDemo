import e from"socketio-wildcard";import{Vec3 as t,TreeItem as a,Color as s,Plane as o,Camera as i,Disc as r,LDRImage as n,Label as h,Material as _,GeomItem as m,Xfo as d,VideoStreamImage2D as l,Cuboid as c,Lines as u,Quat as g,BaseItem as f,Registry as I}from"@zeainc/zea-engine";import{UndoRedoManager as p,SelectionManager as v}from"@zeainc/zea-ux";const C=globalThis.debug?debug("zea-collab"):function(){const e=new URLSearchParams(window.location.search).has("zea-collab");return t=>{e&&console.log(t)}}(),w={JOIN_ROOM:"join-room",PING_ROOM:"ping-room",LEAVE_ROOM:"leave-room"};class P{constructor(e,t){this.userData=e,this.socketUrl=t,this.users={},this.userStreams={},this.callbacks={},this.envIsBrowser="undefined"!=typeof window}stopCamera(e=!0){this.stream&&(this.stream.getVideoTracks()[0].enabled=!1,e&&this.pub(P.actions.USER_VIDEO_STOPPED,{}))}startCamera(e=!0){this.stream&&(this.stream.getVideoTracks()[0].enabled=!0,e&&this.pub(P.actions.USER_VIDEO_STARTED,{}))}muteAudio(e=!0){this.stream&&(this.stream.getAudioTracks()[0].enabled=!1,e&&this.pub(P.actions.USER_AUDIO_STOPPED,{}))}unmuteAudio(e=!0){this.stream&&(this.stream.getAudioTracks()[0].enabled=!0,e&&this.pub(P.actions.USER_AUDIO_STARTED,{}))}getVideoStream(e){return this.userStreams[e]}setVideoStream(e,t){if(this.userStreams[t])return;const a=document.createElement("video");a.srcObject=e,this.userStreams[t]=a,a.onloadedmetadata=()=>{a.play()},document.body.appendChild(a)}isJoiningTheSameRoom(e){return this.roomId===e}joinRoom(t){this.roomId=t,this.leaveRoom(),this.socket=io(this.socketUrl,{"sync disconnect on unload":!0,query:`userId=${this.userData.id}&roomId=${this.roomId}`}),e(io.Manager)(this.socket),this.socket.on("*",e=>{const[t,a]=e.data;t in w||this._emit(t,a.payload,a.userId)}),this.envIsBrowser&&window.addEventListener("beforeunload",()=>{this.leaveRoom()}),this.pub(w.JOIN_ROOM),this.socket.on(w.JOIN_ROOM,e=>{C(`${w.JOIN_ROOM}:\n%O`,e),this.pub(w.PING_ROOM);const t=e.userData;this._addUserIfNew(t)}),this.socket.on(w.LEAVE_ROOM,e=>{C(`${w.LEAVE_ROOM}:\n%O`,e);const t=e.userData,a=t.id;if(a in this.users)return delete this.users[a],void this._emit(P.actions.USER_LEFT,t);C("Outgoing user was not found in room.")}),this.socket.on(w.PING_ROOM,e=>{C(`${w.PING_ROOM}:\n%O`,e);const t=e.userData;this._addUserIfNew(t)})}_prepareMediaStream(){return this.__streamPromise||(this.__streamPromise=new window.Promise((e,t)=>{this.stream?e():navigator.mediaDevices.getUserMedia({audio:!0,video:{width:400,height:300}}).then(t=>{this.stream=t,this.stopCamera(!1),this.muteAudio(!1),e()}).catch(e=>{t(e)})})),this.__streamPromise}leaveRoom(){this._emit(P.actions.LEFT_ROOM),this.users={},this.socket&&this.pub(w.LEAVE_ROOM,void 0,()=>{this.socket.close()})}_addUserIfNew(e){e.id in this.users||(this.users[e.id]=e,this._emit(P.actions.USER_JOINED,e))}getUsers(){return this.users}getUser(e){return this.users[e]}pub(e,t,a){if(!e)throw new Error("Missing messageType");this.socket.emit(e,{userData:this.userData,userId:this.userData.id,payload:t},a)}_emit(e,t,a){if(a&&!this.users[a])return void C(`Ignoring message for user not in session: ${e}. User id: ${a}`);const s=this.callbacks[e];s&&s.forEach(e=>e(t,a))}sub(e,t){if(!e)throw new Error("Missing messageType");if(!t)throw new Error("Missing callback");this.callbacks[e];this.callbacks[e]=this.callbacks[e]||[],this.callbacks[e].push(t);return()=>{this.callbacks[e].splice(this.callbacks[e].indexOf(t),1)}}}P.actions={USER_JOINED:"user-joined",USER_VIDEO_STARTED:"user-video-started",USER_VIDEO_STOPPED:"user-video-stopped",USER_AUDIO_STARTED:"user-audio-started",USER_AUDIO_STOPPED:"user-audio-stopped",USER_LEFT:"user-left",LEFT_ROOM:"left-room",TEXT_MESSAGE:"text-message",COMMAND_ADDED:"command-added",COMMAND_UPDATED:"command-updated",FILE_WITH_PROGRESS:"file-with-progress"};class R{static setSocketURL(e){this.socketUrl=e}static getInstance(e,t,a,s){if(!this.session){if(!this.socketUrl)throw new Error("Missing #socketUrl. Call #setSocketURL first.");this.session=new P(e,this.socketUrl)}return this.session.isJoiningTheSameRoom(t,a,s)||this.session.joinRoom(t,a,s),this.session}static getCurrentSession(){return this.session}}class D{constructor(e){this.session=e;{const e=["https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"],t={};let a,s,o,i=!1;this.__startRecording=()=>{if(i)return;i=!0;const r=(n=e.length,Math.floor(Math.random()*Math.floor(n)));var n;a={id:"_"+Math.random().toString(36).substr(2,9),picture:e[r],name:"Presenter"+Object.keys(t).length},o=[];let h={messageType:"user-joined",payload:a},_=performance.now();s=this.session.pub,this.session.pub=(e,t)=>{const a=performance.now();h.ms=a-_,o.push(h),h={messageType:e,payload:t},_=a,s.call(this.session,e,t)}},this.__stopRecording=()=>{o.push({messageType:"user-left",payload:a}),t[a.id]=o,this.session.pub=s,this.__playRecording(t)}}}startRecording(){this.__startRecording()}stopRecording(){this.__stopRecording()}__stopPlayback(){for(let e in this.__timeoutIds)clearTimeout(this.__timeoutIds[e]);this.__timeoutIds={}}__play(e,t,a){let s=0;const o=()=>{const i=t[s];this.session._emit(i.messageType,i.payload,e),s++,s<t.length?this.__timeoutIds[e]=setTimeout(o,i.ms):a()};this.__timeoutIds[e]=setTimeout(o,1e3)}__playRecording(e){this.__stopPlayback();let t=0;this.__timeoutIds={};for(let a in e)t++,this.__play(a,e[a],()=>{t--,0==t&&this.__playRecording(e)})}downloadAndPlayRecording(e){this.__recordings[name];fetch(new Request(e)).then(e=>{if(!e.ok)throw new Error("404 Error: File not found.");e.json().then(e=>{this.__playRecording(e)})})}}const A=new t(0,0,1);class O{constructor(e,l,c=!1){if(this.__appData=e,this.__userData=l,this.__currentUserAvatar=c,this.__treeItem=new a(this.__userData.id),this.__appData.renderer.addTreeItem(this.__treeItem),this.__avatarColor=new s(l.color||"#0000ff"),this.__hilightPointerColor=this.__avatarColor,this.__plane=new o(1,1),this.__uiGeomIndex=-1,!this.__currentUserAvatar){let e;this.__camera=new i,this.__cameraBound=!1;let a=new r(.5,64);if(this.__userData.picture&&""!=this.__userData.picture)e=new n("user"+this.__userData.id+"AvatarImage"),e.setImageURL(this.__userData.picture);else{const t=this.__userData.name||this.__userData.given_name||"",a=this.__userData.lastName||this.__userData.family_name||"";e=new h("Name"),e.getParameter("BackgroundColor").setValue(this.__avatarColor),e.getParameter("FontSize").setValue(42),e.getParameter("BorderRadius").setValue(0),e.getParameter("BorderWidth").setValue(0),e.getParameter("Margin").setValue(12),e.getParameter("StrokeBackgroundOutline").setValue(!1),e.getParameter("Text").setValue(`${t.charAt(0)}${a.charAt(0)}`),e.on("labelRendered",e=>{this.__avatarImageXfo.sc.set(.15,.15,1),this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo)})}const o=new _("user"+this.__userData.id+"AvatarImageMaterial","FlatSurfaceShader");o.getParameter("BaseColor").setValue(this.__avatarColor),o.getParameter("BaseColor").setImage(e),o.visibleInGeomDataBuffer=!1,this.__avatarImageGeomItem=new m("avatarImage",a,o),this.__avatarImageXfo=new d,this.__avatarImageXfo.sc.set(.2,.2,1),this.__avatarImageXfo.ori.setFromAxisAndAngle(new t(0,1,0),Math.PI),this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo);const l=new _("avatarImageBorderMaterial","FlatSurfaceShader");l.getParameter("BaseColor").setValue(new s(0,0,0,1)),l.visibleInGeomDataBuffer=!1;const c=new m("avatarImageBorder",a,l),u=new d;u.sc.set(1.1,1.1,1.1),u.tr.set(0,0,-.001),c.setLocalXfo(u),this.__avatarImageGeomItem.addChild(c,!1)}}attachRTCStream(e){if(!this.__avatarCamGeomItem){const t=new l("webcamStream");t.setVideoStream(e),this.__avatarCamMaterial=new _("user"+this.__userData.id+"AvatarImageMaterial","FlatSurfaceShader"),this.__avatarCamMaterial.getParameter("BaseColor").setValue(this.__avatarColor),this.__avatarCamMaterial.getParameter("BaseColor").setImage(t),this.__avatarCamMaterial.visibleInGeomDataBuffer=!1,this.__avatarCamGeomItem=new m("avatarImage",this.__plane,this.__avatarCamMaterial);const a=.02;this.__avatarCamXfo=new d,this.__avatarCamXfo.sc.set(16*a,9*a,1),this.__avatarCamXfo.tr.set(0,0,-.1*a),this.__avatarCamGeomItem.setLocalXfo(this.__avatarCamXfo);const s=e.videoWidth/e.videoHeight;this.__avatarCamXfo.sc.x=this.__avatarCamXfo.sc.y*s,this.__avatarImageGeomItem.setLocalXfo(this.__avatarCamXfo)}"CameraAndPointer"==this.__currentViewMode&&(this.__treeItem.getChild(0).removeAllChildren(),this.__treeItem.getChild(0).addChild(this.__avatarCamGeomItem,!1))}detachRTCStream(){if("CameraAndPointer"==this.__currentViewMode){this.__treeItem.getChild(0).removeAllChildren();const e=.02;this.__avatarImageXfo.sc.set(9*e,9*e,1),this.__avatarImageXfo.tr.set(0,0,-.1*e),this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo),this.__treeItem.getChild(0).addChild(this.__avatarImageGeomItem,!1)}}getCamera(){return this.__camera}bindCamera(){this.__cameraBound=!0;const e=this.__camera.getOwner();e&&e.traverse(e=>{e!=this.__camera&&e.setVisible(!1)})}unbindCamera(){this.__cameraBound=!1;const e=this.__camera.getOwner();e&&e.traverse(e=>{e!=this.__camera&&e.setVisible(!0)})}setCameraAndPointerRepresentation(){if(this.__treeItem.removeAllChildren(),this.__currentViewMode="CameraAndPointer",this.__currentUserAvatar)return;const e=new c(.32,.18,.06,!0),a=new t(.1,.1,1);e.getVertex(0).multiplyInPlace(a),e.getVertex(1).multiplyInPlace(a),e.getVertex(2).multiplyInPlace(a),e.getVertex(3).multiplyInPlace(a),e.computeVertexNormals();const o=new _("user"+this.__userData.id+"Material","SimpleSurfaceShader");o.visibleInGeomDataBuffer=!1,o.getParameter("BaseColor").setValue(new s(.5,.5,.5,1));const i=new m("camera",e,o),r=new d;i.setGeomOffsetXfo(r);const n=new u;n.setNumVertices(2),n.setNumSegments(1),n.setSegment(0,0,1),n.getVertex(0).set(0,0,0),n.getVertex(1).set(0,0,1),n.setBoundingBoxDirty(),this.pointerXfo=new d,this.pointerXfo.sc.set(1,1,0),this.__pointermat=new _("pointermat","LinesShader"),this.__pointermat.getParameter("BaseColor").setValue(this.__avatarColor),this.__pointerItem=new m("Pointer",n,this.__pointermat),this.__pointerItem.setLocalXfo(this.pointerXfo),this.__avatarCamGeomItem?i.addChild(this.__avatarCamGeomItem,!1):this.__avatarImageGeomItem&&(this.__avatarImageXfo.sc.set(.18,.18,1),this.__avatarImageXfo.tr.set(0,0,-.002),this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo),i.addChild(this.__avatarImageGeomItem,!1)),this.__audioItem&&i.addChild(this.__audioItem,!1),this.__treeItem.addChild(i,!1),this.__treeItem.addChild(this.__pointerItem,!1),this.__treeItem.addChild(this.__camera,!1),this.__cameraBound&&i.setVisible(!1)}updateCameraAndPointerPose(e){if(!this.__currentUserAvatar)if(e.viewXfo){if(e.focalDistance){const t=e.focalDistance/5;t>1&&e.viewXfo.sc.set(t,t,t)}this.__treeItem.getChild(0).setLocalXfo(e.viewXfo),this.pointerXfo.sc.z=0,this.__treeItem.getChild(1).setLocalXfo(this.pointerXfo)}else e.movePointer?(this.pointerXfo.tr=e.movePointer.start,this.pointerXfo.ori.setFromDirectionAndUpvector(e.movePointer.dir,A),this.pointerXfo.sc.z=e.movePointer.length,this.__treeItem.getChild(1).setLocalXfo(this.pointerXfo)):e.hilightPointer?this.__pointermat.getParameter("BaseColor").setValue(this.__hilightPointerColor):e.unhilightPointer?this.__pointermat.getParameter("BaseColor").setValue(this.__avatarColor):e.hidePointer&&(this.pointerXfo.sc.z=0,this.__treeItem.getChild(1).setLocalXfo(this.pointerXfo))}setVRRepresentation(e){this.__treeItem.removeAllChildren(),this.__currentViewMode="VR";const s=new a("hmdHolder");if(this.__audioItem&&s.addChild(this.__audioItem),this.__avatarImageGeomItem&&(this.__avatarImageXfo.sc.set(.12,.12,1),this.__avatarImageXfo.tr.set(0,-.04,-.135),this.__avatarImageGeomItem.setLocalXfo(this.__avatarImageXfo),s.addChild(this.__avatarImageGeomItem,!1)),this.__treeItem.addChild(s),this.__camera&&s.addChild(this.__camera,!1),this.__hmdGeomItem)this.__currentUserAvatar||s.addChild(this.__hmdGeomItem,!1),this.__cameraBound&&this.__hmdGeomItem.setVisible(!1);else{const a=this.__appData.scene.getResourceLoader();let o;switch(e.hmd){case"Vive":o="ZeaEngine/Vive.vla";break;case"Oculus":o="ZeaEngine/Oculus.vla";break;default:o="ZeaEngine/Vive.vla"}if(!this.__vrAsset){const e=a.resolveFilePathToId(o);e&&(this.__vrAsset=this.__appData.scene.loadCommonAssetResource(e),this.__vrAsset.on("geomsLoaded",()=>{const e=this.__vrAsset.getMaterialLibrary(),a=e.getMaterialNames();for(const t of a){const a=e.getMaterial(t,!1);a&&(a.visibleInGeomDataBuffer=!1,a.setShaderName("SimpleSurfaceShader"))}if(!this.__currentUserAvatar){const e=this.__vrAsset.getChildByName("HMD").clone(),a=e.getLocalXfo();a.tr.set(0,-.03,-.03),a.ori.setFromAxisAndAngle(new t(0,1,0),Math.PI),a.sc.set(.001),e.setLocalXfo(a),this.__hmdGeomItem=e,this.__cameraBound&&this.__hmdGeomItem.setVisible(!1),s.addChild(this.__hmdGeomItem,!1)}}))}}this.__controllerTrees=[]}updateVRPose(e){const s=e=>{if(this.__controllerTrees[e])this.__treeItem.addChild(this.__controllerTrees[e],!1);else{const s=new a("handleHolder"+e);this.__controllerTrees[e]=s,this.__treeItem.addChild(this.__controllerTrees[e],!1);const o=()=>{let a;0==e?a=this.__vrAsset.getChildByName("LeftController"):1==e&&(a=this.__vrAsset.getChildByName("RightController")),a||(a=this.__vrAsset.getChildByName("Controller"));const o=a.clone(),i=new d(new t(0,-.035,-.085),new g({setFromAxisAndAngle:[new t(0,1,0),Math.PI]}),new t(.001,.001,.001));o.setLocalXfo(i),s.addChild(o,!1)};this.__vrAsset.on("geomsLoaded",()=>{o()})}};if(e.viewXfo&&this.__treeItem.getChild(0).setGlobalXfo(e.viewXfo),e.controllers)for(let t=0;t<e.controllers.length;t++)e.controllers[t]&&!this.__controllerTrees[t]&&s(t),this.__controllerTrees[t].setGlobalXfo(e.controllers[t].xfo);if(e.showUIPanel){if(!this.__uiGeomItem){const a=new _("uimat","FlatSurfaceShader");a.getParameter("BaseColor").setValue(this.__avatarColor),this.__uiGeomOffsetXfo=new d,this.__uiGeomOffsetXfo.sc.set(e.showUIPanel.size.x,e.showUIPanel.size.y,1),this.__uiGeomOffsetXfo.ori.setFromAxisAndAngle(new t(0,1,0),Math.PI),this.__uiGeomItem=new m("VRControllerUI",this.__plane,a),this.__uiGeomItem.setGeomOffsetXfo(this.__uiGeomOffsetXfo);const s=new d;s.fromJSON(e.showUIPanel.localXfo),this.__uiGeomItem.setLocalXfo(s)}this.__uiGeomIndex=this.__controllerTrees[e.showUIPanel.controllerId].addChild(this.__uiGeomItem,!1)}else e.updateUIPanel?this.__uiGeomItem&&(this.__uiGeomOffsetXfo.sc.set(e.updateUIPanel.size.x,e.updateUIPanel.size.y,1),this.__uiGeomItem.setGeomOffsetXfo(this.__uiGeomOffsetXfo)):e.hideUIPanel&&this.__uiGeomIndex>=0&&(this.__controllerTrees[e.hideUIPanel.controllerId].removeChild(this.__uiGeomIndex),this.__uiGeomIndex=-1)}updatePose(e){switch(e.interfaceType){case"CameraAndPointer":"CameraAndPointer"!==this.__currentViewMode&&this.setCameraAndPointerRepresentation(),this.updateCameraAndPointerPose(e);break;case"Vive":case"VR":"VR"!==this.__currentViewMode&&this.setVRRepresentation(e),this.updateVRPose(e)}}destroy(){this.__appData.renderer.removeTreeItem(this.__treeItem)}}const b=e=>{if(null!=e){if(e instanceof f)return"::"+e.getPath();if(e.toJSON){const t=e.toJSON();return t.typeName=I.getBlueprintName(e.constructor),t}if(Array.isArray(e)){const t=[];for(const a of e)t.push(b(a));return t}if("object"==typeof e){const t={};for(const a in e)t[a]=b(e[a]);return t}return e}},M=(e,t)=>{if(null!=e){if("string"==typeof e&&e.startsWith("::"))return t.getRoot().resolvePath(e,1);if(e.typeName){const t=I.getBlueprint(e.typeName).create();return t.fromJSON(e),t}if(Array.isArray(e)){const a=[];for(const s of e)a.push(M(s,t));return a}if("object"==typeof e){const a={};for(const s in e)a[s]=M(e[s],t);return a}return e}};class S{constructor(e,t,a,s){this.session=e,this.appData=t;const o={},i=()=>{const a=t.renderer.getViewport().getCamera();e.pub("poseChanged",b({interfaceType:"CameraAndPointer",viewXfo:a.getGlobalXfo(),focalDistance:a.getParameter("focalDistance").getValue()}))};if(e.sub(P.actions.USER_JOINED,e=>{e.id in o||(o[e.id]={undoRedoManager:new p,avatar:new O(t,e),selectionManager:new v(t,{...s,enableXfoHandles:!1,setItemsSelected:!1})},t.renderer&&i())}),e.sub(P.actions.USER_LEFT,e=>{o[e.id]?(o[e.id].avatar.destroy(),delete o[e.id]):console.warn("User id not in session:",e.id)}),e.sub(P.actions.USER_VIDEO_STARTED,(t,a)=>{if(!o[a])return void console.warn("User id not in session:",a);const s=e.getVideoStream(a);s&&o[a].avatar.attachRTCStream(s)}),e.sub(P.actions.USER_VIDEO_STOPPED,(t,s)=>{o[s]?(console.log("USER_VIDEO_STOPPED:",s," us:",a.id),o[s].avatar&&o[s].avatar.detachRTCStream(e.getVideoStream(s))):console.warn("User id not in session:",s)}),t.renderer){const a=t.renderer.getViewport();this.mouseDownId=a.on("mouseDown",t=>{e.pub("poseChanged",{interfaceType:"CameraAndPointer",hilightPointer:{}})}),this.mouseUpId=a.on("mouseUp",t=>{e.pub("poseChanged",b({interfaceType:"CameraAndPointer",unhilightPointer:{}}))}),this.mouseMoveId=a.on("mouseMove",t=>{const a=t.viewport.getGeomDataAtPos(t.mousePos,t.mouseRay),s=a?a.dist:5,o={interfaceType:"CameraAndPointer",movePointer:{start:t.mouseRay.start,dir:t.mouseRay.dir,length:s}};e.pub("poseChanged",b(o))}),a.on("mouseLeave",t=>{e.pub("poseChanged",{interfaceType:"CameraAndPointer",hidePointer:{}})});let s=0;t.renderer.on("viewChanged",t=>{s++;const a="VR"==t.interfaceType;if(a&&s%2!=0)return;const o={interfaceType:t.interfaceType,viewXfo:t.viewXfo};if(t.focalDistance)o.focalDistance=t.focalDistance;else if(a){o.controllers=[];for(const e of t.controllers)o.controllers.push({xfo:e.getTreeItem().getGlobalXfo()})}e.pub("poseChanged",b(o))}),e.sub("poseChanged",(e,a)=>{if(!o[a])return void console.warn("User id not in session:",a);const s=M(e,t.scene);o[a].avatar.updatePose(s)}),i()}if(t.undoRedoManager){const a=t.scene.getRoot();t.undoRedoManager.on("changeAdded",s=>{const{change:o}=s,i={appData:t,makeRelative:e=>e,resolvePath:(e,t)=>{if(!e)throw"Path not spcecified";const s=a.resolvePath(e);s?t(s):console.warn("Path unable to be resolved:"+e)}},r={changeData:o.toJSON(i),changeClass:p.getChangeClassName(o)};e.pub(P.actions.COMMAND_ADDED,r)}),t.undoRedoManager.on("changeUpdated",t=>{const a=b(t);e.pub(P.actions.COMMAND_UPDATED,a)}),e.sub(P.actions.COMMAND_ADDED,(e,a)=>{if(!o[a])return void console.warn("User id not in session:",a);const s=o[a].undoRedoManager,i=s.constructChange(e.changeClass),r={appData:{selectionManager:o[a].selectionManager,scene:t.scene}};i.fromJSON(e.changeData,r),s.addChange(i)}),e.sub(P.actions.COMMAND_UPDATED,(e,a)=>{if(!o[a])return void console.warn("User id not in session:",a);const s=o[a].undoRedoManager,i=M(e,t.scene);s.getCurrentChange().update(i)}),t.undoRedoManager.on("changeUndone",()=>{e.pub("UndoRedoManager_changeUndone",{})}),e.sub("UndoRedoManager_changeUndone",(e,t)=>{o[t].undoRedoManager.undo()}),t.undoRedoManager.on("changeRedone",()=>{e.pub("UndoRedoManager_changeRedone",{})}),e.sub("UndoRedoManager_changeRedone",(e,t)=>{o[t].undoRedoManager.redo()})}}syncStateMachines(e){e.on("stateChanged",t=>{this.session.pub("StateMachine_stateChanged",{stateMachine:e.getPath(),stateName:t.name})}),this.session.sub("StateMachine_stateChanged",(t,a)=>{e.activateState(t.stateName)})}}export{O as Avatar,P as Session,R as SessionFactory,D as SessionRecorder,S as SessionSync};