import { r as registerInstance, h, d as getElement } from './index-12ee0265.js';
var zeaTabsCss = "@import url('https://unpkg.com/tachyons@4/css/tachyons.min.css');:host{display:block;height:100%}:host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-tabs{color:var(--color-foreground-1);display:-ms-flexbox;display:flex;width:100%;height:100%}.zea-tabs *{-webkit-box-sizing:border-box;box-sizing:border-box}.zea-tabs.small{font-size:11px}.zea-tabs{-ms-flex-direction:column;flex-direction:column}.zea-tabs.vertical{-ms-flex-direction:row;flex-direction:row}.zea-tabs .zea-tabs-bar{-ms-flex-negative:0;flex-shrink:0;border-bottom:1px solid var(--color-grey-3)}.zea-tabs.vertical .zea-tabs-bar{width:10em;-ms-flex-negative:0;flex-shrink:0;height:auto;border-bottom:none;border-right:1px solid var(--color-grey-3)}.zea-tabs-content{-ms-flex-positive:1;flex-grow:1;padding-top:1em;height:calc(100% - 30px)}::slotted(:not([slot='tab-bar'])){display:none}::slotted(.active:not([slot='tab-bar'])){display:block;max-height:100%;}::slotted([slot='tab-bar']){font-weight:bold;color:var(--color-foreground-1);cursor:pointer;display:inline-block;padding:1em 1em 0.5em}.small ::slotted([slot='tab-bar']){padding:0.5em 1em 0.5em}::slotted([slot='tab-bar']:hover){color:var(--color-secondary-1)}::slotted(.active[slot='tab-bar']){border-bottom:0.2em solid var(--color-secondary-1);color:var(--color-secondary-1)}.vertical ::slotted([slot='tab-bar']){border-bottom:none;border-left:0.3em solid transparent;padding:1.4em 1em}.vertical ::slotted(.active[slot='tab-bar']){border-bottom:none;border-left:0.3em solid var(--color-secondary-1)}.vertical .zea-tabs-bar{padding-top:2em;padding-left:0}";
var ZeaTabs = /** @class */ (function () {
    function ZeaTabs(hostRef) {
        registerInstance(this, hostRef);
        this.orientation = 'horizontal';
        this.density = 'medium';
    }
    /**
     * Listen to click events
     * @param {any} event The event
     */
    ZeaTabs.prototype.clickHandler = function (event) {
        if (event.target.getAttribute('slot') == 'tab-bar') {
            var tabIndex = this.getTabIndex(event.target);
            this.showPanelByIndex(tabIndex);
            this.resetActiveTab();
            event.target.classList.add('active');
        }
    };
    /**
     * Show panel by index
     * @param {any} tabIndex The tab index
     */
    ZeaTabs.prototype.showPanelByIndex = function (tabIndex) {
        var contentSlot = this.mainElement.shadowRoot.querySelector('slot:not([name])');
        var contentItems = contentSlot.assignedElements();
        var nodes = Array.prototype.slice.call(contentItems);
        for (var i in contentItems) {
            if (contentItems.hasOwnProperty(i)) {
                contentItems[i].classList.remove('active');
            }
        }
        var contentElement = nodes[tabIndex];
        contentElement.classList.add('active');
    };
    /**
     * Get the index of a tab
     * @param {any} tabElement The tab index
     * @return {int} The index of the tab
     */
    ZeaTabs.prototype.getTabIndex = function (tabElement) {
        var tabsSlot = this.mainElement.shadowRoot.querySelector('slot[name="tab-bar"]');
        var tabItems = tabsSlot.assignedElements();
        var nodes = Array.prototype.slice.call(tabItems);
        return nodes.indexOf(tabElement);
    };
    /**
     * Show panel by index
     */
    ZeaTabs.prototype.resetActiveTab = function () {
        var tabsSlot = this.mainElement.shadowRoot.querySelector('slot[name="tab-bar"]');
        var tabItems = tabsSlot.assignedElements();
        for (var i in tabItems) {
            if (tabItems.hasOwnProperty(i)) {
                tabItems[i].classList.remove('active');
            }
        }
    };
    /**
     * Activate first tab on load
     */
    ZeaTabs.prototype.componentDidLoad = function () {
        var tabsSlot = this.mainElement.shadowRoot.querySelector('slot[name="tab-bar"]');
        var firstTab = tabsSlot.assignedElements()[0];
        var evObj = document.createEvent('Events');
        evObj.initEvent('click', true, false);
        firstTab.dispatchEvent(evObj);
    };
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    ZeaTabs.prototype.render = function () {
        return (h("div", { class: "zea-tabs " + this.orientation + " " + this.density }, h("div", { class: "zea-tabs-bar" }, h("slot", { name: "tab-bar" })), h("div", { class: "zea-tabs-content" }, h("slot", null))));
    };
    Object.defineProperty(ZeaTabs.prototype, "mainElement", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return ZeaTabs;
}());
ZeaTabs.style = zeaTabsCss;
export { ZeaTabs as zea_tabs };
