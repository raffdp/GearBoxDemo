import { storiesOf } from '@storybook/html'
import {
  withKnobs,
  text,
  boolean,
  number,
  radios,
  select,
} from '@storybook/addon-knobs'

storiesOf('Components/zea-fab-button', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const elm = document.createElement('zea-fab-button')
    elm.innerHTML = '<zea-icon name="add-outline"></zea-icon>'
    return elm
  })
  .add('Disabled', () => {
    const elm = document.createElement('zea-fab-button')
    elm.innerHTML = '<zea-icon name="add-outline"></zea-icon>'
    elm.disabled = 'true'
    return elm
  })
