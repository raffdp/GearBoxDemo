import { storiesOf } from '@storybook/html'
import { UndoRedoManager, ActionRegistry } from '@zeainc/zea-ux'

storiesOf('Components/zea-dropdown-menu', module).add('Default', () => {
  const menuElement = document.createElement('zea-dropdown-menu')
  const undoRedoManager = new UndoRedoManager()
  const actionRegistry = new ActionRegistry()

  actionRegistry.registerAction({
    path: ['Archive'],
    name: 'New',
    callback: () => {
      console.log('New')
    },
    metaKeys: {
      control: true,
    },
    key: 'n',
    availableInVR: true,
  })

  actionRegistry.registerAction({
    path: ['Edit'],
    name: 'Undo',
    callback: () => {
      undoRedoManager.undo()
    },
    metaKeys: {
      control: true,
    },
    key: 'z',
    availableInVR: true,
  })

  actionRegistry.registerAction({
    path: ['Edit'],
    name: 'Redo action with really long name',
    callback: () => {
      undoRedoManager.redo()
    },
    metaKeys: {
      control: true,
    },
    key: 'y',
    availableInVR: true,
  })

  actionRegistry.registerAction({
    path: ['Edit', 'Other'],
    name: 'Test 1',
    callback: () => {
      undoRedoManager.redo()
    },
    metaKeys: {
      control: true,
    },
    key: 'a',
    availableInVR: true,
  })

  actionRegistry.registerAction({
    path: ['Edit', 'Other'],
    name: 'Test 2',
    callback: () => {
      undoRedoManager.redo()
    },
    metaKeys: {
      control: true,
    },
    key: 'b',
    availableInVR: true,
  })

  menuElement.appData = { undoRedoManager, actionRegistry }

  setTimeout(() => {
    console.log('ok')
  }, 5000)

  return menuElement
})

/*
__existingItems
_comboFragment

_buildTopBar
_addMenuItem(domElement, action)
_addATo(domElement, className, innerHTML)
_addUlTo(domElement, className, innerHTML)
_addLiTo(domElement, className, innerHTML)
_addSpanTo(domElement, className, innerHTML)
_keyComboAsText(action)
__hotkeysToActions = {};
*/
