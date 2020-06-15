import { EventEmitter } from '../../stencil-public-runtime';
export declare class ZeaMenuItem {
    switch: boolean;
    active: boolean;
    hasCheckbox: boolean;
    checked: boolean;
    callback: any;
    hostElement: HTMLElement;
    shown: boolean;
    allowHover: boolean;
    hotkey: string;
    type: string;
    hasSubitems: boolean;
    rootMenu: HTMLElement;
    outerWrap: HTMLElement;
    itemParent: HTMLElement;
    checkboxElement: any;
    subitemsElement: any;
    container: any;
    /**
     * Event to emit when an item gets clicked
     */
    zeaMenuItemClick: EventEmitter;
    /**
     * Event to emit when an item gets clicked
     */
    zeaMenuItemPressed: EventEmitter;
    /**
     * Listen to the event emitted when any item is clicked
     * @param {any} e the event data
     */
    windowClickHandler(e: any): void;
    /**
     * Listen to click (mouse up) events on the whole window
     * and make sure the item is deactivated if the click was
     * on an external element
     * @param {any} ev the event
     */
    handleWindowMouseup(ev: any): void;
    /**
     * Check if an element is child of another
     * @param {any} parent the parent
     * @param {any} child the child
     * @return {any} whether or not is parent
     */
    isDescendant(parent: any, child: any): boolean;
    /**
     * Called everytime the component renders
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
     * Handle click/tap
     * @param {any} e The event
     */
    handleItemClick(e: any): void;
    /**
     * Handle Mouse down
     * @param {any} e The event
     */
    handleItemMouseDown(): void;
    /**
     * Handle mouse up
     * @param {any} e The event
     */
    handleItemMouseUp(e: any): void;
    /**
     * Run the item's callback
     * @param {any} payLoad The data to pass to the callback
     */
    runCallback(payLoad: any): void;
    /**
     * Listen for keyboard shortcuts
     * @param {any} e the event
     */
    keydownHandler(e: any): void;
    /**
     * Generate markup for keyboard shortcut
     * @param {any} action the action
     * @return {array} the html elements
     */
    keyComboAsHtml(): any[];
    /**
     * Render function
     * @return {JSX}
     */
    render(): any;
}
