import { storiesOf } from '@storybook/html'
import {
  withKnobs,
  text,
  boolean,
  number,
  radios,
  select,
} from '@storybook/addon-knobs'

storiesOf('Components/zea-checkbox', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const elm = document.createElement('zea-checkbox')
    return elm
  })
  .add('Checked', () => {
    const elm = document.createElement('zea-checkbox')
    elm.checked = true
    return elm
  })
  .add('Disabled', () => {
    const elm = document.createElement('zea-checkbox')
    elm.disabled = 'true'
    return elm
  })
  .add('Disabled Checked', () => {
    const elm = document.createElement('zea-checkbox')
    elm.checked = 'true'
    elm.disabled = 'true'
    return elm
  })
