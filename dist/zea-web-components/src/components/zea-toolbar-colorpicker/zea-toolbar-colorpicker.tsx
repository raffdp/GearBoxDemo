import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-toolbar-colorpicker',
  styleUrl: 'zea-toolbar-colorpicker.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaToolbarColorpicker {
  colopickerElement: HTMLElement
  currentTool: any
  currentContainer: HTMLElement
  childrenContainer: HTMLElement
  children: any = []
  mouseIsdown: boolean = false

  /**
   * Array of tools
   */
  @Prop() data: any

  /**
   * Whether the color dropdown should be shown
   */
  @Prop() displayChildren: boolean

  /**
   * Called everytime component renders
   */
  componentDidLoad() {
    this.setActiveTool({})
  }

  /**
   * Set the active tool
   * @param {any} e The event
   */
  setActiveTool(e) {
    if (!this.currentTool) {
      this.currentTool = this.children.shift()
    }

    this.currentContainer.appendChild(this.currentTool)
    this.displayChildren = false

    document.documentElement.style.setProperty(
      '--toolbar-active-fg-color',
      this.currentTool.style.color
    )
    document.documentElement.style.setProperty(
      '--toolbar-active-bg-color',
      this.currentTool.style.backgroundColor
    )

    const key = this.currentTool.getAttribute('data-key')

    if ('callback' in this.data.colors[key]) this.data.colors[key].callback(e)
  }

  /**
   * Handle click on color
   * @param {any} e the event
   */
  handleChildrenClick(e) {
    this.childrenContainer.style.display = 'none'
    const clickedTool = e.currentTarget
    if (clickedTool == this.currentTool) {
      if (this.displayChildren) {
        this.displayChildren = false
      } else {
        this.displayChildren = true
        this.currentTool = clickedTool
      }
    } else if (this.children.includes(clickedTool)) {
      this.childrenContainer.appendChild(this.currentTool)
      this.children.push(this.currentTool)
      this.currentTool = clickedTool

      this.setActiveTool(e)
    }
  }

  /**
   * Main render method for the component
   * @return {JSX} The generated markup
   */
  render() {
    const colorKeys = Object.keys(this.data.colors)

    return (
      <div
        class="zea-colopicker"
        ref={(el) => (this.colopickerElement = el as HTMLElement)}
      >
        <div
          class="current"
          ref={(el) => (this.currentContainer = el as HTMLElement)}
        ></div>
        <div
          class="children"
          style={{ display: this.displayChildren ? 'grid' : 'none' }}
          ref={(el) => (this.childrenContainer = el as HTMLElement)}
        >
          {colorKeys &&
            colorKeys.map((colorKey) => {
              const color = this.data.colors[colorKey]
              return (
                <div
                  class="colorpicker-color"
                  style={{
                    backgroundColor: color.background,
                    color: color.foreground,
                  }}
                  data-key={colorKey}
                  key={colorKey}
                  onClick={this.handleChildrenClick.bind(this)}
                  ref={(el) => this.children.push(el)}
                ></div>
              )
            })}
        </div>
      </div>
    )
  }
}
