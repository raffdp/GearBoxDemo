import { Component, Event, EventEmitter, h, Prop } from '@stencil/core'
import { Project } from '@zeainc/drive-lib'

@Component({
  tag: 'zea-breadcrumbs',
  styleUrl: 'zea-breadcrumbs.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaBreadcrumbs {
  /**
   * Zea project.
   */
  @Prop() project: Project

  /**
   * Current folder.
   */
  @Prop() folder

  @Event() clickFolder: EventEmitter

  /**
   * Get the breadcrumb element
   * @param {any} text The text in the breadcrumb element
   * @return {JSX} The generated JSX
   */
  private static breadcrumbEl(text) {
    return (
      <a
        href="#"
        onClick={(evt) => {
          evt.preventDefault()
        }}
      >
        {text}
      </a>
    )
  }

  /**
   * Main render method for the component
   * @return {JSX} The generated markup
   */
  render() {
    const ancestors = [this.folder]

    return (
      <div class="ZeaBreadcrumbs">
        {ZeaBreadcrumbs.breadcrumbEl(this.project.name)}
        {ancestors.length > 0 &&
          ancestors.map((folder) => (
            <span>
              <ion-icon name="arrow-dropright" />
              {ZeaBreadcrumbs.breadcrumbEl(folder.name)}
            </span>
          ))}
      </div>
    )
  }
}
