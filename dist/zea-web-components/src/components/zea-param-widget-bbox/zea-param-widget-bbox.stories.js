import { storiesOf } from '@storybook/html'
import { Box3, Parameter, ValueSetMode } from '@zeainc/zea-engine'
import { UndoRedoManager } from '@zeainc/zea-ux'

storiesOf('Components/zea-param-widget-bbox', module).add('Default', () => {
  const value = new Box3()

  value.p0.set(1, 2, 3)
  value.p1.set(4, 5, 6)

  const parameter = new Parameter('Box3 Parameter', value)
  const paramWidget = document.createElement('zea-param-widget-bbox')
  const undoRedoManager = new UndoRedoManager()

  paramWidget.appData = { undoRedoManager }
  paramWidget.parameter = parameter

  setTimeout(() => {
    value.p0.set(10, 20, 30)
    value.p1.set(40, 50, 60)
    parameter.setValue(value, ValueSetMode.REMOTEUSER_SETVALUE)
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
