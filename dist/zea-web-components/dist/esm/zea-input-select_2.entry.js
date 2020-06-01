import { r as registerInstance, h } from './index-12ee0265.js';

const zeaInputSelectCss = ":host{display:inline-block;width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;font-size:13px}.zea-input{color:var(--color-foreground-1)}.input-label{color:var(--color-grey-3);position:relative;-webkit-transition:all 0.2s linear;transition:all 0.2s linear;pointer-events:none}.empty .input-label{top:18px;font-size:13px}.not-empty .input-label,.focused .input-label{top:0;font-size:11px}.focused .input-label{color:var(--color-secondary-1)}.input-wrap{display:block;position:relative}.invalid-message{color:var(--color-warning-2);padding:0.3em 0;font-size:12px}.underliner{text-align:center;height:1px;background-color:var(--color-grey-3);overflow:hidden;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center}.underliner .expander{height:1px;background-color:var(--color-secondary-1);overflow:hidden;display:inline-block;width:0;-webkit-transition:width 0.2s linear;transition:width 0.2s linear}.focused .underliner .expander{width:100%}.selection-container{min-height:22px;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.selection{-ms-flex-positive:1;flex-grow:1;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.options-container{display:none;position:absolute;width:100%;height:210px;max-height:initial;overflow:hidden;padding:2px;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-box-shadow:2px 2px 13px 0px var(--color-background-4);box-shadow:2px 2px 13px 0px var(--color-background-4);background-color:var(--color-background-1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1000;margin-top:1px}.options-container.shown{display:block}.discipline-row{display:-ms-flexbox;display:flex;width:100%;-ms-flex-align:center;align-items:center}.discipline-name{-ms-flex-positive:1;flex-grow:1}.discipline-abbreviation{text-transform:uppercase;padding:8px;width:15px;height:15px;line-height:15px;text-align:center;border-radius:20px;margin:5px 10px 5px 5px;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;white-space:nowrap}";

const ZeaInputSelect = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         */
        this.name = 'zea-input';
        /**
         */
        this.label = 'Enter text...';
        /**
         */
        this.invalidMessage = 'Not valid';
        /**
         */
        this.required = false;
        /**
         */
        this.isValid = true;
        /**
         */
        this.autoValidate = false;
        /**
         */
        this.invalidMessageShown = false;
        /**
         */
        this.showLabel = true;
        /**
         */
        this.optionsShown = false;
    }
    /**
     * Listen to click events on the whole document
     * @param {any} e The event
     */
    handleClick(e) {
        if (!e.composedPath().includes(this.inputWrapElement)) {
            this.optionsShown = false;
        }
    }
    /**
     */
    checkValue() {
        if (!this.inputElement)
            return;
        this.value = this.inputElement.value;
        this.value.replace(/(^\s+|\s+$)/, ''); // trim
        if (this.required) {
            if (!this.value) {
                this.invalidMessage = 'Field is required';
                this.isValid = false;
                if (this.autoValidate)
                    this.invalidMessageShown = true;
            }
            else {
                this.isValid = true;
                this.invalidMessageShown = false;
            }
        }
    }
    /**
     */
    onContainerClick() {
        this.optionsShown = !this.optionsShown;
    }
    /**
     */
    onBlur() {
        this.inputWrapElement.classList.remove('focused');
    }
    /**
     */
    onFocus() {
        this.inputWrapElement.classList.add('focused');
    }
    /**
     */
    componentDidLoad() {
        this.optionsContainer.addEventListener('click', (e) => {
            e.composedPath().forEach((element) => {
                if (element.tagName == 'ZEA-INPUT-SELECT-ITEM') {
                    this.value = element.value;
                    this.optionsShown = false;
                    const selContainer = this.selectionContainer.querySelector('.selection');
                    selContainer.innerHTML = '';
                    selContainer.appendChild(element.cloneNode(true));
                    if (this.selectCallback)
                        this.selectCallback(this.value);
                }
            });
        });
    }
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { class: `input-wrap ${this.value ? 'not-empty' : 'empty'} ${this.optionsShown ? 'focused' : ''}`, ref: (el) => (this.inputWrapElement = el) }, this.showLabel && h("label", { class: "input-label" }, this.label), h("div", { ref: (el) => (this.selectionContainer = el), class: "selection-container", onClick: this.onContainerClick.bind(this) }, h("div", { class: "selection" }), h("zea-icon", { name: this.optionsShown ? 'chevron-up-outline' : 'chevron-down-outline', size: 13 })), h("div", { ref: (el) => (this.optionsContainer = el), class: { 'options-container': true, shown: this.optionsShown } }, h("zea-scroll-pane", null, h("slot", null))), h("div", { class: "underliner" }, h("div", { class: "expander" })), !this.isValid && this.invalidMessageShown && (h("div", { class: "invalid-message" }, this.invalidMessage))));
    }
};
ZeaInputSelect.style = zeaInputSelectCss;

const zeaInputSelectItemCss = ":host{display:block}.zea-input-select-item{color:var(--color-freground-1)}::slotted(.select-item-wrap){padding:5px}";

const ZeaInputSelectItem = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render() {
        return (h("div", { class: "zea-input-select-item" }, h("slot", null)));
    }
};
ZeaInputSelectItem.style = zeaInputSelectItemCss;

export { ZeaInputSelect as zea_input_select, ZeaInputSelectItem as zea_input_select_item };
