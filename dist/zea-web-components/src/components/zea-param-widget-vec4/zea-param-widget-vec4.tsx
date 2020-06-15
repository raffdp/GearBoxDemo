import { Component, h, Prop, State, Watch } from '@stencil/core'
import uxFactory from '../../assets/UxFactory.js'
import { ValueSetMode, Vec4Parameter, Vec4 } from '@zeainc/zea-engine'
import { ParameterValueChange } from '@zeainc/zea-ux'

@Component({
  tag: 'zea-param-widget-vec4',
  styleUrl: 'zea-param-widget-vec4.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaParamWidgetVec4 {
  private xField: HTMLInputElement
  private yField: HTMLInputElement
  private zField: HTMLInputElement
  private tField: HTMLInputElement
  private container: HTMLElement
  private change: any
  private remoteUserEditedHighlightId: any

  /**
   * Class constructor
   */
  constructor() {
    this.onInput = this.onInput.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  /**
   * Parameter to be edited
   */
  @Prop() parameter: any

  /**
   * The application data
   */
  @Prop() appData: any

  /**
   * The value of the X number
   */
  @State() xValue: any

  /**
   * The value of the Y number
   */
  @State() yValue: any

  /**
   * The value of the Z number
   */
  @State() zValue: any

  /**
   * The value of the T number
   */
  @State() tValue: any

  /**
   * Reinit input when paramater changes
   */
  @Watch('parameter')
  parameterChangeHandler() {
    this.setUpInputs()
  }

  /**
   * Run when component loads
   */
  componentDidLoad() {
    if (this.parameter) {
      this.setUpInputs()
      this.onValueChanged(0)
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
      const vec4 = this.parameter.getValue()
      this.xField.value = `${this.round(vec4.x)}`
      this.yField.value = `${this.round(vec4.y)}`
      this.zField.value = `${this.round(vec4.z)}`
      this.tField.value = `${this.round(vec4.t)}`

      if (mode == ValueSetMode.REMOTEUSER_SETVALUE) {
        this.container.classList.add('user-edited')
        if (this.remoteUserEditedHighlightId)
          clearTimeout(this.remoteUserEditedHighlightId)

        this.remoteUserEditedHighlightId = setTimeout(() => {
          this.container.classList.remove('user-edited')
          this.remoteUserEditedHighlightId = null
        }, 1500)
      }
    }
  }

  /**
   * Input handler
   */
  private onInput() {
    const value = new Vec4(
      this.xField.valueAsNumber,
      this.yField.valueAsNumber,
      this.zField.valueAsNumber,
      this.tField.valueAsNumber
    )
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
   * Round number
   * @param {number} value Number to be rounded
   * @param {number} decimals Number of decimal places
   * @return {number} Rounded number
   */
  private round(value, decimals = 6) {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals)
  }

  /**
   * Render method.
   * @return {JSX} The generated html
   */
  render() {
    return (
      <div
        class="zea-param-widget-vec4"
        ref={(el) => (this.container = el as HTMLElement)}
      >
        <div class="vector-input-wrap">
          <label>X</label>
          <input
            onInput={this.onInput}
            onChange={this.onChange}
            ref={(el) => (this.xField = el as HTMLInputElement)}
            id={this.parameter.getName()}
            type="number"
            pattern="-?[0-9]*(.[0-9]+)?"
            tabindex="0"
            value={this.xValue}
          />
        </div>
        <div class="vector-input-wrap">
          <label>Y</label>
          <input
            onInput={this.onInput}
            onChange={this.onChange}
            ref={(el) => (this.yField = el as HTMLInputElement)}
            id={this.parameter.getName()}
            type="number"
            pattern="-?[0-9]*(.[0-9]+)?"
            tabindex="0"
            value={this.yValue}
          />
        </div>
        <div class="vector-input-wrap">
          <label>Z</label>
          <input
            onInput={this.onInput}
            onChange={this.onChange}
            ref={(el) => (this.zField = el as HTMLInputElement)}
            id={this.parameter.getName()}
            type="number"
            pattern="-?[0-9]*(.[0-9]+)?"
            tabindex="0"
            value={this.zValue}
          />
        </div>
        <div class="vector-input-wrap">
          <label>T</label>
          <input
            onInput={this.onInput}
            onChange={this.onChange}
            ref={(el) => (this.tField = el as HTMLInputElement)}
            id={this.parameter.getName()}
            type="number"
            pattern="-?[0-9]*(.[0-9]+)?"
            tabindex="0"
            value={this.tValue}
          />
        </div>
      </div>
    )
  }
}

uxFactory.registerWidget(
  'zea-param-widget-vec4',
  (p) => p.constructor.name == Vec4Parameter.name
)
