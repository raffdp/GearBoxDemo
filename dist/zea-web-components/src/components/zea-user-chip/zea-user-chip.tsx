import { Component, h, Prop, Event, EventEmitter, Listen } from '@stencil/core'

@Component({
  tag: 'zea-user-chip',
  styleUrl: 'zea-user-chip.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaUserChip {
  chipElement: HTMLElement
  tooltipElement: HTMLElement

  /**
   * Whether the chip is for the current user session
   */
  @Prop() isCurrentUser: boolean = false

  /**
   * Whether the chip is currently active
   */
  @Prop() isActive: boolean = false

  /**
   * Whether avatar images should be shown or not
   */
  @Prop() showImages: boolean = true

  /**
   * User object containing avatar url, firstName, lastName and others
   */
  @Prop() userData: any

  /**
   * The density of the chip (large|normal|small|tiny)
   */
  @Prop() density: string = 'normal'

  /**
   * Whether the tooltip should be shown
   */
  @Prop() showTooltip: boolean = true

  /**
   * Whether to ever show the profile card
   */
  @Prop() showProfileCard: boolean = true

  /**
   * Whether the profile card is currently shown
   */
  @Prop() profileCardShown: boolean = false

  /**
   * Alignment of the profile card (right|left)
   */
  @Prop() profileCardAlign: string = 'left'

  /**
   * The zea user card element contined in this chip
   */
  profileCardElement: HTMLElement

  /**
   * Used as background color for the chip
   */
  randomColor: string = '#000000'.replace(/0/g, () => {
    // limit the random number range so that colors
    // are not too dark nor too bright
    // eslint-disable-next-line no-bitwise
    return (~~(5 + Math.random() * 7)).toString(16)
  })

  /**
   * Event to emit when user chip gets clicked
   */
  @Event({
    eventName: 'zeaUserClicked',
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  zeaUserClicked: EventEmitter

  /**
   * Listen to click events on the whole document
   * @param {any} e The event
   */
  @Listen('click', { target: 'document', capture: true })
  handleClick(e) {
    if (e.composedPath().includes(this.chipElement)) {
      if (!e.composedPath().includes(this.profileCardElement)) {
        this.profileCardShown = !this.profileCardShown
      }
    } else {
      this.profileCardShown = false
    }
  }

  /**
   * Handle click on user chip: emit custom zeaUserClicked event
   * @param {any} userData the userData
   */
  onChipClick() {
    this.zeaUserClicked.emit(this.userData)
  }

  /**
   * On avatar over, fix tooltip position when its out of the screen
   */
  onAvatarOver() {
    this.fixTooltipPosition()
  }

  /**
   * On component render, fix tooltip position when its out of the screen
   */
  componentDidRender() {
    this.fixTooltipPosition()
  }

  /**
   * Fix the tooltip position if it goes out of screen
   */
  fixTooltipPosition() {
    if (!this.tooltipElement) return
    const bbox = this.tooltipElement.getBoundingClientRect()
    if (bbox.x + bbox.width > window.innerWidth) {
      this.tooltipElement.classList.add('bleeded-right')
    } else {
      this.tooltipElement.classList.remove('bleeded-right')
    }

    if (bbox.x < 0) {
      this.tooltipElement.classList.add('bleeded-left')
    } else {
      this.tooltipElement.classList.remove('bleeded-left')
    }
  }

  /**
   * Main render function
   * @return {JSX} The generated html
   */
  render() {
    if (!this.userData) return <span class="empty-user-chip"></span>

    // Ensure that the zea-user-chip is compatible with a variety of userData values.
    const firstName: string =
      this.userData.firstName || this.userData.given_name
    const lastName: string = this.userData.lastName || this.userData.family_name
    const avatar: string = this.userData.avatar || this.userData.picture
    let initials: string = ''
    let backgroundColor: string = this.userData.color

    {
      let firstLetter: string = ''
      let secondLetter: string = ''
      if (firstName) {
        firstLetter = firstName.charAt(0)
      }
      if (lastName) {
        secondLetter = lastName.charAt(0)
      } else if (firstLetter) {
        // if no last name but it does have a firstName,
        // use the firstName's second letter
        secondLetter = firstName.charAt(1)
      }
      initials = String(firstLetter + secondLetter).toUpperCase()
    }

    if (!backgroundColor) {
      backgroundColor = this.randomColor
      this.userData.color = this.randomColor
    }

    const containerClass = { active: this.isActive, 'zea-chip': true }

    containerClass[this.density] = true

    return (
      <div
        ref={(el) => (this.chipElement = el as HTMLElement)}
        class={containerClass}
        onClick={this.onChipClick.bind(this)}
      >
        <div
          class="zea-chip-avatar"
          onMouseOver={this.onAvatarOver.bind(this)}
          style={{
            backgroundColor: backgroundColor,
          }}
        >
          <span>{initials}</span>
          {this.showImages && !!avatar && (
            <div
              class="avatar-image"
              style={{
                backgroundImage: `url(${avatar})`,
              }}
            ></div>
          )}
        </div>

        {this.showTooltip && !this.profileCardShown && (
          <div
            ref={(el) => (this.tooltipElement = el as HTMLElement)}
            class="tooltip"
          >{`${firstName} ${lastName ? lastName : ''}`}</div>
        )}

        {this.showProfileCard && (
          <zea-user-card
            collapsible={true}
            isCurrentUser={this.isCurrentUser}
            ref={(el) => (this.profileCardElement = el as HTMLElement)}
            class={`align-${this.profileCardAlign}`}
            style={{ display: this.profileCardShown ? 'block' : 'none' }}
            userData={this.userData}
          ></zea-user-card>
        )}
      </div>
    )
  }
}
