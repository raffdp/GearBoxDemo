import { Component, h, Prop, Event, EventEmitter } from '@stencil/core'
import { ZeaWcDataConnector } from '../../utils/ZeaWcDataConnector'

@Component({
  tag: 'zea-form-disciplines-settings',
  styleUrl: 'zea-form-disciplines-settings.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaFormDisciplinesSettings {
  /**
   */
  @Prop() contentId: string = 'none'

  /**
   */
  @Prop() disciplines: any = []

  /**
   */
  db = new ZeaWcDataConnector()
  abbrInput: any
  nameInput: any
  colorInput: any
  rowElements: any = {}
  editRowElements: any = {}
  nameElements: any = {}
  abbrElements: any = {}
  colorElements: any = {}

  /**
   */
  @Event({
    eventName: 'dialogResize',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  dialogResize: EventEmitter

  /**
   */
  getDefaultDisciplines() {
    const disciplines = []
    const disStr = `A	Architectural	#F34235
    C	Civil	#E81D62
    E	Electrical	#292929
    F	Fire Protection	#9B26AF
    FS	Food Service	#6639B6
    G	General	#3E50B4
    GA	Garage Architectural	#2095F2
    GE	Garage Electrical	#02A8F3
    GM	Garage Mechanical	#00BBD3
    GP	Garage Plumbing	#009587
    GS	Garage Structual	#4BAE4F
    H	HVAC	#8AC249
    I	Interior	#CCDB38
    IR	Irrigation	#FEEA3A
    L	Landscape	#FEC006
    M	Mechanical	#FE9700
    P	Plumbing	#FE5621
    Q	Equipment	#785447
    R	Resource	#9D9D9D
    S	Structural	#5F7C8A
    T	Telecommunications	#F34235
    X	Other	#E81D62
    Z	Contractor / Shop Drawings	#292929`

    disStr.split('\n').forEach((line, index) => {
      line = line.replace(/(^\s*|\s*$)/, '') // trim
      const cols = line.split('\t')
      disciplines.push({
        type: 'disciplines',
        _id: 'disciplines|default' + index,
        name: cols[1],
        abbreviation: cols[0],
        color: cols[2],
        contentId: this.contentId,
      })
    })
    return disciplines
  }

  /**
   */
  async applyDefaultDisciplines() {
    return new Promise((resolve) => {
      this.disciplines = this.getDefaultDisciplines()
      let insertCount = 0
      this.disciplines.forEach((discipline) => {
        this.db.upsertDoc(discipline).then(() => {
          insertCount++
          if (insertCount == this.disciplines.length) resolve()
        })
      })
    })
  }

  /**
   */
  resetDefatuls() {
    return new Promise((resolve) => {
      this.db.destroyDb('disciplines').then(() => {
        this.applyDefaultDisciplines().then(() => {
          this.refreshDisciplines()
          resolve()
        })
      })
    })
  }

  /**
   */
  saveDiscipline() {
    const data = {
      type: 'disciplines',
      abbreviation: this.abbrInput.value,
      name: this.nameInput.value,
      color: this.colorInput.value,
      contentId: this.contentId,
    }

    this.abbrInput.value = ''
    this.nameInput.value = ''

    this.db.upsertDoc(data).then(() => {
      this.refreshDisciplines()
    })
  }

  /**
   */
  updateDiscipline(id) {
    const data = {
      type: 'disciplines',
      abbreviation: this.abbrElements[id].value,
      name: this.nameElements[id].value,
      color: this.colorElements[id].value,
      contentId: this.contentId,
      _id: id,
    }

    this.db.upsertDoc(data).then(() => {
      this.refreshDisciplines()
    })
  }

  /**
   */
  refreshDisciplines() {
    this.db
      .getDocs({ type: 'disciplines', limit: 1000 })
      .then((response: any) => {
        if (!response.docs || !response.docs.length) {
          this.disciplines = this.getDefaultDisciplines()
          this.applyDefaultDisciplines()

          return
        }
        this.disciplines = response.docs
      })
  }

  /**
   */
  componentWillLoad() {
    this.refreshDisciplines()
  }

  /**
   */
  deleteDisclipline(id) {
    this.db.deleteDoc(id).then(() => {
      this.refreshDisciplines()
    })
  }

  /**
   */
  componentDidRender() {
    this.dialogResize.emit(this)
  }

  /**
   * Main render function
   * @return {JSX} The generated html
   */
  render() {
    return (
      <div class="zea-form-disciplines-settings">
        <div class="form-top">
          <div>
            <zea-input-text
              ref={(el) => (this.abbrInput = el)}
              label="Abbreviation"
              id="abbreviation-input"
            ></zea-input-text>
          </div>
          <div>
            <zea-input-text
              ref={(el) => (this.nameInput = el)}
              label="Discipline"
              id="disciplines-input"
            ></zea-input-text>
          </div>
          <div>
            <zea-input
              ref={(el) => (this.colorInput = el)}
              type="color"
              label="Color"
              showLabel={false}
              colorPopupAlign="top-left"
            ></zea-input>
          </div>
          <div>
            <zea-button
              variant="solid"
              onClick={this.saveDiscipline.bind(this)}
            >
              ADD NEW
            </zea-button>
          </div>
          <div>
            <zea-menu-separator orientation="vertical"></zea-menu-separator>
          </div>
          <div>
            <zea-menu
              type="contextual"
              contextualAlign="top-right"
              showAnchor={true}
              anchorIcon="ellipsis-vertical"
            >
              <zea-menu-item onClick={this.resetDefatuls.bind(this)}>
                <zea-icon name="refresh-circle-outline"></zea-icon> Restore
                Defaults
              </zea-menu-item>
            </zea-menu>
          </div>
        </div>
        <div class="form-bottom">
          <zea-scroll-pane>
            {this.disciplines.map((discipline) => {
              return [
                <div
                  ref={(el) => (this.rowElements[discipline._id] = el)}
                  class="discipline-row"
                  id={discipline._id}
                  key={discipline._id}
                >
                  <div
                    class="discipline-abbreviation"
                    style={{ backgroundColor: discipline.color }}
                  >
                    {discipline.abbreviation}
                  </div>
                  <div class="discipline-name">{discipline.name}</div>
                  <div class="discipline-tools">
                    <zea-icon
                      name="create-outline"
                      size={18}
                      onClick={() => {
                        this.editRowElements[discipline._id].style.display =
                          'flex'
                        this.rowElements[discipline._id].style.display = 'none'
                      }}
                    ></zea-icon>
                    <zea-icon
                      size={18}
                      name="trash-outline"
                      onClick={() => {
                        this.deleteDisclipline(discipline._id)
                      }}
                    ></zea-icon>
                  </div>
                </div>,

                <div
                  ref={(el) => (this.editRowElements[discipline._id] = el)}
                  class="discipline-edit-row"
                  id={`${discipline._id}-editor`}
                  key={`${discipline._id}-editor`}
                >
                  <div>
                    <zea-input-text
                      ref={(el) => (this.abbrElements[discipline._id] = el)}
                      label="Abbreviation"
                      id="abbreviation-input"
                      value={discipline.abbreviation}
                    ></zea-input-text>
                  </div>
                  <div>
                    <zea-input-text
                      ref={(el) => (this.nameElements[discipline._id] = el)}
                      label="Discipline"
                      value={discipline.name}
                      id="disciplines-input"
                    ></zea-input-text>
                  </div>
                  <div>
                    <zea-input
                      ref={(el) => (this.colorElements[discipline._id] = el)}
                      type="color"
                      label="Color"
                      showLabel={false}
                      value={discipline.color}
                      colorPopupAlign="top-left"
                    ></zea-input>
                  </div>
                  <div class="discipline-edit-tools">
                    <zea-icon
                      name="checkmark-outline"
                      size={20}
                      onClick={() => {
                        this.editRowElements[discipline._id].style.display =
                          'none'
                        this.rowElements[discipline._id].style.display = 'flex'
                        this.updateDiscipline(discipline._id)
                      }}
                    ></zea-icon>
                    <zea-icon
                      size={20}
                      name="close-outline"
                      onClick={() => {
                        this.editRowElements[discipline._id].style.display =
                          'none'
                        this.rowElements[discipline._id].style.display = 'flex'
                      }}
                    ></zea-icon>
                  </div>
                </div>,
              ]
            })}
          </zea-scroll-pane>
        </div>
      </div>
    )
  }
}
