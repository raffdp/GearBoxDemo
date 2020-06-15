import { Component, h, Prop, State, Listen } from '@stencil/core'
import uxFactory from '../../assets/UxFactory.js'
import iro from '@jaames/iro'
import { ValueSetMode, Color, ColorParameter } from '@zeainc/zea-engine'
import { ParameterValueChange } from '@zeainc/zea-ux'

@Component({
  tag: 'zea-param-widget-color',
  styleUrl: 'zea-param-widget-color.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaParamWidgetColor {
  private container: HTMLElement
  private colorPicker: any
  private colorPickerContainer: HTMLElement
  private change: any
  private remoteUserEditedHighlightId: any
  private undoing: boolean
  private sampleTextColor: string
  private colorPickerHeight = 200
  private resizeTimeout: any

  /**
   * Parameter to be edited
   */
  @Prop() parameter: any

  /**
   * The application data
   */
  @Prop() appData: any

  /**
   * Color to be dislayed in the sample box
   */
  @State() sampleColor: string

  /**
   * Listen to window resize event
   */
  @Listen('resize', { target: 'window' })
  handlewindowResize() {
    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = setTimeout(() => this.resizeColorPicker(), 500)
  }

  /**
   * Actualy resize color picker
   */
  resizeColorPicker() {
    this.colorPicker.resize(this.container.offsetWidth, this.colorPickerHeight)
  }

  /**
   * Run when component loads
   */
  componentDidLoad() {
    this.setUpColorPicker()

    if (this.parameter) {
      this.parameter.on('valueChanged', (event) => {
        this.onValueChange(event.mode)
      })

      this.onValueChange(ValueSetMode.USER_SETVALUE)
    }

    setTimeout(() => window.dispatchEvent(new Event('resize')), 1000)
  }

  /**
   * Called when the parameter value changes externally
   * @param {any} mode the change mode
   */
  onValueChange(mode) {
    if (!this.change) {
      this.undoing = true
      this.colorPicker.color.rgb = this.parameter.getValue().getAsRGBDict()
      this.undoing = false

      this.sampleColor = this.colorPicker.color.hslString

      this.setSampleTextColor()
      console.log(ValueSetMode)
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
   * Set the color of the text in the sample box
   */
  private setSampleTextColor() {
    const l = 100 - this.colorPicker.color.hsl.l
    this.sampleTextColor = `hsl(1, 0%, ${l}%)`
  }

  /**
   * Setup the color picker and it's events
   */
  private setUpColorPicker() {
    this.colorPicker = iro.ColorPicker(this.colorPickerContainer, {
      // Color picker options:
      // https://iro.js.org/guide.html
      width: this.container.offsetWidth,
      height: this.colorPickerHeight,
      anticlockwise: true,
      borderWidth: 0,
      borderColor: '#fff',
      sliderHeight: '10px',
      padding: 1,
      sliderMargin: 4,
      handleRadius: 4,
      layout: [
        {
          // hue slider
          component: iro.ui.Slider,
          options: {
            sliderType: 'hue',
          },
        },
        {
          // saturation slider
          component: iro.ui.Slider,
          options: {
            sliderType: 'saturation',
          },
        },
        {
          // regular value slider
          component: iro.ui.Slider,
          options: {},
        },
      ],
    })

    this.colorPicker.on('input:start', () => {
      this.change = new ParameterValueChange(this.parameter)
      this.appData.undoRedoManager.addChange(this.change)
    })

    this.colorPicker.on('input:end', () => {
      this.change = undefined
    })

    this.colorPicker.on('color:change', () => {
      if (this.undoing) return

      const value = new Color()
      value.setFromRGBDict(this.colorPicker.color.rgb)

      this.sampleColor = this.colorPicker.color.hslString

      this.setSampleTextColor()

      if (!this.change) {
        this.change = new ParameterValueChange(this.parameter, value)
        this.appData.undoRedoManager.addChange(this.change)
      } else {
        this.change.update({ value })
      }
    })
  }

  /**
   * Main ender method.
   * @return {JSX} The generated html
   */
  render() {
    return (
      <div
        ref={(el) => (this.container = el as HTMLElement)}
        class="zea-param-widget-color"
      >
        <div
          style={{
            color: this.sampleTextColor,
            backgroundColor: this.sampleColor,
          }}
          class="color-sample"
        >
          {this.sampleColor}
        </div>
        <div
          ref={(el) => (this.colorPickerContainer = el as HTMLElement)}
          class="color-picker"
        ></div>
      </div>
    )
  }
}

uxFactory.registerWidget(
  'zea-param-widget-color',
  (p) => p.constructor.name == ColorParameter.name
)
