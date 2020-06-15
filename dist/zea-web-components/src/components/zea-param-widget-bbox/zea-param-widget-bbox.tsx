import { Component, h, Prop } from '@stencil/core'
import uxFactory from '../../assets/UxFactory.js'
import { ValueSetMode, Box3 } from '@zeainc/zea-engine'
import { ParameterValueChange } from '@zeainc/zea-ux'

@Component({
  tag: 'zea-param-widget-bbox',
  styleUrl: 'zea-param-widget-bbox.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaParamWidgetBbox {
  private minxField: HTMLInputElement
  private minyField: HTMLInputElement
  private minzField: HTMLInputElement

  private maxxField: HTMLInputElement
  private maxyField: HTMLInputElement
  private maxzField: HTMLInputElement

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
      const bbox = this.parameter.getValue()

      if (bbox.isValid()) {
        this.minxField.value = bbox.p0.x
        this.minyField.value = bbox.p0.y
        this.minzField.value = bbox.p0.z
        this.maxxField.value = bbox.p1.x
        this.maxyField.value = bbox.p1.y
        this.maxzField.value = bbox.p1.z
      }

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
    // eslint-disable-next-line new-cap
    const value = new Box3()

    value.p0.set(
      this.minxField.valueAsNumber,
      this.minyField.valueAsNumber,
      this.minzField.valueAsNumber
    )
    value.p1.set(
      this.maxxField.valueAsNumber,
      this.maxyField.valueAsNumber,
      this.maxzField.valueAsNumber
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
   * Render method.
   * @return {JSX} The generated html
   */
  render() {
    return (
      <div
        class="zea-param-widget-bbox"
        ref={(el) => (this.container = el as HTMLElement)}
      >
        <fieldset>
          <legend>Min</legend>
          <div class="input-wrap">
            <label>X</label>
            <input
              onInput={this.onInput}
              onChange={this.onChange}
              ref={(el) => (this.minxField = el as HTMLInputElement)}
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
              ref={(el) => (this.minyField = el as HTMLInputElement)}
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
              ref={(el) => (this.minzField = el as HTMLInputElement)}
              id={this.parameter.getName()}
              type="number"
              pattern="-?[0-9]*(.[0-9]+)?"
              tabindex="0"
            />
          </div>
        </fieldset>
        <fieldset>
          <legend>Max</legend>
          <div class="input-wrap">
            <label>X</label>
            <input
              onInput={this.onInput}
              onChange={this.onChange}
              ref={(el) => (this.maxxField = el as HTMLInputElement)}
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
              ref={(el) => (this.maxyField = el as HTMLInputElement)}
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
              ref={(el) => (this.maxzField = el as HTMLInputElement)}
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
  'zea-param-widget-bbox',
  (p) => p.getValue().constructor.name == Box3.name
)
