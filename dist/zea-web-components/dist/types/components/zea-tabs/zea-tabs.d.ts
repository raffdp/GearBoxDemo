export declare class ZeaTabs {
    mainElement: HTMLElement;
    orientation: string;
    density: string;
    /**
     * Listen to click events
     * @param {any} event The event
     */
    clickHandler(event: any): void;
    /**
     * Show panel by index
     * @param {any} tabIndex The tab index
     */
    showPanelByIndex(tabIndex: any): void;
    /**
     * Get the index of a tab
     * @param {any} tabElement The tab index
     * @return {int} The index of the tab
     */
    getTabIndex(tabElement: any): any;
    /**
     * Show panel by index
     */
    resetActiveTab(): void;
    /**
     * Activate first tab on load
     */
    componentDidLoad(): void;
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render(): any;
}
