import 'brace';
export declare class ZeaParamWidgetCode {
    private editorContainer;
    private editor;
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
     * Height of the editor to fit content
     */
    editorHeight: any;
    /**
     * Listen crtl + s for save
     * @param {any} event the keydown event
     */
    keydownHandler(event: any): void;
    /**
     * Run when component loads
     */
    componentDidLoad(): void;
    /**
     * Set up ACE code input
     */
    setUpInputs(): Promise<void>;
    /**
     * Input handler
     */
    private onInput;
    /**
     * Change handler
     */
    private onChange;
    /**
     * Reset editor to content's height
     */
    resetEditorHeight(): void;
    /**
     * Called after component render
     */
    componentDidRender(): void;
    /**
     * Value change handler
     * @param {any} mode The value set mode
     */
    private onValueChanged;
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render(): any;
}
