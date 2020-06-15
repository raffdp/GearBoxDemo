import { storiesOf } from '@storybook/html'
import {
  withKnobs,
  text,
  boolean,
  number,
  radios,
  select,
} from '@storybook/addon-knobs'

storiesOf('Components/zea-tabs', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    let orientation = select(
      'Orientation',
      { Horizontal: 'horizontal', Vertical: 'vertical' },
      'horizontal'
    )
    return `<zea-tabs orientation="${orientation}">
              <div slot="tab-bar">Tab Label 1</div>
              <div>Tab Content 1</div>

              <div slot="tab-bar">Tab Label 2</div>
              <div>Tab Content 2</div>
          </zea-tabs>`
  })
