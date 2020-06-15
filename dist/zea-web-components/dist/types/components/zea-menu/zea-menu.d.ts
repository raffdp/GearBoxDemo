export declare class ZeaMenu {
    itemsContainer: any;
    mouseIsDown: any;
    menuElement: any;
    offset: number[];
    hostElement: HTMLElement;
    leftOffset: string;
    topOffset: string;
    type: string;
    shown: boolean;
    showAnchor: boolean;
    anchorIcon: string;
    anchorElement: HTMLElement;
    contextualAlign: string;
    /**
     * Listen to click (mouse up) events on the whole window
     * @param {any} ev the event
     */
    handleClick(ev: any): void;
    /**
     * isDescendant
     * @param {any} parent the parent
     * @param {any} child the parent
     * @return {any} whether or not is parent
     */
    isDescendant(parent: any, child: any): boolean;
    /**
     * Listen to zeaMenuItemClick events on the whole window
     * @param {any} ev The zeaMenuItemClick event
     */
    handleItemClick(ev: any): void;
    /**
     * Listen to mousedown event
     * @param {any} event the event
     */
    mousedownHandler(event: any): void;
    /**
     * Listen to mousemove event
     * @param {any} event the event
     */
    mousemoveHandler(event: any): void;
    /**
     * Listen to click events on anchor
     * @param {any} ev the event
     */
    handleAnchorClick(ev: any): void;
    /**
     * Called once when component first loads
     */
    componentDidLoad(): void;
    /**
     * Called everytime the component renders
     * Apply the class to children
     */
    componentDidRender(): void;
    /**
     * Run some setup for the children items
     */
    setupChildren(): void;
    /**
     * Render function
     * @return {JSX}
     */
    render(): any;
}
