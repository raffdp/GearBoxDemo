import { storiesOf } from '@storybook/html'
import { Scene, TreeItem } from '@zeainc/zea-engine'
import {
  SelectionManager,
  ActionRegistry,
  UndoRedoManager,
} from '@zeainc/zea-ux'

storiesOf('Components/zea-tree-view', module).add('Default', () => {
  const treeViewElement = document.createElement('zea-tree-view')

  const scene = new Scene()
  const rootTreeItem = new TreeItem()
  const selectionManager = new SelectionManager({}, {})
  const actionRegistry = new ActionRegistry()
  const undoRedoManager = new UndoRedoManager()

  scene.setupGrid(7.0, 50)
  scene.getRoot().addChild(rootTreeItem)

  let childk

  for (let i = 0; i < 10; i++) {
    const childI = new TreeItem('Child' + i)
    for (let j = 0; j < 10; j++) {
      const childJ = new TreeItem('Child' + j)
      for (let k = 0; k < 10; k++) {
        childk = new TreeItem('Child' + k)
        childJ.addChild(childk)
      }
      childI.addChild(childJ)
    }
    rootTreeItem.addChild(childI)
  }

  treeViewElement.appData = {
    selectionManager,
    actionRegistry,
    undoRedoManager,
  }
  treeViewElement.rootItem = scene.getRoot()

  setTimeout(() => {
    childk.setName('Test name change')
  }, 5000)

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      undoRedoManager.undo()
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
      undoRedoManager.redo()
    }
  })

  return treeViewElement
})
