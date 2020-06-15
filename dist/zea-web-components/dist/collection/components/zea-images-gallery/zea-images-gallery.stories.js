import { storiesOf } from '@storybook/html'
import { withKnobs, number, text } from '@storybook/addon-knobs'

import { projectsClient } from '../../../.storybook/lib/clients'

storiesOf('Components/zea-images-gallery', module)
  .addDecorator(withKnobs)
  .add('ZeaClient', () => {
    const columns = number('Columns', 4)
    const featured = number('Featured', 2)
    const containerHeight = number('Container height', 400)
    const containerWidth = number('Container width', 600)
    const projectId = number('Project Id', 1)
    const folderPath = text('Folder path', 'gallery')

    const zeaImagesGallery = document.createElement('zea-images-gallery')
    zeaImagesGallery.columns = columns
    zeaImagesGallery.featured = featured

    projectsClient.fetch(projectId).then(async (project) => {
      const fsObject = project.getFsObjectByPath(folderPath)
      if (!fsObject || !fsObject.isFolder) {
        throw new Error('The path is not a valid folder.')
      }
      zeaImagesGallery.folder = fsObject
    })

    const container = document.createElement('div')
    container.style.width = `${containerWidth}px`
    container.style.height = `${containerHeight}px`
    container.appendChild(zeaImagesGallery)

    return container
  })
  .add('Standalone', () => {
    const columns = number('Columns', 4)
    const featured = number('Featured', 2)
    const containerHeight = number('Container height', 400)
    const containerWidth = number('Container width', 600)

    const zeaImagesGallery = document.createElement('zea-images-gallery')
    zeaImagesGallery.columns = columns
    zeaImagesGallery.featured = featured

    zeaImagesGallery.folder = {
      children: {
        image1: {
          url: 'https://placekitten.com/800/600?nocache=1',
          extension: 'jpg',
        },
        image2: {
          url: 'https://placekitten.com/800/601?nocache=1',
          extension: 'jpg',
        },
        image3: {
          url: 'https://placekitten.com/800/602?nocache=1',
          extension: 'jpg',
        },
        image4: {
          url: 'https://placekitten.com/800/603?nocache=1',
          extension: 'jpg',
        },
        image5: {
          url: 'https://placekitten.com/800/604?nocache=1',
          extension: 'jpg',
        },
        image6: {
          url: 'https://placekitten.com/800/605?nocache=1',
          extension: 'jpg',
        },
        image7: {
          url: 'https://placekitten.com/800/606?nocache=1',
          extension: 'jpg',
        },
        image8: {
          url: 'https://placekitten.com/800/607?nocache=1',
          extension: 'jpg',
        },
      },
    }

    const container = document.createElement('div')
    container.style.width = `${containerWidth}px`
    container.style.height = `${containerHeight}px`
    container.appendChild(zeaImagesGallery)

    return container
  })
