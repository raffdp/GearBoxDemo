import { storiesOf } from '@storybook/html'

storiesOf('Components/high-level', module)
  .add('App Shell', () => `<zea-app-shell></zea-app-shell>`)
  .add('Drawing Settings', () => {
    const element = document.createElement('zea-dialog-drawing-settings')
    const container = document.createElement('div')
    const button = document.createElement('zea-button')

    element.showLabels = true
    button.htmlContent = '<zea-icon name="settings-outline"></zea-icon>Settings'

    container.appendChild(button)
    container.appendChild(element)

    button.addEventListener('click', () => {
      element.shown = !element.shown
    })

    return container
  })
  .add('Profile Dialog', () => {
    const element = document.createElement('zea-dialog-profile')
    const container = document.createElement('div')
    const button = document.createElement('zea-button')

    element.showLabels = true
    button.htmlContent = 'View Profile'

    container.appendChild(button)
    container.appendChild(element)

    button.addEventListener('click', () => {
      element.shown = !element.shown
    })

    return container
  })
  .add('Share Dialog', () => `<zea-dialog-share></zea-dialog-share>`)
  .add('Form', () => `<zea-form></zea-form>`)
  .add(
    'Discipline Settings Form',
    () =>
      `<div style="padding:1em; height: 100%;box-sizing: border-box;">
        <zea-form-disciplines-settings></zea-form-disciplines-settings>
      </div>`
  )
  .add(
    'Drawing Setup Form',
    () => `<zea-form-drawing-setup></zea-form-drawing-setup>`
  )
  .add(
    'Measurements Settings Form',
    () => `<zea-form-measurements-settings></zea-form-measurements-settings>`
  )
  .add(
    'Profile Form',
    () => `<zea-form-profile welcome-html=""></zea-form-profile>`
  )
