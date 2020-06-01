import { storiesOf } from '@storybook/html'

storiesOf('Components/zea-thumbnail', module).add('Default', () => {
  const zeaFsObject = document.createElement('zea-thumbnail')

  zeaFsObject.zeaModelInstance = {
    name: 'Foo',
    thumbnail: 'https://placeimg.com/400/300/any',
  }

  zeaFsObject.addEventListener('clickThumbnail', (e) =>
    console.log(e.type, e.detail)
  )

  zeaFsObject.addEventListener('dblClickThumbnail', (e) =>
    console.log(e.type, e.detail)
  )

  return zeaFsObject
})
