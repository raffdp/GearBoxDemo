import { Component, h, Prop, Listen } from '@stencil/core'

@Component({
  tag: 'zea-input',
  styleUrl: 'zea-input.css',
  shadow: true,
})
/**
 */
export class ZeaInput {
  /**
   */
  @Prop() name: string = 'zea-input'

  /**
   */
  @Prop() type: string = 'text'

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
  @Prop() showLabel: boolean = false

  /**
   */
  @Prop() photoBase64: string = ''

  /**
   */
  @Prop() colorPopupShown: boolean = false

  /**
   */
  @Prop() colorPopupAlign: string = 'bottom-right'

  /**
   */
  @Prop() colorOptions = [
    '#F34235',
    '#E81D62',
    '#292929',
    '#9B26AF',
    '#6639B6',
    '#3E50B4',
    '#2095F2',
    '#02A8F3',
    '#00BBD3',
    '#009587',
    '#4BAE4F',
    '#8AC249',
    '#CCDB38',
    '#FEEA3A',
    '#FEC006',
    '#FE9700',
    '#FE5621',
    '#785447',
    '#9D9D9D',
    '#5F7C8A',
  ]

  /**
   * Referenced html elements
   */
  inputElement: HTMLInputElement
  inputWrapElement: HTMLElement
  colorPopup: HTMLElement
  selectedColorContainer: HTMLElement

  /**
   * Listen to click events on the whole document
   * @param {any} e The event
   */
  @Listen('click', { target: 'document', capture: true })
  handleClick(e) {
    if (
      !e.composedPath().includes(this.colorPopup) &&
      !e.composedPath().includes(this.selectedColorContainer)
    ) {
      this.colorPopupShown = false
    }
  }

  /**
   */
  checkValue() {
    if (!this.inputElement) return

    if (this.type == 'photo') {
      this.value = this.photoBase64
    } else if (this.type == 'color') {
      this.value = this.selectedColor
    } else {
      this.value = this.inputElement.value
      this.value.replace(/(^\s+|\s+$)/, '') // trim
    }

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
  @Prop() selectedColor
  currentColorElement

  /**
   */
  onColorClick(e) {
    this.selectColor(e.currentTarget.dataset.color)
  }

  /**
   */
  selectColor(color) {
    const colorElement: HTMLElement = this.inputWrapElement.querySelector(
      `.color-option[data-color="${color}"]`
    )
    if (!colorElement) return
    this.selectedColor = colorElement.dataset.color
    if (this.currentColorElement)
      this.currentColorElement.classList.remove('active')
    colorElement.classList.add('active')
    this.currentColorElement = colorElement
    this.value = this.selectedColor
  }

  /**
   */
  onPhotoChange(e) {
    const file = e.currentTarget.files[0]
    const reader = new FileReader()

    reader.addEventListener(
      'load',
      () => {
        this.photoBase64 = `${reader.result}`
        this.value = this.photoBase64
        this.checkValue()
      },
      false
    )

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  /**
   */
  componentDidRender() {
    // this.checkValue()
  }

  /**
   */
  componentWillLoad() {
    if (this.type == 'color' && !this.selectedColor && !this.value) {
      this.selectedColor = this.colorOptions[
        Math.floor(Math.random() * this.colorOptions.length)
      ]
      this.value = this.selectedColor
    } else if (this.type == 'color' && this.value) {
      this.selectedColor = this.value
    }

    if (this.type == 'photo' && this.value) {
      this.photoBase64 = this.value // TODO: check it's actually base64
    }
  }

  /**
   */
  componentDidLoad() {
    this.selectColor(this.selectedColor)
  }

  /**
   */
  render() {
    const inputTypes = {
      text: [
        this.showLabel && <label class="input-label">{this.label}</label>,
        <input
          ref={(el) => (this.inputElement = el as HTMLInputElement)}
          placeholder={this.showLabel ? '' : this.label}
          type="text"
          value={this.value}
          onKeyDown={this.onKeyDown.bind(this)}
          onKeyUp={this.onKeyUp.bind(this)}
          class={{
            invalid:
              (this.autoValidate || this.invalidMessageShown) && !this.isValid,
          }}
        />,
      ],
      photo: (
        <div class="photo-input">
          <div
            class="photo-thumb"
            onClick={() => {
              this.inputElement.dispatchEvent(new MouseEvent('click'))
            }}
          >
            <zea-icon name="camera-outline" size={30}></zea-icon>
            <div
              id="photo-preview"
              style={{ backgroundImage: `url(${this.value})` }}
            ></div>
          </div>
          <div class="photo-copy">
            <label class="input-label">{this.label}</label>
            Your photo lets people recognize you while working together.
          </div>
          <input
            ref={(el) => (this.inputElement = el as HTMLInputElement)}
            type="file"
            onChange={this.onPhotoChange.bind(this)}
            class={{
              invalid:
                (this.autoValidate || this.invalidMessageShown) &&
                !this.isValid,
            }}
          />
        </div>
      ),
      color: (
        <div class="color-input">
          <div class="color-thumb">
            <div
              ref={(el) =>
                (this.selectedColorContainer = el as HTMLInputElement)
              }
              class="choosen-color"
              style={{ backgroundColor: this.selectedColor }}
              onClick={() => {
                this.colorPopupShown = !this.colorPopupShown
              }}
            ></div>
            <div
              ref={(el) => (this.colorPopup = el as HTMLInputElement)}
              class={`color-popup ${this.colorPopupShown ? 'shown' : ''} ${
                this.colorPopupAlign
              }`}
            >
              {this.colorOptions.map((colorOption) => (
                <div
                  class="color-option"
                  data-color={colorOption}
                  onMouseDown={this.onColorClick.bind(this)}
                  onMouseUp={() => {
                    this.colorPopupShown = false
                  }}
                >
                  <div
                    class="color-sample"
                    style={{ backgroundColor: colorOption }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
          {this.showLabel && (
            <div class="color-copy">
              <label class="input-label">{this.label}</label>
              Your color helps you stand out from other people.
            </div>
          )}
        </div>
      ),
    }

    return (
      <div class="input-wrap" ref={(el) => (this.inputWrapElement = el)}>
        {inputTypes[this.type]}
        {!this.isValid && this.invalidMessageShown && (
          <div class="invalid-message">{this.invalidMessage}</div>
        )}
      </div>
    )
  }
}
