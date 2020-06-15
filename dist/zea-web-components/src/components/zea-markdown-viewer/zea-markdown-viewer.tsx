import { Component, h, Prop } from '@stencil/core'
import { Remarkable } from 'remarkable'

@Component({
  tag: 'zea-markdown-viewer',
  styleUrl: 'zea-markdown-viewer.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaMarkdownViewer {
  /**
   * MD text to be converted
   */
  @Prop() mdText: string

  /**
   * Convert the MD markup to html
   * @return {string} the generated html
   */
  private convertMdToHtml() {
    const mdConverter = new Remarkable()
    return mdConverter.render(this.mdText)
  }

  /**
   * Main render function
   * @return {JSX} the generated html
   */
  render() {
    const convertedText = this.convertMdToHtml()
    return <div innerHTML={convertedText}></div>
  }
}
