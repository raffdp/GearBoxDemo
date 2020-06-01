import { r as registerInstance, h, H as Host, d as getElement } from './index-12ee0265.js';
import { g as getIonMode, c as config, a as isPlatform } from './ionic-global-9ae0f2dd.js';
var appCss = "html.plt-mobile ion-app{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}ion-app.force-statusbar-padding{--ion-safe-area-top:20px}";
var App = /** @class */ (function () {
    function App(hostRef) {
        registerInstance(this, hostRef);
    }
    App.prototype.componentDidLoad = function () {
        {
            rIC(function () {
                var isHybrid = isPlatform(window, 'hybrid');
                if (!config.getBoolean('_testing')) {
                    import('./tap-click-cb806055.js').then(function (module) { return module.startTapClick(config); });
                }
                if (config.getBoolean('statusTap', isHybrid)) {
                    import('./status-tap-54895a24.js').then(function (module) { return module.startStatusTap(); });
                }
                if (config.getBoolean('inputShims', needInputShims())) {
                    import('./input-shims-51327da2.js').then(function (module) { return module.startInputShims(config); });
                }
                if (config.getBoolean('hardwareBackButton', isHybrid)) {
                    import('./hardware-back-button-24485eb0.js').then(function (module) { return module.startHardwareBackButton(); });
                }
                import('./focus-visible-571e113e.js').then(function (module) { return module.startFocusVisible(); });
            });
        }
    };
    App.prototype.render = function () {
        var _a;
        var mode = getIonMode(this);
        return (h(Host, { class: (_a = {},
                _a[mode] = true,
                _a['ion-page'] = true,
                _a['force-statusbar-padding'] = config.getBoolean('_forceStatusbarPadding'),
                _a) }));
    };
    Object.defineProperty(App.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return App;
}());
var needInputShims = function () {
    return isPlatform(window, 'ios') && isPlatform(window, 'mobile');
};
var rIC = function (callback) {
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback);
    }
    else {
        setTimeout(callback, 32);
    }
};
App.style = appCss;
export { App as ion_app };
