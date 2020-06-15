import {
  Component,
  h,
  Prop,
  Listen,
  Event,
  EventEmitter,
  Element,
} from '@stencil/core'

@Component({
  tag: 'zea-app-shell',
  styleUrl: 'zea-app-shell.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaAppShell {
  @Element() hostElement

  /**
   */
  @Prop() logoUrl: string =
    'https://storage.googleapis.com/misc-assets/zea-logo.png'

  /**
   */
  @Prop() userData: any = {}

  /**
   */
  @Prop() session: any = {}

  /**
   */
  @Prop() leftPanelWidth: string = '200'
  @Prop() rightPanelWidth: string = '200'

  /**
   */
  @Prop() leftProgressMessage: string = ''
  @Prop() centerProgressMessage: string = ''
  @Prop() rightProgressMessage: string = ''

  /**
   */
  @Prop() centerProgressBar: any
  @Prop() leftProgressBar: any
  @Prop() rightProgressBar: any

  /**
   */
  registerDialog
  registerForm
  shareDialog

  /**
   */
  @Event() userAuthenticated: EventEmitter

  /**
   */
  @Listen('userRegistered')
  userRegisteredHandler(event: any) {
    this.userData = event.detail
    this.userData.id = Math.random().toString(36).slice(2, 12)
    localStorage.setItem('zea-user-data', JSON.stringify(this.userData))
    this.registerDialog.shown = false
    this.userAuthenticated.emit(this.userData)
  }

  /**
   */
  componentWillLoad() {
    const storedUserData = localStorage.getItem('zea-user-data')
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData)
    }
  }

  /**
   */
  componentDidLoad() {
    if ('id' in this.userData) {
      this.userAuthenticated.emit(this.userData)
    } else {
      this.registerDialog.shown = true
    }
  }

  /**
   */
  onShareIconClick() {
    this.shareDialog.shown = true
  }

  /**
   * Main render function
   *
   * @return {JSX} The generated html
   */
  render() {
    return [
      <zea-layout
        orientation="vertical"
        cell-a-size="40"
        cell-c-size="0"
        resize-cell-a="false"
        resize-cell-c="false"
        show-borders="false"
      >
        <header slot="a">
          <zea-navigation-drawer id="navigation-drawer">
            <zea-menu-item
              onClick={this.onShareIconClick.bind(this)}
              type="standalone"
            >
              <zea-icon name="link-outline"></zea-icon>
              Share
            </zea-menu-item>
            <slot name="nav-drawer"></slot>
          </zea-navigation-drawer>

          <div
            id="brand"
            style={{ backgroundImage: `url(${this.logoUrl})` }}
          ></div>

          <zea-user-chip-set
            id="users-container"
            session={this.session}
          ></zea-user-chip-set>

          <div id="tools-container">
            <div id="main-search">
              <zea-input-search></zea-input-search>
            </div>
          </div>

          <zea-user-chip
            userData={this.userData}
            id="current-user"
            profile-card-align="right"
            is-current-user="true"
          ></zea-user-chip>
        </header>

        <zea-layout
          slot="b"
          cell-a-size={this.leftPanelWidth}
          cell-c-size={this.rightPanelWidth}
        >
          <div slot="a" id="left-panel-container">
            {this.leftProgressMessage && (
              <zea-panel-progress-bar ref={(el) => (this.leftProgressBar = el)}>
                {this.leftProgressMessage}
              </zea-panel-progress-bar>
            )}
            <slot name="left-panel"></slot>
          </div>
          <div slot="b" id="center-panel-container">
            {this.centerProgressMessage && (
              <zea-panel-progress-bar
                ref={(el) => (this.centerProgressBar = el)}
              >
                {this.centerProgressMessage}
              </zea-panel-progress-bar>
            )}
            <slot name="center-panel"></slot>
          </div>
          <div slot="c" id="right-panel-container">
            {this.rightProgressMessage && (
              <zea-panel-progress-bar
                ref={(el) => (this.rightProgressBar = el)}
              >
                {this.rightProgressMessage}
              </zea-panel-progress-bar>
            )}
            <slot name="right-panel"></slot>
          </div>
        </zea-layout>
      </zea-layout>,

      <zea-dialog-profile
        allowClose={false}
        ref={(el) => (this.registerDialog = el)}
      ></zea-dialog-profile>,

      <zea-dialog-share
        ref={(el) => (this.shareDialog = el)}
      ></zea-dialog-share>,
    ]
  }
}
