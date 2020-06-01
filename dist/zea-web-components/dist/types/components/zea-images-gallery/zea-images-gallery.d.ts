export declare class ZeaImagesGallery {
    static imagesMediaTypes: string[];
    /**
     * Number of featured images
     * @param {any} file The file object
     * @return {boolean} Whether or not the file extension is included in the imagesMediaTypes
     */
    static isFileImage(file: any): boolean;
    /**
     * Get an image's URL.
     * @param {File} image The file representing the image.
     * @return {string} The image's URL.
     */
    static getImageUrl(image: any): string;
    /**
     * Number of featured images
     */
    featured: number;
    /**
     * Number of columns
     */
    columns: number;
    /**
     * Folder from which to take the files to display.
     */
    folder: {
        children: any[];
    };
    zoomedImageClass: string;
    zoomedImageUrl: string;
    zoomedTop: string;
    zoomedLeft: string;
    zoomedWidth: string;
    zoomedHeight: string;
    zoomedOpacity: string;
    bbox: DOMRect;
    /**
     * Take image back to original location
     */
    private resetImageLocation;
    /**
     * Zoom image in
     * @param {any} event The event
     * @param {any} image The image
     */
    private zoomImageIn;
    /**
     * Zoom image out
     */
    private zoomImageOut;
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render(): any;
}
