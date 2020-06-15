import { Component, h, Prop, State, Listen, Element } from '@stencil/core'

@Component({
  tag: 'zea-popup-menu',
  styleUrl: 'zea-popup-menu.css',
  shadow: true,
})

/**
 * Main class for component
 */
export class ZeaPopupMenu {
  @Element() hostElement: HTMLElement

  /**
   * Anchor element
   */
  @Prop() anchorElement: HTMLElement

  /**
   * Whether the menu should be shown
   */
  @Prop() shown: boolean = false

  @State() bbox: DOMRect

  @Prop() topOffset: string

  @Prop() leftOffset: string

  @State() node: HTMLElement

  /**
   * Main render function
   * @param {any} ev the event
   */
  @Listen('click', { target: 'window' })
  handleClick(ev) {
    if (ev.target == this.anchorElement) {
      this.bbox = ev.target.getBoundingClientRect()
      this.leftOffset = `${this.bbox.left}px`
      this.topOffset = `${this.bbox.top}px`
      this.shown = !this.shown
      return
    }

    // check if the clicked element is part of the menu
    if (this.hostElement.contains(ev.target)) {
      const item = ev.target.shadowRoot.querySelector('.zea-popup-menu-item')
      this.twinkleElement(item)
      setTimeout(() => {
        this.shown = false
      }, 300)
    } else {
      if (this.anchorElement) this.shown = false
    }
  }

  /**
   * Add twinkle effect on item click
   * @param {any} elmnt the item element
   */
  twinkleElement = (elmnt) => {
    elmnt.classList.toggle('twinkled')

    const interval = setInterval(() => {
      elmnt.classList.toggle('twinkled')
    }, 70)

    setTimeout(() => {
      clearTimeout(interval)
      elmnt.classList.remove('twinkled')
    }, 100)
  }

  /**
   * Main render function
   * @return {JSX} the generated html
   */
  render() {
    return (
      <div
        ref={(node) => (this.node = node)}
        class={`zea-popup-menu ${this.shown ? 'shown' : 'hidden'}`}
        style={{
          top: this.topOffset,
          left: this.leftOffset,
        }}
      >
        <slot></slot>
      </div>
    )
  }
}
