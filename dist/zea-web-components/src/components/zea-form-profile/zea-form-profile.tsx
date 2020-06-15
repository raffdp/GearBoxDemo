import { Component, h, Prop, Event, EventEmitter } from '@stencil/core'

@Component({
  tag: 'zea-form-profile',
  styleUrl: 'zea-form-profile.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaProfileForm {
  /**
   * A test prop.
   */
  @Prop()
  welcomeHtml: string = `Welcome to Zea Construction. We just need <br />a few details and
  then you're ready to go.`

  /**
   * A test prop.
   */
  @Prop() submitButtonText: string = 'SAVE'

  /**
   */
  @Prop() showLabels: boolean = true

  /**
   */
  @Prop() userData: any = {}

  /**
   */
  formElement: any

  /**
   */
  @Event() userRegistered: EventEmitter

  /**
   */
  submitCallback(formValues) {
    if (this.formElement.isValid) {
      this.userRegistered.emit(formValues)
    }
  }

  /**
   * Main render function
   * @return {JSX} The generated html
   */
  render() {
    return (
      <div class="zea-form-profile">
        <zea-form
          ref={(el) => (this.formElement = el)}
          id="quick-access-form"
          submitCallback={this.submitCallback.bind(this)}
          submit-text={this.submitButtonText}
          validate={true}
        >
          {this.welcomeHtml && <div innerHTML={this.welcomeHtml}></div>}
          <zea-input-text
            id="quick-access-name"
            label="First Name (required)"
            name="firstName"
            showLabel={true}
            required={true}
            value={this.userData.firstName || ''}
          ></zea-input-text>
          <zea-input-text
            id="quick-access-lastname"
            label="Last Name"
            showLabel={this.showLabels}
            name="lastName"
            value={this.userData.lastName || ''}
          ></zea-input-text>
          <zea-input-text
            id="quick-access-email"
            label="Email"
            showLabel={this.showLabels}
            name="email"
            value={this.userData.email || ''}
          ></zea-input-text>
          <zea-input-text
            id="quick-access-phone"
            label="Phone"
            showLabel={this.showLabels}
            name="phone"
            value={this.userData.phone || ''}
          ></zea-input-text>
          <zea-input-text
            id="quick-access-company"
            label="Company"
            showLabel={this.showLabels}
            name="company"
            value={this.userData.company || ''}
          ></zea-input-text>
          <zea-input
            id="quick-access-photo"
            type="photo"
            label="Photo"
            showLabel={this.showLabels}
            name="avatar"
            value={this.userData.avatar || ''}
          ></zea-input>
          <zea-input
            id="quick-access-color"
            type="color"
            label="Color"
            showLabel={this.showLabels}
            name="color"
            value={this.userData.color || ''}
          ></zea-input>
        </zea-form>
      </div>
    )
  }
}
