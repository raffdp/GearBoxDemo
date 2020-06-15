import {
  Component,
  h,
  Prop,
  Event,
  EventEmitter,
  Element,
  Listen,
} from '@stencil/core'

@Component({
  tag: 'zea-toolbar-tool',
  styleUrl: 'zea-toolbar-tool.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaToolbarTool {
  outerWrap: HTMLElement
  @Element() hostElement: HTMLElement

  /**
   * The tool data
   */
  @Prop() data: any

  /**
   * Whether the tool is currently active
   */
  @Prop() isActive: boolean

  /**
   * Event to emit when user chip gets clicked
   */
  @Event({
    eventName: 'zeaToolbarToolClick',
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  zeaToolbarToolClick: EventEmitter

  /**
   * zeaToolbarToolClickHandler
   * @param {any} event the event data
   */
  @Listen('zeaToolbarToolClick', { target: 'window' })
  zeaToolbarToolClickHandler() {
    this.isActive = false
  }

  /**
   * Handle click on user chip
   * @param {any} e the event
   */
  toolClickHandler(e) {
    this.zeaToolbarToolClick.emit(this.hostElement)
    this.isActive = true
    if ('callback' in this.data) {
      this.data.callback(e)
    }
  }

  /**
   * Main render method for the component
   * @return {JSX} The generated markup
   */
  render() {
    return (
      <div
        ref={(el) => (this.outerWrap = el as HTMLElement)}
        class={`tool-wrap ${this.isActive ? 'active' : ''}`}
        title={this.data.toolName}
        onClick={this.toolClickHandler.bind(this)}
      >
        <zea-icon
          name={this.data.iconName}
          type={this.data.iconType}
        ></zea-icon>
      </div>
    )
  }
}
