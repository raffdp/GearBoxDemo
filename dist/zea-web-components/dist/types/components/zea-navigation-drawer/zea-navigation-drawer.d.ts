import { EventEmitter } from '../../stencil-public-runtime';
export declare class ZeaNavigationDrawer {
    /**
     */
    shown: boolean;
    /**
     */
    navDrawerOpen: EventEmitter;
    /**
     */
    navDrawerClosed: EventEmitter;
    /**
     */
    container: HTMLElement;
    toggleButton: HTMLElement;
    /**
     * Listen to click events on the whole document
     * @param {any} e The event
     */
    handleClick(e: any): void;
    /**
     */
    onToggleClick(): void;
    /**
     */
    render(): any;
}
