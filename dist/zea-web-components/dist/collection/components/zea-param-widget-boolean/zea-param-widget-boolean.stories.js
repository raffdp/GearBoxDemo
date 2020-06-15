import { storiesOf } from '@storybook/html'
import { BooleanParameter, ValueSetMode } from '@zeainc/zea-engine'
import { UndoRedoManager } from '@zeainc/zea-ux'

storiesOf('Components/zea-param-widget-boolean', module).add('Default', () => {
  const booleanParameter = new BooleanParameter('Foo', false)
  const booleanParamWidget = document.createElement('zea-param-widget-boolean')
  const undoRedoManager = new UndoRedoManager()

  booleanParamWidget.appData = { undoRedoManager }
  booleanParamWidget.parameter = booleanParameter

  setTimeout(() => {
    booleanParameter.setValue(true, ValueSetMode.REMOTEUSER_SETVALUE)
  }, 5000)

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      undoRedoManager.undo()
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
      undoRedoManager.redo()
    }
  })

  return booleanParamWidget
})
