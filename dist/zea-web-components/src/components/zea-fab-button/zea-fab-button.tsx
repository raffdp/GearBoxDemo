import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-fab-button',
  styleUrl: 'zea-fab-button.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaFabButton {
  /**
  /**
   * Whether the button should be disabled (true) or not (false)
   */
  @Prop() disabled: false

  /**
   * Main render function
   * @return {JSX} the generated html
   */
  render() {
    return (
      <button class="zea-fab-button" disabled={this.disabled}>
        <span class="zea-fab-button-wrap">
          <span class="zea-fab-button-icon">
            <slot></slot>
          </span>
        </span>
      </button>
    )
  }
}
