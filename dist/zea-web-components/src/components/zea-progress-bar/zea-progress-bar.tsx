import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-progress-bar',
  styleUrl: 'zea-progress-bar.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaProgressBar {
  /**
   * The bar type (determinate | indeterminate)
   */
  @Prop() type: string = 'determinate'

  /**
   * The progress (width) percentage for the bar
   */
  @Prop() percent: any = 50

  /**
   * The size (height) of the progress bar
   */
  @Prop() size: any = 3

  /**
   * The color for the bar
   */
  @Prop() color: any = 'var(--color-primary-1)'

  /**
   * The color for the background track
   */
  @Prop() backgroundColor: any = 'var(--color-primary-3)'

  /**
   * The animation type for the indeterminate bar ( continuous | pulsating)
   */
  @Prop() indeterminateAnimation: any = 'continuous'

  /**
   * Main render method for the component
   * @return {JSX} The generated markup
   */
  render() {
    return (
      <div
        class={`zea-progress-bar ${this.type} ${this.indeterminateAnimation}`}
        style={{
          backgroundColor: this.backgroundColor,
          height: this.size + 'px',
        }}
      >
        <div
          class="progress"
          style={{
            width: this.percent + '%',
            height: this.size + 'px',
            backgroundColor: this.color,
          }}
        ></div>
      </div>
    )
  }
}
