export declare class ZeaToolbar {
    mouseIsDown: boolean;
    toolbarElement: HTMLElement;
    offset: number[];
    /**
     * Array of tools
     */
    tools: any;
    /**
     * Listen to mousedown event
     * @param {any} event the event
     */
    mousedownHandler(event: any): void;
    /**
     * Listen to mouseup event
     */
    mouseupHandler(): void;
    /**
     * Listen to mousemove event
     * @param {any} event the event
     */
    mousemoveHandler(event: any): void;
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render(): any;
}
