// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/html'

storiesOf('Components/zea-input-search', module).add(
  'Default',
  () =>
    `<div style="width:500px;max-width: 100%; box-sizing: border-box; text-align: right; padding: 1em; background-color: var(--color-background-2)">
      <zea-input-search></zea-input-search>
    </div>`
)
