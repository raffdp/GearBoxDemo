export declare class ZeaParamWidgetBoolean {
    private cheboxInput?;
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
     * Whether the checkbox should be checked
     */
    checked: boolean;
    /**
     * The application data
     */
    appData: any;
    /**
     * Run when component loads
     */
    componentDidLoad(): void;
    /**
     * Run when input changes
     */
    inputChanged(): void;
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render(): any;
}
