import { EventEmitter } from '../../stencil-public-runtime';
export declare class ZeaDialog {
    shown: boolean;
    width: string;
    allowClose: boolean;
    showBackdrop: boolean;
    addPadding: boolean;
    hostElement: any;
    dialogContainer: HTMLElement;
    dialogClose: EventEmitter;
    /**
     */
    prompt(): Promise<void>;
    /**
     */
    onBackdropClick(): void;
    /**
     */
    resetSize(): void;
    /**
     */
    componentDidRender(): void;
    /**
     */
    componentWillLoad(): void;
    /**
     */
    setupContainer(el: any): void;
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render(): any;
}
