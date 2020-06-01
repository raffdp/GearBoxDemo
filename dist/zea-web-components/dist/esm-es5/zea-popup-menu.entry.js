import { r as registerInstance, h, d as getElement } from './index-12ee0265.js';
var zeaPopupMenuCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-popup-menu{color:var(--color-foreground-1);display:none;position:absolute;z-index:10000;background-color:var(--color-background-2);-webkit-box-shadow:0px 5px 10px var(--color-shadow);box-shadow:0px 5px 10px var(--color-shadow);padding:0.5em 0}.zea-popup-menu.shown{display:block}";
var ZeaPopupMenu = /** @class */ (function () {
    function ZeaPopupMenu(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Whether the menu should be shown
         */
        this.shown = false;
        /**
         * Add twinkle effect on item click
         * @param {any} elmnt the item element
         */
        this.twinkleElement = function (elmnt) {
            elmnt.classList.toggle('twinkled');
            var interval = setInterval(function () {
                elmnt.classList.toggle('twinkled');
            }, 70);
            setTimeout(function () {
                clearTimeout(interval);
                elmnt.classList.remove('twinkled');
            }, 100);
        };
    }
    /**
     * Main render function
     * @param {any} ev the event
     */
    ZeaPopupMenu.prototype.handleClick = function (ev) {
        var _this = this;
        if (ev.target == this.anchorElement) {
            this.bbox = ev.target.getBoundingClientRect();
            this.leftOffset = this.bbox.left + "px";
            this.topOffset = this.bbox.top + "px";
            this.shown = !this.shown;
            return;
        }
        // check if the clicked element is part of the menu
        if (this.hostElement.contains(ev.target)) {
            var item = ev.target.shadowRoot.querySelector('.zea-popup-menu-item');
            this.twinkleElement(item);
            setTimeout(function () {
                _this.shown = false;
            }, 300);
        }
        else {
            if (this.anchorElement)
                this.shown = false;
        }
    };
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    ZeaPopupMenu.prototype.render = function () {
        var _this = this;
        return (h("div", { ref: function (node) { return (_this.node = node); }, class: "zea-popup-menu " + (this.shown ? 'shown' : 'hidden'), style: {
                top: this.topOffset,
                left: this.leftOffset,
            } }, h("slot", null)));
    };
    Object.defineProperty(ZeaPopupMenu.prototype, "hostElement", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return ZeaPopupMenu;
}());
ZeaPopupMenu.style = zeaPopupMenuCss;
export { ZeaPopupMenu as zea_popup_menu };
