export declare class ZeaMenuSubitems {
    subitemsElement: HTMLElement;
    subitemsArray: any[];
    hostElement: HTMLElement;
    /**
     * Whether it is/should be shown
     */
    shown: boolean;
    /**
     * Menu type
     */
    type: string;
    /**
     * The item this subitems belongs to
     */
    parentItem: any;
    /**
     * Whether the children should have checkboxes and behave as a radio button
     */
    radioSelect: boolean;
    /**
     * The root menu this item belongs to
     */
    rootMenu: HTMLElement;
    /**
     * zeaMenuItemClickHandler
     * @param {any} e the event data
     */
    windowClickHandler(e: any): void;
    /**
     * zeaMenuItemClickHandler
     * @param {any} e the event data
     */
    windowItemPressHandler(e: any): void;
    /**
     * Listen to click (mouse up) events on the whole window
     * @param {any} ev the event
     */
    handleWindowMouseup(ev: any): void;
    /**
     * isDescendant
     * @param {any} parent the parent
     * @param {any} child the parent
     * @return {any} whether or not is parent
     */
    isDescendant(parent: any, child: any): boolean;
    /**
     * Called everytime the component renders
     * Apply the class to children
     */
    componentDidRender(): void;
    /**
     * Called everytime the component renders
     */
    watchHandler(): void;
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
