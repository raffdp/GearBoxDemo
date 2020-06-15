import { Component, Element, h, Prop, State, Watch } from '@stencil/core'

@Component({
  tag: 'zea-switch',
  styleUrl: 'zea-switch.css',
  shadow: true,
})

/**
 * Main Class for the component
 */
export class ZeaSwitch {
  @Element() private element: HTMLElement

  /**
   * Text/html to be displayed inside the button
   */
  @Prop() name: string

  /**
   * Whether the switch is disabled
   */
  @Prop() disabled: boolean = false

  /**
   * Whether the switch is checked
   */
  @Prop() checked: boolean = false

  /**
   * State label to show next to the switch
   */
  @Prop() stateLabel: string

  /**
   * Class to change presentation according to switch state
   */
  @State() elementClass: string

  /**
   * Listen for changes on the checked prop
   * @param {boolean} checked the checked state
   */
  @Watch('checked')
  onCheckedChanged(checked: boolean) {
    this.element.shadowRoot.querySelector('input').checked = checked
    this.updateElementClass()
    this.stateLabel = checked ? 'On' : 'Off'
  }

  /**
   * Listen for changes on the disabled prop
   * @param {boolean} disabled the disabled state
   */
  @Watch('disabled')
  onDisabledChanged(disabled: boolean) {
    this.element.shadowRoot.querySelector('input').disabled = disabled
    this.updateElementClass()
  }

  /**
   * Update element class according to switch state
   */
  private updateElementClass() {
    this.elementClass = this.checked ? 'checked' : ''
    this.elementClass += this.disabled ? ' disabled ' : ''
  }

  /**
   * Change switch state on click
   */
  private toggleCheck() {
    if (!this.disabled) {
      this.checked = !this.checked
    }
  }

  /**
   * Runs when component loads
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
        class={'zea-switch ' + this.elementClass}
        onClick={() => {
          this.toggleCheck()
        }}
      >
        <span class="zea-switch-wrap">
          <span class="zea-switch-track"></span>
          <span class="zea-switch-button"></span>
          <span class="zea-switch-label">{this.stateLabel}</span>
        </span>
        <input type="checkbox" name={this.name} />
      </div>
    )
  }
}
