import { storiesOf } from '@storybook/html'
import { ValueSetMode, Vec2Parameter, Vec2 } from '@zeainc/zea-engine'
import { UndoRedoManager } from '@zeainc/zea-ux'

storiesOf('Components/zea-param-widget-vec2', module).add('Default', () => {
  const parameter = new Vec2Parameter('Vec2 Parameter', new Vec2(1, 2))

  const paramWidget = document.createElement('zea-param-widget-vec2')
  const undoRedoManager = new UndoRedoManager()

  paramWidget.appData = { undoRedoManager }
  paramWidget.parameter = parameter

  setTimeout(() => {
    parameter.setValue(new Vec2(3, 4), ValueSetMode.REMOTEUSER_SETVALUE)
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
