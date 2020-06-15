import { Component, Host, h, Prop, State } from '@stencil/core'

@Component({
  tag: 'zea-images-gallery',
  styleUrl: 'zea-images-gallery.css',
  shadow: true,
})

/**
 * Main class for component
 */
export class ZeaImagesGallery {
  static imagesMediaTypes = ['image/jpeg', 'image/png', 'image/svg+xml']

  /**
   * Number of featured images
   * @param {any} file The file object
   * @return {boolean} Whether or not the file extension is included in the imagesMediaTypes
   */
  static isFileImage(file) {
    return ZeaImagesGallery.imagesMediaTypes.includes(file.type)
  }

  /**
   * Get an image's URL.
   * @param {File} image The file representing the image.
   * @return {string} The image's URL.
   */
  static getImageUrl(image): string {
    const BUCKET_NAME = 'zea-drive-staging-projects-assets'
    const BASE_URL = `https://storage.googleapis.com/${BUCKET_NAME}/`
    return `${BASE_URL}${image.idInStorage}`
  }

  /**
   * Number of featured images
   */
  @Prop() featured: number = 2

  /**
   * Number of columns
   */
  @Prop() columns: number = 4

  /**
   * Folder from which to take the files to display.
   */
  @Prop() folder = {
    children: [],
  }

  @State() zoomedImageClass: string = 'zea-ig-zoomed inactive'

  @State() zoomedImageUrl: string = ''

  @State() zoomedTop: string

  @State() zoomedLeft: string

  @State() zoomedWidth: string

  @State() zoomedHeight: string

  @State() zoomedOpacity: string

  @State() bbox: DOMRect

  /**
   * Take image back to original location
   */
  private resetImageLocation() {
    this.zoomedTop = this.bbox.top + 'px'
    this.zoomedLeft = this.bbox.left + 'px'
    this.zoomedWidth = this.bbox.width + 'px'
    this.zoomedHeight = this.bbox.height + 'px'
    this.zoomedOpacity = '0'
  }

  /**
   * Zoom image in
   * @param {any} event The event
   * @param {any} image The image
   */
  private zoomImageIn(event, image) {
    this.zoomedImageUrl = ZeaImagesGallery.getImageUrl(image)
    this.bbox = event.target.getBoundingClientRect()
    this.zoomedImageClass = 'zea-ig-zoomed active'
    this.resetImageLocation()

    setTimeout(() => {
      this.zoomedImageClass = 'zea-ig-zoomed active animate'
      this.zoomedTop = '0px'
      this.zoomedLeft = '0px'
      this.zoomedWidth = '100%'
      this.zoomedHeight = '100%'
      this.zoomedOpacity = '1'
    }, 100)
  }

  /**
   * Zoom image out
   */
  private zoomImageOut() {
    this.resetImageLocation()
    setTimeout(() => {
      this.zoomedImageClass = 'zea-ig-zoomed inactive'
    }, 400)
  }

  /**
   * Main render function
   * @return {JSX} the generated html
   */
  render() {
    const onlyImages = Object.values(this.folder.children).filter(
      ZeaImagesGallery.isFileImage
    )

    const rowsCount = Math.ceil(
      (onlyImages.length + this.featured * 3) / this.columns
    )

    return (
      <Host class="ZeaImagesGallery">
        <div
          class={this.zoomedImageClass}
          style={{
            top: this.zoomedTop,
            left: this.zoomedLeft,
            width: this.zoomedWidth,
            height: this.zoomedHeight,
            opacity: this.zoomedOpacity,
          }}
        >
          <div
            class="zea-ig-zoomed-inner"
            style={{
              backgroundImage: 'url(' + this.zoomedImageUrl + ')',
            }}
            onClick={() => {
              this.zoomImageOut()
            }}
          />
        </div>

        <div
          class="zea-ig-container"
          style={{
            gridTemplateColumns: 'repeat(' + this.columns + ', 1fr)',
            gridTemplateRows: 'repeat(' + rowsCount + ', 1fr)',
          }}
        >
          {onlyImages.map((image, i) => (
            <div
              style={{
                backgroundImage: `url(${ZeaImagesGallery.getImageUrl(image)})`,
              }}
              class={`zea-ig-image ${i < this.featured ? ' featured' : ''}`}
              onClick={(event) => {
                this.zoomImageIn(event, image)
              }}
              title={image.name}
            />
          ))}
        </div>
      </Host>
    )
  }
}
