import { Component, h, Prop } from '@stencil/core'
import { getSvg } from './svg'

@Component({
  tag: 'zea-icon',
  styleUrl: 'zea-icon.css',
  shadow: true,
})
/**
 * Main class for the icon
 */
export class ZeaIcon {
  /**
   * The library to load the icon from
   */
  @Prop() type: string = 'ionic'

  /**
   * The icon name within the choosen library
   */
  @Prop() name: string

  /**
   * The icon size in pixels
   */
  @Prop() size: number = 24

  /**
   * Main render function
   * @return {JSX} the generated html
   */
  render() {
    if (this.type == 'ionic') {
      return (
        <div class="zea-icon ionic">
          <ion-icon
            name={this.name}
            style={{ fontSize: `${this.size}px` }}
          ></ion-icon>
        </div>
      )
    } else if (this.type == 'zea') {
      return (
        <div class={`zea-icon zea-custom-icon zea-icon-${this.name}`}>
          <div
            class="zea-custom-icon-inner"
            style={{ fontSize: `${this.size}px` }}
            innerHTML={getSvg(this.name)}
          ></div>
        </div>
      )
    }
  }
}
