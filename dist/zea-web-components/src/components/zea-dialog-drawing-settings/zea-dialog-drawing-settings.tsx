import { Component, h, Prop, Listen } from '@stencil/core'

@Component({
  tag: 'zea-dialog-drawing-settings',
  styleUrl: 'zea-dialog-drawing-settings.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaDialogDrawingSettings {
  /**
   */
  @Prop() allowClose: boolean = true

  /**
   */
  @Prop() shown: boolean = false

  /**
   */
  @Prop() showLabels: boolean = true

  /**
   */
  @Prop() userData: any

  /**
   */
  @Listen('dialogClose')
  todoCompletedHandler() {
    this.shown = false
  }

  /**
   * Main render function
   * @return {JSX} The generated html
   */
  render() {
    return (
      <div class="zea-dialog-pdf-drawing-settings">
        <zea-dialog
          allowClose={this.allowClose}
          showBackdrop={true}
          shown={this.shown}
          addPadding={false}
        >
          <div slot="body" id="tabs-container">
            <zea-tabs orientation="horizontal" density="small">
              <div slot="tab-bar">Drawing Disciplines</div>
              <zea-form-disciplines-settings></zea-form-disciplines-settings>
              <div slot="tab-bar">Measurements</div>
              <zea-form-measurements-settings></zea-form-measurements-settings>
            </zea-tabs>
          </div>
        </zea-dialog>
      </div>
    )
  }
}
