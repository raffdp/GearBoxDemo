import {
  Component,
  h,
  Prop,
  Method,
  Event,
  EventEmitter,
  Element,
} from '@stencil/core'

@Component({
  tag: 'zea-dialog',
  styleUrl: 'zea-dialog.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaDialog {
  @Prop() shown: boolean = false

  @Prop() width: string = 'auto'

  @Prop() allowClose: boolean = true

  @Prop() showBackdrop: boolean = true

  @Prop() addPadding: boolean = true

  @Element() hostElement

  dialogContainer: HTMLElement

  @Event({
    eventName: 'dialogClose',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  dialogClose: EventEmitter

  /**
   */
  @Method()
  async prompt() {
    this.shown = true
  }

  /**
   */
  onBackdropClick() {
    if (this.allowClose) {
      this.shown = false
      this.dialogClose.emit(this.hostElement)
    }
  }

  /**
   */
  resetSize() {
    if (!this.dialogContainer) return

    if (this.width) {
      this.dialogContainer.style.width = this.width
    } else {
      this.dialogContainer.style.width = `fit-content`
    }

    this.dialogContainer.style.height = `fit-content`

    if (this.dialogContainer.offsetHeight) {
      this.dialogContainer.style.height = `${this.dialogContainer.offsetHeight}px`
    }

    if (this.dialogContainer.offsetWidth) {
      this.dialogContainer.style.width = `${this.dialogContainer.offsetWidth}px`
    }
  }

  /**
   */
  componentDidRender() {
    this.resetSize()
  }

  /**
   */
  componentWillLoad() {
    window.addEventListener('resize', () => {
      this.resetSize()
    })
  }

  /**
   */
  setupContainer(el) {
    if (this.dialogContainer) return
    this.dialogContainer = el
    this.dialogContainer.addEventListener('dialogResize', () => {
      this.resetSize()
    })
  }

  /**
   * Main render function
   * @return {JSX} the generated html
   */
  render() {
    return (
      <div
        class={{
          'zea-dialog': true,
          shown: this.shown,
          'with-padding': this.addPadding,
        }}
      >
        {this.showBackdrop && (
          <div class="backdrop" onClick={this.onBackdropClick.bind(this)}></div>
        )}
        <div class="zea-dialog-container" ref={(el) => this.setupContainer(el)}>
          <div class="zea-dialog-title">
            <slot name="title"></slot>
          </div>
          <div class="zea-dialog-body">
            <slot name="body"></slot>
          </div>
          <div class="zea-dialog-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    )
  }
}
