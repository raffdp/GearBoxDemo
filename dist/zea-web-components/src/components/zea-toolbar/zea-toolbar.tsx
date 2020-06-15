import { Component, h, Prop, Listen } from '@stencil/core'

@Component({
  tag: 'zea-toolbar',
  styleUrl: 'zea-toolbar.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaToolbar {
  mouseIsDown: boolean
  toolbarElement: HTMLElement
  offset = [0, 0]

  /**
   * Array of tools
   */
  @Prop() tools: any = {}

  /**
   * Listen to mousedown event
   * @param {any} event the event
   */
  @Listen('mousedown')
  mousedownHandler(event) {
    if (event.currentTarget.tagName == 'ZEA-TOOLBAR') {
      this.mouseIsDown = true
      this.offset = [
        this.toolbarElement.offsetLeft - event.clientX,
        this.toolbarElement.offsetTop - event.clientY,
      ]
    }
  }

  /**
   * Listen to mouseup event
   */
  @Listen('mouseup', { target: 'document' })
  mouseupHandler() {
    this.mouseIsDown = false
  }

  /**
   * Listen to mousemove event
   * @param {any} event the event
   */
  @Listen('mousemove', { target: 'document' })
  mousemoveHandler(event) {
    if (this.mouseIsDown) {
      this.toolbarElement.style.left = `${event.clientX + this.offset[0]}px`
      this.toolbarElement.style.top = `${event.clientY + this.offset[1]}px`
    }
  }

  /**
   * Main render method for the component
   * @return {JSX} The generated markup
   */
  render() {
    const toolKeys = Object.keys(this.tools)

    return (
      <div
        class="zea-toolbar"
        ref={(el) => (this.toolbarElement = el as HTMLElement)}
      >
        {toolKeys &&
          toolKeys.map((toolKey) => {
            const tool = this.tools[toolKey]
            return <tool.tag data={tool.data} key={toolKey}></tool.tag>
          })}
      </div>
    )
  }
}
