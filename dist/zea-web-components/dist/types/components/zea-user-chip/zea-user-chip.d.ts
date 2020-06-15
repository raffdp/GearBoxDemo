import { EventEmitter } from '../../stencil-public-runtime';
export declare class ZeaUserChip {
    chipElement: HTMLElement;
    tooltipElement: HTMLElement;
    /**
     * Whether the chip is for the current user session
     */
    isCurrentUser: boolean;
    /**
     * Whether the chip is currently active
     */
    isActive: boolean;
    /**
     * Whether avatar images should be shown or not
     */
    showImages: boolean;
    /**
     * User object containing avatar url, firstName, lastName and others
     */
    userData: any;
    /**
     * The density of the chip (large|normal|small|tiny)
     */
    density: string;
    /**
     * Whether the tooltip should be shown
     */
    showTooltip: boolean;
    /**
     * Whether to ever show the profile card
     */
    showProfileCard: boolean;
    /**
     * Whether the profile card is currently shown
     */
    profileCardShown: boolean;
    /**
     * Alignment of the profile card (right|left)
     */
    profileCardAlign: string;
    /**
     * The zea user card element contined in this chip
     */
    profileCardElement: HTMLElement;
    /**
     * Used as background color for the chip
     */
    randomColor: string;
    /**
     * Event to emit when user chip gets clicked
     */
    zeaUserClicked: EventEmitter;
    /**
     * Listen to click events on the whole document
     * @param {any} e The event
     */
    handleClick(e: any): void;
    /**
     * Handle click on user chip: emit custom zeaUserClicked event
     * @param {any} userData the userData
     */
    onChipClick(): void;
    /**
     * On avatar over, fix tooltip position when its out of the screen
     */
    onAvatarOver(): void;
    /**
     * On component render, fix tooltip position when its out of the screen
     */
    componentDidRender(): void;
    /**
     * Fix the tooltip position if it goes out of screen
     */
    fixTooltipPosition(): void;
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render(): any;
}
