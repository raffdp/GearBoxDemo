// eslint-disable-next-line import/no-extraneous-dependencies, no-unused-vars
import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-copy-link',
  styleUrl: 'zea-copy-link.css',
  shadow: true,
})

/**
 */
export class ZeaCopyLink {
  linkInput: HTMLInputElement
  tooltipDelay = 3000

  @Prop() link: string = ''

  @Prop() tooltipIsVisible: boolean = false

  @Prop() tooltipText: string = 'Copy Link'

  /**
   */
  onCopyClick() {
    /* Select the text field */
    this.linkInput.select()
    this.linkInput.setSelectionRange(0, 99999) /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand('copy')

    this.tooltipIsVisible = true
    this.tooltipText = 'Link Copied'

    setTimeout(() => {
      this.tooltipIsVisible = false
      this.tooltipText = 'Copy Link'
    }, this.tooltipDelay)
  }

  /**
   */
  onLinkClick() {
    /* Select the text field */
    this.linkInput.select()
    this.linkInput.setSelectionRange(0, 99999)
  }

  /**
   */
  render() {
    if (!this.link) {
      this.link = window.location.href
    }
    return (
      <div class="zea-copy-link">
        <div class="label">Copy Link</div>
        <div class="link-container">
          <input
            onClick={this.onLinkClick.bind(this)}
            readOnly={true}
            class="link"
            ref={(el) => (this.linkInput = el as HTMLInputElement)}
            value={this.link}
          />
          <div
            class={{ active: this.tooltipIsVisible, 'copy-icon': true }}
            onClick={this.onCopyClick.bind(this)}
          >
            <zea-icon name="copy-outline"></zea-icon>
            <div class={{ tooltip: true }}>{this.tooltipText}</div>
          </div>
        </div>
      </div>
    )
  }
}
