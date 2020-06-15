export declare class ZeaQrCode {
    container: HTMLElement;
    canvas: any;
    /**
     * The content to code into the QR
     */
    content: string;
    /**
     * The content to code into the QR
     */
    scale: number;
    /**
    /**
     * Listen for changes on the content prop
     */
    onContentChanged(): void;
    /**
     * Runs when component finishes loading
     */
    componentDidLoad(): void;
    /**
     * Make the QR image as a canvas
     */
    makeQR(): void;
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render(): any;
}
