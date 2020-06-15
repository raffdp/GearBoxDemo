import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-popup-menu-item',
  styleUrl: 'zea-popup-menu-item.css',
  shadow: true,
})

/**
 * Main class for component
 */
export class ZeaPopupMenuItem {
  /**
   * Click Handler
   */
  @Prop() clickHandler: CallableFunction

  /**
   * Material icon name for item start
   */
  @Prop() startIcon: string

  /**
   * Material icon name for item end
   */
  @Prop() endIcon: string

  /**
   * Handle item click
   * @param {Event} e The event
   */
  handleItemClick = (e: Event) => {
    if (this.clickHandler) this.clickHandler(e)
  }

  /**
   * Main render function
   * @return {JSX} the generated html
   */
  render() {
    let startIcon
    let endIcon

    if (this.startIcon) {
      startIcon = (
        <span class="start-icon">
          <zea-icon name={this.startIcon}></zea-icon>
        </span>
      )
    }

    if (this.endIcon) {
      endIcon = (
        <span class="end-icon">
          <zea-icon name={this.endIcon}></zea-icon>
        </span>
      )
    }

    return (
      <div onClick={(e) => this.handleItemClick(e)} class="zea-popup-menu-item">
        {startIcon}
        <span>
          <slot></slot>
        </span>
        {endIcon}
      </div>
    )
  }
}
