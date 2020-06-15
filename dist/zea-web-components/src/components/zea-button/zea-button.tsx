import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-button',
  styleUrl: 'zea-button.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaButton {
  /**
   * Text/html to be displayed inside the button
   */
  @Prop() htmlContent: string

  /**
   * Style variant for the button
   */
  @Prop() variant: string = 'solid'

  /**
   * Whether the button should be disabled (true) or not (false)
   */
  @Prop() disabled: boolean = false

  /**
   * Whether the button should be disabled (true) or not (false)
   */
  @Prop() color: boolean = false

  /**
   * Whether the button should be disabled (true) or not (false)
   */
  @Prop() density: string = 'normal'

  /**
   * Main render function
   * @return {JSX} the generated html
   */
  render() {
    return (
      <button
        class={`zea-button ${this.variant} ${this.density}`}
        disabled={this.disabled}
      >
        <span class="zea-button-content-wrap">
          <span class="zea-start-icon">
            <slot name="start-icon"></slot>
          </span>
          {this.htmlContent ? (
            <span class="zea-button-label" innerHTML={this.htmlContent}></span>
          ) : (
            <span class="zea-button-label">
              <slot></slot>
            </span>
          )}
          <span class="zea-end-icon">
            <slot name="end-icon"></slot>
          </span>
        </span>
      </button>
    )
  }
}
