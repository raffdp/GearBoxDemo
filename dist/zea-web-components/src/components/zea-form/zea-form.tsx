import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-form',
  styleUrl: 'zea-form.css',
  shadow: true,
})

/**
 */
export class ZeaForm {
  /**
   */
  @Prop() submitText: string = 'SUBMIT'

  /**
   */
  @Prop() validate: boolean = true

  /**
   */
  @Prop() isValid: boolean = true

  /**
   */
  @Prop() formValue: any = {}

  /**
   */
  @Prop() submitCallback: any

  /**
   */
  private inputs = []

  /**
   */
  formContainer: HTMLElement

  /**
   */
  getFormValue() {
    this.checkValidation()

    this.inputs.forEach((inputElement) => {
      this.formValue[inputElement.name] = inputElement.value
    })

    return this.formValue
  }

  /**
   */
  checkValidation(): Boolean {
    if (!this.validate) {
      return true
    }

    for (let i = 0; i < this.inputs.length; i++) {
      const inputElement = this.inputs[i]

      if (inputElement.isValid) {
        inputElement.invalidMessageShown = false
        this.isValid = true
      } else {
        inputElement.invalidMessageShown = true
        this.isValid = false

        return false
      }
    }

    return true
  }

  /**
   */
  onSubmit() {
    if (this.submitCallback) {
      this.submitCallback(this.getFormValue())
    }
  }

  /**
   */
  componentDidRender() {
    this.setupChildren()
  }

  /**
   * Run some setup for the children items
   */
  setupChildren() {
    this.formContainer
      .querySelector('slot')
      .assignedElements()
      .forEach((element: any) => {
        if (element.tagName.match(/^ZEA-INPUT/i)) {
          this.inputs.push(element)
        }
      })
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div
        class="zea-form"
        ref={(el) => (this.formContainer = el as HTMLElement)}
      >
        <slot></slot>
        <zea-button onClick={this.onSubmit.bind(this)} class="submit">
          {this.submitText}
        </zea-button>
      </div>
    )
  }
}
