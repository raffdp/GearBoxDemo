import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-input-text',
  styleUrl: 'zea-input-text.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaInputText {
  /**
   */
  @Prop() name: string = 'zea-input'

  /**
   */
  @Prop() value: any

  /**
   */
  @Prop() label: string = 'Enter text...'

  /**
   */
  @Prop() invalidMessage: string = 'Not valid'

  /**
   */
  @Prop() required: boolean = false

  /**
   */
  @Prop() disabled: boolean = false

  /**
   */
  @Prop() isValid: boolean = true

  /**
   */
  @Prop() autoValidate: boolean = false

  /**
   */
  @Prop() invalidMessageShown: boolean = false

  /**
   */
  @Prop() showLabel: boolean = true

  /**
   */
  inputElement: HTMLInputElement
  inputWrapElement: HTMLElement

  /**
   */
  checkValue() {
    if (!this.inputElement) return

    this.value = this.inputElement.value
    this.value.replace(/(^\s+|\s+$)/, '') // trim

    if (this.required) {
      if (!this.value) {
        this.invalidMessage = 'Field is required'
        this.isValid = false
        if (this.autoValidate) this.invalidMessageShown = true
      } else {
        this.isValid = true
        this.invalidMessageShown = false
      }
    }
  }

  /**
   */
  onKeyUp(e) {
    this.checkValue()
    e.stopPropagation()
  }

  /**
   */
  onKeyDown(e) {
    e.stopPropagation()
  }

  /**
   */
  onBlur() {
    this.inputWrapElement.classList.remove('focused')
  }

  /**
   */
  onFocus() {
    this.inputWrapElement.classList.add('focused')
  }

  /**
   */
  componentDidRender() {
    this.checkValue()
  }

  /**
   * Main render function
   * @return {JSX} The generated html
   */
  render() {
    return (
      <div
        class={`input-wrap ${this.value ? 'not-empty' : 'empty'} ${
          !this.invalidMessageShown ? 'valid' : 'invalid'
        } ${this.disabled ? 'disabled' : ''}`}
        ref={(el) => (this.inputWrapElement = el)}
      >
        {this.showLabel && <label class="input-label">{this.label}</label>}
        <input
          ref={(el) => (this.inputElement = el as HTMLInputElement)}
          // placeholder={this.showLabel ? '' : this.label}
          type="text"
          value={this.value}
          onKeyDown={this.onKeyDown.bind(this)}
          onKeyUp={this.onKeyUp.bind(this)}
          onBlur={this.onBlur.bind(this)}
          onFocus={this.onFocus.bind(this)}
          disabled={this.disabled}
          class={{
            invalid:
              (this.autoValidate || this.invalidMessageShown) && !this.isValid,
          }}
        />
        <div class="underliner">
          <div class="expander"></div>
        </div>
        {!this.isValid && this.invalidMessageShown && (
          <div class="invalid-message">{this.invalidMessage}</div>
        )}
      </div>
    )
  }
}
