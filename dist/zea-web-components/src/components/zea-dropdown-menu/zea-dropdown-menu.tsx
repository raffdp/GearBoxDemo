import { Component, h, Prop, State, Listen } from '@stencil/core'

@Component({
  tag: 'zea-dropdown-menu',
  styleUrl: 'zea-dropdown-menu.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaDropdownMenu {
  hotkeysToActions = {}

  /**
   * The application data
   * TODO: pass actionRegistry only instead of whole appData
   */
  @Prop() appData: any

  /**
   * List of actions returned by the actionRegistry
   */
  @State() actions: Array<any>

  /**
   * Tree representation of the items and actions
   * based on path arrays
   */
  @State() menuItems: any = { children: {} }

  /**
   * Runs once when component first loads
   */
  componentDidLoad() {
    // subscribe to the actionAdded signal
    // Note: the action registry is deprecated.
    if (this.appData && this.appData.actionRegistry) {
      this.appData.actionRegistry.on('actionAdded', () => {
        this.makeMenuTree()
      })
    }

    this.makeMenuTree()
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

    if (comboString in this.hotkeysToActions) {
      const action = this.hotkeysToActions[comboString]
      action.callback(e)
    }

    e.preventDefault()
  }

  /**
   * Make a hierarchical representation out of
   * the path arrays in the action list
   */
  makeMenuTree() {
    this.actions = this.appData.actionRegistry.getActions()

    this.actions.forEach((action) => {
      const currentItem = this.getMenuTreeItem(action.path)
      currentItem['children'][action.name] = action
    })

    this.feedHotKeys()
  }

  /**
   * Feed the list of hotkeys
   */
  feedHotKeys() {
    this.actions.forEach((action) => {
      const hotkey = this.keyComboAsText(action)
      if (hotkey) this.hotkeysToActions[hotkey] = action
    })
  }

  /**
   * Get a specific tree location using an action's path
   * @param {any} path the path
   * @return {any} item
   */
  getMenuTreeItem(path) {
    // here menuItems is modified by reference
    let currentItem = this.menuItems
    path.forEach((pathPart) => {
      if (!(pathPart in currentItem.children)) {
        currentItem.children[pathPart] = { children: {} }
      }
      // the reference runs deep
      currentItem = currentItem.children[pathPart]
    })
    return currentItem
  }

  /**
   * Generate markup for a branch with children
   * @param {any} key the key
   * @param {any} item the item
   * @return {JSX} the ul
   */
  makeBranch(key, item) {
    return (
      <li key={key}>
        <span class="branch-label">
          <span class="branch-name">{key}</span>
          <span class="branch-arrow">{this.getBranchArrow()}</span>
        </span>
        <ul>{this.makeBranchItems(item)}</ul>
      </li>
    )
  }

  /**
   * Generate markup for the children of a branch
   * @param {any} item the item
   * @return {JSX} the ul
   */
  makeBranchItems(item) {
    const items = []

    Object.keys(item.children).forEach((key) => {
      const currentItem = item.children[key]

      if ('children' in currentItem) {
        items.push(this.makeBranch(key, currentItem))
      } else {
        items.push(this.makeLeaf(key, currentItem))
      }
    })

    return items
  }

  /**
   * Generate markup for a leaf item, with an anchor
   * and no children
   * @param {any} key the key
   * @param {any} action the action
   * @return {JSX} the ul
   */
  makeLeaf(key, action) {
    return (
      <li
        key={key}
        onClick={(e) => {
          this.hadleLeafClick(e, action)
        }}
      >
        <span class="leaf-label">
          <span class="action-name">{action.name}</span>
          <span class="keyboard-shortcut">{this.keyComboAsHtml(action)}</span>
        </span>
      </li>
    )
  }

  /**
   * Handle click events on leafs
   * @param {any} event the event
   * @param {any} action the action
   */
  hadleLeafClick(event, action) {
    if ('callback' in action) {
      action.callback()
    }

    this.flashItem(event.currentTarget)
  }

  /**
   * Rapidly change items bg color to indicate it was clicked
   * @param {any} target the clicked li item
   */
  flashItem(target) {
    target.classList.toggle('flashed')

    const interval = setInterval(() => {
      target.classList.toggle('flashed')
    }, 80)

    setTimeout(() => {
      clearInterval(interval)
      target.classList.remove('flashed')
    }, 100)
  }

  /**
   * Generate markup for keyboard shortcut
   * @param {any} action the action
   * @return {array} the html elements
   */
  keyComboAsHtml(action) {
    const { metaKeys, key } = action
    const elements = []

    if (!key && !metaKeys) {
      return null
    }

    if (metaKeys.control) {
      elements.push(<span class="keyboard-key">Ctrl</span>)
      elements.push('+')
    }

    if (metaKeys.alt) {
      elements.push(<span class="keyboard-key">Alt</span>)
      elements.push('+')
    }

    if (metaKeys.shift) {
      elements.push(<span class="keyboard-key">Shift</span>)
      elements.push('+')
    }

    elements.push(<span class="keyboard-key">{key}</span>)

    return elements
  }

  /**
   * Generate markup for keyboard shortcut
   * @param {any} action the action
   * @return {string} the html elements
   */
  keyComboAsText(action) {
    const { metaKeys, key } = action
    const elements = []

    if (!key && !metaKeys) {
      return ''
    }

    if (metaKeys) {
      if (metaKeys.shift) elements.push('shift')
      if (metaKeys.alt) elements.push('alt')
      if (metaKeys.control) elements.push('ctrl')
    }

    elements.push(key)

    return elements.join('+').toLowerCase()
  }

  /**
   * Get arrow icon svg for branch
   * @return {JSX} the arrow svg
   */
  getBranchArrow() {
    return (
      <svg
        class="branch-arrow-icon"
        xmlns="http://www.w3.org/2000/svg"
        height="16"
        viewBox="0 0 24 24"
        width="16"
      >
        <path d="M8 5v14l11-7z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    )
  }

  /**
   * Main render method for the component
   * @return {JSX} The generated markup
   */
  render() {
    return (
      <div class="zea-dropdown-menu">
        <ul class="menu-root">{this.makeBranchItems(this.menuItems)}</ul>
      </div>
    )
  }
}
