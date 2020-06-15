import { Component, h, Prop, Element } from '@stencil/core'

@Component({
  tag: 'zea-input-search',
  styleUrl: 'zea-input-search.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaInputSearch {
  @Element() mainElement: HTMLElement

  @Prop() placeholder: string = ''

  mainContainer
  mainInput

  /**
   * Toggle 'active' class of the search box
   */
  private toggleSearchBox() {
    this.mainContainer.classList.toggle('active')
    this.mainInput.focus()
  }

  /**
   * Main render function
   * @return {JSX} the generated html
   */
  render() {
    return (
      <div
        class="zea-input-search"
        ref={(el) => {
          this.mainContainer = el
        }}
      >
        <span
          class="zea-input-search-icon"
          onClick={() => {
            this.toggleSearchBox()
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
          >
            <path
              class="icon"
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </span>
        <span class="zea-input-search-text-container">
          <input
            ref={(el) => {
              this.mainInput = el
            }}
            onBlur={() => {
              this.mainContainer.classList.remove('active')
            }}
            onKeyDown={(e) => {
              e.stopPropagation()
            }}
            onKeyUp={(e) => {
              e.stopPropagation()
            }}
            class="zea-input-search-text"
            type="text"
            placeholder={this.placeholder}
          />
        </span>
      </div>
    )
  }
}
