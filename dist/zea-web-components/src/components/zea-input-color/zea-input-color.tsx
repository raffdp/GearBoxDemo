import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-input-color',
  styleUrl: 'zea-input-color.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaInputColor {
  /**
   * A test prop.
   */
  @Prop() test: string = 'Hello World'

  /**
   * Main render function
   * @return {JSX} The generated html
   */
  render() {
    return <div class="zea-input-color">{this.test}</div>
  }
}
