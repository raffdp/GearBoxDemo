import { Component, Host, h, Prop, State } from '@stencil/core';
/**
 * Main class for component
 */
export class ZeaImagesGallery {
    constructor() {
        /**
         * Number of featured images
         */
        this.featured = 2;
        /**
         * Number of columns
         */
        this.columns = 4;
        /**
         * Folder from which to take the files to display.
         */
        this.folder = {
            children: [],
        };
        this.zoomedImageClass = 'zea-ig-zoomed inactive';
        this.zoomedImageUrl = '';
    }
    /**
     * Number of featured images
     * @param {any} file The file object
     * @return {boolean} Whether or not the file extension is included in the imagesMediaTypes
     */
    static isFileImage(file) {
        return ZeaImagesGallery.imagesMediaTypes.includes(file.type);
    }
    /**
     * Get an image's URL.
     * @param {File} image The file representing the image.
     * @return {string} The image's URL.
     */
    static getImageUrl(image) {
        const BUCKET_NAME = 'zea-drive-staging-projects-assets';
        const BASE_URL = `https://storage.googleapis.com/${BUCKET_NAME}/`;
        return `${BASE_URL}${image.idInStorage}`;
    }
    /**
     * Take image back to original location
     */
    resetImageLocation() {
        this.zoomedTop = this.bbox.top + 'px';
        this.zoomedLeft = this.bbox.left + 'px';
        this.zoomedWidth = this.bbox.width + 'px';
        this.zoomedHeight = this.bbox.height + 'px';
        this.zoomedOpacity = '0';
    }
    /**
     * Zoom image in
     * @param {any} event The event
     * @param {any} image The image
     */
    zoomImageIn(event, image) {
        this.zoomedImageUrl = ZeaImagesGallery.getImageUrl(image);
        this.bbox = event.target.getBoundingClientRect();
        this.zoomedImageClass = 'zea-ig-zoomed active';
        this.resetImageLocation();
        setTimeout(() => {
            this.zoomedImageClass = 'zea-ig-zoomed active animate';
            this.zoomedTop = '0px';
            this.zoomedLeft = '0px';
            this.zoomedWidth = '100%';
            this.zoomedHeight = '100%';
            this.zoomedOpacity = '1';
        }, 100);
    }
    /**
     * Zoom image out
     */
    zoomImageOut() {
        this.resetImageLocation();
        setTimeout(() => {
            this.zoomedImageClass = 'zea-ig-zoomed inactive';
        }, 400);
    }
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render() {
        const onlyImages = Object.values(this.folder.children).filter(ZeaImagesGallery.isFileImage);
        const rowsCount = Math.ceil((onlyImages.length + this.featured * 3) / this.columns);
        return (h(Host, { class: "ZeaImagesGallery" },
            h("div", { class: this.zoomedImageClass, style: {
                    top: this.zoomedTop,
                    left: this.zoomedLeft,
                    width: this.zoomedWidth,
                    height: this.zoomedHeight,
                    opacity: this.zoomedOpacity,
                } },
                h("div", { class: "zea-ig-zoomed-inner", style: {
                        backgroundImage: 'url(' + this.zoomedImageUrl + ')',
                    }, onClick: () => {
                        this.zoomImageOut();
                    } })),
            h("div", { class: "zea-ig-container", style: {
                    gridTemplateColumns: 'repeat(' + this.columns + ', 1fr)',
                    gridTemplateRows: 'repeat(' + rowsCount + ', 1fr)',
                } }, onlyImages.map((image, i) => (h("div", { style: {
                    backgroundImage: `url(${ZeaImagesGallery.getImageUrl(image)})`,
                }, class: `zea-ig-image ${i < this.featured ? ' featured' : ''}`, onClick: (event) => {
                    this.zoomImageIn(event, image);
                }, title: image.name }))))));
    }
    static get is() { return "zea-images-gallery"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["zea-images-gallery.css"]
    }; }
    static get styleUrls() { return {
        "$": ["zea-images-gallery.css"]
    }; }
    static get properties() { return {
        "featured": {
            "type": "number",
            "mutable": false,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Number of featured images"
            },
            "attribute": "featured",
            "reflect": false,
            "defaultValue": "2"
        },
        "columns": {
            "type": "number",
            "mutable": false,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Number of columns"
            },
            "attribute": "columns",
            "reflect": false,
            "defaultValue": "4"
        },
        "folder": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "{ children: any[]; }",
                "resolved": "{ children: any[]; }",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "Folder from which to take the files to display."
            },
            "defaultValue": "{\r\n    children: [],\r\n  }"
        }
    }; }
    static get states() { return {
        "zoomedImageClass": {},
        "zoomedImageUrl": {},
        "zoomedTop": {},
        "zoomedLeft": {},
        "zoomedWidth": {},
        "zoomedHeight": {},
        "zoomedOpacity": {},
        "bbox": {}
    }; }
}
ZeaImagesGallery.imagesMediaTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
