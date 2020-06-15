export declare class ZeaMenuColorpicker {
    currentColorContainer: any;
    dropDownContainer: any;
    colorElements: any[];
    currentColor: any;
    shown: boolean;
    /**
     * Handler for click events on the whole window
     * @param {any} e the event
     */
    handleDropDownColorClick(e: any): void;
    /**
     * Set the active colors through css variables
     */
    setActiveColors(): void;
    /**
     * Handle click on currently selected color
     */
    handleCurrentColorClick(): void;
    /**
     * Called everytime the component renders to run some setup on child elements
     */
    componentDidRender(): void;
    /**
     * Run some setup for the children items
     */
    setupChildren(): void;
    /**
     * Run the item's callback
     * @param {any} element The element whose callback to call
     */
    runCallback(element: any): void;
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render(): any;
}
