import { EventEmitter } from '../../stencil-public-runtime';
export declare class ZeaToolbarTool {
    outerWrap: HTMLElement;
    hostElement: HTMLElement;
    /**
     * The tool data
     */
    data: any;
    /**
     * Whether the tool is currently active
     */
    isActive: boolean;
    /**
     * Event to emit when user chip gets clicked
     */
    zeaToolbarToolClick: EventEmitter;
    /**
     * zeaToolbarToolClickHandler
     * @param {any} event the event data
     */
    zeaToolbarToolClickHandler(): void;
    /**
     * Handle click on user chip
     * @param {any} e the event
     */
    toolClickHandler(e: any): void;
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render(): any;
}
