import { storiesOf } from '@storybook/html'
import { ValueSetMode, Vec4Parameter, Vec4 } from '@zeainc/zea-engine'
import { UndoRedoManager } from '@zeainc/zea-ux'

storiesOf('Components/zea-param-widget-vec4', module).add('Default', () => {
  const parameter = new Vec4Parameter('Vec4 Parameter', new Vec4(1, 2, 3, 4))

  const paramWidget = document.createElement('zea-param-widget-vec4')
  const undoRedoManager = new UndoRedoManager()

  paramWidget.appData = { undoRedoManager }
  paramWidget.parameter = parameter

  setTimeout(() => {
    parameter.setValue(new Vec4(5, 6, 7, 8), ValueSetMode.REMOTEUSER_SETVALUE)
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
