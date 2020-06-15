import { Component, h, Prop, State, Watch } from '@stencil/core'

@Component({
  tag: 'zea-user-chip-set',
  styleUrl: 'zea-user-chip-set.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaUserChipSet {
  /**
   * Whether avatar images should be shown or not
   */
  @Prop() showImages: boolean = true

  /**
   * The initial z-index for chip overlapping
   */
  @Prop() initialZIndex: number = 1000

  /**
   * The Zea session
   */
  @Prop() session: any

  /**
   * Number of chips to show before overflow happens
   */
  @Prop() overflowLimit: any = 5

  /**
   * Number of chips to show before overflow happens
   */
  @State() overflowShown: boolean = false

  /**
   * Array of connected users
   */
  @State() userDatas: Array<any>

  /**
   * Object containing entries in the overflow
   */
  @State() shownOverflowEntry: string = null

  /**
   * Watch for changes in the session property
   */
  @Watch('session')
  sessionChanged() {
    this.setupSession()
  }

  /**
   * Called when the component first loads
   */
  componentWillLoad() {
    this.setupSession()
  }

  /**
   * Set up the sesion subscriptions
   */
  setupSession() {
    if (this.session && 'sub' in this.session) {
      // Initialize the data array with any users already in the meeting.
      const userDatas: Array<any> = []

      for (let u in this.session.users) {
        if (this.session.users.hasOwnProperty(u)) {
          userDatas.push(this.session.users[u])
        }
      }

      this.userDatas = userDatas

      // Maintaint the order which users join.
      // New users should be on the left.
      this.session.sub('user-joined', (userData) => {
        if (
          !this.userDatas.find(
            (sessionUserData) => sessionUserData.id == userData.id
          )
        ) {
          this.userDatas = [userData, ...this.userDatas]
        }
      })

      this.session.sub('user-left', (userData) => {
        const index = this.userDatas.findIndex(
          (sessionUserData) => sessionUserData.id == userData.id
        )
        if (index == -1) {
          console.warn('User id not in session:', userData.id)
          return
        }
        const userDatas: Array<object> = [...this.userDatas]
        // Remove the user from our array.
        userDatas.splice(index, 1)
        this.userDatas = userDatas
      })
    } else {
      this.userDatas = []
    }
  }

  /**
   * Activate the current item
   * @param {any} e The event
   */
  onChipClick() {
    // e.currentTarget.isActive = !e.currentTarget.isActive
  }

  /**
   * Render method.
   * @return {JSX} The generated html
   */
  render() {
    const shownChips = this.userDatas.slice(0, this.overflowLimit)
    const overflownChips = this.userDatas.slice(this.overflowLimit)

    // let currentZIndex = this.initialZIndex
    return (
      <div class="zea-chip-set">
        {shownChips &&
          shownChips.map((userData) => {
            return (
              <zea-user-chip
                showImages={this.showImages}
                key={userData.id}
                userData={userData}
                // style={{ zIndex: `${--currentZIndex}` }}
                onClick={this.onChipClick.bind(this)}
              ></zea-user-chip>
            )
          })}

        {overflownChips.length > 0 && (
          <div class="overflow">
            <div
              class="overflow-thumb"
              onClick={() => (this.overflowShown = !this.overflowShown)}
            >
              {[
                `+${this.userDatas.length - this.overflowLimit}`,
                !this.overflowShown && (
                  <div class="overflow-tooltip">Show All</div>
                ),
              ]}
            </div>
            <div class={{ 'overflow-list': true, shown: this.overflowShown }}>
              {overflownChips.map((userData) => {
                return (
                  <div
                    key={userData.id}
                    class={{
                      'overflow-entry': true,
                      shown: this.shownOverflowEntry == userData.id,
                    }}
                  >
                    <div
                      class="overflow-entry-collapser"
                      onClick={(e: any) => {
                        this.shownOverflowEntry =
                          this.shownOverflowEntry == userData.id
                            ? null
                            : userData.id
                        e.currentTarget.scrollIntoView()
                      }}
                    >
                      <zea-icon
                        name={
                          this.shownOverflowEntry == userData.id
                            ? 'chevron-up-outline'
                            : 'chevron-down-outline'
                        }
                        size={14}
                      ></zea-icon>
                    </div>
                    <zea-user-card
                      userData={userData}
                      collapsible={false}
                      density={
                        this.shownOverflowEntry == userData.id
                          ? 'normal'
                          : 'small'
                      }
                    ></zea-user-card>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }
}
