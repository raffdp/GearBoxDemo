import '@ionic/core'
// eslint-disable-next-line no-unused-vars
import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core'
import { Project, File, Folder } from '@zeainc/drive-lib'
import { Session, SessionFactory } from '@zeainc/zea-collab'
import yaml from 'js-yaml'

@Component({
  tag: 'zea-file-system-browser',
  styleUrl: 'zea-file-system-browser.css',
  shadow: true,
})
/**
 * ZeaFileSystemBrowser.
 */
export class ZeaFileSystemBrowser {
  private unsubFileWithProgress: any
  private zeaSession: Session

  @Event() changeFolder: EventEmitter

  /**
   * Zea project.
   */
  @Prop() project: Project

  /**
   * Folder Id inside project.
   */
  @Prop() folderId: string

  /**
   * Display only FS Objects that match this filter.
   */
  @Prop() filter: string = ''

  /**
   * Current folder.
   */
  @State() folder: Folder

  @State() galleryFolder: Folder

  /**
   * Used for a visual effect when there is a dragging action in progress.
   */
  @State() isHighlighted: boolean

  @State() showProjectSettingsDialog: boolean

  @State() showAppStoreDialog: boolean

  @State() currentApp: Project

  @State() currentAppReadmeTextContent: string

  @State() availableApps: Project[]

  @State() readmeTextContent: string

  @State() fileAssociations: any

  // eslint-disable-next-line require-jsdoc
  componentWillLoad() {
    this.setFolder()
  }

  // eslint-disable-next-line require-jsdoc
  componentWillUpdate() {
    this.setFolder()
  }

  // eslint-disable-next-line require-jsdoc
  componentDidUnload(): void {
    if (this.unsubFileWithProgress) {
      this.unsubFileWithProgress()
    }
  }

  /**
   * Load README.md file.
   */
  private loadReadmeFile() {
    const readmeFile = this.folder.getFileByName('readme.md')

    if (readmeFile) {
      readmeFile.getPlainTextContent().then((plainTextContent) => {
        this.readmeTextContent = plainTextContent
      })
    }
  }

  /**
   * Files associations.
   */
  private loadFileAssociations() {
    if (this.project.connectedApps?.length) {
      const promises = this.project.connectedApps.map(async (appId) => {
        const app = await this.project.fetchApp(appId)
        await app.fetchLatestVersion()
        const folder = app.getRootFolder()
        const zeaAppFile = folder.getFileByName('zea-app.yaml')

        if (!zeaAppFile) {
          throw new Error(
            `The connected app "${appId}" doesn't have a "zea-app.yaml" file.`
          )
        }

        const plainTextContent = await zeaAppFile.getPlainTextContent()

        const jsonContent = yaml.safeLoad(plainTextContent)

        return jsonContent
      })

      Promise.all(promises).then((fileAssociations) => {
        this.fileAssociations = fileAssociations
      })
    }
  }

  /**
   * Zea Session.
   */
  private handleZeaSession() {
    if (this.unsubFileWithProgress) {
      this.unsubFileWithProgress()
    }

    SessionFactory.setSocketURL('https://websocket-staging.zea.live')
    this.zeaSession = SessionFactory.getInstance(
      { id: 'zea-web-components' },
      this.project._id
    )
  }

  /**
   * Set folder.
   */
  private setFolder() {
    if (!this.project) {
      return
    }

    this.folder = this.folderId
      ? this.project.getFolderById(this.folderId)
      : this.project.getRootFolder()

    this.galleryFolder = this.folder.getFolderByName('gallery')

    this.loadReadmeFile()

    this.loadFileAssociations()

    this.handleZeaSession()
  }

  /**
   * Handle drop.
   * @Param {Event} e Event.
   */
  private async handleDrop(e) {
    const { files } = e.dataTransfer
    await this.folder.addFiles(files)
    await this.project.fetchLatestVersion()
    this.folder = null
    this.setFolder()
  }

  /**
   * Prevent defaults.
   * @Param {Event} e Event.
   */
  private static preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  /**
   * Fetch apps.
   */
  private async fetchAvailableApps() {
    this.availableApps = await this.project.fetchAvailableApps()
  }

  /**
   * Main render function
   * @return {JSX} the generated html
   */
  render() {
    if (!this.folder) {
      return
    }

    const childrenArray = Object.values(this.folder.children || {})
      .filter((child: any) =>
        child.name.toLowerCase().includes(this.filter.toLowerCase())
      )
      .sort((a: any, b: any) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      )

    const folders: Folder[] = childrenArray.filter(
      (folder: Folder) => folder.isFolder
    )

    const files: File[] = childrenArray.filter((file: File) => !file.isFolder)

    return (
      <div
        class={{
          ZeaFileSystemBrowser: true,
          'ZeaFileSystemBrowser--highlighted': this.isHighlighted,
        }}
        onDragEnter={(e) => {
          ZeaFileSystemBrowser.preventDefaults(e)
          this.isHighlighted = true
        }}
        onDragLeave={(e) => {
          ZeaFileSystemBrowser.preventDefaults(e)
          this.isHighlighted = false
        }}
        onDragOver={(e) => {
          ZeaFileSystemBrowser.preventDefaults(e)
          this.isHighlighted = true
        }}
        onDrop={async (e) => {
          ZeaFileSystemBrowser.preventDefaults(e)
          this.isHighlighted = false
          await this.handleDrop(e)
        }}
      >
        <div class="ZeaFileSystemBrowser__upload-overlay">
          <img src="./icon-drop-files-here.png" />
        </div>

        <div class="ZeaFileSystemBrowser__title-bar">
          <span class="flex-auto">{this.project.name}</span>
          <ion-button shape="round">
            <ion-icon slot="start" name="add" />
            new
          </ion-button>
          <ion-button fill="clear" title="Project info">
            <ion-icon name="information-circle-sharp"></ion-icon>
          </ion-button>
          <ion-button
            fill="clear"
            title="Project settings"
            onClick={() => {
              this.showProjectSettingsDialog = true
            }}
          >
            <ion-icon name="settings-sharp"></ion-icon>
          </ion-button>
          <ion-button fill="clear" title="View as list">
            <ion-icon name="list-sharp"></ion-icon>
          </ion-button>
        </div>

        <div class="ZeaFileSystemBrowser__breadcrumbs">
          <zea-breadcrumbs project={this.project} folder={this.folder} />
        </div>

        <div class="mh3">
          <div class="mb4">
            <p class="ZeaFileSystemBrowser__section-title">Folders</p>
            {folders.length ? (
              <div class="ZeaFileSystemBrowser__fs-objects">
                {folders.map((folder) => (
                  <zea-thumbnail
                    icon={<ion-icon name="folder" />}
                    zeaModelInstance={folder}
                    onDblClickThumbnail={() => {
                      this.folderId = folder.id
                      this.changeFolder.emit(folder)
                    }}
                  />
                ))}
              </div>
            ) : (
              <div>No folders.</div>
            )}
          </div>

          <div class="mb4">
            <p class="ZeaFileSystemBrowser__section-title">Files</p>
            {files.length ? (
              <div class="ZeaFileSystemBrowser__fs-objects">
                {files.map((file) => (
                  <zea-thumbnail
                    icon={<ion-icon name="document" />}
                    zeaModelInstance={file}
                    zeaSession={this.zeaSession}
                    onDblClickThumbnail={() => {
                      const forThisMediaType = this.fileAssociations.find(
                        (association) =>
                          association['media-types'].includes(file.type)
                      )

                      if (!forThisMediaType) {
                        window.alert(
                          `The file's media type (${file.type}) doesn't have a valid association.`
                        )
                        return
                      }

                      const viewWith = forThisMediaType['view-with']

                      const win = window.open(
                        `${viewWith}?project-id=${this.project._id}&file-id=${file.id}`
                      )

                      win.focus()
                    }}
                  />
                ))}
              </div>
            ) : (
              <div>No files.</div>
            )}
          </div>

          <div class="ZeaFileSystemBrowser__gallery-wrapper">
            {this.galleryFolder && (
              <zea-images-gallery
                folder={this.galleryFolder}
              ></zea-images-gallery>
            )}
          </div>

          <div class="ZeaFileSystemBrowser__readme-wrapper">
            <zea-markdown-viewer
              mdText={this.readmeTextContent}
            ></zea-markdown-viewer>
          </div>
        </div>

        {this.showProjectSettingsDialog && (
          <zea-dialog shown width="50%">
            <div slot="title">Project Settings</div>
            <div slot="body">
              <zea-tabs>
                <div slot="tab-bar">Manage Apps</div>
                <div>
                  <div class="f4 mb3">Manage Apps</div>
                  <ion-button
                    class="mb3"
                    onClick={async () => {
                      await this.fetchAvailableApps()
                      this.showAppStoreDialog = true
                    }}
                  >
                    App Store
                  </ion-button>

                  {this.project.connectedApps?.length > 0 ? (
                    <div>
                      <div class="mb3">
                        The apps below have been connected to this project.
                      </div>

                      <ion-list>
                        {this.project.connectedApps.map((appId) => {
                          return (
                            <ion-item>
                              <ion-label>{appId}</ion-label>
                              <ion-button
                                class="dark-red"
                                fill="clear"
                                slot="end"
                                title="Remove"
                                onClick={async () => {
                                  await this.project.disconnectApp(appId)
                                }}
                              >
                                <ion-icon name="close-circle-sharp"></ion-icon>
                              </ion-button>
                            </ion-item>
                          )
                        })}
                      </ion-list>
                    </div>
                  ) : (
                    <div>No apps have been connected to this project.</div>
                  )}
                </div>
                <div slot="tab-bar">Storage</div>
                <div></div>
                <div slot="tab-bar">Advanced</div>
                <div></div>
              </zea-tabs>
            </div>
          </zea-dialog>
        )}

        {this.showAppStoreDialog && (
          <zea-dialog shown width="75%">
            <div slot="title">App Store</div>
            <div slot="body">
              <ul class="list pl0 flex flex-wrap">
                {this.availableApps.map((app) => (
                  <li>
                    <button
                      class="AppItem br2 grow shadow-hover mb3 mr3 pa0"
                      title={app.name}
                      type="button"
                      onClick={async () => {
                        this.currentApp = await this.project.fetchApp(app._id)
                        await this.currentApp.fetchLatestVersion()
                        const appRootFolder = this.currentApp.getRootFolder()

                        const appReadmeFile = appRootFolder.getFileByName(
                          'readme.md'
                        )

                        if (appReadmeFile) {
                          appReadmeFile
                            .getPlainTextContent()
                            .then((plainTextContent) => {
                              this.currentAppReadmeTextContent = plainTextContent
                            })
                        }
                      }}
                    >
                      <div
                        class="AppItem__Thumbnail br2"
                        style={{
                          backgroundImage:
                            "url('https://storage.googleapis.com/zea-drive-staging-projects-assets/thumbnail-pdf-viewer.png')",
                        }}
                      ></div>
                      <div class="AppItem__Footer flex f6 items-center pa1">
                        <span class="AppItem__Name">{app.name}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </zea-dialog>
        )}

        {this.currentApp && (
          <zea-dialog shown width="80%">
            <div class="flex items-center" slot="title">
              <span class="flex-auto">{this.currentApp.name}</span>
              <ion-button
                onClick={async () => {
                  await this.project.connectApp(this.currentApp._id)
                }}
              >
                Install
              </ion-button>
            </div>
            <div slot="body">
              <zea-markdown-viewer
                mdText={this.currentAppReadmeTextContent}
              ></zea-markdown-viewer>
            </div>
          </zea-dialog>
        )}
      </div>
    )
  }
}
