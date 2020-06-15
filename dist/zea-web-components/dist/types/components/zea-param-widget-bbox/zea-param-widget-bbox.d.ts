export declare class ZeaParamWidgetBbox {
    private minxField;
    private minyField;
    private minzField;
    private maxxField;
    private maxyField;
    private maxzField;
    private container;
    private change;
    private remoteUserEditedHighlightId;
    /**
     * Class constructor
     */
    constructor();
    /**
     * Parameter to be edited
     */
    parameter: any;
    /**
     * The application data
     */
    appData: any;
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
     * @param {object} event The event object with details about the change.
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
