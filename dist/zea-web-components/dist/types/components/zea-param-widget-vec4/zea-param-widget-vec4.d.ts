export declare class ZeaParamWidgetVec4 {
    private xField;
    private yField;
    private zField;
    private tField;
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
     * The value of the X number
     */
    xValue: any;
    /**
     * The value of the Y number
     */
    yValue: any;
    /**
     * The value of the Z number
     */
    zValue: any;
    /**
     * The value of the T number
     */
    tValue: any;
    /**
     * Reinit input when paramater changes
     */
    parameterChangeHandler(): void;
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
     * Round number
     * @param {number} value Number to be rounded
     * @param {number} decimals Number of decimal places
     * @return {number} Rounded number
     */
    private round;
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render(): any;
}
