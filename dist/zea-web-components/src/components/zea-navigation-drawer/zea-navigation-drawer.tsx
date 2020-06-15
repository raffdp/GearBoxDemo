import { Component, h, Prop, Listen } from '@stencil/core'

@Component({
  tag: 'zea-navigation-drawer',
  styleUrl: 'zea-navigation-drawer.css',
  shadow: true,
})

/**
 */
export class ZeaNavigationDrawer {
  /**
   */
  @Prop() shown: boolean = false

  /**
   */
  container: HTMLElement

  /**
   * Listen to click events on the whole document
   * @param {any} e The event
   */
  @Listen('click', { target: 'document', capture: true })
  handleClick() {
    // if (!e.composedPath().includes(this.container)) {
    this.shown = false
    // }
  }

  /**
   */
  onToggleClick() {
    this.shown = !this.shown
  }

  /**
   */
  render() {
    return (
      <div
        ref={(el) => (this.container = el)}
        class={{ 'zea-navigation-drawer': true, shown: this.shown }}
      >
        <div class="drawer">
          <div class="drawer-content">
            <slot></slot>
          </div>
        </div>
        <div class="toggle" onClick={this.onToggleClick.bind(this)}>
          <zea-icon size={30} name="menu"></zea-icon>
        </div>
      </div>
    )
  }
}
