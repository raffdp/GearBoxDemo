export declare class ZeaToolbar {
    toolsetElement: HTMLElement;
    currentTool: HTMLElement;
    currentContainer: HTMLElement;
    childrenContainer: HTMLElement;
    children: any;
    mouseIsdown: boolean;
    hostElement: HTMLElement;
    /**
     * Array of tools
     */
    data: any;
    /**
     * zeaToolbarToolClickHandler
     * @param {any} e the event data
     */
    zeaToolbarToolClickHandler(e: any): void;
    /**
     * Called everytime component renders
     */
    componentDidLoad(): void;
    /**
     * setActiveTool
     */
    setActiveTool(): void;
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render(): any;
}
