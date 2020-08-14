'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');

const zeaDialogShareCss = ".zea-dialog-share{color:var(--color-freground-1)}.scrollpane-container{width:100%;height:100%;padding:10px;-webkit-box-sizing:border-box;box-sizing:border-box}";

const ZeaDialogShare = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        /**
         */
        this.shown = false;
    }
    /**
     */
    dialogCloseHandler(event) {
        if (event.detail == this.dialog)
            this.shown = false;
    }
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render() {
        return (index.h("zea-dialog", { ref: (el) => (this.dialog = el), width: "fit-content", class: "share-dialog", shown: this.shown }, index.h("div", { slot: "title" }, "Share"), index.h("div", { slot: "body" }, index.h("div", { class: "scrollpane-container" }, index.h("zea-scroll-pane", null, index.h("zea-tabs", { orientation: "horizontal", density: "small" }, index.h("div", { slot: "tab-bar" }, "Share Link"), index.h("div", null, index.h("zea-qr-code", { scale: 4 }), index.h("zea-copy-link", null)), index.h("div", { slot: "tab-bar" }, "Send SMS"), index.h("div", null, "Tab Content 2"), index.h("div", { slot: "tab-bar" }, "Send Email"), index.h("div", null, "Tab Content 3")))))));
    }
};
ZeaDialogShare.style = zeaDialogShareCss;

const zeaInputSearchCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-input-search{color:var(--color-foreground-1);display:-ms-inline-flexbox;display:inline-flex;-ms-flex-pack:end;justify-content:flex-end;-ms-flex-align:center;align-items:center;width:2em;border-radius:3px;-webkit-transition:all 0.5s;transition:all 0.5s;background-color:transparent;border:1px solid transparent}path.icon{fill:var(--color-foreground-1)}.zea-input-search.active{width:100%;border:1px solid var(--color-grey-3);background-color:var(--color-background-1)}.zea-input-search-icon{height:2em;width:2em;display:inline-block;vertical-align:middle;border-radius:1em;-webkit-box-sizing:border-box;box-sizing:border-box;padding:0.2em;-ms-flex-positive:0;flex-grow:0;-ms-flex-negative:0;flex-shrink:0}.zea-input-search-icon:hover{background-color:var(--color-primary-3);color:var(--color-button-text-1)}.zea-input-search.active .zea-input-search-icon:hover{background-color:var(--color-background-1)}input{display:block;height:100%;width:100%;border:none;background-color:transparent;outline:none;font-size:1em;color:var(--color-foreground-1)}.zea-input-search-text-container{height:2em;-ms-flex-positive:1;flex-grow:1;opacity:0;-webkit-transition:all 0.5s;transition:all 0.5s}.zea-input-search.active .zea-input-search-text-container{opacity:1}";

const ZeaInputSearch = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.placeholder = '';
    }
    /**
     * Toggle 'active' class of the search box
     */
    toggleSearchBox() {
        this.mainContainer.classList.toggle('active');
        this.mainInput.focus();
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render() {
        return (index.h("div", { class: "zea-input-search", ref: (el) => {
                this.mainContainer = el;
            } }, index.h("span", { class: "zea-input-search-icon", onClick: () => {
                this.toggleSearchBox();
            } }, index.h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "100%", height: "100%", viewBox: "0 0 24 24" }, index.h("path", { class: "icon", d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" }), index.h("path", { d: "M0 0h24v24H0z", fill: "none" }))), index.h("span", { class: "zea-input-search-text-container" }, index.h("input", { ref: (el) => {
                this.mainInput = el;
            }, onBlur: () => {
                this.mainContainer.classList.remove('active');
            }, onKeyDown: (e) => {
                e.stopPropagation();
            }, onKeyUp: (e) => {
                e.stopPropagation();
            }, class: "zea-input-search-text", type: "text", placeholder: this.placeholder }))));
    }
    get mainElement() { return index.getElement(this); }
};
ZeaInputSearch.style = zeaInputSearchCss;

const zeaLayoutCss = ":host{height:100%}:host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-layout{color:var(--color-foreground-1);display:-ms-flexbox;display:flex;width:100%;height:100%}.zea-layout.vertical{-ms-flex-direction:column;flex-direction:column}.zea-layout-cell{-ms-flex-positive:1;flex-grow:1;position:relative;-webkit-box-sizing:border-box;box-sizing:border-box;background-color:var(--color-background-1);width:100%;height:100%}.with-borders .zea-layout-cell{border:1px solid var(--color-grey-1)}.zea-layout-cell:nth-child(1){-ms-flex-positive:0;flex-grow:0;width:100px;height:auto}.zea-layout-cell:nth-child(3){-ms-flex-positive:0;flex-grow:0;width:100px;height:auto}.vertical .zea-layout-cell:nth-child(1){-ms-flex-positive:0;flex-grow:0;height:100px;width:auto}.vertical .zea-layout-cell:nth-child(3){-ms-flex-positive:0;flex-grow:0;height:100px;width:auto}.zea-resize-handle{position:absolute;display:block;content:'';width:6px;height:100%;background-color:transparent;background-repeat:no-repeat;background-position:center center;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAXCAYAAAAoRj52AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEFJREFUeNpinDRp0v+XL18yLF26lFFMTIwhJiYGzGf6/fs3w58/fxhgAMZnYsABRiWGrwQLCwsDMzMzXADGBwgwAF78GJLqRabNAAAAAElFTkSuQmCC);z-index:1000000;top:0;opacity:0.5;cursor:col-resize}.zea-resize-handle:hover{background-color:var(--color-background-2);opacity:1}.vertical .zea-resize-handle{left:0 !important;right:0 !important;background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAGCAYAAAAooAWeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAD1JREFUeNpinDhx4v8/f/4wUBuwsrIysLx8+ZLh79+/VDechYWFgVFBQYGBVoBFTEyMdoZHR0cPzTAHCDAAG7UW+bsxwNcAAAAASUVORK5CYII=')}.zea-layout-cell:nth-child(1) .zea-resize-handle{right:-1px}.zea-layout-cell:nth-child(3) .zea-resize-handle{left:-1px}.vertical .zea-resize-handle{position:absolute;width:100%;height:6px;cursor:row-resize;margin-left:0;left:0;background-repeat:no-repeat}.vertical .zea-layout-cell:nth-child(1) .zea-resize-handle{bottom:-1px;top:auto}.vertical .zea-layout-cell:nth-child(3) .zea-resize-handle{top:-1px}";

const ZeaLayout = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.cellCount = 3;
        this.orientation = 'horizontal';
        this.resizeCellA = true;
        this.resizeCellC = true;
        this.cellASize = 100;
        this.cellCSize = 100;
        this.resizeInterval = 50;
        this.showBorders = true;
        this.error = '';
        this.minimumGap = 20;
        this.maximunGap = 50;
    }
    /**
     * Listen for dragstart events
     * @param {any} event The event
     */
    onHandleMouseDown(event) {
        this.activeHandle = event.target;
        document.getElementsByTagName('body')[0].style.cursor =
            this.orientation === 'vertical' ? 'row-resize' : 'col-resize';
        document.getElementsByTagName('body')[0].style.userSelect = 'none';
    }
    /**
     * Listen for dragstart events
     * @param {any} event The event
     */
    onHandleMouseUp() {
        this.activeHandle = null;
        document.getElementsByTagName('body')[0].style.cursor = 'default';
        document.getElementsByTagName('body')[0].style.userSelect = 'initial';
    }
    /**
     * Listen to mousemove event
     * @param {any} event the event
     */
    mouseMoveHandler(event) {
        if (this.activeHandle) {
            const isA = this.activeHandle.classList.contains('zea-handle-a');
            if (this.orientation === 'vertical') {
                if (isA) {
                    this.processDrag(event, 'Y', 'a');
                }
                else {
                    this.processDrag(event, 'Y', 'c');
                }
            }
            else {
                if (isA) {
                    this.processDrag(event, 'X', 'a');
                }
                else {
                    this.processDrag(event, 'X', 'c');
                }
            }
        }
    }
    /**
     * Process drag
     * @param {any} event The event
     * @param {any} axis The axis
     * @param {any} cell The cell
     */
    processDrag(event, axis, cell) {
        const handle = this.activeHandle;
        const parent = handle.parentElement;
        const parentRect = parent.getBoundingClientRect();
        const handleRect = handle.getBoundingClientRect();
        const cellBREct = this.cellB.getBoundingClientRect();
        const side = axis == 'X' ? 'left' : 'top';
        const prop = axis == 'X' ? 'width' : 'height';
        const cellBSize = cellBREct[prop];
        let offset = handleRect[side] - event['client' + axis];
        // change offset sign for the following sum, according to cell
        offset = cell == 'a' ? -offset : offset;
        let newDimension = parentRect[prop] + offset;
        parent.style[prop] = `${newDimension}px`;
        if (newDimension < this.minimumGap) {
            newDimension = this.minimumGap;
        }
        const maxDimension = parentRect[prop] + cellBSize - this.minimumGap;
        if (newDimension > maxDimension) {
            newDimension = maxDimension;
        }
        const cellSizeVar = cell == 'a' ? 'cellASize' : 'cellCSize';
        this[cellSizeVar] = newDimension;
        parent.style[prop] = `${newDimension}px`;
        this.triggerResize(newDimension);
    }
    /**
     * Trigger window resize event
     * @param {any} newDimension The new dimension
     */
    triggerResize(newDimension) {
        window.dispatchEvent(new CustomEvent('resize', {
            bubbles: true,
            detail: newDimension,
        }));
    }
    /**
     */
    layout() {
        let dimension;
        let availableLength;
        if (this.orientation === 'vertical') {
            dimension = 'height';
            availableLength = this.layoutContainer.clientHeight;
        }
        else {
            dimension = 'width';
            availableLength = this.layoutContainer.clientWidth;
        }
        const cellBSize = availableLength - this.cellASize - this.cellCSize;
        this.cellA.style[dimension] = `${this.cellASize}px`;
        this.cellB.style[dimension] = `${cellBSize}px`;
        this.cellC.style[dimension] = `${this.cellCSize}px`;
    }
    /**
     * Prevent the browser drag event from triggering
     * as it hinders the mousemove event
     */
    componentDidLoad() {
        this.mainElement.addEventListener('dragstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        window.addEventListener('resize', () => {
            this.layout();
        });
    }
    /**
     * Prevent the browser drag event from triggering
     * as it hinders the mousemove event
     */
    componentDidRender() {
        this.layout();
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render() {
        const cellAStyle = {};
        const cellCStyle = {};
        if (!this.cellASize) {
            this.resizeCellA = false;
        }
        if (!this.cellCSize) {
            this.resizeCellC = false;
        }
        if (this.cellASize !== undefined) {
            if (this.orientation === 'vertical') {
                cellAStyle.height = `${this.cellASize}px`;
            }
            else {
                cellAStyle.width = `${this.cellASize}px`;
            }
        }
        if (this.cellCSize !== undefined) {
            if (this.orientation === 'vertical') {
                cellCStyle.height = `${this.cellCSize}px`;
            }
            else {
                cellCStyle.width = `${this.cellCSize}px`;
            }
        }
        const cellA = (index.h("div", { class: "zea-layout-cell cell-a", style: cellAStyle, ref: (el) => (this.cellA = el) }, this.resizeCellA && (index.h("div", { class: "zea-resize-handle zea-handle-a", onMouseDown: this.onHandleMouseDown.bind(this) })), index.h("slot", { name: "a" })));
        const cellB = (index.h("div", { class: "zea-layout-cell cell-b", ref: (el) => (this.cellB = el) }, index.h("slot", { name: "b" })));
        const cellC = this.cellCount > 2 && (index.h("div", { class: "zea-layout-cell cell-c", style: cellCStyle, ref: (el) => (this.cellC = el) }, this.resizeCellC && (index.h("div", { class: "zea-resize-handle zea-handle-c", onMouseDown: this.onHandleMouseDown.bind(this) })), index.h("slot", { name: "c" })));
        return (index.h("div", { ref: (el) => (this.layoutContainer = el), class: `zea-layout ${this.orientation} ${this.showBorders ? 'with-borders' : ''}` }, this.error || [cellA, cellB, cellC]));
    }
    get mainElement() { return index.getElement(this); }
};
ZeaLayout.style = zeaLayoutCss;

const zeaNavigationDrawerCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-navigation-drawer{color:var(--color-foreground-1);display:inline-block;vertical-align:middle}.drawer{position:fixed;top:0;left:0;-webkit-transform:translateX(-100%);transform:translateX(-100%);width:192px;height:100vh;background-color:var(--color-background-1);z-index:10000000;-webkit-transition:-webkit-transform 0.3s;transition:-webkit-transform 0.3s;transition:transform 0.3s;transition:transform 0.3s, -webkit-transform 0.3s;-webkit-transition-timing-function:ease-out;transition-timing-function:ease-out}.shown .drawer{left:0;-webkit-transform:translateX(0);transform:translateX(0)}.toggle{position:relative;z-index:10000010;margin-right:12px;margin-left:7px;background-color:transparent;border-radius:50%;padding:4px;display:inline-block}.toggle:hover{background-color:var(--color-grey-3)}.drawer-content{padding-top:80px;padding-left:9px;font-size:14px}@media only screen and (max-width: 667px){.drawer{width:80%}}";

const ZeaNavigationDrawer = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        /**
         */
        this.shown = false;
        this.navDrawerOpen = index.createEvent(this, "navDrawerOpen", 7);
        this.navDrawerClosed = index.createEvent(this, "navDrawerClosed", 7);
    }
    /**
     * Listen to click events on the whole document
     * @param {any} e The event
     */
    handleClick(e) {
        if (!e.composedPath().includes(this.container) ||
            !e.composedPath().includes(this.toggleButton)) {
            this.shown = false;
            this.navDrawerClosed.emit(this);
        }
    }
    /**
     */
    onToggleClick() {
        this.shown = !this.shown;
        if (this.shown) {
            this.navDrawerOpen.emit(this);
        }
        else {
            this.navDrawerClosed.emit(this);
        }
    }
    /**
     */
    render() {
        return (index.h("div", { ref: (el) => (this.container = el), class: { 'zea-navigation-drawer': true, shown: this.shown } }, index.h("div", { class: "drawer" }, index.h("div", { class: "drawer-content" }, index.h("slot", null))), index.h("div", { class: "toggle", ref: (el) => (this.toggleButton = el), onClick: this.onToggleClick.bind(this) }, index.h("zea-icon", { size: 30, name: "menu" }))));
    }
};
ZeaNavigationDrawer.style = zeaNavigationDrawerCss;

const zeaPanelProgressBarCss = ".zea-panel-progress-bar{color:var(--color-freground-1);position:absolute;top:0;left:0;right:0;bottom:0;background-color:var(--color-shadow);display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center}";

const ZeaPanelProgressBar = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
    }
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render() {
        return (index.h("div", { class: "zea-panel-progress-bar" }, index.h("zea-dialog", { shown: true, allowClose: false, showTitle: false, fullScreenMobile: false, width: '300px' }, index.h("div", { slot: "body" }, index.h("slot", null), index.h("zea-progress-bar", { ref: (el) => (this.progressBar = el), type: "indeterminate" })))));
    }
};
ZeaPanelProgressBar.style = zeaPanelProgressBarCss;

const zeaUserChipSetCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-chip-set{color:var(--color-foreground-1);display:-ms-flexbox;display:flex;position:relative}zea-user-chip{margin-left:-8px;width:36px;height:36px;border:1px solid transparent;border-radius:19px}.overflow-thumb{border:2px solid var(--color-background-3);background-color:var(--color-background-3);width:36px;height:36px;color:var(--color-foreground-2);display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;position:relative;font-size:13px;margin-left:-8px;border-radius:19px;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.overflow-tooltip{position:absolute;top:35px;padding:4px 7px;border-radius:4px;font-size:12px;color:var(--color-foreground-1);background-color:var(--color-grey-3);z-index:10000;white-space:nowrap;display:none}.overflow-thumb:hover .overflow-tooltip{display:block}.overflow-list{max-height:calc(100vh - 60px);width:-webkit-min-content;width:-moz-min-content;width:min-content;overflow-y:auto;background-color:var(--color-background-2);display:none}.overflow-list.shown{display:block;position:absolute}.overflow-list zea-user-card{display:block;}.overflow-entry{display:-ms-flexbox;display:flex;-ms-flex-align:stretch;align-items:stretch}.overflow-entry-collapser{padding-left:8px;padding-top:14px;padding-right:8px}";

const ZeaUserChipSet = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        /**
         * Whether avatar images should be shown or not
         */
        this.showImages = true;
        /**
         * The initial z-index for chip overlapping
         */
        this.initialZIndex = 1000;
        /**
         * Number of chips to show before overflow happens
         */
        this.overflowLimit = 5;
        /**
         * Number of chips to show before overflow happens
         */
        this.overflowShown = false;
        /**
         * Object containing entries in the overflow
         */
        this.shownOverflowEntry = null;
    }
    /**
     * Watch for changes in the session property
     */
    sessionChanged() {
        this.setupSession();
    }
    /**
     * Called when the component first loads
     */
    componentWillLoad() {
        setTimeout(() => {
            this.setupSession();
        }, 500);
    }
    /**
     * Set up the sesion subscriptions
     */
    setupSession() {
        if (this.session && 'sub' in this.session) {
            // Initialize the data array with any users already in the meeting.
            const userDatas = [];
            for (let u in this.session.users) {
                if (this.session.users.hasOwnProperty(u)) {
                    userDatas.push(this.session.users[u]);
                }
            }
            this.userDatas = userDatas;
            // Maintaint the order which users join.
            // New users should be on the left.
            this.session.sub('user-joined', (userData) => {
                if (!this.userDatas.find((sessionUserData) => sessionUserData.id == userData.id)) {
                    this.userDatas = [userData, ...this.userDatas];
                }
            });
            this.session.sub('user-left', (userData) => {
                const index = this.userDatas.findIndex((sessionUserData) => sessionUserData.id == userData.id);
                if (index == -1) {
                    console.warn('User id not in session:', userData.id);
                    return;
                }
                const userDatas = [...this.userDatas];
                // Remove the user from our array.
                userDatas.splice(index, 1);
                this.userDatas = userDatas;
            });
            this.session.sub('userChanged', (newUserData) => {
                this.session.users[newUserData.id] = newUserData;
                const userDatas = [];
                for (let u in this.session.users) {
                    if (this.session.users.hasOwnProperty(u)) {
                        userDatas.push(this.session.users[u]);
                    }
                }
                this.userDatas = userDatas;
            });
        }
        else {
            this.userDatas = [];
        }
    }
    /**
     * Activate the current item
     * @param {any} e The event
     */
    onChipClick(e) {
        e.stopPropagation();
    }
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render() {
        if (!this.userDatas)
            return;
        const shownChips = this.userDatas.slice(0, this.overflowLimit);
        const overflownChips = this.userDatas.slice(this.overflowLimit);
        // let currentZIndex = this.initialZIndex
        return (index.h("div", { class: "zea-chip-set" }, shownChips &&
            shownChips.map((userData) => {
                return (index.h("zea-user-chip", { showImages: this.showImages, key: userData.id, userData: userData,
                    // style={{ zIndex: `${--currentZIndex}` }}
                    onClick: this.onChipClick.bind(this) }));
            }), overflownChips.length > 0 && (index.h("div", { class: "overflow" }, index.h("div", { class: "overflow-thumb", onClick: (e) => {
                this.overflowShown = !this.overflowShown;
                e.stopPropagation();
            } }, [
            `+${this.userDatas.length - this.overflowLimit}`,
            !this.overflowShown && (index.h("div", { class: "overflow-tooltip" }, "Show All")),
        ]), index.h("div", { class: { 'overflow-list': true, shown: this.overflowShown } }, overflownChips.map((userData) => {
            return (index.h("div", { key: userData.id, class: {
                    'overflow-entry': true,
                    shown: this.shownOverflowEntry == userData.id,
                } }, index.h("div", { class: "overflow-entry-collapser", onClick: (e) => {
                    this.shownOverflowEntry =
                        this.shownOverflowEntry == userData.id
                            ? null
                            : userData.id;
                    e.currentTarget.scrollIntoView();
                } }, index.h("zea-icon", { name: this.shownOverflowEntry == userData.id
                    ? 'chevron-up-outline'
                    : 'chevron-down-outline', size: 14 })), index.h("zea-user-card", { userData: userData, collapsible: false, density: this.shownOverflowEntry == userData.id
                    ? 'normal'
                    : 'small' })));
        }))))));
    }
    static get watchers() { return {
        "session": ["sessionChanged"]
    }; }
};
ZeaUserChipSet.style = zeaUserChipSetCss;

exports.zea_dialog_share = ZeaDialogShare;
exports.zea_input_search = ZeaInputSearch;
exports.zea_layout = ZeaLayout;
exports.zea_navigation_drawer = ZeaNavigationDrawer;
exports.zea_panel_progress_bar = ZeaPanelProgressBar;
exports.zea_user_chip_set = ZeaUserChipSet;
