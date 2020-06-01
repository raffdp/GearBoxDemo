import { storiesOf } from '@storybook/html'

import { projectsClient } from '../../../.storybook/lib/clients'

storiesOf('Components/zea-projects-browser', module).add('Default', () => {
  const zeaProjectsBrowser = document.createElement('zea-projects-browser')

  projectsClient.fetchAll().then((projects) => {
    zeaProjectsBrowser.projectsClient = projectsClient
    zeaProjectsBrowser.projects = projects

    zeaProjectsBrowser.addEventListener('dblClickProject', (event) =>
      console.log(event.type, event)
    )
  })

  return zeaProjectsBrowser
})
