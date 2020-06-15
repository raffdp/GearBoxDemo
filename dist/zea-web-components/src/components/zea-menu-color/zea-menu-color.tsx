import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-menu-color',
  styleUrl: 'zea-menu-color.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaMenuColor {
  /**
   * The color assigned to this item
   */
  @Prop() color: string = ''

  /**
   * The color of the foreground (icon) for the tool
   */
  @Prop() fgColor: string = ''

  /**
   * Main render method for the component
   * @return {JSX} The generated markup
   */
  render() {
    return (
      <div class="zea-menu-color" style={{ backgroundColor: this.color }}></div>
    )
  }
}
