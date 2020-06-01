export declare class ZeaUserChipSet {
    /**
     * Whether avatar images should be shown or not
     */
    showImages: boolean;
    /**
     * The initial z-index for chip overlapping
     */
    initialZIndex: number;
    /**
     * The Zea session
     */
    session: any;
    /**
     * Number of chips to show before overflow happens
     */
    overflowLimit: any;
    /**
     * Number of chips to show before overflow happens
     */
    overflowShown: boolean;
    /**
     * Array of connected users
     */
    userDatas: Array<any>;
    /**
     * Object containing entries in the overflow
     */
    shownOverflowEntry: string;
    /**
     * Watch for changes in the session property
     */
    sessionChanged(): void;
    /**
     * Called when the component first loads
     */
    componentWillLoad(): void;
    /**
     * Set up the sesion subscriptions
     */
    setupSession(): void;
    /**
     * Activate the current item
     * @param {any} e The event
     */
    onChipClick(): void;
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render(): any;
}
