export declare class ZeaInputSelect {
    /**
     */
    name: string;
    /**
     */
    value: any;
    /**
     */
    label: string;
    /**
     */
    invalidMessage: string;
    /**
     */
    required: boolean;
    /**
     */
    isValid: boolean;
    /**
     */
    autoValidate: boolean;
    /**
     */
    invalidMessageShown: boolean;
    /**
     */
    showLabel: boolean;
    /**
     */
    optionsShown: boolean;
    /**
     */
    selectCallback: any;
    /**
     */
    inputElement: HTMLInputElement;
    inputWrapElement: HTMLElement;
    selectionContainer: HTMLElement;
    optionsContainer: HTMLElement;
    /**
     * Listen to click events on the whole document
     * @param {any} e The event
     */
    handleClick(e: any): void;
    /**
     */
    checkValue(): void;
    /**
     */
    onContainerClick(): void;
    /**
     */
    onBlur(): void;
    /**
     */
    onFocus(): void;
    /**
     */
    componentDidLoad(): void;
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render(): any;
}
