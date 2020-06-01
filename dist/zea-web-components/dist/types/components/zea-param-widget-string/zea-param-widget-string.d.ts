export declare class ZeaParamWidgetString {
    private txtField;
    private widgetContainer;
    private change;
    private remoteUserEditedHighlightId;
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
     * Set the inputs up
     */
    private setUpInputs;
    /**
     * Value change handler
     * @param {any} mode The value set mode
     */
    private onValueChanged;
    /**
     * Input handler
     */
    private onInput;
    /**
     * Change handler
     */
    private onChange;
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render(): any;
}
