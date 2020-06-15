export declare class ZeaParamWidgetMaterialColor {
    private container;
    private colorPicker;
    private colorPickerContainer;
    private change;
    private remoteUserEditedHighlightId;
    private undoing;
    private sampleTextColor;
    private colorPickerHeight;
    private resizeTimeout;
    /**
     * Parameter to be edited
     */
    parameter: any;
    /**
     * The application data
     */
    appData: any;
    /**
     * Color to be dislayed in the sample box
     */
    sampleColor: string;
    /**
     * Listen to window resize event
     */
    handlewindowResize(): void;
    /**
     * Actualy resize color picker
     */
    resizeColorPicker(): void;
    /**
     * Run when component loads
     */
    componentDidLoad(): void;
    /**
     * Called when the parameter value changes externally
     * @param {any} mode the change mode
     */
    onValueChange(mode: any): void;
    /**
     * Set the color of the text in the sample box
     */
    private setSampleTextColor;
    /**
     * Setup the color picker and it's events
     */
    private setUpColorPicker;
    /**
     * Main render method.
     * @return {JSX} The generated html
     */
    render(): any;
}
