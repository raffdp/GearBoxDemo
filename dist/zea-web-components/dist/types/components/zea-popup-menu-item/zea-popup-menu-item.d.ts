export declare class ZeaPopupMenuItem {
    /**
     * Click Handler
     */
    clickHandler: CallableFunction;
    /**
     * Material icon name for item start
     */
    startIcon: string;
    /**
     * Material icon name for item end
     */
    endIcon: string;
    /**
     * Handle item click
     * @param {Event} e The event
     */
    handleItemClick: (e: Event) => void;
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render(): any;
}
