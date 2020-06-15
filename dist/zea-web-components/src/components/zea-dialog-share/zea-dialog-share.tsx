import { Component, h, Prop, Listen } from '@stencil/core'

@Component({
  tag: 'zea-dialog-share',
  styleUrl: 'zea-dialog-share.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaDialogShare {
  /**
   */
  @Prop() shown: boolean = false

  /**
   */
  dialog

  /**
   */
  @Listen('dialogClose')
  dialogCloseHandler(event: any) {
    if (event.detail == this.dialog) this.shown = false
  }

  /**
   * Main render function
   * @return {JSX} The generated html
   */
  render() {
    return (
      <zea-dialog
        ref={(el) => (this.dialog = el)}
        width="fit-content"
        class="share-dialog"
        shown={this.shown}
      >
        <h3 slot="title">Share</h3>
        <div slot="body">
          <zea-tabs orientation="horizontal" density="small">
            <div slot="tab-bar">Share Link</div>
            <div>
              <zea-qr-code
                scale={4}
                // ref={(el) => (this.qrCode = el as HTMLElement)}
              ></zea-qr-code>
              <zea-copy-link></zea-copy-link>
            </div>

            <div slot="tab-bar">Send SMS</div>
            <div>Tab Content 2</div>

            <div slot="tab-bar">Send Email</div>
            <div>Tab Content 3</div>
          </zea-tabs>
        </div>
      </zea-dialog>
    )
  }
}
