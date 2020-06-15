import { storiesOf } from '@storybook/html'

storiesOf('Components/zea-input-text', module)
  .add(
    'Default',
    () => `<div style="padding: 2em; max-width: 500px">
            <zea-input-text show-label="true"></zea-input-text>
         </div>`
  )
  .add(
    'Invalid',
    () => `<div style="padding: 2em; max-width: 500px">
            <zea-input-text
               is-valid="false"
               required="true"
               auto-validate="true"
               invalid-message-shown="true"
               invalid-message="This field value is not valid."
               show-label="true"></zea-input-text>
         </div>`
  )
  .add(
    'Disabled',
    () => `<div style="padding: 2em; max-width: 500px">
            <zea-input-text label="Can't enter text" show-label="true" disabled="true"></zea-input-text>
         </div>`
  )
