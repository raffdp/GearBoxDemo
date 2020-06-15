import { storiesOf } from '@storybook/html'
import { withKnobs, text } from '@storybook/addon-knobs'

import { projectsClient } from '../../../.storybook/lib/clients'

storiesOf('Components/zea-file-system-browser', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const projectId = text('Project Id', 'project-acegqznn')
    const folderId = text('Folder Id', undefined)
    const filter = text('Filter', '')

    const zeaFileSystemBrowser = document.createElement(
      'zea-file-system-browser'
    )

    projectsClient.fetch(projectId).then(async (project) => {
      await project.fetchLatestVersion()

      zeaFileSystemBrowser.project = project
      zeaFileSystemBrowser.folderId = folderId
      zeaFileSystemBrowser.filter = filter

      zeaFileSystemBrowser.addEventListener('changeFolder', (event) =>
        console.log(event.type, event)
      )
    })

    const container = document.createElement('div')
    container.appendChild(zeaFileSystemBrowser)

    return container
  })
