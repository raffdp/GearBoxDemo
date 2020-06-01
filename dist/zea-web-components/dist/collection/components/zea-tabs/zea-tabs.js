import { Component, h, Prop, Listen, Element } from '@stencil/core';
/**
 * Main class for the component
 */
export class ZeaTabs {
    constructor() {
        this.orientation = 'horizontal';
        this.density = 'medium';
    }
    /**
     * Listen to click events
     * @param {any} event The event
     */
    clickHandler(event) {
        if (event.target.getAttribute('slot') == 'tab-bar') {
            let tabIndex = this.getTabIndex(event.target);
            this.showPanelByIndex(tabIndex);
            this.resetActiveTab();
            event.target.classList.add('active');
        }
    }
    /**
     * Show panel by index
     * @param {any} tabIndex The tab index
     */
    showPanelByIndex(tabIndex) {
        const contentSlot = this.mainElement.shadowRoot.querySelector('slot:not([name])');
        const contentItems = contentSlot.assignedElements();
        const nodes = Array.prototype.slice.call(contentItems);
        for (const i in contentItems) {
            if (contentItems.hasOwnProperty(i)) {
                contentItems[i].classList.remove('active');
            }
        }
        const contentElement = nodes[tabIndex];
        contentElement.classList.add('active');
    }
    /**
     * Get the index of a tab
     * @param {any} tabElement The tab index
     * @return {int} The index of the tab
     */
    getTabIndex(tabElement) {
        const tabsSlot = this.mainElement.shadowRoot.querySelector('slot[name="tab-bar"]');
        const tabItems = tabsSlot.assignedElements();
        const nodes = Array.prototype.slice.call(tabItems);
        return nodes.indexOf(tabElement);
    }
    /**
     * Show panel by index
     */
    resetActiveTab() {
        const tabsSlot = this.mainElement.shadowRoot.querySelector('slot[name="tab-bar"]');
        const tabItems = tabsSlot.assignedElements();
        for (const i in tabItems) {
            if (tabItems.hasOwnProperty(i)) {
                tabItems[i].classList.remove('active');
            }
        }
    }
    /**
     * Activate first tab on load
     */
    componentDidLoad() {
        const tabsSlot = this.mainElement.shadowRoot.querySelector('slot[name="tab-bar"]');
        const firstTab = tabsSlot.assignedElements()[0];
        const evObj = document.createEvent('Events');
        evObj.initEvent('click', true, false);
        firstTab.dispatchEvent(evObj);
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render() {
        return (h("div", { class: `zea-tabs ${this.orientation} ${this.density}` },
            h("div", { class: "zea-tabs-bar" },
                h("slot", { name: "tab-bar" })),
            h("div", { class: "zea-tabs-content" },
                h("slot", null))));
    }
    static get is() { return "zea-tabs"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-tabs.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-tabs.css"]
    }; }
    static get properties() { return {
        "orientation": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "orientation",
            "reflect": false,
            "defaultValue": "'horizontal'"
        },
        "density": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "density",
            "reflect": false,
            "defaultValue": "'medium'"
        }
    }; }
    static get elementRef() { return "mainElement"; }
    static get listeners() { return [{
            "name": "click",
            "method": "clickHandler",
            "target": undefined,
            "capture": false,
            "passive": false
        }]; }
}
