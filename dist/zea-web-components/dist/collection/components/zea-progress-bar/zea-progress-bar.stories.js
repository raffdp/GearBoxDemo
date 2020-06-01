// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/html'

storiesOf('Components/zea-progress-bar', module)
  .add('Determinate', () => {
    const element = document.createElement('zea-progress-bar')

    const container = document.createElement('div')
    container.style.width = '300px'
    container.style.height = '100px'
    container.style.backgroundColor = 'grey'
    container.style.margin = '1em'
    container.style.position = 'relative'
    container.appendChild(element)

    element.percent = 0

    setInterval(() => {
      element.percent += 10
      if (element.percent > 100) element.percent = 0
    }, 1000)

    setTimeout(() => {
      element.percent = 10
    }, 500)

    return container
  })
  .add('Indeterminate', () => {
    const element = document.createElement('zea-progress-bar')

    const container = document.createElement('div')
    container.style.width = '300px'
    container.style.height = '100px'
    container.style.backgroundColor = 'grey'
    container.style.margin = '1em'
    container.style.position = 'relative'
    container.appendChild(element)

    element.type = 'indeterminate'

    return container
  })
  .add('Indeterminate (Pulsating)', () => {
    const element = document.createElement('zea-progress-bar')

    const container = document.createElement('div')
    container.style.width = '300px'
    container.style.height = '100px'
    container.style.backgroundColor = 'grey'
    container.style.margin = '1em'
    container.style.position = 'relative'
    container.appendChild(element)

    element.type = 'indeterminate'
    element.indeterminateAnimation = 'pulsating'

    return container
  })
  .add('Full screen', () => {
    const element = document.createElement('zea-progress-bar')

    element.percent = 0
    element.size = 5

    setInterval(() => {
      element.percent += 10
      if (element.percent > 100) element.percent = 0
    }, 3000)

    return element
  })
  .add('Custom Colors', () => {
    const element = document.createElement('zea-progress-bar')

    element.percent = 0
    element.size = 5
    element.color = 'var(--color-secondary-1)'
    element.backgroundColor = 'var(--color-secondary-3)'

    setInterval(() => {
      element.percent += 20
      if (element.percent > 100) element.percent = 0
    }, 1000)

    return element
  })
