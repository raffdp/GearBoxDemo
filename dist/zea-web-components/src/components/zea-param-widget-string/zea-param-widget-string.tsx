import { Component, h, Prop } from '@stencil/core'
import uxFactory from '../../assets/UxFactory.js'
import { ValueSetMode, StringParameter } from '@zeainc/zea-engine'
import { ParameterValueChange } from '@zeainc/zea-ux'

@Component({
  tag: 'zea-param-widget-string',
  styleUrl: 'zea-param-widget-string.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaParamWidgetString {
  private txtField: HTMLInputElement
  private widgetContainer: HTMLElement
  private change: any
  private remoteUserEditedHighlightId: any

  /**
   * Parameter to be edited
   */
  @Prop() parameter: any

  /**
   * The application data
   */
  @Prop() appData: any

  /**
   * Class constructor
   */
  constructor() {
    this.onInput = this.onInput.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  /**
   * Run when component loads
   */
  componentDidLoad() {
    if (this.parameter) {
      this.setUpInputs()
      this.onValueChanged(ValueSetMode.USER_SETVALUE)
    }
  }

  /**
   * Set the inputs up
   */
  private setUpInputs() {
    this.parameter.on('valueChanged', (event) => {
      this.onValueChanged(event.mode)
    })
  }

  /**
   * Value change handler
   * @param {object} event The event object with details about the change.
   */
  private onValueChanged(mode) {
    if (!this.change) {
      this.txtField.value = this.parameter.getValue()

      if (mode == ValueSetMode.REMOTEUSER_SETVALUE) {
        this.widgetContainer.classList.add('user-edited')
        if (this.remoteUserEditedHighlightId)
          clearTimeout(this.remoteUserEditedHighlightId)

        this.remoteUserEditedHighlightId = setTimeout(() => {
          this.widgetContainer.classList.remove('user-edited')
          this.remoteUserEditedHighlightId = null
        }, 1500)
      }
    }
  }

  /**
   * Input handler
   */
  private onInput() {
    const value = this.txtField.value

    if (!this.change) {
      this.change = new ParameterValueChange(this.parameter, value)
      this.appData.undoRedoManager.addChange(this.change)
    } else {
      this.change.update({ value })
    }
  }

  /**
   * Change handler
   */
  private onChange() {
    this.onInput()
    this.change = undefined
  }

  /**
   * Render method.
   * @return {JSX} The generated html
   */
  render() {
    return (
      <div
        class="zea-param-widget-string"
        ref={(el) => (this.widgetContainer = el as HTMLElement)}
      >
        <input
          onInput={this.onInput}
          onChange={this.onChange}
          ref={(el) => (this.txtField = el as HTMLInputElement)}
          id={this.parameter.getName()}
          type="text"
          tabindex="0"
        />
      </div>
    )
  }
}

uxFactory.registerWidget(
  'zea-param-widget-string',
  (p) => p.constructor.name == StringParameter.name
)
