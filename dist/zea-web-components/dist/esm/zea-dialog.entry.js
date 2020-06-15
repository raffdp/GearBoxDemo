import { r as registerInstance, c as createEvent, h, d as getElement } from './index-12ee0265.js';

const zeaDialogCss = "@import url('https://unpkg.com/tachyons@4/css/tachyons.min.css');:host{position:relative;z-index:10000000}:host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-dialog{color:var(--color-foreground-1);display:none;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;position:fixed;top:0;left:0;bottom:0;right:0;font-size:14px;pointer-events:none}.zea-dialog.shown{display:-ms-flexbox;display:flex}.backdrop{background-color:var(--color-shadow);position:absolute;top:0;left:0;bottom:0;right:0;pointer-events:auto}.scroll-pane-container{max-height:100%;height:100%}.zea-dialog-container{-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;background-color:var(--color-background-1);-webkit-box-shadow:2px 6px 10px 5px var(--color-shadow);box-shadow:2px 6px 10px 5px var(--color-shadow);min-height:-webkit-fit-content;min-height:-moz-fit-content;min-height:fit-content;min-width:-webkit-fit-content;min-width:-moz-fit-content;min-width:fit-content;pointer-events:auto;max-height:100%;max-width:100%}.zea-dialog-title ::slotted(h3){font-size:13px;margin:0 0 1em}.zea-dialog-title{color:var(--color-foreground-1)}.with-padding .zea-dialog-title{padding:20px 20px 0 20px}.zea-dialog-body{-ms-flex-positive:1;flex-grow:1;height:100%;-webkit-box-sizing:border-box;box-sizing:border-box}.with-padding .zea-dialog-body{padding:20px}.zea-dialog-body ::slotted([slot='body']){height:100%;-webkit-box-sizing:border-box;box-sizing:border-box}.zea-dialog-footer{text-align:right}.with-padding .zea-dialog-footer{padding:0 20px 20px}";

const ZeaDialog = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.shown = false;
        this.width = 'auto';
        this.allowClose = true;
        this.showBackdrop = true;
        this.addPadding = true;
        this.dialogClose = createEvent(this, "dialogClose", 7);
    }
    /**
     */
    async prompt() {
        this.shown = true;
    }
    /**
     */
    onBackdropClick() {
        if (this.allowClose) {
            this.shown = false;
            this.dialogClose.emit(this.hostElement);
        }
    }
    /**
     */
    resetSize() {
        if (!this.dialogContainer)
            return;
        if (this.width) {
            this.dialogContainer.style.width = this.width;
        }
        else {
            this.dialogContainer.style.width = `fit-content`;
        }
        this.dialogContainer.style.height = `fit-content`;
        if (this.dialogContainer.offsetHeight) {
            this.dialogContainer.style.height = `${this.dialogContainer.offsetHeight}px`;
        }
        if (this.dialogContainer.offsetWidth) {
            this.dialogContainer.style.width = `${this.dialogContainer.offsetWidth}px`;
        }
    }
    /**
     */
    componentDidRender() {
        this.resetSize();
    }
    /**
     */
    componentWillLoad() {
        window.addEventListener('resize', () => {
            this.resetSize();
        });
    }
    /**
     */
    setupContainer(el) {
        if (this.dialogContainer)
            return;
        this.dialogContainer = el;
        this.dialogContainer.addEventListener('dialogResize', () => {
            this.resetSize();
        });
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render() {
        return (h("div", { class: {
                'zea-dialog': true,
                shown: this.shown,
                'with-padding': this.addPadding,
            } }, this.showBackdrop && (h("div", { class: "backdrop", onClick: this.onBackdropClick.bind(this) })), h("div", { class: "zea-dialog-container", ref: (el) => this.setupContainer(el) }, h("div", { class: "zea-dialog-title" }, h("slot", { name: "title" })), h("div", { class: "zea-dialog-body" }, h("slot", { name: "body" })), h("div", { class: "zea-dialog-footer" }, h("slot", { name: "footer" })))));
    }
    get hostElement() { return getElement(this); }
};
ZeaDialog.style = zeaDialogCss;

export { ZeaDialog as zea_dialog };
