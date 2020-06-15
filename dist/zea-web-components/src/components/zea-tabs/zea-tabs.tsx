import { Component, h, Prop, Listen, Element } from '@stencil/core'

@Component({
  tag: 'zea-tabs',
  styleUrl: 'zea-tabs.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaTabs {
  @Element() mainElement: HTMLElement

  @Prop() orientation: string = 'horizontal'

  @Prop() density: string = 'medium'

  /**
   * Listen to click events
   * @param {any} event The event
   */
  @Listen('click')
  clickHandler(event) {
    if (event.target.getAttribute('slot') == 'tab-bar') {
      let tabIndex = this.getTabIndex(event.target)
      this.showPanelByIndex(tabIndex)
      this.resetActiveTab()
      event.target.classList.add('active')
    }
  }

  /**
   * Show panel by index
   * @param {any} tabIndex The tab index
   */
  showPanelByIndex(tabIndex) {
    const contentSlot: HTMLSlotElement = this.mainElement.shadowRoot.querySelector(
      'slot:not([name])'
    )
    const contentItems = contentSlot.assignedElements()
    const nodes = Array.prototype.slice.call(contentItems)

    for (const i in contentItems) {
      if (contentItems.hasOwnProperty(i)) {
        contentItems[i].classList.remove('active')
      }
    }

    const contentElement = nodes[tabIndex]
    contentElement.classList.add('active')
  }

  /**
   * Get the index of a tab
   * @param {any} tabElement The tab index
   * @return {int} The index of the tab
   */
  getTabIndex(tabElement) {
    const tabsSlot: HTMLSlotElement = this.mainElement.shadowRoot.querySelector(
      'slot[name="tab-bar"]'
    )
    const tabItems = tabsSlot.assignedElements()
    const nodes = Array.prototype.slice.call(tabItems)
    return nodes.indexOf(tabElement)
  }

  /**
   * Show panel by index
   */
  resetActiveTab() {
    const tabsSlot: HTMLSlotElement = this.mainElement.shadowRoot.querySelector(
      'slot[name="tab-bar"]'
    )
    const tabItems = tabsSlot.assignedElements()
    for (const i in tabItems) {
      if (tabItems.hasOwnProperty(i)) {
        tabItems[i].classList.remove('active')
      }
    }
  }

  /**
   * Activate first tab on load
   */
  componentDidLoad() {
    const tabsSlot: HTMLSlotElement = this.mainElement.shadowRoot.querySelector(
      'slot[name="tab-bar"]'
    )
    const firstTab = tabsSlot.assignedElements()[0]
    const evObj = document.createEvent('Events')
    evObj.initEvent('click', true, false)
    firstTab.dispatchEvent(evObj)
  }

  /**
   * Main render function
   * @return {JSX} the generated html
   */
  render() {
    return (
      <div class={`zea-tabs ${this.orientation} ${this.density}`}>
        <div class="zea-tabs-bar">
          <slot name="tab-bar" />
        </div>
        <div class="zea-tabs-content">
          <slot />
        </div>
      </div>
    )
  }
}
