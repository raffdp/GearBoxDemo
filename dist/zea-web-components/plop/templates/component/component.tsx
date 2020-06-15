// eslint-disable-next-line no-unused-vars
import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'template-component',
  styleUrl: 'template-component.css',
  shadow: true,
})
/**
 * Main class for the component
 */
export class TemplateComponent {
  /**
   * A test prop.
   */
  @Prop() test: string = 'Hello World'

  /**
   * Main render function
   * @return {JSX} The generated html
   */
  render() {
    return <div class="template-component">{this.test}</div>
  }
}
