// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/html'

storiesOf('Components/zea-icon', module)
  .add('Default', () => `<zea-icon name="add"></zea-icon>`)
  .add(
    'Custom Icons',
    () => `<zea-icon type="zea" name="draw-arrow"></zea-icon>`
  )
