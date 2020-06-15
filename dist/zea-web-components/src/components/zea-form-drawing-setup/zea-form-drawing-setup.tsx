import { Component, h, Prop } from '@stencil/core'
import { ZeaWcDataConnector } from '../../utils/ZeaWcDataConnector'

@Component({
  tag: 'zea-form-drawing-setup',
  styleUrl: 'zea-form-drawing-setup.css',
  shadow: true,
})

/**
 */
export class ZeaFormDrawingSetup {
  /**
   */
  @Prop() disciplines = []

  /**
   */
  @Prop() scales = []

  db = new ZeaWcDataConnector()
  drawingNumberInput
  titleInput
  disciplineInput

  /**
   *
   */
  onDisciplinesSelect(value) {
    console.log('value', value)
  }

  /**
   *
   */
  onScalesSelect(value) {
    console.log('value', value)
  }

  /**
   *
   */
  componentWillLoad() {
    this.db
      .getDocs({ type: 'disciplines', limit: 100 })
      .then((disciplines: any) => {
        this.disciplines = disciplines.docs
      })

    this.scales = [
      { _id: 'scale1', name: `1/32' = 1'0"` },
      { _id: 'scale2', name: `1/16' = 1'0"` },
      { _id: 'scale3', name: `1/8' = 1'0"` },
      { _id: 'scale4', name: `1/4' = 1'0"` },
      { _id: 'scale5', name: `3/8' = 1'0"` },
      { _id: 'scale6', name: `1/32 = 1'0"` },
      { _id: 'scale7', name: `1/32 = 1'0"` },
      { _id: 'scale8', name: `1/32 = 1'0"` },
      { _id: 'scale9', name: `1/32 = 1'0"` },
      { _id: 'scale10', name: `1/32 = 1'0"` },
    ]
  }

  /**
   */
  render() {
    return (
      <div class="zea-form-drawing-setup">
        <div class="inputs">
          <div class="input-container">
            <zea-input-text
              ref={(el) => (this.drawingNumberInput = el)}
              label="Drawing Number"
              id="drawing-number-input"
            ></zea-input-text>
          </div>
          <div class="input-container">
            <zea-input-text
              ref={(el) => (this.titleInput = el)}
              label="Title"
              id="title-input"
            ></zea-input-text>
          </div>
          <div class="input-container">
            <zea-input-select
              selectCallback={this.onDisciplinesSelect.bind(this)}
              label="Discipline"
              id="discipline-input"
            >
              {this.disciplines.map((discipline) => {
                return (
                  <zea-input-select-item value={discipline}>
                    <div
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
                    </div>
                  </zea-input-select-item>
                )
              })}
            </zea-input-select>
          </div>
          <div class="input-container">
            <zea-input-select
              selectCallback={this.onScalesSelect.bind(this)}
              label="Scale"
              id="scale-input"
            >
              {this.scales.map((scale) => {
                return (
                  <zea-input-select-item value={scale}>
                    <div
                      class="select-item-wrap scale-row"
                      id={scale._id}
                      key={scale._id}
                    >
                      <div class="scale-name">{scale.name}</div>
                    </div>
                  </zea-input-select-item>
                )
              })}
            </zea-input-select>
          </div>
        </div>
        <div class="buttons">
          <div>
            <zea-button density="small">FINISHED ALL</zea-button>
          </div>
          <div>
            <zea-button density="small">PREVIOUS</zea-button>
            <zea-button density="small">NEXT</zea-button>
          </div>
        </div>
      </div>
    )
  }
}
