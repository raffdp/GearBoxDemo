import { storiesOf } from '@storybook/html'

storiesOf('Components/zea-scroll-pane', module)
  .add('Default', () => `<zea-scroll-pane></zea-scroll-pane>`)
  .add(
    'With Input',
    () =>
      `<div style="width: 300px; height; 300px" ><zea-scroll-pane>
      <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur molestie sed turpis et fringilla. Quisque vel rutrum quam, sodales hendrerit eros. Nunc imperdiet pulvinar augue vitae ultrices. Vivamus ac eros vulputate, maximus nisi sed, varius sem. Cras condimentum neque risus, in vestibulum quam pretium sed. Morbi vitae eros eleifend, auctor nunc in, tincidunt mauris. Praesent bibendum enim felis, tincidunt facilisis nulla accumsan a. Pellentesque nec lorem diam.
      </p>
      <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur molestie sed turpis et fringilla. Quisque vel rutrum quam, sodales hendrerit eros. Nunc imperdiet pulvinar augue vitae ultrices. Vivamus ac eros vulputate, maximus nisi sed, varius sem. Cras condimentum neque risus, in vestibulum quam pretium sed. Morbi vitae eros eleifend, auctor nunc in, tincidunt mauris. Praesent bibendum enim felis, tincidunt facilisis nulla accumsan a. Pellentesque nec lorem diam.
      </p>
      </zea-scroll-pane>`
  )
