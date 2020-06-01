export declare class ZeaScrollPane {
    scrollPane: any;
    scrollContent: any;
    vScrollBar: any;
    scrollRatio: any;
    scrollDelta: any;
    vMouseDown: boolean;
    vMouseOffet: any;
    vCurrentScroll: any;
    vBarTop: any;
    vBarHeight: any;
    vTrackTop: any;
    vScrollTrack: any;
    rootElement: any;
    /**
     *
     */
    onResize(): void;
    /**
     *
     */
    onMouseUp(): void;
    prevClientY: any;
    /**
     * @param {any} e The event
     */
    onMouseMove(e: any): void;
    /**
     *
     */
    componentDidLoad(): void;
    /**
     *
     */
    refreshScrollbar(): void;
    /**
     *
     */
    render(): any;
}
