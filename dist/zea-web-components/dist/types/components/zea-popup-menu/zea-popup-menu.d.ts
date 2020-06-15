export declare class ZeaPopupMenu {
    hostElement: HTMLElement;
    /**
     * Anchor element
     */
    anchorElement: HTMLElement;
    /**
     * Whether the menu should be shown
     */
    shown: boolean;
    bbox: DOMRect;
    topOffset: string;
    leftOffset: string;
    node: HTMLElement;
    /**
     * Main render function
     * @param {any} ev the event
     */
    handleClick(ev: any): void;
    /**
     * Add twinkle effect on item click
     * @param {any} elmnt the item element
     */
    twinkleElement: (elmnt: any) => void;
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render(): any;
}
