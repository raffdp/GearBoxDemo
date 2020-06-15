import { Component, h, Prop, State, Listen, Element } from '@stencil/core'

@Component({
  tag: 'zea-layout',
  styleUrl: 'zea-layout.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaLayout {
  cellA: HTMLElement
  cellB: HTMLElement
  cellC: HTMLElement

  @Element() mainElement: HTMLElement

  @Prop() cellCount: number = 3

  @Prop() orientation: string = 'horizontal'

  @Prop() resizeCellA: boolean = true

  @Prop() resizeCellC: boolean = true

  @Prop() cellASize: number = 100

  @Prop() cellCSize: number = 100

  @Prop() resizeInterval: number = 50

  @Prop() showBorders: boolean = true

  @State() error: string = ''

  @State() prevOffset: number

  @State() minimumGap = 20

  @State() maximunGap = 50

  @State() activeHandle: any

  layoutContainer: HTMLElement

  /**
   * Listen for dragstart events
   * @param {any} event The event
   */
  onHandleMouseDown(event) {
    this.activeHandle = event.target
    document.getElementsByTagName('body')[0].style.cursor =
      this.orientation === 'vertical' ? 'row-resize' : 'col-resize'
    document.getElementsByTagName('body')[0].style.userSelect = 'none'
  }

  /**
   * Listen for dragstart events
   * @param {any} event The event
   */
  @Listen('mouseup', { target: 'document' })
  onHandleMouseUp() {
    this.activeHandle = null
    document.getElementsByTagName('body')[0].style.cursor = 'default'
    document.getElementsByTagName('body')[0].style.userSelect = 'initial'
  }

  /**
   * Listen to mousemove event
   * @param {any} event the event
   */
  @Listen('mousemove', { target: 'document' })
  mouseMoveHandler(event) {
    if (this.activeHandle) {
      const isA = this.activeHandle.classList.contains('zea-handle-a')

      if (this.orientation === 'vertical') {
        if (isA) {
          this.processDrag(event, 'Y', 'a')
        } else {
          this.processDrag(event, 'Y', 'c')
        }
      } else {
        if (isA) {
          this.processDrag(event, 'X', 'a')
        } else {
          this.processDrag(event, 'X', 'c')
        }
      }
    }
  }

  /**
   * Process drag
   * @param {any} event The event
   * @param {any} axis The axis
   * @param {any} cell The cell
   */
  processDrag(event, axis, cell) {
    const handle = this.activeHandle
    const parent = handle.parentElement
    const parentRect = parent.getBoundingClientRect()
    const handleRect = handle.getBoundingClientRect()
    const cellBREct = this.cellB.getBoundingClientRect()

    const side = axis == 'X' ? 'left' : 'top'
    const prop = axis == 'X' ? 'width' : 'height'
    const cellBSize = cellBREct[prop]

    let offset = handleRect[side] - event['client' + axis]

    // change offset sign for the following sum, according to cell
    offset = cell == 'a' ? -offset : offset
    let newDimension = parentRect[prop] + offset

    parent.style[prop] = `${newDimension}px`

    if (newDimension < this.minimumGap) {
      newDimension = this.minimumGap
    }

    const maxDimension = parentRect[prop] + cellBSize - this.minimumGap

    if (newDimension > maxDimension) {
      newDimension = maxDimension
    }

    const cellSizeVar = cell == 'a' ? 'cellASize' : 'cellCSize'
    this[cellSizeVar] = newDimension

    parent.style[prop] = `${newDimension}px`

    this.triggerResize(newDimension)
  }

  /**
   * Trigger window resize event
   * @param {any} newDimension The new dimension
   */
  triggerResize(newDimension) {
    window.dispatchEvent(
      new CustomEvent('resize', {
        bubbles: true,
        detail: newDimension,
      })
    )
  }
  /**
   */
  layout() {
    let dimension
    let availableLength

    if (this.orientation === 'vertical') {
      dimension = 'height'
      availableLength = this.layoutContainer.clientHeight
    } else {
      dimension = 'width'
      availableLength = this.layoutContainer.clientWidth
    }

    const cellBSize = availableLength - this.cellASize - this.cellCSize

    this.cellA.style[dimension] = `${this.cellASize}px`
    this.cellB.style[dimension] = `${cellBSize}px`
    this.cellC.style[dimension] = `${this.cellCSize}px`
  }

  /**
   * Prevent the browser drag event from triggering
   * as it hinders the mousemove event
   */
  componentDidLoad() {
    this.mainElement.addEventListener('dragstart', (e) => {
      e.preventDefault()
      e.stopPropagation()
    })

    window.addEventListener('resize', () => {
      this.layout()
    })
  }

  /**
   * Prevent the browser drag event from triggering
   * as it hinders the mousemove event
   */
  componentDidRender() {
    this.layout()
  }

  /**
   * Main render function
   * @return {JSX} the generated html
   */
  render() {
    const cellAStyle: any = {}
    const cellCStyle: any = {}

    if (!this.cellASize) {
      this.resizeCellA = false
    }

    if (!this.cellCSize) {
      this.resizeCellC = false
    }

    if (this.cellASize !== undefined) {
      if (this.orientation === 'vertical') {
        cellAStyle.height = `${this.cellASize}px`
      } else {
        cellAStyle.width = `${this.cellASize}px`
      }
    }

    if (this.cellCSize !== undefined) {
      if (this.orientation === 'vertical') {
        cellCStyle.height = `${this.cellCSize}px`
      } else {
        cellCStyle.width = `${this.cellCSize}px`
      }
    }

    const cellA = (
      <div
        class="zea-layout-cell cell-a"
        style={cellAStyle}
        ref={(el) => (this.cellA = el as HTMLElement)}
      >
        {this.resizeCellA && (
          <div
            class="zea-resize-handle zea-handle-a"
            onMouseDown={this.onHandleMouseDown.bind(this)}
          ></div>
        )}
        <slot name="a"></slot>
      </div>
    )

    const cellB = (
      <div
        class="zea-layout-cell cell-b"
        ref={(el) => (this.cellB = el as HTMLElement)}
      >
        <slot name="b"></slot>
      </div>
    )

    const cellC = this.cellCount > 2 && (
      <div
        class="zea-layout-cell cell-c"
        style={cellCStyle}
        ref={(el) => (this.cellC = el as HTMLElement)}
      >
        {this.resizeCellC && (
          <div
            class="zea-resize-handle zea-handle-c"
            onMouseDown={this.onHandleMouseDown.bind(this)}
          ></div>
        )}
        <slot name="c"></slot>
      </div>
    )

    return (
      <div
        ref={(el) => (this.layoutContainer = el)}
        class={`zea-layout ${this.orientation} ${
          this.showBorders ? 'with-borders' : ''
        }`}
      >
        {this.error || [cellA, cellB, cellC]}
      </div>
    )
  }
}
