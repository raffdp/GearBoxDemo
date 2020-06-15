import { storiesOf } from '@storybook/html'
import { ValueSetMode, Vec3Parameter, Vec3 } from '@zeainc/zea-engine'
import { UndoRedoManager } from '@zeainc/zea-ux'

storiesOf('Components/zea-param-widget-vec3', module).add('Default', () => {
  const parameter = new Vec3Parameter('Vec3 Parameter', new Vec3(1, 2, 3))

  const paramWidget = document.createElement('zea-param-widget-vec3')
  const undoRedoManager = new UndoRedoManager()

  paramWidget.appData = { undoRedoManager }
  paramWidget.parameter = parameter

  setTimeout(() => {
    parameter.setValue(new Vec3(4, 5, 6), ValueSetMode.REMOTEUSER_SETVALUE)
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
