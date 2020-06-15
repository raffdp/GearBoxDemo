import { Component, Element, h, Prop, State, Watch } from '@stencil/core'

@Component({
  tag: 'zea-checkbox',
  styleUrl: 'zea-checkbox.css',
  shadow: true
})

/**
 * Main class for the component
 */
export class ZeaCheckbox {
  @Element() private element: HTMLElement

  /**
  /**
   * Text/html to be displayed inside the button
   */
  @Prop() name: string

  /**
  /**
   * Whether the checkbox is disabled
   */
  @Prop() disabled: boolean = false

  /**
  /**
   * Whether the checkbox is checked
   */
  @Prop() checked: boolean = false

  /**
  /**
   * Class to change presentation according to checkbox state
   */
  @State() elementClass: string

  /**
  /**
   * Listen for changes on the checked prop
   * @param {boolean} checked New value for the checked prop
   */
  @Watch('checked')
  onCheckedChanged(checked: boolean) {
    this.element.shadowRoot.querySelector('input').checked = checked
    this.updateElementClass()
  }

  /**
  /**
   * Listen for changes on the disabled prop
   * @param {boolean} disabled New value for the disabled prop
   */
  @Watch('disabled')
  onDisabledChanged(disabled: boolean) {
    this.element.shadowRoot.querySelector('input').disabled = disabled
    this.updateElementClass()
  }

  /**
  /**
   * Update element class according to checkbox state
   */
  private updateElementClass() {
    this.elementClass = this.checked ? 'checked' : ''
    this.elementClass += this.disabled ? ' disabled ' : ''
  }

  /**
   * Change checkbox state on click
   */
  private toggleCheck() {
    if (!this.disabled) {
      this.checked = !this.checked
    }
  }

  /**
   * Called everytime component loads
   */
  componentDidLoad() {
    this.onCheckedChanged(this.checked)
    this.onDisabledChanged(this.disabled)
  }

  /**
   * Main render function
   * @return {JSX} the generated html
   */
  render() {
    return (
      <div
        class={'zea-checkbox ' + this.elementClass}
        onClick={() => {
          this.toggleCheck()
        }}
      >
        <span class="zea-checkbox-wrap">
          <span class="zea-checkbox-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
            >
              <path
                class="icon-path"
                d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z"
              />
            </svg>
          </span>
        </span>
        <input type="checkbox" name={this.name} />
      </div>
    )
  }
}
