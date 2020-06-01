import { r as registerInstance, h, H as Host, d as getElement } from './index-12ee0265.js';
import { i as isStr, g as getUrl, a as getName } from './utils-00f05b01.js';
var validateContent = function (svgContent) {
    if (svgContent && typeof document !== 'undefined') {
        var div = document.createElement('div');
        div.innerHTML = svgContent;
        // setup this way to ensure it works on our buddy IE
        for (var i = div.childNodes.length - 1; i >= 0; i--) {
            if (div.childNodes[i].nodeName.toLowerCase() !== 'svg') {
                div.removeChild(div.childNodes[i]);
            }
        }
        // must only have 1 root element
        var svgElm = div.firstElementChild;
        if (svgElm && svgElm.nodeName.toLowerCase() === 'svg') {
            var svgClass = svgElm.getAttribute('class') || '';
            svgElm.setAttribute('class', (svgClass + ' s-ion-icon').trim());
            // root element must be an svg
            // lets double check we've got valid elements
            // do not allow scripts
            if (isValid(svgElm)) {
                return div.innerHTML;
            }
        }
    }
    return '';
};
var isValid = function (elm) {
    if (elm.nodeType === 1) {
        if (elm.nodeName.toLowerCase() === 'script') {
            return false;
        }
        for (var i = 0; i < elm.attributes.length; i++) {
            var val = elm.attributes[i].value;
            if (isStr(val) && val.toLowerCase().indexOf('on') === 0) {
                return false;
            }
        }
        for (var i = 0; i < elm.childNodes.length; i++) {
            if (!isValid(elm.childNodes[i])) {
                return false;
            }
        }
    }
    return true;
};
var ioniconContent = new Map();
var requests = new Map();
var getSvgContent = function (url) {
    // see if we already have a request for this url
    var req = requests.get(url);
    if (!req) {
        if (typeof fetch !== 'undefined') {
            // we don't already have a request
            req = fetch(url).then(function (rsp) {
                if (rsp.ok) {
                    return rsp.text().then(function (svgContent) {
                        ioniconContent.set(url, validateContent(svgContent));
                    });
                }
                ioniconContent.set(url, '');
            });
            // cache for the same requests
            requests.set(url, req);
        }
        else {
            // set to empty for ssr scenarios and resolve promise
            ioniconContent.set(url, '');
            return Promise.resolve();
        }
    }
    return req;
};
var iconCss = ":host{display:inline-block;width:1em;height:1em;contain:strict;fill:currentColor;-webkit-box-sizing:content-box !important;box-sizing:content-box !important}:host .ionicon{stroke:currentColor}.ionicon-fill-none{fill:none}.ionicon-stroke-width{stroke-width:32px;stroke-width:var(--ionicon-stroke-width, 32px)}.icon-inner,.ionicon,svg{display:block;height:100%;width:100%}:host(.flip-rtl) .icon-inner{-webkit-transform:scaleX(-1);transform:scaleX(-1)}:host(.icon-small){font-size:18px !important}:host(.icon-large){font-size:32px !important}:host(.ion-color){color:var(--ion-color-base) !important}:host(.ion-color-primary){--ion-color-base:var(--ion-color-primary, #3880ff)}:host(.ion-color-secondary){--ion-color-base:var(--ion-color-secondary, #0cd1e8)}:host(.ion-color-tertiary){--ion-color-base:var(--ion-color-tertiary, #f4a942)}:host(.ion-color-success){--ion-color-base:var(--ion-color-success, #10dc60)}:host(.ion-color-warning){--ion-color-base:var(--ion-color-warning, #ffce00)}:host(.ion-color-danger){--ion-color-base:var(--ion-color-danger, #f14141)}:host(.ion-color-light){--ion-color-base:var(--ion-color-light, #f4f5f8)}:host(.ion-color-medium){--ion-color-base:var(--ion-color-medium, #989aa2)}:host(.ion-color-dark){--ion-color-base:var(--ion-color-dark, #222428)}";
var Icon = /** @class */ (function () {
    function Icon(hostRef) {
        registerInstance(this, hostRef);
        this.isVisible = false;
        /**
         * The mode determines which platform styles to use.
         */
        this.mode = getIonMode();
        /**
         * If enabled, ion-icon will be loaded lazily when it's visible in the viewport.
         * Default, `false`.
         */
        this.lazy = false;
    }
    Icon.prototype.connectedCallback = function () {
        var _this = this;
        // purposely do not return the promise here because loading
        // the svg file should not hold up loading the app
        // only load the svg if it's visible
        this.waitUntilVisible(this.el, '50px', function () {
            _this.isVisible = true;
            _this.loadIcon();
        });
    };
    Icon.prototype.disconnectedCallback = function () {
        if (this.io) {
            this.io.disconnect();
            this.io = undefined;
        }
    };
    Icon.prototype.waitUntilVisible = function (el, rootMargin, cb) {
        var _this = this;
        if (this.lazy && typeof window !== 'undefined' && window.IntersectionObserver) {
            var io_1 = this.io = new window.IntersectionObserver(function (data) {
                if (data[0].isIntersecting) {
                    io_1.disconnect();
                    _this.io = undefined;
                    cb();
                }
            }, { rootMargin: rootMargin });
            io_1.observe(el);
        }
        else {
            // browser doesn't support IntersectionObserver
            // so just fallback to always show it
            cb();
        }
    };
    Icon.prototype.loadIcon = function () {
        var _this = this;
        if (this.isVisible) {
            var url_1 = getUrl(this);
            if (url_1) {
                if (ioniconContent.has(url_1)) {
                    // sync if it's already loaded
                    this.svgContent = ioniconContent.get(url_1);
                }
                else {
                    // async if it hasn't been loaded
                    getSvgContent(url_1).then(function () { return _this.svgContent = ioniconContent.get(url_1); });
                }
            }
        }
        if (!this.ariaLabel) {
            var label = getName(this.name, this.icon, this.mode, this.ios, this.md);
            // user did not provide a label
            // come up with the label based on the icon name
            if (label) {
                this.ariaLabel = label.replace(/\-/g, ' ');
            }
        }
    };
    Icon.prototype.render = function () {
        var _a, _b;
        var mode = this.mode || 'md';
        var flipRtl = this.flipRtl || (this.ariaLabel && (this.ariaLabel.indexOf('arrow') > -1 || this.ariaLabel.indexOf('chevron') > -1) && this.flipRtl !== false);
        return (h(Host, { role: "img", class: Object.assign(Object.assign((_a = {}, _a[mode] = true, _a), createColorClasses(this.color)), (_b = {}, _b["icon-" + this.size] = !!this.size, _b['flip-rtl'] = !!flipRtl && this.el.ownerDocument.dir === 'rtl', _b)) }, ((this.svgContent)
            ? h("div", { class: "icon-inner", innerHTML: this.svgContent })
            : h("div", { class: "icon-inner" }))));
    };
    Object.defineProperty(Icon, "assetsDirs", {
        get: function () { return ["svg"]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Icon.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Icon, "watchers", {
        get: function () {
            return {
                "name": ["loadIcon"],
                "src": ["loadIcon"],
                "icon": ["loadIcon"]
            };
        },
        enumerable: true,
        configurable: true
    });
    return Icon;
}());
var getIonMode = function () { return (typeof document !== 'undefined' && document.documentElement.getAttribute('mode')) || 'md'; };
var createColorClasses = function (color) {
    var _a;
    return (color) ? (_a = {
            'ion-color': true
        },
        _a["ion-color-" + color] = true,
        _a) : null;
};
Icon.style = iconCss;
var svg = {};
svg['draw-arrow'] = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg width=\"100%\" height=\"100%\" viewBox=\"0 0 512 512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" xmlns:serif=\"http://www.serif.com/\" style=\"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;\"><g id=\"arrow\"><path id=\"arrow1\" serif:id=\"arrow\" d=\"M118.973,142.33l-30.466,30.467c-6.181,6.181 -16.767,2.264 -17.44,-6.452l-7.037,-91.328c-0.229,-2.976 0.857,-5.909 2.967,-8.02c2.111,-2.11 5.044,-3.196 8.02,-2.967l91.327,7.037c8.729,0.661 12.646,11.247 6.465,17.428l-30.478,30.478l300.835,300.836c6.445,6.445 6.445,16.912 0,23.357c-6.446,6.445 -16.912,6.445 -23.358,0l-300.835,-300.836Z\"/><rect id=\"keep-square\" serif:id=\"keep square\" x=\"0\" y=\"0\" width=\"512\" height=\"512\" style=\"fill:none;fill-rule:nonzero;\"/></g></svg>";
svg['draw-freehand'] = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg width=\"100%\" height=\"100%\" viewBox=\"0 0 512 512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" xmlns:serif=\"http://www.serif.com/\" style=\"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;\"><g id=\"freehand\"><path id=\"pen\" d=\"M324.403,142.611c-3.015,-3.092 -7.153,-4.834 -11.472,-4.829c-4.319,0.005 -8.453,1.756 -11.461,4.856l-187.543,193.243c-1.146,1.181 -2.104,2.532 -2.838,4.006l-26.409,70.002c-3.095,6.21 -1.833,13.707 3.123,18.562c4.957,4.856 12.478,5.962 18.623,2.74l68.378,-27.232c1.48,-0.776 2.83,-1.78 3.999,-2.974l188.421,-192.356c6.082,-6.209 6.094,-16.138 0.026,-22.361l-42.847,-43.657Zm30.305,-54.593l-21.677,22.234c-6.057,6.212 -6.058,16.119 -0.003,22.332l42.847,43.671c3.011,3.09 7.143,4.832 11.457,4.832c4.315,0 8.446,-1.743 11.457,-4.833l21.678,-22.248c14.614,-14.999 8.958,-45.329 -5.656,-60.328c-14.942,-15.315 -45.165,-20.971 -60.099,-5.663l-0.004,0.003Z\"/><rect id=\"keep-square\" serif:id=\"keep square\" x=\"0\" y=\"0\" width=\"512\" height=\"512\" style=\"fill:none;fill-rule:nonzero;\"/></g></svg>";
svg['draw-polygon'] = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg width=\"100%\" height=\"100%\" viewBox=\"0 0 512 512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" xmlns:serif=\"http://www.serif.com/\" style=\"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;\"><g id=\"polygon\"><path id=\"polygon1\" serif:id=\"polygon\" d=\"M266.945,355.799l-136.44,91.653c-5.263,3.536 -11.95,4.192 -17.801,1.747c-5.85,-2.445 -10.082,-7.664 -11.264,-13.894l-40.792,-214.944c-1.268,-6.68 1.156,-13.526 6.344,-17.92l161.322,-136.628c4.965,-4.206 11.747,-5.557 17.945,-3.575l191.685,61.294c7.799,2.494 13.1,9.732 13.124,17.92l0.615,208.352c0.016,5.271 -2.173,10.309 -6.038,13.893c-3.865,3.584 -9.052,5.389 -14.307,4.978l-164.393,-12.876Zm146.933,-26.352l-0.514,-174.147l-168.638,-53.924l-144.944,122.757l33.41,176.044l118.156,-79.371c3.531,-2.371 7.758,-3.481 11.998,-3.149l150.532,11.79Z\"/><rect id=\"keep-square\" serif:id=\"keep square\" x=\"0\" y=\"0\" width=\"512\" height=\"512\" style=\"fill:none;fill-rule:nonzero;\"/></g></svg>";
svg['draw-text'] = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg width=\"100%\" height=\"100%\" viewBox=\"0 0 512 512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" xmlns:serif=\"http://www.serif.com/\" style=\"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;\"><g id=\"text\"><path id=\"text1\" serif:id=\"text\" d=\"M63.725,112l0,-36c0,-6.623 5.377,-12 12,-12l360,0c6.623,0 12,5.377 12,12l0,36l0.275,0l0,50c0,6.623 -5.377,12 -12,12l-24,0c-6.623,0 -12,-5.377 -12,-12l0,-50l-120,0l0,288l45.381,0c6.623,0 12,5.377 12,12l0,24c0,6.623 -5.377,12 -12,12l-139.312,0c-6.623,0 -12,-5.377 -12,-12l0,-24c0,-6.623 5.377,-12 12,-12l45.931,0l0,-288l-119.725,0l0,50c0,6.623 -5.377,12 -12,12l-24,0c-6.623,0 -12,-5.377 -12,-12l0,-50l-0.55,0Z\"/><rect id=\"keep-square\" serif:id=\"keep square\" x=\"0\" y=\"0\" width=\"512\" height=\"512\" style=\"fill:none;fill-rule:nonzero;\"/></g></svg>";
svg['find-user'] = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg width=\"100%\" height=\"100%\" viewBox=\"0 0 512 512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" xmlns:serif=\"http://www.serif.com/\" style=\"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;\"><g id=\"find-user\"><g id=\"person\"><path id=\"body\" d=\"M364.305,393.842l-216.61,0c-5.738,0.074 -11.214,-2.444 -14.892,-6.849c-4,-4.782 -5.612,-11.311 -4.418,-17.914c5.194,-28.811 21.403,-53.014 46.879,-70.004c22.633,-15.083 51.303,-23.384 80.736,-23.384c29.433,0 58.103,8.307 80.736,23.384c25.476,16.984 41.685,41.186 46.879,69.998c1.194,6.603 -0.418,13.132 -4.418,17.913c-3.677,4.408 -9.153,6.929 -14.892,6.856Z\" style=\"fill-rule:nonzero;\"/><path id=\"head\" d=\"M303.162,138.206c-11.975,-12.929 -28.701,-20.049 -47.162,-20.049c-18.559,0 -35.341,7.077 -47.26,19.925c-12.049,12.991 -17.92,30.646 -16.541,49.71c2.732,37.611 31.353,68.207 63.801,68.207c32.448,0 61.02,-30.59 63.795,-68.195c1.397,-18.892 -4.51,-36.51 -16.633,-49.598Z\" style=\"fill-rule:nonzero;\"/></g><g id=\"scan\"><path id=\"_4\" serif:id=\"4\" d=\"M336,464l56,0c39.498,0 72,-32.502 72,-72c0,0 0,-56 0,-56c0,-8.831 -7.169,-16 -16,-16c-8.831,0 -16,7.169 -16,16l0,56c0,21.943 -18.057,40 -40,40l-56,0c-8.831,0 -16,7.169 -16,16c0,8.831 7.169,16 16,16Z\"/><path id=\"_3\" serif:id=\"3\" d=\"M176,432l-56,0c-21.943,0 -40,-18.057 -40,-40c0,0 0,-56 0,-56c0,-8.831 -7.169,-16 -16,-16c-8.831,0 -16,7.169 -16,16l0,56c0,39.498 32.502,72 72,72c0,0 56,0 56,0c8.831,0 16,-7.169 16,-16c0,-8.831 -7.169,-16 -16,-16Z\"/><path id=\"_2\" serif:id=\"2\" d=\"M464,176l0,-56c0,-39.498 -32.502,-72 -72,-72l-56,0c-8.831,0 -16,7.169 -16,16c0,8.831 7.169,16 16,16l56,0c21.943,0 40,18.057 40,40l0,56c0,8.831 7.169,16 16,16c8.831,0 16,-7.169 16,-16Z\"/><path id=\"_1\" serif:id=\"1\" d=\"M80,176l0,-56c0,-21.943 18.057,-40 40,-40c0,0 56,0 56,0c8.831,0 16,-7.169 16,-16c0,-8.831 -7.169,-16 -16,-16l-56,0c-39.498,0 -72,32.502 -72,72l0,56c0,8.831 7.169,16 16,16c8.831,0 16,-7.169 16,-16Z\"/></g><rect id=\"keep-square\" serif:id=\"keep square\" x=\"0\" y=\"0\" width=\"512\" height=\"512\" style=\"fill:none;fill-rule:nonzero;\"/></g></svg>";
svg['undo'] = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg width=\"100%\" height=\"100%\" viewBox=\"0 0 512 512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" xmlns:serif=\"http://www.serif.com/\" style=\"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;\"><g id=\"undo\"><path id=\"undo1\" serif:id=\"undo\" d=\"M173.041,264.618c48.562,-42.459 88.718,-55.437 122.014,-50.683c30.36,4.335 53.985,23.204 71.761,43.697c28.572,32.938 42.372,70.95 42.372,70.95l0,0c3.755,10.38 15.23,15.76 25.61,12.006c10.38,-3.754 15.76,-15.23 12.006,-25.61c0,0 -16.146,-44.792 -49.772,-83.557c-23.69,-27.31 -55.864,-51.308 -96.324,-57.084c-42.091,-6.01 -94.34,7.325 -156.009,61.939l-38.76,-38.76c-8.12,-8.12 -22.029,-2.975 -22.912,8.478l-9.246,119.989c-0.3,3.911 1.126,7.763 3.899,10.536c2.773,2.774 6.626,4.199 10.536,3.899l119.989,-9.246c11.469,-0.867 16.614,-14.776 8.494,-22.896l-43.658,-43.658Z\" style=\"fill-rule:nonzero;\"/><rect id=\"keep-square\" serif:id=\"keep square\" x=\"0\" y=\"0\" width=\"512\" height=\"512\" style=\"fill:none;fill-rule:nonzero;\"/></g></svg>";
svg['redo'] = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg width=\"100%\" height=\"100%\" viewBox=\"0 0 512 512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" xmlns:serif=\"http://www.serif.com/\" style=\"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;\"><g id=\"redo\"><path id=\"redo1\" serif:id=\"redo\" d=\"M348.701,264.618c-48.562,-42.459 -88.718,-55.437 -122.014,-50.683c-30.36,4.335 -53.985,23.204 -71.761,43.697c-28.573,32.938 -42.373,70.95 -42.373,70.95l0,0c-3.754,10.38 -15.229,15.76 -25.609,12.006c-10.381,-3.754 -15.761,-15.23 -12.006,-25.61c0,0 16.145,-44.792 49.772,-83.557c23.69,-27.31 55.864,-51.308 96.323,-57.084c42.092,-6.01 94.341,7.325 156.01,61.939l38.759,-38.76c8.121,-8.12 22.029,-2.975 22.913,8.478l9.246,119.989c0.3,3.911 -1.126,7.763 -3.899,10.536c-2.774,2.774 -6.626,4.199 -10.537,3.899l-119.989,-9.246c-11.468,-0.867 -16.614,-14.776 -8.493,-22.896l43.658,-43.658Z\" style=\"fill-rule:nonzero;\"/><rect id=\"keep-square\" serif:id=\"keep square\" x=\"0\" y=\"0\" width=\"512\" height=\"512\" style=\"fill:none;fill-rule:nonzero;\"/></g></svg>";
var getSvg = function (name) {
    return svg[name];
};
var zeaIconCss = ":host,zea-icon,.zea-icon{display:inline-block;vertical-align:middle;}ion-icon{display:block}.zea-custom-icon svg{width:100%;height:100%;fill:currentColor}.zea-custom-icon svg *{}.zea-custom-icon-inner{width:1em;height:1em}";
var ZeaIcon = /** @class */ (function () {
    function ZeaIcon(hostRef) {
        registerInstance(this, hostRef);
        /**
         * The library to load the icon from
         */
        this.type = 'ionic';
        /**
         * The icon size in pixels
         */
        this.size = 24;
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    ZeaIcon.prototype.render = function () {
        if (this.type == 'ionic') {
            return (h("div", { class: "zea-icon ionic" }, h("ion-icon", { name: this.name, style: { fontSize: this.size + "px" } })));
        }
        else if (this.type == 'zea') {
            return (h("div", { class: "zea-icon zea-custom-icon zea-icon-" + this.name }, h("div", { class: "zea-custom-icon-inner", style: { fontSize: this.size + "px" }, innerHTML: getSvg(this.name) })));
        }
    };
    return ZeaIcon;
}());
ZeaIcon.style = zeaIconCss;
export { Icon as ion_icon, ZeaIcon as zea_icon };
