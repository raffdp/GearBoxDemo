import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-panel-progress-bar',
  styleUrl: 'zea-panel-progress-bar.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaPanelProgressBar {
  /**
   */
  @Prop() progressBar: any

  /**
   * Main render function
   * @return {JSX} The generated html
   */
  render() {
    return (
      <div class="zea-panel-progress-bar">
        <zea-dialog shown={true} allowClose={false} width={'300px'}>
          <div slot="body">
            <slot></slot>
            <zea-progress-bar
              ref={(el) => (this.progressBar = el)}
              type="indeterminate"
            ></zea-progress-bar>
          </div>
        </zea-dialog>
      </div>
    )
  }
}
