import { storiesOf } from '@storybook/html'
import {
  withKnobs,
  text,
  boolean,
  number,
  radios,
  select,
} from '@storybook/addon-knobs'

storiesOf('Components/zea-button', module)
  .addDecorator(withKnobs)
  .add('Configurable', () => {
    const btn = document.createElement('zea-button')

    btn.htmlContent = text('Button Label', 'Button')

    // Choose button variant
    const variantLabel = 'Variant'
    const variantOptions = {
      Text: 'text',
      Solid: 'solid',
      Outlined: 'outlined',
      Pill: 'pill',
    }
    const variantValue = 'red'
    const variantGroupId = 'Other'

    const variant = select(
      variantLabel,
      variantOptions,
      variantValue,
      variantGroupId
    )

    btn.variant = variant

    // Icon to show
    const icon = text('Icon', 'add-outline')

    // Choose whether to have an icon
    const label = 'Icon Position'
    const options = {
      none: 'None',
      Start: 'start',
      End: 'end',
    }

    const defaultValue = 'None'
    const groupId = 'Other'
    const withIcon = radios(label, options, defaultValue, groupId)

    if (withIcon === 'start') {
      btn.innerHTML =
        '<zea-icon slot="start-icon" name="' + icon + '"></zea-icon>'
    } else if (withIcon === 'end') {
      btn.innerHTML =
        '<zea-icon slot="end-icon" name="' + icon + '"></zea-icon>'
    } else {
      btn.innerHTML = ''
    }

    const disabled = boolean('Disable Button', false)

    btn.disabled = disabled

    return btn
  })
  .add('Solid Variant', () => {
    const btn = document.createElement('zea-button')
    btn.htmlContent = 'Button'
    btn.variant = 'solid'
    return btn
  })
  .add('Outlined Variant', () => {
    const btn = document.createElement('zea-button')
    btn.htmlContent = 'Button'
    btn.variant = 'outlined'
    return btn
  })
  .add('Pill Variant', () => {
    const btn = document.createElement('zea-button')
    btn.htmlContent = 'Button'
    btn.variant = 'pill'
    return btn
  })
  .add('With Start Icon', () => {
    const btn = document.createElement('zea-button')
    btn.innerHTML = '<zea-icon slot="start-icon" name="add-outline"></zea-icon>'
    btn.htmlContent = 'Button'
    btn.variant = 'pill'
    return btn
  })
  .add('With End Icon', () => {
    const btn = document.createElement('zea-button')
    btn.innerHTML = '<zea-icon slot="end-icon" name="add-outline"></zea-icon>'
    btn.htmlContent = 'Button'
    btn.variant = 'solid'
    return btn
  })
  .add('Disabled', () => {
    const btn = document.createElement('zea-button')
    btn.htmlContent = 'Button'
    btn.variant = 'solid'
    btn.disabled = true
    return btn
  })
