import { r as registerInstance, h } from './index-12ee0265.js';
var zeaMenuColorpickerCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.currentColor{margin:10px}.colorDropdown{display:none}.colorDropdown.shown{display:grid;grid-gap:10px;padding:10px;grid-template-columns:1fr 1fr 1fr;position:absolute;margin-top:-42px;margin-left:49px;border-radius:15px;background-color:var(--color-background-2)}";
var ZeaMenuColorpicker = /** @class */ (function () {
    function ZeaMenuColorpicker(hostRef) {
        registerInstance(this, hostRef);
        this.colorElements = [];
        this.shown = false;
    }
    /**
     * Handler for click events on the whole window
     * @param {any} e the event
     */
    ZeaMenuColorpicker.prototype.handleDropDownColorClick = function (e) {
        if (e.target == this.currentColor)
            return;
        if (e.target.tagName == 'ZEA-MENU-COLOR') {
            // Re-insert the previous color at the start of the list
            var referenceNode = this.dropDownContainer.childNodes[0];
            this.dropDownContainer.insertBefore(this.currentColor, referenceNode);
            this.currentColor = e.target;
            this.setActiveColors();
            this.currentColorContainer.appendChild(this.currentColor);
            this.shown = false;
            if ('callback' in this.currentColor)
                this.runCallback(this.currentColor);
        }
    };
    /**
     * Set the active colors through css variables
     */
    ZeaMenuColorpicker.prototype.setActiveColors = function () {
        document.documentElement.style.setProperty('--toolbar-active-bg-color', this.currentColor.color);
        document.documentElement.style.setProperty('--toolbar-active-fg-color', this.currentColor.fgColor);
    };
    /**
     * Handle click on currently selected color
     */
    ZeaMenuColorpicker.prototype.handleCurrentColorClick = function () {
        this.shown = !this.shown;
    };
    /**
     * Called everytime the component renders to run some setup on child elements
     */
    ZeaMenuColorpicker.prototype.componentDidRender = function () {
        this.setupChildren();
    };
    /**
     * Run some setup for the children items
     */
    ZeaMenuColorpicker.prototype.setupChildren = function () {
        var _this = this;
        this.dropDownContainer
            .querySelector('slot')
            .assignedElements()
            .forEach(function (element) {
            if (element.tagName == 'ZEA-MENU-COLOR') {
                _this.colorElements.push(element);
                element.addEventListener('click', _this.handleDropDownColorClick.bind(_this));
            }
        });
        if (!this.currentColor) {
            this.currentColor = this.colorElements[0];
            this.setActiveColors();
        }
        this.currentColorContainer.appendChild(this.currentColor);
    };
    /**
     * Run the item's callback
     * @param {any} element The element whose callback to call
     */
    ZeaMenuColorpicker.prototype.runCallback = function (element) {
        if (element.callback) {
            if (typeof element.callback == 'string') {
                eval(element.callback);
            }
            else {
                element.callback(element);
            }
        }
    };
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    ZeaMenuColorpicker.prototype.render = function () {
        var _this = this;
        return (h("div", { class: "zea-menu-colorpicker" }, h("div", { onClick: this.handleCurrentColorClick.bind(this), class: "currentColor", ref: function (el) { return (_this.currentColorContainer = el); } }), h("div", { class: "colorDropdown " + (this.shown ? 'shown' : ''), ref: function (el) { return (_this.dropDownContainer = el); } }, h("slot", null))));
    };
    return ZeaMenuColorpicker;
}());
ZeaMenuColorpicker.style = zeaMenuColorpickerCss;
export { ZeaMenuColorpicker as zea_menu_colorpicker };
