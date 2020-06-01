export declare class ZeaParamWidgetNumber {
    private inputField;
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
     * Html input type
     */
    inputType: string;
    /**
     * The application data
     */
    appData: any;
    /**
     * The value of the number
     */
    value: any;
    /**
     * Range of values
     */
    range: any;
    /**
     * Steps for the slider
     */
    step: any;
    /**
     * Reinit input when paramater changes
     */
    parameterChangeHandler(): void;
    /**
     * Run when component loads
     */
    componentDidLoad(): void;
    /**
     * Set up the input
     */
    private setUpInput;
    /**
     * Sets the value of the input
     */
    private setInputValue;
    /**
     * Run when input changes
     */
    private inputChanged;
    /**
     * Round number
     * @param {number} value Number to be rounded
     * @param {number} decimals Number of decimal places
     * @return {number} Rounded number
     */
    private round;
    /**
     * Clamp number
     * @param {number} num Number to be rounded
     * @param {number} a Number of decimal places
     * @param {number} b Number of decimal places
     * @return {number} clamped number
     */
    private clamp;
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render(): any;
}
