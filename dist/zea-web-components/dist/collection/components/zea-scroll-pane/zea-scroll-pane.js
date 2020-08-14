import { Component, h, Host, Element, Listen } from '@stencil/core';
import { ResizeObserver } from '@juggle/resize-observer';
/**
 *
 * */
export class ZeaScrollPane {
    constructor() {
        this.vMouseDown = false;
    }
    /**
     *
     */
    onResize() {
        this.refreshScrollbar();
    }
    /**
     *
     */
    onOrientationchange() {
        this.refreshScrollbar();
    }
    /**
     *
     */
    onMouseUp() {
        this.vMouseDown = false;
        this.scrollPane.style.userSelect = 'initial';
    }
    /**
     * @param {any} e The event
     */
    onMouseMove(e) {
        if (this.vMouseDown) {
            const mouseDelta = e.clientY - this.prevClientY;
            const newScroll = (this.vBarTop - this.vTrackTop + mouseDelta) / this.scrollRatio;
            this.scrollPane.scrollTop = this.scrollPane.scrollTop + newScroll;
            this.prevClientY = e.clientY;
        }
    }
    /**
     *
     */
    componentDidLoad() {
        this.refreshScrollbar();
        this.scrollPane.addEventListener('scroll', () => {
            this.vScrollBar.style.top = `${this.scrollPane.scrollTop * this.scrollRatio}px`;
        });
        this.vScrollBar.addEventListener('mousedown', (e) => {
            this.vMouseDown = true;
            this.vMouseOffet = e.clientY;
            this.vCurrentScroll = this.scrollPane.scrollTop;
            const vBarBbox = this.vScrollBar.getBoundingClientRect();
            this.vBarTop = vBarBbox.top;
            this.vBarHeight = vBarBbox.height;
            this.prevClientY = e.clientY;
            const vTrackBbox = this.vScrollBar.getBoundingClientRect();
            this.vTrackTop = vTrackBbox.top;
            this.scrollPane.style.userSelect = 'none';
        });
        const ro = new ResizeObserver(() => {
            this.refreshScrollbar();
        });
        ro.observe(this.scrollContent);
        const observer = new MutationObserver((mutations) => {
            console.log(mutations);
            this.refreshScrollbar();
        });
        observer.observe(this.scrollContent, {
            attributes: true,
        });
    }
    /**
     *
     */
    refreshScrollbar() {
        this.scrollRatio =
            Math.ceil((this.rootElement.offsetHeight / this.scrollContent.offsetHeight) * 1000) / 1000;
        if (this.scrollRatio < 0.999) {
            this.rootElement.classList.remove('disabled');
            const handleHeight = this.rootElement.offsetHeight * this.scrollRatio;
            this.scrollDelta = this.rootElement.offsetHeight - handleHeight;
            this.vScrollBar.style.height = `${handleHeight}px`;
        }
        else {
            this.rootElement.classList.add('disabled');
        }
    }
    /**
     *
     */
    render() {
        return (h(Host, null,
            h("div", { ref: (el) => (this.vScrollTrack = el), draggable: false, class: "v-scroll-track" }),
            h("div", { draggable: false, class: "v-scroll-bar", ref: (el) => (this.vScrollBar = el) }),
            h("div", { class: "zea-scroll-pane", ref: (el) => (this.scrollPane = el) },
                h("div", { class: "scroll-content", ref: (el) => (this.scrollContent = el) },
                    h("slot", null)))));
    }
    static get is() { return "zea-scroll-pane"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-scroll-pane.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-scroll-pane.css"]
    }; }
    static get elementRef() { return "rootElement"; }
    static get listeners() { return [{
            "name": "resize",
            "method": "onResize",
            "target": "window",
            "capture": false,
            "passive": true
        }, {
            "name": "orientationchange",
            "method": "onOrientationchange",
            "target": "window",
            "capture": false,
            "passive": false
        }, {
            "name": "mouseup",
            "method": "onMouseUp",
            "target": "window",
            "capture": false,
            "passive": true
        }, {
            "name": "mousemove",
            "method": "onMouseMove",
            "target": "window",
            "capture": false,
            "passive": true
        }]; }
}
