import { Component, h, Prop } from '@stencil/core'
import uxFactory from '../../assets/UxFactory.js'
import { ValueSetMode, XfoParameter, Xfo } from '@zeainc/zea-engine'
import { ParameterValueChange } from '@zeainc/zea-ux'

@Component({
  tag: 'zea-param-widget-xfo',
  styleUrl: 'zea-param-widget-xfo.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaParamWidgetXfo {
  private trxField: HTMLInputElement
  private tryField: HTMLInputElement
  private trzField: HTMLInputElement

  private orxField: HTMLInputElement
  private oryField: HTMLInputElement
  private orzField: HTMLInputElement
  private orwField: HTMLInputElement

  private scxField: HTMLInputElement
  private scyField: HTMLInputElement
  private sczField: HTMLInputElement

  private widgetContainer: HTMLElement

  private change: any
  private remoteUserEditedHighlightId: any
  private settingValue: boolean = false

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
      this.updateDisplayedValue(ValueSetMode.USER_SETVALUE)
    }
  }

  /**
   * Value change handler
   * @param {object} event The event object with details about the change.
   */
  private updateDisplayedValue(mode) {
    if (!this.settingValue) {
      const xfo = this.parameter.getValue()
      this.trxField.value = `${this.round(xfo.tr.x)}`
      this.tryField.value = `${this.round(xfo.tr.y)}`
      this.trzField.value = `${this.round(xfo.tr.z)}`

      this.orxField.value = `${this.round(xfo.ori.x)}`
      this.oryField.value = `${this.round(xfo.ori.y)}`
      this.orzField.value = `${this.round(xfo.ori.z)}`
      this.orwField.value = `${this.round(xfo.ori.w)}`

      this.scxField.value = `${this.round(xfo.sc.x)}`
      this.scyField.value = `${this.round(xfo.sc.y)}`
      this.sczField.value = `${this.round(xfo.sc.z)}`

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
   * Set the inputs up
   */
  private setUpInputs() {
    this.parameter.on('valueChanged', (event) => {
      this.updateDisplayedValue(event.mode)
    })
  }

  /**
   * Input handler
   */
  private onInput() {
    this.settingValue = true
    const xfo = new Xfo()
    xfo.tr.set(
      this.trxField.valueAsNumber,
      this.tryField.valueAsNumber,
      this.trzField.valueAsNumber
    )
    xfo.ori.set(
      this.orxField.valueAsNumber,
      this.oryField.valueAsNumber,
      this.orzField.valueAsNumber,
      this.orwField.valueAsNumber
    ) /* value order is xyzw*/
    xfo.ori.normalizeInPlace()
    xfo.sc.set(
      this.scxField.valueAsNumber,
      this.scyField.valueAsNumber,
      this.sczField.valueAsNumber
    )
    if (!this.change) {
      this.change = new ParameterValueChange(this.parameter, xfo)
      this.appData.undoRedoManager.addChange(this.change)
    } else {
      this.change.update({ value: xfo })
    }
  }

  /**
   * Change handler
   */
  private onChange() {
    this.onInput()
    this.settingValue = false
    this.change = undefined
  }

  /**
   * Round number
   * @param {number} value the value to be rounded
   * @param {number} decimals decimal places to keep
   * @return {number} the rouunded value
   */
  private round(value, decimals = 6) {
    if (Math.abs(value) < Number('1e-6')) return 0
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals)
  }

  /**
   * Render method.
   * @return {JSX} The generated html
   */
  render() {
    return (
      <div
        class="zea-param-widget-xfo"
        ref={(el) => (this.widgetContainer = el as HTMLElement)}
      >
        <fieldset>
          <legend>Translation</legend>
          <div class="input-wrap">
            <label>X</label>
            <input
              onInput={this.onInput}
              onChange={this.onChange}
              ref={(el) => (this.trxField = el as HTMLInputElement)}
              id={this.parameter.getName()}
              type="number"
              pattern="-?[0-9]*(.[0-9]+)?"
              tabindex="0"
            />
          </div>
          <div class="input-wrap">
            <label>Y</label>
            <input
              onInput={this.onInput}
              onChange={this.onChange}
              ref={(el) => (this.tryField = el as HTMLInputElement)}
              id={this.parameter.getName()}
              type="number"
              pattern="-?[0-9]*(.[0-9]+)?"
              tabindex="0"
            />
          </div>
          <div class="input-wrap">
            <label>Z</label>
            <input
              onInput={this.onInput}
              onChange={this.onChange}
              ref={(el) => (this.trzField = el as HTMLInputElement)}
              id={this.parameter.getName()}
              type="number"
              pattern="-?[0-9]*(.[0-9]+)?"
              tabindex="0"
            />
          </div>
        </fieldset>
        <fieldset>
          <legend>Rotation</legend>
          <div class="input-wrap">
            <label>X</label>
            <input
              onInput={this.onInput}
              onChange={this.onChange}
              ref={(el) => (this.orxField = el as HTMLInputElement)}
              id={this.parameter.getName()}
              type="number"
              pattern="-?[0-9]*(.[0-9]+)?"
              tabindex="0"
            />
          </div>
          <div class="input-wrap">
            <label>Y</label>
            <input
              onInput={this.onInput}
              onChange={this.onChange}
              ref={(el) => (this.oryField = el as HTMLInputElement)}
              id={this.parameter.getName()}
              type="number"
              pattern="-?[0-9]*(.[0-9]+)?"
              tabindex="0"
            />
          </div>
          <div class="input-wrap">
            <label>Z</label>
            <input
              onInput={this.onInput}
              onChange={this.onChange}
              ref={(el) => (this.orzField = el as HTMLInputElement)}
              id={this.parameter.getName()}
              type="number"
              pattern="-?[0-9]*(.[0-9]+)?"
              tabindex="0"
            />
          </div>
          <div class="input-wrap">
            <label>W</label>
            <input
              onInput={this.onInput}
              onChange={this.onChange}
              ref={(el) => (this.orwField = el as HTMLInputElement)}
              id={this.parameter.getName()}
              type="number"
              pattern="-?[0-9]*(.[0-9]+)?"
              tabindex="0"
            />
          </div>
        </fieldset>
        <fieldset>
          <legend>Scale</legend>
          <div class="input-wrap">
            <label>X</label>
            <input
              onInput={this.onInput}
              onChange={this.onChange}
              ref={(el) => (this.scxField = el as HTMLInputElement)}
              id={this.parameter.getName()}
              type="number"
              pattern="-?[0-9]*(.[0-9]+)?"
              tabindex="0"
            />
          </div>
          <div class="input-wrap">
            <label>Y</label>
            <input
              onInput={this.onInput}
              onChange={this.onChange}
              ref={(el) => (this.scyField = el as HTMLInputElement)}
              id={this.parameter.getName()}
              type="number"
              pattern="-?[0-9]*(.[0-9]+)?"
              tabindex="0"
            />
          </div>
          <div class="input-wrap">
            <label>Z</label>
            <input
              onInput={this.onInput}
              onChange={this.onChange}
              ref={(el) => (this.sczField = el as HTMLInputElement)}
              id={this.parameter.getName()}
              type="number"
              pattern="-?[0-9]*(.[0-9]+)?"
              tabindex="0"
            />
          </div>
        </fieldset>
      </div>
    )
  }
}

uxFactory.registerWidget(
  'zea-param-widget-xfo',
  (p) => p.constructor.name == XfoParameter.name
)
