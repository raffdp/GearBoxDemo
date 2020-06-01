import { storiesOf } from '@storybook/html'

storiesOf('Components/zea-dialog', module).add(
  'Default',
  () =>
    `<zea-dialog shown="true" allow-close="false">
        <div slot="title">Test Dialog Header</div>
        <div slot="body">This is a test dialog. It's meant to present basic functionality.</div>
        <div slot="footer">
          <zea-button html-content="CANCEL" variant="outlined"></zea-button>
          <zea-button html-content="OK" variant="solid"></zea-button>
        </div>
      </zea-dialog>`
)
