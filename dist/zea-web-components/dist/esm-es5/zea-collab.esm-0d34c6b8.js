import { s, e } from './index-ee0e95b8.js';
var t = { JOIN_ROOM: "join-room", PING_ROOM: "ping-room", LEAVE_ROOM: "leave-room" };
var i = /** @class */ (function () {
    function i(s, e) {
        this.userData = s, this.socketUrl = e, this.users = {}, this.userStreams = {}, this.callbacks = {}, this.envIsBrowser = "undefined" != typeof window;
    }
    i.prototype.stopCamera = function (s) {
        if (s === void 0) { s = !0; }
        this.stream && (this.stream.getVideoTracks()[0].enabled = !1, s && this.pub(i.actions.USER_VIDEO_STOPPED, {}));
    };
    i.prototype.startCamera = function (s) {
        if (s === void 0) { s = !0; }
        this.stream && (this.stream.getVideoTracks()[0].enabled = !0, s && this.pub(i.actions.USER_VIDEO_STARTED, {}));
    };
    i.prototype.muteAudio = function (s) {
        if (s === void 0) { s = !0; }
        this.stream && (this.stream.getAudioTracks()[0].enabled = !1, s && this.pub(i.actions.USER_VIDEO_STOPPED, {}));
    };
    i.prototype.unmuteAudio = function (s) {
        if (s === void 0) { s = !0; }
        this.stream && (this.stream.getAudioTracks()[0].enabled = !0, s && this.pub(i.actions.USER_AUDIO_STARTED, {}));
    };
    i.prototype.getVideoStream = function (s) { return this.userStreams[s]; };
    i.prototype.setVideoStream = function (s, e) { if (this.userStreams[e])
        return; var t = document.createElement("video"); t.srcObject = s, this.userStreams[e] = t, t.onloadedmetadata = function () { t.play(); }, document.body.appendChild(t); };
    i.concatFullRoomId = function (s, e, t) { return s + (e || "_ALL_FILES_") + (t || "_ALL_ROOMS_"); };
    i.prototype.isJoiningTheSameRoom = function (s, e, t) { return this.fullRoomId === i.concatFullRoomId(s, e, t); };
    i.prototype.joinRoom = function (o, r, a) {
        var _this = this;
        this.projectId = o, this.fileId = r, this.roomId = a, this.fullRoomId = i.concatFullRoomId(this.projectId, this.fileId, this.roomId), this.leaveRoom(), this.socket = s(this.socketUrl, { "sync disconnect on unload": !0, query: "userId=" + this.userData.id + "&roomId=" + this.fullRoomId }), e(s.Manager)(this.socket), this.socket.on("*", function (s) { var _a = s.data, e = _a[0], i = _a[1]; e in t || _this._emit(e, i.payload, i.userId); }), this.envIsBrowser && window.addEventListener("beforeunload", function () { _this.leaveRoom(); }), this.pub(t.JOIN_ROOM), this.socket.on(t.JOIN_ROOM, function (s) { console.info(t.JOIN_ROOM + ":", s); var e = s.userData; _this._addUserIfNew(e), _this.pub(t.PING_ROOM); }), this.socket.on(t.LEAVE_ROOM, function (s) { console.info(t.LEAVE_ROOM + ":", s); var e = s.userData, o = e.id; if (o in _this.users)
            return delete _this.users[o], void _this._emit(i.actions.USER_LEFT, e); console.warn("Outgoing user was not found in room."); }), this.socket.on(t.PING_ROOM, function (s) { console.info(t.PING_ROOM + ":", s); var e = s.userData; _this._addUserIfNew(e); });
    };
    i.prototype._prepareMediaStream = function () {
        var _this = this;
        return this.__streamPromise || (this.__streamPromise = new window.Promise(function (s, e) { _this.stream ? s() : navigator.mediaDevices.getUserMedia({ audio: !0, video: { width: 400, height: 300 } }).then(function (e) { _this.stream = e, _this.stopCamera(!1), _this.muteAudio(!1), s(); }).catch(function (s) { e(s); }); })), this.__streamPromise;
    };
    i.prototype.leaveRoom = function () {
        var _this = this;
        this._emit(i.actions.LEFT_ROOM), this.users = {}, this.socket && this.pub(t.LEAVE_ROOM, void 0, function () { _this.socket.close(); });
    };
    i.prototype._addUserIfNew = function (s) { s.id in this.users || (this.users[s.id] = s, this._emit(i.actions.USER_JOINED, s)); };
    i.prototype.createRoom = function () { return this.roomId = shortid.generate(), this.joinRoom(this.projectId, this.fileId, this.roomId), this.envIsBrowser && window.history.pushState(null, null, "?project-id=" + this.projectId + "&file-id=" + this.fileId + "&room-id=" + this.roomId), this.roomId; };
    i.prototype.getUsers = function () { return this.users; };
    i.prototype.getUser = function (s) { return this.users[s]; };
    i.prototype.pub = function (s, e, t) { if (!s)
        throw new Error("Missing messageType"); this.socket.emit(s, { userData: this.userData, userId: this.userData.id, payload: e }, t); };
    i.prototype._emit = function (s, e, t) { var i = this.callbacks[s]; i && i.forEach(function (s) { return s(e, t); }); };
    i.prototype.sub = function (s, e) {
        var _this = this;
        if (!s)
            throw new Error("Missing messageType");
        if (!e)
            throw new Error("Missing callback");
        this.callbacks[s] = this.callbacks[s] || [], this.callbacks[s].push(e);
        return function () { _this.callbacks[s].splice(_this.callbacks[s].indexOf(e), 1); };
    };
    return i;
}());
i.actions = { USER_JOINED: "user-joined", USER_VIDEO_STARTED: "user-video-started", USER_VIDEO_STOPPED: "user-video-stopped", USER_AUDIO_STARTED: "user-audio-started", USER_AUDIO_STOPPED: "user-audio-stopped", USER_LEFT: "user-left", LEFT_ROOM: "left-room", TEXT_MESSAGE: "text-message", POSE_CHANGED: "pose-message", COMMAND_ADDED: "command-added", COMMAND_UPDATED: "command-updated", FILE_WITH_PROGRESS: "file-with-progress" };
var o = /** @class */ (function () {
    function o() {
    }
    o.setSocketURL = function (s) { this.socketUrl = s; };
    o.getInstance = function (s, e, t, o) { if (!this.session) {
        if (!this.socketUrl)
            throw new Error("Missing #socketUrl. Call #setSocketURL first.");
        this.session = new i(s, this.socketUrl);
    } return this.session.isJoiningTheSameRoom(e, t, o) || this.session.joinRoom(e, t, o), this.session; };
    o.getCurrentSession = function () { return this.session; };
    return o;
}());
export { i, o };
