import { storiesOf } from '@storybook/html'
import * as SessionBundle from '@zeainc/zea-collab'
import MockSession from '../../assets/MockSession.js'
import { withKnobs, boolean } from '@storybook/addon-knobs'

storiesOf('Components/zea-user-chip-set', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const mockSession = new MockSession('https://websocket-staging.zea.live')
    const elm = document.createElement('zea-user-chip-set')
    elm.session = mockSession.getSession()
    elm.showImages = boolean('Show Images', true)

    document.addEventListener(
      'zeaUserClicked',
      () => {
        console.log('user clicked')
      },
      false
    )

    const constContainer = document.createElement('div')
    constContainer.style.backgroundColor = 'var(--color-grey-2)'
    constContainer.style.height = '64px'
    constContainer.style.padding = '14px'
    constContainer.appendChild(elm)

    return constContainer
  })
