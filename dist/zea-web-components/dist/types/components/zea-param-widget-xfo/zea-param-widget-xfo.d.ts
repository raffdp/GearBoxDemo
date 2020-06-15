export declare class ZeaParamWidgetXfo {
    private trxField;
    private tryField;
    private trzField;
    private orxField;
    private oryField;
    private orzField;
    private orwField;
    private scxField;
    private scyField;
    private sczField;
    private widgetContainer;
    private change;
    private remoteUserEditedHighlightId;
    private settingValue;
    /**
     * Parameter to be edited
     */
    parameter: any;
    /**
     * The application data
     */
    appData: any;
    /**
     * Class constructor
     */
    constructor();
    /**
     * Run when component loads
     */
    componentDidLoad(): void;
    /**
     * Value change handler
     * @param {object} event The event object with details about the change.
     */
    private updateDisplayedValue;
    /**
     * Set the inputs up
     */
    private setUpInputs;
    /**
     * Input handler
     */
    private onInput;
    /**
     * Change handler
     */
    private onChange;
    /**
     * Round number
     * @param {number} value the value to be rounded
     * @param {number} decimals decimal places to keep
     * @return {number} the rouunded value
     */
    private round;
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render(): any;
}
