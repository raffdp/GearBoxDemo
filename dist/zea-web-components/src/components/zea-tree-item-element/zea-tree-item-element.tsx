import { Component, h, Prop, State, Watch, Element } from '@stencil/core'
import { Color } from '@zeainc/zea-engine'
import { ParameterValueChange } from '@zeainc/zea-ux'

@Component({
  tag: 'zea-tree-item-element',
  styleUrls: ['zea-tree-item-element.css'],
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaTreeItemElement {
  updateSelectedId: any
  updateVisibilityId: any
  visibilityIcon: any
  updateHighlightId: any
  nameChangedId: BigInteger
  childAddedId: any
  childRemovedId: any

  @Prop() itemContainer: any
  @Prop() label: string = 'Loading...'
  @Prop() isRoot: boolean = false
  @Prop() isTreeItem: boolean = false
  @Prop() isSelected: boolean = false
  @Prop() isVisible: boolean = false
  @Prop() isHighlighted: boolean = false
  @Prop() treeItem: any
  @Prop() appData: any
  @Prop() isExpanded: boolean = false
  @State() childItems: any = []
  @Element() rootElement: HTMLElement

  /**
   * Placeholder comment
   */
  @Watch('treeItem')
  treeItemChanged() {
    if (this.treeItem) {
      this.initTreeItem()
    }
  }

  /**
   * Placeholder comment
   */
  componentWillLoad() {
    if (this.treeItem) {
      this.initTreeItem()
    }
  }

  /**
   * Placeholder comment
   */
  componentDidLoad() {
    if (this.treeItem) {
      this.updateSelected()
      this.updateVisibility()
      this.updateHighlight()

      if (this.childItems.length) this.rootElement.classList.add('has-children')
      else this.rootElement.classList.remove('has-children')

      this.treeItem.titleElement = this.rootElement
    }
  }

  /**
   * Placeholder comment
   */
  initTreeItem() {
    // Name
    this.label = this.treeItem.getName()
    this.nameChangedId = this.treeItem.on('nameChanged', () => {
      this.label = this.treeItem.getName()
    })

    // Selection
    this.updateSelectedId = this.treeItem.on('selectedChanged',
      this.updateSelected.bind(this)
    )

    if (typeof this.treeItem.getChildren === 'function') {
      this.isTreeItem = true
      this.childItems = [...this.treeItem.getChildren()]

      this.childAddedId = this.treeItem.on('childAdded', () => {
        this.childItems = [...this.treeItem.getChildren()]
      })
      this.childRemovedId = this.treeItem.on('childRemoved', () => {
        this.childItems = [...this.treeItem.getChildren()]
      })

      // Visibility
      this.updateVisibilityId = this.treeItem.on('visibilityChanged',
        this.updateVisibility.bind(this)
      )
    } else {
      this.isTreeItem = false
      this.isVisible = true
    }

    // Highlights
    this.updateHighlightId = this.treeItem.on('highlightChanged',
      this.updateHighlight.bind(this)
    )
  }

  /**
   * Placeholder comment
   */
  updateSelected() {
    if (this.treeItem && 'getSelected' in this.treeItem)
      this.isSelected = this.treeItem.getSelected()
  }

  /**
   * Placeholder comment
   */
  updateVisibility() {
    if (this.treeItem && 'getVisible' in this.treeItem) {
      this.isVisible = this.treeItem.getVisible()
    }
  }

  /**
   * Placeholder comment
   */
  updateHighlight() {
    if (this.treeItem && 'isHighlighted' in this.treeItem) {
      this.isHighlighted = this.treeItem.isHighlighted()

      if (this.isHighlighted && 'getHighlight' in this.treeItem) {
        const highlightColor = this.treeItem.getHighlight()
        const bgColor = highlightColor.lerp(new Color(0.75, 0.75, 0.75, 0), 0.5)

        this.itemContainer.style.setProperty(
          '--treeview-highlight-bg-color',
          `${bgColor.toHex()}60` // add transparency
        )

        this.itemContainer.style.setProperty(
          '--treeview-highlight-color',
          highlightColor.toHex()
        )
      }
    }
  }

  /**
   * Placeholder comment
   */
  private toggleChildren() {
    this.isExpanded = !this.isExpanded
  }

  /**
   * Placeholder comment
   */
  onVisibilityToggleClick() {
    const visibleParam = this.treeItem.getParameter('Visible')
    if (this.appData && this.appData.undoRedoManager) {
      const change = new ParameterValueChange(
        visibleParam,
        !visibleParam.getValue()
      )
      this.appData.undoRedoManager.addChange(change)
    } else {
      visibleParam.setValue(!visibleParam.getValue())
    }
  }

  /**
   * Placeholder comment
   * @param {any} e The event object
   */
  onLabelClick(e) {
    if (!this.appData || !this.appData.selectionManager) {
      this.treeItem.setSelected(!this.treeItem.getSelected())
      return
    }
    if (this.appData.selectionManager.pickingModeActive()) {
      this.appData.selectionManager.pick(this.treeItem)
      return
    }
    this.appData.selectionManager.toggleItemSelection(this.treeItem, !e.ctrlKey)
  }

  /**
   * Main render method for the component
   * @return {JSX} The generated markup
   */
  render() {
    return (
      <div
        class={{
          wrap: true,
          'has-children': this.childItems.length,
          selected: this.isSelected,
          visible: this.isVisible,
          highlighted: this.isHighlighted,
          'is-tree-item': this.isTreeItem,
        }}
        style={{ display: 'block' }}
        ref={(el) => (this.itemContainer = el as HTMLElement)}
      >
        <div class="header">
          <div
            class="arrow"
            style={{ display: this.childItems.length > 0 ? 'block' : 'none' }}
            onClick={() => this.toggleChildren()}
          >
            <span>
              {this.isExpanded ? (
                <zea-icon name="caret-down" size={12}></zea-icon>
              ) : (
                <zea-icon name="caret-forward" size={12}></zea-icon>
              )}
            </span>
          </div>
          {this.isTreeItem && (
            <div
              class="toggle"
              onClick={this.onVisibilityToggleClick.bind(this)}
            >
              <zea-icon
                name={this.isVisible ? 'eye-outline' : 'eye-off-outline'}
                ref={(el) => (this.visibilityIcon = el as HTMLElement)}
                size={16}
              ></zea-icon>
            </div>
          )}

          <div
            class="zea-tree-item-label"
            onClick={this.onLabelClick.bind(this)}
          >
            {this.label}
          </div>
        </div>
        {this.isTreeItem && (
          <div
            class="children"
            style={{ display: this.isExpanded ? 'block' : 'none' }}
          >
            {this.isExpanded &&
              this.childItems.map((child) => (
                <zea-tree-item-element
                  treeItem={child}
                  appData={this.appData}
                />
              ))}
          </div>
        )}
      </div>
    )
  }
}
