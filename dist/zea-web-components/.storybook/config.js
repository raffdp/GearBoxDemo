import { configure, addDecorator, addParameters } from '@storybook/html'

import withAssets from './stencil'
import zeaTheme from './zea-theme'

/**
 * Add custom with assets decorator
 * DO NOT REMOVE - This injects the stencil assets by default to the iframe head
 */
addDecorator(
  withAssets({
    // Add addtional key value pair assets.
    // The key is the id of the script or style tag
  })
)

addParameters({
  options: {
    theme: zeaTheme,
  },
})

// automatically import all files ending in *.stories.js
const reqSrcStories = require.context('../src', true, /.stories.js$/)
function loadStories() {
  reqSrcStories.keys().forEach(filename => reqSrcStories(filename))
}

configure(loadStories, module)
