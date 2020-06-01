import { storiesOf } from '@storybook/html'

storiesOf('Components/zea-menu', module)
  .add('Contextual', () => {
    return `
        Click the icon to show menu
        <zea-menu type="contextual" show-anchor="true" anchor-icon="ellipsis-vertical-circle-outline">
          <zea-menu-item hotkey="ctrl+L">
            <zea-icon name="link-outline"></zea-icon>
            Add Link
          </zea-menu-item>
          <zea-menu-item>
            <zea-icon name="add"></zea-icon>
            Create New
            <zea-menu-subitems>
              <zea-menu-item hotkey="ctrl+c" callback="console.log('ok')">
                <zea-icon name="add"></zea-icon> Test Item
              </zea-menu-item>
              <zea-menu-item>
                <zea-icon name="add"></zea-icon> Test Item
                <zea-menu-subitems>
                  <zea-menu-item hotkey="ctrl+c" callback="console.log('ok')">
                    <zea-icon name="add"></zea-icon> Test Item
                  </zea-menu-item>
                  <zea-menu-item>
                    <zea-icon name="add"></zea-icon> Test Item
                  </zea-menu-item>
                  <zea-menu-item>
                    <zea-icon name="add"></zea-icon> Test Item
                  </zea-menu-item>
                </zea-menu-subitems>
              </zea-menu-item>
              <zea-menu-item>
                <zea-icon name="add"></zea-icon> Test Item
              </zea-menu-item>
            </zea-menu-subitems>
          </zea-menu-item>
          <zea-menu-separator></zea-menu-separator>
          <zea-menu-item>
            <zea-icon name="layers-outline"></zea-icon>
            Change Layers
            <zea-menu-subitems radio-select="true">
              <zea-menu-item checkbox="true">
                  Test Item
              </zea-menu-item>
              <zea-menu-item checkbox="true">
                Test Item
              </zea-menu-item>
              <zea-menu-item checkbox="true">
                Test Item
              </zea-menu-item>
            </zea-menu-subitems>
          </zea-menu-item>
          <zea-menu-separator></zea-menu-separator>
          <zea-menu-item switch="true">
            Double Arrow
          </zea-menu-item>
          <zea-menu-separator></zea-menu-separator>
          <zea-menu-item switch="true" hotkey="ctrl+m">
            Measure
          </zea-menu-item>
          <zea-menu-separator></zea-menu-separator>
          <zea-menu-item hotkey="ctrl+d">
            <zea-icon name="duplicate-outline"></zea-icon>
            Duplicate
          </zea-menu-item>
          <zea-menu-item hotkey="ctrl+e">
            <zea-icon name="trash-outline"></zea-icon>
            Delete
          </zea-menu-item>
        </zea-menu>`
  })
  .add('Dropdown', () => {
    return `
        <zea-menu type="dropdown" show-anchor="true">
          <zea-menu-item>
            Create New
            <zea-menu-subitems>
              <zea-menu-item hotkey="ctrl+c" callback="console.log('ok')">
                <zea-icon name="add"></zea-icon> Test Item
              </zea-menu-item>
              <zea-menu-item>
                <zea-icon name="add"></zea-icon> Test Item
                <zea-menu-subitems>
                  <zea-menu-item hotkey="ctrl+c" callback="console.log('ok')">
                    <zea-icon name="add"></zea-icon> Test Item
                  </zea-menu-item>
                  <zea-menu-item>
                    <zea-icon name="add"></zea-icon> Test Item
                  </zea-menu-item>
                  <zea-menu-item>
                    <zea-icon name="add"></zea-icon> Test Item
                  </zea-menu-item>
                </zea-menu-subitems>
              </zea-menu-item>
              <zea-menu-item>
                <zea-icon name="add"></zea-icon> Test Item
              </zea-menu-item>
            </zea-menu-subitems>
          </zea-menu-item>
          <zea-menu-separator></zea-menu-separator>
          <zea-menu-item>
            Radio Select
            <zea-menu-subitems radio-select="true">
              <zea-menu-item>
                  Test Item
              </zea-menu-item>
              <zea-menu-item>
                Test Item
              </zea-menu-item>
              <zea-menu-item>
                Test Item
              </zea-menu-item>
            </zea-menu-subitems>
          </zea-menu-item>
          <zea-menu-separator></zea-menu-separator>
          <zea-menu-item hotkey="ctrl+d">
            <zea-icon name="duplicate-outline"></zea-icon>
            Duplicate
          </zea-menu-item>
          <zea-menu-item hotkey="ctrl+e">
            <zea-icon name="trash-outline"></zea-icon>
            Delete
          </zea-menu-item>
        </zea-menu>`
  })
  .add('Toolbar', () => {
    return `
        <zea-menu type="toolbar">
          <zea-menu-item title="Navigate">
            <zea-icon name="navigate-outline"></zea-icon>
          </zea-menu-item>
          <zea-menu-item title="Arrow Tool">
            <zea-icon type="zea" name="draw-arrow"></zea-icon>
          </zea-menu-item>
          <zea-menu-item title="Free Hand Tool">
            <zea-icon type="zea" name="draw-freehand"></zea-icon>
          </zea-menu-item>
          <zea-menu-item title="Polygon Tool">
            <zea-icon type="zea" name="draw-polygon"></zea-icon>
          </zea-menu-item>
          <zea-menu-item title="Rectangle Tool">
            <zea-icon name="square-outline"></zea-icon>
          </zea-menu-item>
          <zea-menu-colorpicker title="Color Picker">
            <zea-menu-color title="Blue" color="#00a7ff" fg-color="white" callback="console.log('blue')"></zea-menu-color>
            <zea-menu-color title="Red" color="#ff4848" fg-color="white"></zea-menu-color>
            <zea-menu-color title="Green" color="#03c149" fg-color="white"></zea-menu-color>
            <zea-menu-color title="Yellow" color="#f8c706" fg-color="black"></zea-menu-color>
            <zea-menu-color title="Orange" color="#fb8002" fg-color="white"></zea-menu-color>
            <zea-menu-color title="Violet" color="violet" fg-color="white"></zea-menu-color>
            <zea-menu-color title="Black" color="black" fg-color="white"></zea-menu-color>
          </zea-menu-colorpicker>
        </zea-menu>`
  })
