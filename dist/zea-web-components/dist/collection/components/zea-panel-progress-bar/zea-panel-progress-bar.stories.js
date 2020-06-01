import { storiesOf } from '@storybook/html'

storiesOf('Components/zea-panel-progress-bar', module).add(
  'Default',
  () => `<div style="width: 500px; height: 500px;">
          <zea-panel-progress-bar>Loading...</zea-panel-progress-bar>
        </div>`
)
