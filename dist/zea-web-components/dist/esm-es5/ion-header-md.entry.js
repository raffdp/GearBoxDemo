var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { e as readTask, w as writeTask, r as registerInstance, h, H as Host, d as getElement } from './index-12ee0265.js';
import { g as getIonMode } from './ionic-global-9ae0f2dd.js';
import { c as clamp } from './helpers-4a6bd295.js';
var TRANSITION = 'all 0.2s ease-in-out';
var cloneElement = function (tagName) {
    var getCachedEl = document.querySelector(tagName + ".ion-cloned-element");
    if (getCachedEl !== null) {
        return getCachedEl;
    }
    var clonedEl = document.createElement(tagName);
    clonedEl.classList.add('ion-cloned-element');
    clonedEl.style.setProperty('display', 'none');
    document.body.appendChild(clonedEl);
    return clonedEl;
};
var createHeaderIndex = function (headerEl) {
    if (!headerEl) {
        return;
    }
    var toolbars = headerEl.querySelectorAll('ion-toolbar');
    return {
        el: headerEl,
        toolbars: Array.from(toolbars).map(function (toolbar) {
            var ionTitleEl = toolbar.querySelector('ion-title');
            return {
                el: toolbar,
                background: toolbar.shadowRoot.querySelector('.toolbar-background'),
                ionTitleEl: ionTitleEl,
                innerTitleEl: (ionTitleEl) ? ionTitleEl.shadowRoot.querySelector('.toolbar-title') : null,
                ionButtonsEl: Array.from(toolbar.querySelectorAll('ion-buttons')) || []
            };
        }) || []
    };
};
var handleContentScroll = function (scrollEl, scrollHeaderIndex, contentEl) {
    readTask(function () {
        var scrollTop = scrollEl.scrollTop;
        var scale = clamp(1, 1 + (-scrollTop / 500), 1.1);
        // Native refresher should not cause titles to scale
        var nativeRefresher = contentEl.querySelector('ion-refresher.refresher-native');
        if (nativeRefresher === null) {
            writeTask(function () {
                scaleLargeTitles(scrollHeaderIndex.toolbars, scale);
            });
        }
    });
};
var setToolbarBackgroundOpacity = function (toolbar, opacity) {
    if (opacity === undefined) {
        toolbar.background.style.removeProperty('--opacity');
    }
    else {
        toolbar.background.style.setProperty('--opacity', opacity.toString());
    }
};
var handleToolbarBorderIntersection = function (ev, mainHeaderIndex) {
    if (!ev[0].isIntersecting) {
        return;
    }
    /**
     * There is a bug in Safari where overflow scrolling on a non-body element
     * does not always reset the scrollTop position to 0 when letting go. It will
     * set to 1 once the rubber band effect has ended. This causes the background to
     * appear slightly on certain app setups.
     */
    var scale = (ev[0].intersectionRatio > 0.9) ? 0 : ((1 - ev[0].intersectionRatio) * 100) / 75;
    mainHeaderIndex.toolbars.forEach(function (toolbar) {
        setToolbarBackgroundOpacity(toolbar, (scale === 1) ? undefined : scale);
    });
};
/**
 * If toolbars are intersecting, hide the scrollable toolbar content
 * and show the primary toolbar content. If the toolbars are not intersecting,
 * hide the primary toolbar content and show the scrollable toolbar content
 */
var handleToolbarIntersection = function (ev, mainHeaderIndex, scrollHeaderIndex) {
    writeTask(function () {
        handleToolbarBorderIntersection(ev, mainHeaderIndex);
        var event = ev[0];
        var intersection = event.intersectionRect;
        var intersectionArea = intersection.width * intersection.height;
        var rootArea = event.rootBounds.width * event.rootBounds.height;
        var isPageHidden = intersectionArea === 0 && rootArea === 0;
        var leftDiff = Math.abs(intersection.left - event.boundingClientRect.left);
        var rightDiff = Math.abs(intersection.right - event.boundingClientRect.right);
        var isPageTransitioning = intersectionArea > 0 && (leftDiff >= 5 || rightDiff >= 5);
        if (isPageHidden || isPageTransitioning) {
            return;
        }
        if (event.isIntersecting) {
            setHeaderActive(mainHeaderIndex, false);
            setHeaderActive(scrollHeaderIndex);
        }
        else {
            /**
             * There is a bug with IntersectionObserver on Safari
             * where `event.isIntersecting === false` when cancelling
             * a swipe to go back gesture. Checking the intersection
             * x, y, width, and height provides a workaround. This bug
             * does not happen when using Safari + Web Animations,
             * only Safari + CSS Animations.
             */
            var hasValidIntersection = (intersection.x === 0 && intersection.y === 0) || (intersection.width !== 0 && intersection.height !== 0);
            if (hasValidIntersection) {
                setHeaderActive(mainHeaderIndex);
                setHeaderActive(scrollHeaderIndex, false);
                setToolbarBackgroundOpacity(mainHeaderIndex.toolbars[0]);
            }
        }
    });
};
var setHeaderActive = function (headerIndex, active) {
    if (active === void 0) { active = true; }
    if (active) {
        headerIndex.el.classList.remove('header-collapse-condense-inactive');
    }
    else {
        headerIndex.el.classList.add('header-collapse-condense-inactive');
    }
};
var scaleLargeTitles = function (toolbars, scale, transition) {
    if (toolbars === void 0) { toolbars = []; }
    if (scale === void 0) { scale = 1; }
    if (transition === void 0) { transition = false; }
    toolbars.forEach(function (toolbar) {
        var ionTitle = toolbar.ionTitleEl;
        var titleDiv = toolbar.innerTitleEl;
        if (!ionTitle || ionTitle.size !== 'large') {
            return;
        }
        titleDiv.style.transformOrigin = 'left center';
        titleDiv.style.transition = (transition) ? TRANSITION : '';
        titleDiv.style.transform = "scale3d(" + scale + ", " + scale + ", 1)";
    });
};
var headerIosCss = "ion-header{display:block;position:relative;-ms-flex-order:-1;order:-1;width:100%;z-index:10}ion-header ion-toolbar:first-of-type{padding-top:var(--ion-safe-area-top, 0)}.header-ios ion-toolbar:last-of-type{--border-width:0 0 0.55px}@supports ((-webkit-backdrop-filter: blur(0)) or (backdrop-filter: blur(0))){.header-background{left:0;right:0;top:0;bottom:0;position:absolute;-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px)}.header-translucent-ios ion-toolbar{--opacity:.8}.header-collapse-condense-inactive .header-background{-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px)}}.header-ios.ion-no-border ion-toolbar:last-of-type{--border-width:0}.header-collapse-condense{z-index:9}.header-collapse-condense ion-toolbar{position:-webkit-sticky;position:sticky;top:0}.header-collapse-condense ion-toolbar:first-of-type{padding-top:7px;z-index:1}.header-collapse-condense ion-toolbar{--background:var(--ion-background-color, #fff);z-index:0}.header-collapse-condense ion-toolbar ion-searchbar{height:48px;padding-top:0px;padding-bottom:13px}.header-collapse-main ion-toolbar.in-toolbar ion-title,.header-collapse-main ion-toolbar.in-toolbar ion-buttons{-webkit-transition:all 0.2s ease-in-out;transition:all 0.2s ease-in-out}.header-collapse-condense-inactive:not(.header-collapse-condense) ion-toolbar.in-toolbar ion-title,.header-collapse-condense-inactive:not(.header-collapse-condense) ion-toolbar.in-toolbar ion-buttons.buttons-collapse{opacity:0;pointer-events:none}.header-collapse-condense-inactive.header-collapse-condense ion-toolbar.in-toolbar ion-title,.header-collapse-condense-inactive.header-collapse-condense ion-toolbar.in-toolbar ion-buttons.buttons-collapse{visibility:hidden}";
var headerMdCss = "ion-header{display:block;position:relative;-ms-flex-order:-1;order:-1;width:100%;z-index:10}ion-header ion-toolbar:first-of-type{padding-top:var(--ion-safe-area-top, 0)}.header-md::after{left:0;bottom:-5px;background-position:left 0 top -2px;position:absolute;width:100%;height:5px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAHBAMAAADzDtBxAAAAD1BMVEUAAAAAAAAAAAAAAAAAAABPDueNAAAABXRSTlMUCS0gBIh/TXEAAAAaSURBVAjXYxCEAgY4UIICBmMogMsgFLtAAQCNSwXZKOdPxgAAAABJRU5ErkJggg==);background-repeat:repeat-x;content:\"\"}[dir=rtl] .header-md::after,:host-context([dir=rtl]) .header-md::after{left:unset;right:unset;right:0}[dir=rtl] .header-md::after,:host-context([dir=rtl]) .header-md::after{background-position:right 0 top -2px}.header-collapse-condense{display:none}.header-md.ion-no-border::after{display:none}";
var Header = /** @class */ (function () {
    function class_1(hostRef) {
        registerInstance(this, hostRef);
        this.collapsibleHeaderInitialized = false;
        /**
         * If `true`, the header will be translucent.
         * Only applies when the mode is `"ios"` and the device supports
         * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
         *
         * Note: In order to scroll content behind the header, the `fullscreen`
         * attribute needs to be set on the content.
         */
        this.translucent = false;
    }
    class_1.prototype.componentDidLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkCollapsibleHeader()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.componentDidUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkCollapsibleHeader()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.componentDidUnload = function () {
        this.destroyCollapsibleHeader();
    };
    class_1.prototype.checkCollapsibleHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hasCollapse, canCollapse, pageEl, contentEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hasCollapse = this.collapse === 'condense';
                        canCollapse = (hasCollapse && getIonMode(this) === 'ios') ? hasCollapse : false;
                        if (!(!canCollapse && this.collapsibleHeaderInitialized)) return [3 /*break*/, 1];
                        this.destroyCollapsibleHeader();
                        return [3 /*break*/, 3];
                    case 1:
                        if (!(canCollapse && !this.collapsibleHeaderInitialized)) return [3 /*break*/, 3];
                        pageEl = this.el.closest('ion-app,ion-page,.ion-page,page-inner');
                        contentEl = (pageEl) ? pageEl.querySelector('ion-content') : null;
                        return [4 /*yield*/, this.setupCollapsibleHeader(contentEl, pageEl)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.destroyCollapsibleHeader = function () {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            this.intersectionObserver = undefined;
        }
        if (this.scrollEl && this.contentScrollCallback) {
            this.scrollEl.removeEventListener('scroll', this.contentScrollCallback);
            this.contentScrollCallback = undefined;
        }
        if (this.collapsibleMainHeader) {
            this.collapsibleMainHeader.classList.remove('header-collapse-main');
            this.collapsibleMainHeader = undefined;
        }
    };
    class_1.prototype.setupCollapsibleHeader = function (contentEl, pageEl) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, headers, mainHeaderIndex, scrollHeaderIndex, toolbarIntersection;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!contentEl || !pageEl) {
                            console.error('ion-header requires a content to collapse, make sure there is an ion-content.');
                            return [2 /*return*/];
                        }
                        _a = this;
                        return [4 /*yield*/, contentEl.getScrollElement()];
                    case 1:
                        _a.scrollEl = _b.sent();
                        headers = pageEl.querySelectorAll('ion-header');
                        this.collapsibleMainHeader = Array.from(headers).find(function (header) { return header.collapse !== 'condense'; });
                        if (!this.collapsibleMainHeader) {
                            return [2 /*return*/];
                        }
                        mainHeaderIndex = createHeaderIndex(this.collapsibleMainHeader);
                        scrollHeaderIndex = createHeaderIndex(this.el);
                        if (!mainHeaderIndex || !scrollHeaderIndex) {
                            return [2 /*return*/];
                        }
                        setHeaderActive(mainHeaderIndex, false);
                        mainHeaderIndex.toolbars.forEach(function (toolbar) {
                            setToolbarBackgroundOpacity(toolbar, 0);
                        });
                        toolbarIntersection = function (ev) { handleToolbarIntersection(ev, mainHeaderIndex, scrollHeaderIndex); };
                        this.intersectionObserver = new IntersectionObserver(toolbarIntersection, { root: contentEl, threshold: [0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] });
                        this.intersectionObserver.observe(scrollHeaderIndex.toolbars[scrollHeaderIndex.toolbars.length - 1].el);
                        /**
                         * Handle scaling of large iOS titles and
                         * showing/hiding border on last toolbar
                         * in primary header
                         */
                        this.contentScrollCallback = function () { handleContentScroll(_this.scrollEl, scrollHeaderIndex, contentEl); };
                        this.scrollEl.addEventListener('scroll', this.contentScrollCallback);
                        writeTask(function () {
                            var title = cloneElement('ion-title');
                            title.size = 'large';
                            cloneElement('ion-back-button');
                            if (_this.collapsibleMainHeader !== undefined) {
                                _this.collapsibleMainHeader.classList.add('header-collapse-main');
                            }
                        });
                        this.collapsibleHeaderInitialized = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.render = function () {
        var _a;
        var translucent = this.translucent;
        var mode = getIonMode(this);
        var collapse = this.collapse || 'none';
        return (h(Host, { role: "banner", class: (_a = {},
                _a[mode] = true,
                // Used internally for styling
                _a["header-" + mode] = true,
                _a["header-translucent"] = this.translucent,
                _a["header-collapse-" + collapse] = true,
                _a["header-translucent-" + mode] = this.translucent,
                _a) }, mode === 'ios' && translucent &&
            h("div", { class: "header-background" }), h("slot", null)));
    };
    Object.defineProperty(class_1.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
Header.style = {
    /*STENCIL:MODE:ios*/ ios: headerIosCss,
    /*STENCIL:MODE:md*/ md: headerMdCss
};
export { Header as ion_header };
