import { Component, h, Prop, State, Watch } from '@stencil/core'
import uxFactory from '../../assets/UxFactory.js'
import { ValueSetMode, NumberParameter } from '@zeainc/zea-engine'
import { ParameterValueChange } from '@zeainc/zea-ux'

@Component({
  tag: 'zea-param-widget-number',
  styleUrl: 'zea-param-widget-number.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaParamWidgetNumber {
  private inputField: HTMLInputElement
  private remoteUserEditedHighlightId: any

  /**
   * Class constructor
   */
  constructor() {
    this.inputChanged = this.inputChanged.bind(this)
  }

  /**
   * Parameter to be edited
   */
  @Prop() parameter: any

  /**
   * Html input type
   */
  @Prop() inputType: string

  /**
   * The application data
   */
  @Prop() appData: any

  /**
   * The value of the number
   */
  @Prop() value: any

  /**
   * Range of values
   */
  @State() range: any

  /**
   * Steps for the slider
   */
  @State() step: any

  /**
   * Reinit input when paramater changes
   */
  @Watch('parameter')
  parameterChangeHandler() {
    this.setUpInput()
  }

  /**
   * Run when component loads
   */
  componentDidLoad() {
    if (this.parameter) {
      this.setUpInput()
    }
  }

  /**
   * Set up the input
   */
  private setUpInput() {
    this.range = this.parameter.getRange()
    this.step = this.parameter.getStep()

    this.setInputValue()

    this.parameter.on('valueChanged', (event) => {
      console.log('value changed')
      this.setInputValue()

      if (event.mode == ValueSetMode.REMOTEUSER_SETVALUE) {
        this.inputField.classList.add('user-edited')

        if (this.remoteUserEditedHighlightId)
          clearTimeout(this.remoteUserEditedHighlightId)

        this.remoteUserEditedHighlightId = setTimeout(() => {
          this.inputField.classList.remove('user-edited')
          this.remoteUserEditedHighlightId = null
        }, 1500)
      }
    })
  }

  /**
   * Sets the value of the input
   */
  private setInputValue() {
    if (this.range) {
      this.value =
        ((this.parameter.getValue() - this.range[0]) /
          (this.range[1] - this.range[0])) *
        200
    } else {
      this.value = this.parameter.getValue()
    }
  }

  /**
   * Run when input changes
   */
  private inputChanged() {
    let value = this.round(this.inputField.valueAsNumber)

    if (this.range) {
      // Renmap from the 0..200 integer to the floating point
      // range specified in the parameter.
      value = this.range[0] + (value / 200) * (this.range[1] - this.range[0])
      value = this.clamp(value, this.range[0], this.range[1])
    }

    if (this.appData.undoRedoManager) {
      const change = new ParameterValueChange(this.parameter, value)
      this.appData.undoRedoManager.addChange(change)
    } else {
      this.parameter.setValue(value)
    }
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
   * Clamp number
   * @param {number} num Number to be rounded
   * @param {number} a Number of decimal places
   * @param {number} b Number of decimal places
   * @return {number} clamped number
   */
  private clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b))
  }

  /**
   * Render method.
   * @return {JSX} The generated html
   */
  render() {
    if (this.range) {
      return (
        <div class="zea-param-widget-number">
          <input
            onChange={this.inputChanged}
            ref={(el) => (this.inputField = el as HTMLInputElement)}
            class="mdl-slider mdl-js-slider"
            type="range"
            min="0"
            max="200"
            step={this.step ? this.step : 1}
            id={this.parameter.getName()}
            value={this.value}
            tabindex="0"
          />
        </div>
      )
    }

    return (
      <div class="zea-param-widget-number">
        <input
          onChange={this.inputChanged}
          ref={(el) => (this.inputField = el as HTMLInputElement)}
          type="number"
          pattern="-?[0-9]*(.[0-9]+)?"
          id={this.parameter.getName()}
          value={this.value}
          tabindex="0"
        />
      </div>
    )
  }
}

uxFactory.registerWidget(
  'zea-param-widget-number',
  (p) => p.constructor.name == NumberParameter.name
)
