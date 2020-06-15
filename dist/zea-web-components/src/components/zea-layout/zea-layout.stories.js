import { storiesOf } from '@storybook/html'
import { withKnobs, text } from '@storybook/addon-knobs'

storiesOf('Components/zea-layout', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const decodeEntities = (() => {
      // this prevents any overhead from creating the object each time
      const element = document.createElement('div')

      const decodeHTMLEntities = (str) => {
        if (str && typeof str === 'string') {
          element.innerHTML = str
          str = element.textContent
          element.textContent = ''
        }

        return str
      }

      return decodeHTMLEntities
    })()

    const layout = text(
      'Layout',
      `<zea-layout cell-count="3" orientation="vertical"
cell-a-size="30" cell-c-size="70" resize-cell-a="false">
  <zea-layout cell-count="3" slot="b">
    <zea-layout cell-count="3" orientation="vertical" slot="b">
      <zea-layout cell-count="3" slot="a"></zea-layout>
    </zea-layout>
  </zea-layout>
</zea-layout>`
    )

    return decodeEntities(layout)
  })
