export declare class ZeaInput {
    /**
     */
    name: string;
    /**
     */
    type: string;
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
    photoBase64: string;
    /**
     */
    colorPopupShown: boolean;
    /**
     */
    colorPopupAlign: string;
    /**
     */
    colorOptions: string[];
    /**
     * Referenced html elements
     */
    inputElement: HTMLInputElement;
    inputWrapElement: HTMLElement;
    colorPopup: HTMLElement;
    selectedColorContainer: HTMLElement;
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
    onKeyUp(e: any): void;
    /**
     */
    onKeyDown(e: any): void;
    /**
     */
    selectedColor: any;
    currentColorElement: any;
    /**
     */
    onColorClick(e: any): void;
    /**
     */
    selectColor(color: any): void;
    /**
     */
    onPhotoChange(e: any): void;
    /**
     */
    componentDidRender(): void;
    /**
     */
    componentWillLoad(): void;
    /**
     */
    componentDidLoad(): void;
    /**
     */
    render(): any;
}
