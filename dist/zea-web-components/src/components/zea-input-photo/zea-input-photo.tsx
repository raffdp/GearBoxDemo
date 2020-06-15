import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-input-photo',
  styleUrl: 'zea-input-photo.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaInputPhoto {
  /**
   * A test prop.
   */
  @Prop() test: string = 'Hello World'

  /**
   * Main render function
   * @return {JSX} The generated html
   */
  render() {
    return <div class="zea-input-photo">{this.test}</div>
  }
}
