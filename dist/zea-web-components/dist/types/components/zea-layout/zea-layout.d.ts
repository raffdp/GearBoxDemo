export declare class ZeaLayout {
    cellA: HTMLElement;
    cellB: HTMLElement;
    cellC: HTMLElement;
    mainElement: HTMLElement;
    cellCount: number;
    orientation: string;
    resizeCellA: boolean;
    resizeCellC: boolean;
    cellASize: number;
    cellCSize: number;
    resizeInterval: number;
    showBorders: boolean;
    error: string;
    prevOffset: number;
    minimumGap: number;
    maximunGap: number;
    activeHandle: any;
    layoutContainer: HTMLElement;
    /**
     * Listen for dragstart events
     * @param {any} event The event
     */
    onHandleMouseDown(event: any): void;
    /**
     * Listen for dragstart events
     * @param {any} event The event
     */
    onHandleMouseUp(): void;
    /**
     * Listen to mousemove event
     * @param {any} event the event
     */
    mouseMoveHandler(event: any): void;
    /**
     * Process drag
     * @param {any} event The event
     * @param {any} axis The axis
     * @param {any} cell The cell
     */
    processDrag(event: any, axis: any, cell: any): void;
    /**
     * Trigger window resize event
     * @param {any} newDimension The new dimension
     */
    triggerResize(newDimension: any): void;
    /**
     */
    layout(): void;
    /**
     * Prevent the browser drag event from triggering
     * as it hinders the mousemove event
     */
    componentDidLoad(): void;
    /**
     * Prevent the browser drag event from triggering
     * as it hinders the mousemove event
     */
    componentDidRender(): void;
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render(): any;
}
