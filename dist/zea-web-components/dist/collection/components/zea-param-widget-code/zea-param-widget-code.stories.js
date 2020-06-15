import { storiesOf } from '@storybook/html'
import { CodeParameter, ValueSetMode } from '@zeainc/zea-engine'
import { UndoRedoManager } from '@zeainc/zea-ux'

storiesOf('Components/zea-param-widget-code', module).add('Default', () => {
  const parameter = new CodeParameter('Code Parameter', 'This is a test')

  const paramWidget = document.createElement('zea-param-widget-code')
  const undoRedoManager = new UndoRedoManager()

  paramWidget.appData = { undoRedoManager }
  paramWidget.parameter = parameter

  setTimeout(() => {
    parameter.setValue('The test changed', ValueSetMode.REMOTEUSER_SETVALUE)
  }, 5000)

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      undoRedoManager.undo()
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
      undoRedoManager.redo()
    }
  })

  return paramWidget
})
