import { Component, h, Prop, Listen } from '@stencil/core'

@Component({
  tag: 'zea-input-select',
  styleUrl: 'zea-input-select.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaInputSelect {
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
  @Prop() optionsShown: boolean = false

  /**
   */
  @Prop() selectCallback: any

  /**
   */
  inputElement: HTMLInputElement
  inputWrapElement: HTMLElement
  selectionContainer: HTMLElement
  optionsContainer: HTMLElement

  /**
   * Listen to click events on the whole document
   * @param {any} e The event
   */
  @Listen('click', { target: 'document', capture: true })
  handleClick(e) {
    if (!e.composedPath().includes(this.inputWrapElement)) {
      this.optionsShown = false
    }
  }

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
  onContainerClick() {
    this.optionsShown = !this.optionsShown
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
  componentDidLoad() {
    this.optionsContainer.addEventListener('click', (e) => {
      e.composedPath().forEach((element: any) => {
        if (element.tagName == 'ZEA-INPUT-SELECT-ITEM') {
          this.value = element.value
          this.optionsShown = false
          const selContainer = this.selectionContainer.querySelector(
            '.selection'
          )
          selContainer.innerHTML = ''
          selContainer.appendChild(element.cloneNode(true))
          if (this.selectCallback) this.selectCallback(this.value)
        }
      })
    })
  }

  /**
   * Main render function
   * @return {JSX} The generated html
   */
  render() {
    return (
      <div
        class={`input-wrap ${this.value ? 'not-empty' : 'empty'} ${
          this.optionsShown ? 'focused' : ''
        }`}
        ref={(el) => (this.inputWrapElement = el)}
      >
        {this.showLabel && <label class="input-label">{this.label}</label>}
        <div
          ref={(el) => (this.selectionContainer = el)}
          class="selection-container"
          onClick={this.onContainerClick.bind(this)}
        >
          <div class="selection"></div>
          <zea-icon
            name={
              this.optionsShown ? 'chevron-up-outline' : 'chevron-down-outline'
            }
            size={13}
          ></zea-icon>
        </div>
        <div
          ref={(el) => (this.optionsContainer = el)}
          class={{ 'options-container': true, shown: this.optionsShown }}
        >
          <zea-scroll-pane>
            <slot></slot>
          </zea-scroll-pane>
        </div>
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
