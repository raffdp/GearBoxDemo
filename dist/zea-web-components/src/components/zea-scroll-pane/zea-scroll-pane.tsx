import { Component, h, Host, Element, Listen } from '@stencil/core'
import { ResizeObserver } from '@juggle/resize-observer'

@Component({
  tag: 'zea-scroll-pane',
  styleUrl: 'zea-scroll-pane.css',
  shadow: true,
})
/**
 *
 * */
export class ZeaScrollPane {
  scrollPane
  scrollContent
  vScrollBar
  scrollRatio
  scrollDelta
  vMouseDown = false
  vMouseOffet
  vCurrentScroll
  vBarTop
  vBarHeight
  vTrackTop
  vScrollTrack
  @Element() rootElement

  /**
   *
   */
  @Listen('resize', { target: 'window' })
  onResize() {
    this.refreshScrollbar()
  }

  /**
   *
   */
  @Listen('mouseup', { target: 'window' })
  onMouseUp() {
    this.vMouseDown = false
    this.scrollPane.style.userSelect = 'initial'
  }

  prevClientY
  /**
   * @param {any} e The event
   */
  @Listen('mousemove', { target: 'window' })
  onMouseMove(e) {
    if (this.vMouseDown) {
      const mouseDelta = e.clientY - this.prevClientY
      const newScroll =
        (this.vBarTop - this.vTrackTop + mouseDelta) / this.scrollRatio
      this.scrollPane.scrollTop = this.scrollPane.scrollTop + newScroll
      this.prevClientY = e.clientY
    }
  }

  /**
   *
   */
  componentDidLoad() {
    this.refreshScrollbar()

    this.scrollPane.addEventListener('scroll', () => {
      this.vScrollBar.style.top = `${
        this.scrollPane.scrollTop * this.scrollRatio
      }px`
    })

    this.vScrollBar.addEventListener('mousedown', (e) => {
      this.vMouseDown = true
      this.vMouseOffet = e.clientY
      this.vCurrentScroll = this.scrollPane.scrollTop
      const vBarBbox = this.vScrollBar.getBoundingClientRect()
      this.vBarTop = vBarBbox.top
      this.vBarHeight = vBarBbox.height
      this.prevClientY = e.clientY

      const vTrackBbox = this.vScrollBar.getBoundingClientRect()
      this.vTrackTop = vTrackBbox.top

      this.scrollPane.style.userSelect = 'none'
    })

    const ro = new ResizeObserver(() => {
      this.refreshScrollbar()
    })

    ro.observe(this.scrollContent)

    const observer = new MutationObserver((mutations) => {
      console.log(mutations)
      this.refreshScrollbar()
    })

    observer.observe(this.scrollContent, {
      attributes: true,
    })
  }

  /**
   *
   */
  refreshScrollbar() {
    this.scrollRatio =
      Math.ceil(
        (this.rootElement.offsetHeight / this.scrollContent.offsetHeight) * 1000
      ) / 1000

    if (this.scrollRatio < 0.999) {
      this.rootElement.classList.remove('disabled')
      const handleHeight = this.rootElement.offsetHeight * this.scrollRatio
      this.scrollDelta = this.rootElement.offsetHeight - handleHeight
      this.vScrollBar.style.height = `${handleHeight}px`
    } else {
      this.rootElement.classList.add('disabled')
    }
  }

  /**
   *
   */
  render() {
    return (
      <Host>
        <div
          ref={(el) => (this.vScrollTrack = el as HTMLElement)}
          draggable={false}
          class="v-scroll-track"
        ></div>
        <div
          draggable={false}
          class="v-scroll-bar"
          ref={(el) => (this.vScrollBar = el as HTMLElement)}
        ></div>
        <div
          class="zea-scroll-pane"
          ref={(el) => (this.scrollPane = el as HTMLElement)}
        >
          <div
            class="scroll-content"
            ref={(el) => (this.scrollContent = el as HTMLElement)}
          >
            <slot></slot>
          </div>
        </div>
      </Host>
    )
  }
}
