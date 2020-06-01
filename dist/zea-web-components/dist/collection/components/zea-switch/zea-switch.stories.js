import { storiesOf } from '@storybook/html'
import { withKnobs } from '@storybook/addon-knobs'

storiesOf('Components/zea-switch', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const elm = document.createElement('zea-switch')
    return elm
  })
  .add('Checked', () => {
    const elm = document.createElement('zea-switch')
    elm.checked = true
    return elm
  })
  .add('Disabled', () => {
    const elm = document.createElement('zea-switch')
    elm.disabled = 'true'
    return elm
  })
  .add('Disabled Checked', () => {
    const elm = document.createElement('zea-switch')
    elm.checked = 'true'
    elm.disabled = 'true'
    return elm
  })
