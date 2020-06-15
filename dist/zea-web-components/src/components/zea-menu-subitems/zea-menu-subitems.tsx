import { Component, h, Prop, Listen, Element, Watch } from '@stencil/core'

@Component({
  tag: 'zea-menu-subitems',
  styleUrl: 'zea-menu-subitems.css',
  shadow: true,
})

/**
 * Main component class
 */
export class ZeaMenuSubitems {
  subitemsElement: HTMLElement
  subitemsArray = []

  @Element() hostElement: HTMLElement

  /**
   * Whether it is/should be shown
   */
  @Prop() shown: boolean = false

  /**
   * Menu type
   */
  @Prop() type: string = ''

  /**
   * The item this subitems belongs to
   */
  @Prop() parentItem: any

  /**
   * Whether the children should have checkboxes and behave as a radio button
   */
  @Prop() radioSelect: boolean = false

  /**
   * The root menu this item belongs to
   */
  @Prop() rootMenu: HTMLElement

  /**
   * zeaMenuItemClickHandler
   * @param {any} e the event data
   */
  @Listen('zeaMenuItemClick', { target: 'window' })
  windowClickHandler(e) {
    const clickedItem = e.detail
    const itemIsDescendant = this.isDescendant(this.hostElement, clickedItem)
    if (clickedItem == this.parentItem) {
      this.shown = !this.shown
    } else {
      if (!itemIsDescendant || !clickedItem.hasSubitems) {
        this.shown = false
      }
    }
  }

  /**
   * zeaMenuItemClickHandler
   * @param {any} e the event data
   */
  @Listen('zeaMenuItemPressed', { target: 'window' })
  windowItemPressHandler(e) {
    const clickedItem = e.detail
    const itemIsDescendant = this.isDescendant(this.hostElement, clickedItem)

    if (this.radioSelect && itemIsDescendant) {
      this.subitemsArray.forEach(element => {
        element.checked = false
      })
    }
  }

  /**
   * Listen to click (mouse up) events on the whole window
   * @param {any} ev the event
   */
  @Listen('mouseup', { target: 'window' })
  handleWindowMouseup(ev) {
    if (!this.isDescendant(this.rootMenu, ev.target)) {
      this.shown = false
    }
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
   * Called everytime the component renders
   * Apply the class to children
   */
  componentDidRender() {
    // this.setupChildren()
  }

  /**
   * Called everytime the component renders
   */
  @Watch('rootMenu')
  watchHandler() {
    this.setupChildren()
  }

  /**
   * Run some setup for the children items
   */
  setupChildren() {
    this.subitemsElement
      .querySelector('slot')
      .assignedElements()
      .forEach((element: any) => {
        if ('itemParent' in element) {
          element.itemParent = this.hostElement
        }
        if ('rootMenu' in element) {
          element.rootMenu = this.rootMenu
        }
        if (this.radioSelect) {
          element.hasCheckbox = true
        }
        this.subitemsArray.push(element)
      })
  }

  /**
   * Render function
   * @return {JSX}
   */
  render() {
    return (
      <div
        class={`zea-menu-subitems ${this.type} ${this.shown ? 'shown' : ''} `}
      >
        <div class="arrow">
          <svg
            class="branch-arrow-icon"
            xmlns="http://www.w3.org/2000/svg"
            height="13"
            viewBox="0 0 24 24"
            width="13"
          >
            <path d="M8 5v14l11-7z" class="fgpath" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </div>
        <div
          class="subitems"
          ref={el => (this.subitemsElement = el as HTMLElement)}
        >
          <slot></slot>
        </div>
      </div>
    )
  }
}
