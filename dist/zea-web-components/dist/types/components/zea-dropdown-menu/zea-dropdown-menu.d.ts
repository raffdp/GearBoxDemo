export declare class ZeaDropdownMenu {
    hotkeysToActions: {};
    /**
     * The application data
     * TODO: pass actionRegistry only instead of whole appData
     */
    appData: any;
    /**
     * List of actions returned by the actionRegistry
     */
    actions: Array<any>;
    /**
     * Tree representation of the items and actions
     * based on path arrays
     */
    menuItems: any;
    /**
     * Runs once when component first loads
     */
    componentDidLoad(): void;
    /**
     * Listen for keyboard shortcuts
     * @param {any} e the event
     */
    keydownHandler(e: any): void;
    /**
     * Make a hierarchical representation out of
     * the path arrays in the action list
     */
    makeMenuTree(): void;
    /**
     * Feed the list of hotkeys
     */
    feedHotKeys(): void;
    /**
     * Get a specific tree location using an action's path
     * @param {any} path the path
     * @return {any} item
     */
    getMenuTreeItem(path: any): any;
    /**
     * Generate markup for a branch with children
     * @param {any} key the key
     * @param {any} item the item
     * @return {JSX} the ul
     */
    makeBranch(key: any, item: any): any;
    /**
     * Generate markup for the children of a branch
     * @param {any} item the item
     * @return {JSX} the ul
     */
    makeBranchItems(item: any): any[];
    /**
     * Generate markup for a leaf item, with an anchor
     * and no children
     * @param {any} key the key
     * @param {any} action the action
     * @return {JSX} the ul
     */
    makeLeaf(key: any, action: any): any;
    /**
     * Handle click events on leafs
     * @param {any} event the event
     * @param {any} action the action
     */
    hadleLeafClick(event: any, action: any): void;
    /**
     * Rapidly change items bg color to indicate it was clicked
     * @param {any} target the clicked li item
     */
    flashItem(target: any): void;
    /**
     * Generate markup for keyboard shortcut
     * @param {any} action the action
     * @return {array} the html elements
     */
    keyComboAsHtml(action: any): any[];
    /**
     * Generate markup for keyboard shortcut
     * @param {any} action the action
     * @return {string} the html elements
     */
    keyComboAsText(action: any): string;
    /**
     * Get arrow icon svg for branch
     * @return {JSX} the arrow svg
     */
    getBranchArrow(): any;
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render(): any;
}
