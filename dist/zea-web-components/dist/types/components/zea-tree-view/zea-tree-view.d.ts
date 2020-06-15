export declare class ZeaTreeView {
    rootItem: any;
    appData: any;
    mouseIsOver: any;
    /**
     * onKeyDown
     * @param {any} event the event data
     */
    onKeyDown(event: any): void;
    /**
     * The expandSelection method.
     * @param {Map} item - The item we wish to expand to show.
     * @param {boolean} scrollToView - Whether to scroll the item into view
     */
    expandSelection(item: any, scrollToView?: boolean): void;
    /**
     * The collapseSelection method.
     * @param {Map} item - The item we wish to expand to show.
     * @param {boolean} scrollToView - Whether to scroll the item into view
     */
    collapseSelection(item: any, scrollToView?: boolean): void;
    /**
     * Placeholder comment
     * @param {any} item The item
     */
    scrollItemIntoView(item: any): void;
    /**
     * onMouseEnter
     */
    onMouseEnter(): void;
    /**
     * onMouseLeave
     */
    onMouseLeave(): void;
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render(): any;
}
