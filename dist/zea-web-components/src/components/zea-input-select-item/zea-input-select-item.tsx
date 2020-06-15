import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'zea-input-select-item',
  styleUrl: 'zea-input-select-item.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaInputSelectItem {
  /**
   */
  @Prop() value: any

  /**
   * Main render function
   * @return {JSX} The generated html
   */
  render() {
    return (
      <div class="zea-input-select-item">
        <slot></slot>
      </div>
    )
  }
}
