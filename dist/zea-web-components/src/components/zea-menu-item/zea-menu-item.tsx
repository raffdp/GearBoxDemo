import {
  Component,
  h,
  Prop,
  Element,
  Listen,
  Event,
  EventEmitter,
  Watch,
} from '@stencil/core'

@Component({
  tag: 'zea-menu-item',
  styleUrl: 'zea-menu-item.css',
  shadow: true,
})

/**
 * Main component class
 */
export class ZeaMenuItem {
  @Prop() switch: boolean = false

  @Prop() active: boolean = false

  @Prop() hasCheckbox: boolean = false

  @Prop() checked: boolean = false

  @Prop() callback: any

  @Element() hostElement: HTMLElement

  @Prop() shown: boolean = false

  @Prop() allowHover: boolean = false

  @Prop() hotkey: string = ''

  @Prop() type: string = ''

  @Prop() hasSubitems: boolean = false

  @Prop() rootMenu: HTMLElement

  outerWrap: HTMLElement
  itemParent: HTMLElement
  checkboxElement: any
  subitemsElement: any
  container

  /**
   * Event to emit when an item gets clicked
   */
  @Event({
    eventName: 'zeaMenuItemClick',
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  zeaMenuItemClick: EventEmitter

  /**
   * Event to emit when an item gets clicked
   */
  @Event({
    eventName: 'zeaMenuItemPressed',
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  zeaMenuItemPressed: EventEmitter

  /**
   * Listen to the event emitted when any item is clicked
   * @param {any} e the event data
   */
  @Listen('zeaMenuItemClick', { target: 'window' })
  windowClickHandler(e) {
    this.active = false
    e.detail.active = true
    /* if (this.isDescendant(this.subitemsElement, e.detail)) {
      this.active = true
    } */

    if (!e.detail.hasSubitems && this.type != 'toolbar') {
      this.active = false
    }
  }

  /**
   * Listen to click (mouse up) events on the whole window
   * and make sure the item is deactivated if the click was
   * on an external element
   * @param {any} ev the event
   */
  @Listen('mouseup', { target: 'window' })
  handleWindowMouseup(ev) {
    if (
      !this.isDescendant(this.rootMenu, ev.target) &&
      this.type != 'toolbar'
    ) {
      this.active = false
    }
  }

  /**
   * Check if an element is child of another
   * @param {any} parent the parent
   * @param {any} child the child
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
    this.container
      .querySelector('slot')
      .assignedElements()
      .forEach((element: any) => {
        if (element.tagName == 'ZEA-MENU-SUBITEMS') {
          this.hasSubitems = true
          this.subitemsElement = element
          this.subitemsElement.rootMenu = this.rootMenu
          this.subitemsElement.parentItem = this.hostElement
          this.subitemsElement.type = this.hostElement.parentElement['type']

          this.outerWrap.appendChild(this.subitemsElement)
          this.container.classList.add('has-subitems')

          if (this.hostElement.parentElement.tagName == 'ZEA-MENU') {
            this.subitemsElement.belongsToRoot = true
          }
        }
      })
  }

  /**
   * Handle click/tap
   * @param {any} e The event
   */
  handleItemClick(e) {
    this.zeaMenuItemClick.emit(this.hostElement)

    /* const zeaSwitch = this.container.querySelector('ZEA-SWITCH')
    if (zeaSwitch && (!e.target || e.target.tagName != 'ZEA-SWITCH'))
      zeaSwitch.checked = !zeaSwitch.checked */

    /* if (
      this.checkboxElement &&
      (!e.target || e.target.tagName != 'ZEA-CHECKBOX')
    )
      this.checked = !this.checked */

    this.active = true

    this.runCallback(e)
  }

  /**
   * Handle Mouse down
   * @param {any} e The event
   */
  handleItemMouseDown() {
    this.container.classList.add('pressed')
    this.zeaMenuItemPressed.emit(this.hostElement)
    this.checked = !this.checked
  }

  /**
   * Handle mouse up
   * @param {any} e The event
   */
  handleItemMouseUp(e) {
    this.container.classList.remove('pressed')
    this.handleItemClick(e)
    if (!this.hasSubitems && this.type != 'toolbar') {
      this.active = false
    }
  }

  /**
   * Run the item's callback
   * @param {any} payLoad The data to pass to the callback
   */
  runCallback(payLoad) {
    if (this.callback) {
      if (typeof this.callback == 'string') {
        eval(this.callback)
      } else {
        this.callback(payLoad)
      }
    }
  }

  /**
   * Listen for keyboard shortcuts
   * @param {any} e the event
   */
  @Listen('keydown', { target: 'document' })
  keydownHandler(e) {
    if (e.target instanceof HTMLInputElement) return

    const keys = []

    if (e.shiftKey) keys.push('shift')
    if (e.altKey) keys.push('alt')
    if (e.metaKey) keys.push('ctrl')
    if (e.ctrlKey) keys.push('ctrl')

    if (
      e.key != 'Alt' &&
      e.key != 'Control' &&
      e.key != 'Ctrl' &&
      e.key != 'Shift'
    ) {
      keys.push(e.key)
    }

    const comboString = keys.join('+').toLowerCase()

    if (comboString == this.hotkey.toLowerCase()) {
      this.handleItemClick(new MouseEvent('click'))
    }

    e.preventDefault()
  }

  /**
   * Generate markup for keyboard shortcut
   * @param {any} action the action
   * @return {array} the html elements
   */
  keyComboAsHtml() {
    const hotkeyParts = this.hotkey.split('+')
    const elements = []

    hotkeyParts.forEach((part) => {
      part = part.toLowerCase()
      if (part == 'ctrl') {
        elements.push(<span class="keyboard-key">Ctrl</span>)
        elements.push('+')
      } else if (part == 'alt') {
        elements.push(<span class="keyboard-key">Alt</span>)
        elements.push('+')
      } else if (part == 'shift') {
        elements.push(<span class="keyboard-key">Shift</span>)
        elements.push('+')
      } else {
        elements.push(<span class="keyboard-key">{part}</span>)
      }
    })

    return elements
  }

  /**
   * Render function
   * @return {JSX}
   */
  render() {
    return (
      <div
        ref={(el) => (this.container = el as HTMLElement)}
        class={`zea-menu-item ${this.type} ${this.active ? 'active' : ''} ${
          this.allowHover ? 'allow-hover' : ''
        }`}
      >
        <div
          class="outer-wrap"
          ref={(el) => (this.outerWrap = el as HTMLElement)}
        >
          <div
            class="inner-wrap"
            onMouseDown={this.handleItemMouseDown.bind(this)}
            onMouseUp={this.handleItemMouseUp.bind(this)}
          >
            {this.hasCheckbox ? (
              <zea-checkbox
                checked={this.checked}
                ref={(el) => (this.checkboxElement = el)}
              ></zea-checkbox>
            ) : null}
            <slot></slot>
            {this.switch ? (
              <zea-switch checked={this.checked}></zea-switch>
            ) : null}
            {this.hotkey ? (
              <span class="hotkey">{this.keyComboAsHtml()}</span>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}
