import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-user-card',
  styleUrl: 'zea-user-card.css',
  shadow: true,
})

/**
 */
export class ZeaUserCard {
  /**
   */
  @Prop() userData: any

  /**
   * Whether the card is for the current user session
   */
  @Prop() isCurrentUser: boolean = false

  /**
   * Whether to show the collpase control for additional data
   */
  @Prop() collapsible: boolean = true

  /**
   * Whether additional data is currently shown
   */
  @Prop() additionalDataShown: boolean

  /**
   * Density and size of elements
   */
  @Prop() density: string = 'normal'

  profileDialog: any

  /**
   * Initialize the shown state of additional data
   * according to whether collapsing is allowed or not
   */
  componentWillLoad() {
    this.additionalDataShown = !this.collapsible
  }

  /**
   * Show the profile editor form
   */
  onProfileLinkClick() {
    this.profileDialog.shown = true
  }

  /**
   * Main render function
   * @return {JSX} The generated html
   */
  render() {
    const firstName: string =
      this.userData.firstName || this.userData.given_name
    const lastName: string = this.userData.lastName || this.userData.family_name
    const company: string = this.userData.company
    const phone: string = this.userData.phone
    const email: string = this.userData.email

    return (
      <div class={`zea-user-card ${this.density}`}>
        <div class="user-chip-container">
          <zea-user-chip
            showProfileCard={false}
            showTooltip={false}
            userData={this.userData}
            density={this.density == 'normal' ? 'large' : this.density}
          ></zea-user-chip>
        </div>
        <div class="user-info">
          <div class="user-name">
            {firstName} {lastName}
          </div>
          <div class="user-company">{company}</div>
          {this.isCurrentUser && (
            <div
              onClick={this.onProfileLinkClick.bind(this)}
              class="profile-link"
            >
              My Profile
            </div>
          )}
        </div>
        {!this.isCurrentUser && (
          <div class="user-focuser-container">
            <div class="user-focuser">
              <zea-icon type="zea" name="find-user" size={28}></zea-icon>
            </div>
          </div>
        )}
        {!this.isCurrentUser && this.collapsible && (phone || email) && (
          <div
            class="additional-data-collapser"
            onClick={() =>
              (this.additionalDataShown = !this.additionalDataShown)
            }
          >
            <span class="collapser-label">
              {this.additionalDataShown ? 'Less' : 'More'}
            </span>
            <span class="collapser-icon">
              <zea-icon
                name={
                  this.additionalDataShown
                    ? 'chevron-up-outline'
                    : 'chevron-down-outline'
                }
                size={14}
              ></zea-icon>
            </span>
          </div>
        )}
        {!this.isCurrentUser && (phone || email) && (
          <div
            class={{
              'additional-data': true,
              shown: this.additionalDataShown,
            }}
          >
            {phone && (
              <div class="user-phone">
                <zea-icon name="phone-portrait-outline"></zea-icon>
                <span>{phone}</span>
              </div>
            )}
            {email && (
              <div class="user-email">
                <zea-icon name="mail-outline"></zea-icon>
                <span>{email}</span>
              </div>
            )}
            {/* <div class="full-profile-button">
              <zea-button variant="outlined">FULL PROFILE</zea-button>
            </div> */}
          </div>
        )}
        {this.isCurrentUser && (
          <zea-dialog-profile
            ref={(el) => (this.profileDialog = el)}
            userData={this.userData}
          ></zea-dialog-profile>
        )}
      </div>
    )
  }
}
