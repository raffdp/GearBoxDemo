import { Component, h, Prop, Listen, Element } from '@stencil/core'

@Component({
  tag: 'zea-menu',
  styleUrl: 'zea-menu.css',
  shadow: true,
})

/**
 * Main component class
 */
export class ZeaMenu {
  itemsContainer
  mouseIsDown
  menuElement
  offset = [0, 0]

  @Element() hostElement: HTMLElement

  @Prop() leftOffset: string = ''

  @Prop() topOffset: string = ''

  @Prop() type: string = 'dropdown'

  @Prop() shown: boolean = false

  @Prop() showAnchor: boolean = false

  @Prop() anchorIcon: string = 'ellipsis-vertical-circle-outline'

  anchorElement: HTMLElement

  @Prop() contextualAlign: string = 'top-left'

  /**
   * Listen to click (mouse up) events on the whole window
   * @param {any} ev the event
   */
  @Listen('mouseup')
  handleClick(ev) {
    if (ev.currentTarget == this.anchorElement) {
      this.shown = !this.shown
      return
    } else if (
      this.type == 'contextual' &&
      !this.isDescendant(this.hostElement, ev.target)
    ) {
      this.shown = false
    }

    this.mouseIsDown = false
  }

  /**
   * isDescendant
   * @param {any} parent the parent
   * @param {any} child the parent
   * @return {any} whether or not is parent
   */
  isDescendant(parent, child) {
    let node = child.parentNode
    while (node != null) {
      if (node == parent) {
        return true
      }
      node = node.parentNode
    }
    return false
  }

  /**
   * Listen to zeaMenuItemClick events on the whole window
   * @param {any} ev The zeaMenuItemClick event
   */
  @Listen('zeaMenuItemClick', { target: 'window' })
  handleItemClick(ev) {
    if (this.type == 'contextual' && !ev.detail.hasSubitems) {
      this.shown = false
    }
  }

  /**
   * Listen to mousedown event
   * @param {any} event the event
   */
  @Listen('mousedown')
  mousedownHandler(event) {
    if (this.type == 'toolbar' && event.currentTarget.tagName == 'ZEA-MENU') {
      this.mouseIsDown = true
      this.offset = [
        this.menuElement.offsetLeft - event.clientX,
        this.menuElement.offsetTop - event.clientY,
      ]
    }
  }

  /**
   * Listen to mousemove event
   * @param {any} event the event
   */
  @Listen('mousemove', { target: 'document' })
  mousemoveHandler(event) {
    if (this.type == 'toolbar' && this.mouseIsDown) {
      this.menuElement.style.left = `${event.clientX + this.offset[0]}px`
      this.menuElement.style.top = `${event.clientY + this.offset[1]}px`
    }
  }

  /**
   * Listen to click events on anchor
   * @param {any} ev the event
   */
  handleAnchorClick(ev) {
    this.handleClick(ev)
    ev.stopPropagation()
  }

  /**
   * Called once when component first loads
   */
  componentDidLoad() {
    // the menu is hidden by default to avoid flashing
    if (this.type != 'contextual') {
      this.shown = true
    }
  }

  /**
   * Called everytime the component renders
   * Apply the class to children
   */
  componentDidRender() {
    this.setupChildren()
  }

  /**
   * Run some setup for the children items
   */
  setupChildren() {
    this.itemsContainer
      .querySelector('slot')
      .assignedNodes()
      .forEach((element: any) => {
        if ('type' in element) {
          element.type = this.type
        }
        if ('itemParent' in element) {
          element.itemParent = this.hostElement
        }
        if ('rootMenu' in element) {
          element.rootMenu = this.hostElement
        }
      })
  }

  /**
   * Render function
   * @return {JSX}
   */
  render() {
    const anchor =
      this.type == 'contextual' && this.showAnchor ? (
        <div
          onMouseUp={this.handleAnchorClick.bind(this)}
          class="menu-anchor"
          ref={(el) => (this.anchorElement = el as HTMLElement)}
        >
          <zea-icon name={this.anchorIcon}></zea-icon>
        </div>
      ) : null

    const menuClass = {}
    menuClass['zea-menu'] = true
    menuClass[this.type] = true
    menuClass['shown'] = this.shown
    menuClass[this.contextualAlign] = true

    const containerStyle = {
      top: this.topOffset,
      left: this.leftOffset,
    }

    return (
      <div
        class={menuClass}
        ref={(el) => (this.menuElement = el as HTMLElement)}
      >
        {anchor}
        <div
          ref={(el) => (this.itemsContainer = el as HTMLElement)}
          class="items"
          style={containerStyle}
        >
          <slot></slot>
        </div>
      </div>
    )
  }
}
