import { storiesOf } from '@storybook/html'
import { ValueSetMode, StringParameter } from '@zeainc/zea-engine'
import { UndoRedoManager } from '@zeainc/zea-ux'

storiesOf('Components/zea-param-widget-string', module).add('Default', () => {
  const parameter = new StringParameter('String Parameter', 'Test String')

  const paramWidget = document.createElement('zea-param-widget-string')
  const undoRedoManager = new UndoRedoManager()

  paramWidget.appData = { undoRedoManager }
  paramWidget.parameter = parameter

  setTimeout(() => {
    parameter.setValue('Changed Test String', ValueSetMode.REMOTEUSER_SETVALUE)
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
