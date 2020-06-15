import { Component, h, Prop } from '@stencil/core'
import uxFactory from '../../assets/UxFactory.js'
import { ValueSetMode, BooleanParameter } from '@zeainc/zea-engine'
import { ParameterValueChange } from '@zeainc/zea-ux'

@Component({
  tag: 'zea-param-widget-boolean',
  styleUrl: 'zea-param-widget-boolean.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaParamWidgetBoolean {
  private cheboxInput?: HTMLInputElement
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
   * Whether the checkbox should be checked
   */
  @Prop() checked: boolean = false

  /**
   * The application data
   */
  @Prop() appData: any

  /**
   * Run when component loads
   */
  componentDidLoad() {
    if (this.parameter) {
      this.checked = this.parameter.getValue()

      this.parameter.on('valueChanged', (event) => {
        this.checked = this.parameter.getValue()

        if (event.mode == ValueSetMode.REMOTEUSER_SETVALUE) {
          this.cheboxInput.classList.add('user-edited')
          if (this.remoteUserEditedHighlightId) {
            clearTimeout(this.remoteUserEditedHighlightId)
          }

          this.remoteUserEditedHighlightId = setTimeout(() => {
            this.cheboxInput.classList.remove('user-edited')
            this.remoteUserEditedHighlightId = null
          }, 1500)
        }
      })
    }
  }

  /**
   * Run when input changes
   */
  inputChanged() {
    if (this.appData.undoRedoManager) {
      const change = new ParameterValueChange(
        this.parameter,
        this.cheboxInput.checked
      )
      this.appData.undoRedoManager.addChange(change)
    } else {
      this.parameter.setValue(this.cheboxInput.checked)
    }
  }

  /**
   * Render method.
   * @return {JSX} The generated html
   */
  render() {
    return (
      <div class="zea-param-widget-boolean">
        <input
          onChange={this.inputChanged}
          ref={(el) => (this.cheboxInput = el as HTMLInputElement)}
          type="checkbox"
          name={this.parameter.getName()}
          tabindex="0"
          checked={this.checked}
        />
      </div>
    )
  }
}

uxFactory.registerWidget(
  'zea-param-widget-boolean',
  (p) => p.constructor.name == BooleanParameter.name
)
