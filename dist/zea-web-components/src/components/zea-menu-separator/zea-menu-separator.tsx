import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-menu-separator',
  styleUrl: 'zea-menu-separator.css',
  shadow: true,
})
/**
 * Main component class
 */
export class ZeaMenuSeparator {
  /**
   */
  @Prop() class: string = ''

  /**
   */
  @Prop() orientation: string = 'horizontal'

  /**
   * Render function
   * @return {JSX}
   */
  render() {
    return (
      <div class={`zea-menu-separator ${this.class} ${this.orientation}`}>
        <div class="ruler"></div>
      </div>
    )
  }
}
