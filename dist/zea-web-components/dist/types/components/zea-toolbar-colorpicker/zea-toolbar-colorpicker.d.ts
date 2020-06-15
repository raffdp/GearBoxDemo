export declare class ZeaToolbarColorpicker {
    colopickerElement: HTMLElement;
    currentTool: any;
    currentContainer: HTMLElement;
    childrenContainer: HTMLElement;
    children: any;
    mouseIsdown: boolean;
    /**
     * Array of tools
     */
    data: any;
    /**
     * Whether the color dropdown should be shown
     */
    displayChildren: boolean;
    /**
     * Called everytime component renders
     */
    componentDidLoad(): void;
    /**
     * Set the active tool
     * @param {any} e The event
     */
    setActiveTool(e: any): void;
    /**
     * Handle click on color
     * @param {any} e the event
     */
    handleChildrenClick(e: any): void;
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render(): any;
}
