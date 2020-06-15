import { Component, h, Prop, Element, Listen } from '@stencil/core'

@Component({
  tag: 'zea-toolbar-toolset',
  styleUrl: 'zea-toolbar-toolset.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaToolbar {
  toolsetElement: HTMLElement
  currentTool: HTMLElement
  currentContainer: HTMLElement
  childrenContainer: HTMLElement
  children: any = []
  mouseIsdown: boolean = false
  @Element() hostElement: HTMLElement

  /**
   * Array of tools
   */
  @Prop() data: any

  /**
   * zeaToolbarToolClickHandler
   * @param {any} e the event data
   */
  @Listen('zeaToolbarToolClick', { target: 'window' })
  zeaToolbarToolClickHandler(e) {
    this.childrenContainer.style.display = 'none'

    const clickedTool = e.detail
    if (this.currentTool == clickedTool) {
      if (clickedTool.isActive) {
        this.childrenContainer.style.display = 'flex'
      }

      return
    }

    if (this.children.includes(clickedTool)) {
      this.children.push(this.currentTool)
      this.childrenContainer.appendChild(this.currentTool)
      this.currentTool = clickedTool
      this.setActiveTool()
    }
  }

  /**
   * Called everytime component renders
   */
  componentDidLoad() {
    this.setActiveTool()
  }

  /**
   * setActiveTool
   */
  setActiveTool() {
    if (!this.currentTool) {
      this.currentTool = this.children.shift()
    }

    this.currentContainer.appendChild(this.currentTool)

    this.childrenContainer.style.display = 'none'
  }

  /**
   * Main render method for the component
   * @return {JSX} The generated markup
   */
  render() {
    const toolKeys = Object.keys(this.data.tools)

    return (
      <div
        class="zea-toolset"
        ref={(el) => (this.toolsetElement = el as HTMLElement)}
      >
        <div
          class="current"
          ref={(el) => (this.currentContainer = el as HTMLElement)}
        ></div>
        <div
          class="children"
          ref={(el) => (this.childrenContainer = el as HTMLElement)}
        >
          {toolKeys &&
            toolKeys.map((toolKey) => {
              const tool = this.data.tools[toolKey]
              return (
                <tool.tag
                  key={toolKey}
                  data={tool.data}
                  ref={(el) => this.children.push(el)}
                ></tool.tag>
              )
            })}
        </div>
      </div>
    )
  }
}
