import { storiesOf } from '@storybook/html'
import { ValueSetMode, XfoParameter, Xfo } from '@zeainc/zea-engine'
import { UndoRedoManager } from '@zeainc/zea-ux'

storiesOf('Components/zea-param-widget-xfo', module).add('Default', () => {
  const xfo = new Xfo()

  xfo.tr.set(1, 2, 3)
  xfo.ori.set(4, 5, 6, 7)
  xfo.ori.normalizeInPlace()
  xfo.sc.set(8, 9, 10)

  const parameter = new XfoParameter('Xfo Parameter', xfo)

  const paramWidget = document.createElement('zea-param-widget-xfo')
  const undoRedoManager = new UndoRedoManager()

  paramWidget.appData = { undoRedoManager }
  paramWidget.parameter = parameter

  xfo.tr.set(10, 20, 30)
  xfo.ori.set(40, 50, 60, 70)
  xfo.ori.normalizeInPlace()
  xfo.sc.set(80, 90, 100)

  setTimeout(() => {
    parameter.setValue(xfo, ValueSetMode.REMOTEUSER_SETVALUE)
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
