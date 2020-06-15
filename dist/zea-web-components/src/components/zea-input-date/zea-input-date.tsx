import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-input-date',
  styleUrl: 'zea-input-date.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaInputDate {
  /**
   * A test prop.
   */
  @Prop() test: string = 'Hello World'

  /**
   * Main render function
   * @return {JSX} The generated html
   */
  render() {
    return <div class="zea-input-date">{this.test}</div>
  }
}
