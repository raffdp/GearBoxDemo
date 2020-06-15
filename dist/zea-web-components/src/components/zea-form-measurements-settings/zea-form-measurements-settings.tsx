import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-form-measurements-settings',
  styleUrl: 'zea-form-measurements-settings.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaFormMeasurementsSettings {
  /**
   * A test prop.
   */
  @Prop() test: string = 'Hello World'

  /**
   * Main render function
   * @return {JSX} The generated html
   */
  render() {
    return <div class="zea-form-measurements-settings">{this.test}</div>
  }
}
