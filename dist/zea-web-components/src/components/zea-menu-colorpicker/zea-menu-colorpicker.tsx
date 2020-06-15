import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-menu-colorpicker',
  styleUrl: 'zea-menu-colorpicker.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaMenuColorpicker {
  currentColorContainer
  dropDownContainer
  colorElements = []
  currentColor

  @Prop() shown: boolean = false

  /**
   * Handler for click events on the whole window
   * @param {any} e the event
   */
  handleDropDownColorClick(e) {
    if (e.target == this.currentColor) return

    if (e.target.tagName == 'ZEA-MENU-COLOR') {
      // Re-insert the previous color at the start of the list
      const referenceNode = this.dropDownContainer.childNodes[0]
      this.dropDownContainer.insertBefore(this.currentColor, referenceNode)

      this.currentColor = e.target

      this.setActiveColors()

      this.currentColorContainer.appendChild(this.currentColor)
      this.shown = false
      if ('callback' in this.currentColor) this.runCallback(this.currentColor)
    }
  }

  /**
   * Set the active colors through css variables
   */
  setActiveColors() {
    document.documentElement.style.setProperty(
      '--toolbar-active-bg-color',
      this.currentColor.color
    )

    document.documentElement.style.setProperty(
      '--toolbar-active-fg-color',
      this.currentColor.fgColor
    )
  }

  /**
   * Handle click on currently selected color
   */
  handleCurrentColorClick() {
    this.shown = !this.shown
  }

  /**
   * Called everytime the component renders to run some setup on child elements
   */
  componentDidRender() {
    this.setupChildren()
  }

  /**
   * Run some setup for the children items
   */
  setupChildren() {
    this.dropDownContainer
      .querySelector('slot')
      .assignedElements()
      .forEach((element: any) => {
        if (element.tagName == 'ZEA-MENU-COLOR') {
          this.colorElements.push(element)
          element.addEventListener(
            'click',
            this.handleDropDownColorClick.bind(this)
          )
        }
      })
    if (!this.currentColor) {
      this.currentColor = this.colorElements[0]
      this.setActiveColors()
    }
    this.currentColorContainer.appendChild(this.currentColor)
  }

  /**
   * Run the item's callback
   * @param {any} element The element whose callback to call
   */
  runCallback(element) {
    if (element.callback) {
      if (typeof element.callback == 'string') {
        eval(element.callback)
      } else {
        element.callback(element)
      }
    }
  }

  /**
   * Main render method for the component
   * @return {JSX} The generated markup
   */
  render() {
    return (
      <div class="zea-menu-colorpicker">
        <div
          onClick={this.handleCurrentColorClick.bind(this)}
          class="currentColor"
          ref={el => (this.currentColorContainer = el as HTMLElement)}
        ></div>
        <div
          class={`colorDropdown ${this.shown ? 'shown' : ''}`}
          ref={el => (this.dropDownContainer = el as HTMLElement)}
        >
          <slot></slot>
        </div>
      </div>
    )
  }
}
