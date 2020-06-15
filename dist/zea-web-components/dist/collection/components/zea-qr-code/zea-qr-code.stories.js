import { storiesOf } from '@storybook/html'
import { withKnobs, text } from '@storybook/addon-knobs'

storiesOf('Components/zea-qr-code', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const content = text('QR Content', 'Zea Inc.')
    return `<zea-qr-code content="${content}"></zea-qr-code>`
  })
