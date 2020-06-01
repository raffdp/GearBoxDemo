import { storiesOf } from '@storybook/html'
import { ValueSetMode, NumberParameter } from '@zeainc/zea-engine'
import { UndoRedoManager } from '@zeainc/zea-ux'

storiesOf('Components/zea-param-widget-number', module).add('Default', () => {
  const numberParameter = new NumberParameter('Foo', 6, [0, 30], 5)
  const numberParamWidget = document.createElement('zea-param-widget-number')
  const undoRedoManager = new UndoRedoManager()

  numberParamWidget.appData = { undoRedoManager }
  numberParamWidget.parameter = numberParameter

  setTimeout(() => {
    numberParameter.setValue(10, ValueSetMode.REMOTEUSER_SETVALUE)
  }, 5000)

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      undoRedoManager.undo()
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
      undoRedoManager.redo()
    }
  })

  return numberParamWidget
})
