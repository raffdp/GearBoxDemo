// eslint-disable-next-line no-unused-vars
import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { FsObject, Project } from '@zeainc/drive-lib'
import { Session } from '@zeainc/zea-collab'

@Component({
  tag: 'zea-thumbnail',
  styleUrl: 'zea-thumbnail.css',
  shadow: true,
})
/**
 * ZeaThumbnail.
 */
export class ZeaThumbnail {
  /**
   * Constructor.
   */
  constructor() {
    this.handleClick = this.handleClick.bind(this)
    this.handleDblClick = this.handleDblClick.bind(this)
  }

  @Event() clickThumbnail: EventEmitter

  @Event() dblClickThumbnail: EventEmitter

  /**
   * The Zea model instance to represent.
   */
  @Prop() zeaModelInstance: FsObject | Project

  @Prop() icon

  @Prop() zeaSession: Session

  @State() isSelected: boolean

  @State() fileProgress: any

  // eslint-disable-next-line require-jsdoc
  componentWillLoad() {
    this.subToFileProgress()
  }

  // eslint-disable-next-line require-jsdoc
  componentWillUpdate() {
    this.subToFileProgress()
  }

  /**
   * Subscribe to incoming file progress actions.
   */
  private subToFileProgress() {
    if (!this.zeaSession) {
      return
    }

    this.zeaSession.sub(Session.actions.FILE_WITH_PROGRESS, (payload: any) => {
      const incomingFile = payload.file

      if (incomingFile.id !== this.zeaModelInstance.id) {
        return
      }

      this.fileProgress = incomingFile.progress
    })
  }

  /**
   * Handle click.
   */
  private handleClick() {
    this.clickThumbnail.emit(this.zeaModelInstance)
    this.isSelected = !this.isSelected
  }

  /**
   * Handle double click.
   */
  private handleDblClick() {
    this.dblClickThumbnail.emit(this.zeaModelInstance)
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div
        class={{
          ZeaThumbnail: true,
          'ZeaThumbnail--selected': this.isSelected,
        }}
        title={this.zeaModelInstance.name}
        onClick={this.handleClick}
        onDblClick={this.handleDblClick}
      >
        {this.zeaModelInstance.thumbnail && (
          <div
            class="ZeaThumbnail__thumbnail"
            style={{
              backgroundImage: `url("${this.zeaModelInstance.thumbnail}")`,
            }}
          />
        )}
        <div class="ZeaThumbnail__footer">
          <span class="ZeaThumbnail__icon">{this.icon}</span>
          <span class="ZeaThumbnail__name">{this.zeaModelInstance.name}</span>
        </div>
        {this.fileProgress && (
          <div
            class="ZeaThumbnail__progress"
            style={{
              backgroundColor: this.fileProgress.indicatorColor,
              width: `${this.fileProgress.percentageCompleted}%`,
            }}
          ></div>
        )}
      </div>
    )
  }
}
