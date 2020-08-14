export declare class ZeaInputText {
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
    disabled: boolean;
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
    hidden: boolean;
    /**
     */
    inputElement: HTMLInputElement;
    inputWrapElement: HTMLElement;
    /**
     */
    checkValue(): void;
    /**
     */
    onKeyUp(e: any): void;
    /**
     */
    onKeyDown(e: any): void;
    /**
     */
    onBlur(): void;
    /**
     */
    onFocus(): void;
    /**
     */
    componentDidRender(): void;
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render(): any;
}
