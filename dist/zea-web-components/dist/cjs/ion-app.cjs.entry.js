'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');
const ionicGlobal = require('./ionic-global-63aa0afb.js');

const appCss = "html.plt-mobile ion-app{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}ion-app.force-statusbar-padding{--ion-safe-area-top:20px}";

const App = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    componentDidLoad() {
        {
            rIC(() => {
                const isHybrid = ionicGlobal.isPlatform(window, 'hybrid');
                if (!ionicGlobal.config.getBoolean('_testing')) {
                    new Promise(function (resolve) { resolve(require('./tap-click-e0af5237.js')); }).then(module => module.startTapClick(ionicGlobal.config));
                }
                if (ionicGlobal.config.getBoolean('statusTap', isHybrid)) {
                    new Promise(function (resolve) { resolve(require('./status-tap-2f852d8a.js')); }).then(module => module.startStatusTap());
                }
                if (ionicGlobal.config.getBoolean('inputShims', needInputShims())) {
                    new Promise(function (resolve) { resolve(require('./input-shims-276ef23e.js')); }).then(module => module.startInputShims(ionicGlobal.config));
                }
                if (ionicGlobal.config.getBoolean('hardwareBackButton', isHybrid)) {
                    new Promise(function (resolve) { resolve(require('./hardware-back-button-44aa341d.js')); }).then(module => module.startHardwareBackButton());
                }
                new Promise(function (resolve) { resolve(require('./focus-visible-5621d6b1.js')); }).then(module => module.startFocusVisible());
            });
        }
    }
    render() {
        const mode = ionicGlobal.getIonMode(this);
        return (index.h(index.Host, { class: {
                [mode]: true,
                'ion-page': true,
                'force-statusbar-padding': ionicGlobal.config.getBoolean('_forceStatusbarPadding')
            } }));
    }
    get el() { return index.getElement(this); }
};
const needInputShims = () => {
    return ionicGlobal.isPlatform(window, 'ios') && ionicGlobal.isPlatform(window, 'mobile');
};
const rIC = (callback) => {
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback);
    }
    else {
        setTimeout(callback, 32);
    }
};
App.style = appCss;

exports.ion_app = App;
