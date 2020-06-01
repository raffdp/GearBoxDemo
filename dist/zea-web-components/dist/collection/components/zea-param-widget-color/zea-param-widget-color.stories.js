import { storiesOf } from '@storybook/html'
import { ValueSetMode, Color, ColorParameter } from '@zeainc/zea-engine'
import { UndoRedoManager } from '@zeainc/zea-ux'

storiesOf('Components/zea-param-widget-color', module).add('Default', () => {
  const value = new Color()
  value.setFromRGBDict({ r: 255, g: 0, b: 0 })
  const parameter = new ColorParameter('Color Parameter', value)

  const paramWidget = document.createElement('zea-param-widget-color')
  const undoRedoManager = new UndoRedoManager()

  paramWidget.appData = { undoRedoManager }
  paramWidget.parameter = parameter

  setTimeout(() => {
    value.setFromRGBDict({ r: 0, g: 255, b: 0 })
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
