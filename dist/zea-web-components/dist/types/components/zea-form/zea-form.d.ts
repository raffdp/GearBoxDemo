export declare class ZeaForm {
    /**
     */
    submitText: string;
    /**
     */
    validate: boolean;
    /**
     */
    isValid: boolean;
    /**
     */
    formValue: any;
    /**
     */
    submitCallback: any;
    /**
     */
    private inputs;
    /**
     */
    formContainer: HTMLElement;
    /**
     */
    getFormValue(): any;
    /**
     */
    checkValidation(): Boolean;
    /**
     */
    onSubmit(): void;
    /**
     */
    componentDidRender(): void;
    /**
     * Run some setup for the children items
     */
    setupChildren(): void;
    render(): any;
}
