import { Component, h, Prop, Watch } from '@stencil/core'
import QRCode from 'qrcode'

@Component({
  tag: 'zea-qr-code',
  styleUrl: 'zea-qr-code.css',
  shadow: true,
})

/**
 * Renders a string into a QR code image (html canvas)
 */
export class ZeaQrCode {
  container: HTMLElement
  canvas

  /**
   * The content to code into the QR
   */
  @Prop() content: string = window.location.href

  /**
   * The content to code into the QR
   */
  @Prop() scale: number = 4

  /**
  /**
   * Listen for changes on the content prop
   */
  @Watch('content')
  onContentChanged() {
    this.makeQR()
  }

  /**
   * Runs when component finishes loading
   */
  componentDidLoad() {
    this.makeQR()
  }

  /**
   * Make the QR image as a canvas
   */
  makeQR() {
    if (this.canvas) this.canvas.remove()

    QRCode.toCanvas(this.content, { scale: this.scale }).then((canvas) => {
      this.canvas = canvas
      this.container.appendChild(this.canvas)
    })
  }

  /**
   * Main render method for the component
   * @return {JSX} The generated markup
   */
  render() {
    return (
      <div
        class="zea-qr-code"
        ref={(el) => (this.container = el as HTMLElement)}
      ></div>
    )
  }
}
