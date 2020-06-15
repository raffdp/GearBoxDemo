import { Component, h, Prop, Listen } from '@stencil/core'

@Component({
  tag: 'zea-dialog-profile',
  styleUrl: 'zea-dialog-profile.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaProfileDialog {
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
   */
  @Listen('userRegistered')
  userRegisteredHandler() {
    console.log('userRegistered')
    this.shown = false
  }

  /**
   * Main render function
   * @return {JSX} The generated html
   */
  render() {
    return (
      <div class="zea-dialog-profile">
        <zea-dialog
          width="320px"
          allowClose={this.allowClose}
          showBackdrop={true}
          shown={this.shown}
          addPadding={false}
        >
          <div slot="body">
            <div class="scrollpane-container">
              <zea-scroll-pane>
                <zea-form-profile
                  userData={this.userData}
                  showLabels={this.showLabels}
                  welcomeHtml="My Profile"
                ></zea-form-profile>
              </zea-scroll-pane>
            </div>
          </div>
        </zea-dialog>
      </div>
    )
  }
}
