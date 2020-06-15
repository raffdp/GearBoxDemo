import { Component, h, Prop } from '@stencil/core'
import uxFactory from '../../assets/UxFactory.js'
import '../zea-param-widget-boolean/zea-param-widget-boolean'
import '../zea-param-widget-number/zea-param-widget-number'
import '../zea-param-widget-vec2/zea-param-widget-vec2'
import '../zea-param-widget-vec3/zea-param-widget-vec3'
import '../zea-param-widget-vec4/zea-param-widget-vec4'
import '../zea-param-widget-color/zea-param-widget-color'
import '../zea-param-widget-xfo/zea-param-widget-xfo'
import '../zea-param-widget-string/zea-param-widget-string'
import '../zea-param-widget-bbox/zea-param-widget-bbox'

@Component({
  tag: 'zea-parameter-container',
  styleUrl: 'zea-parameter-container.css',
  shadow: true,
})

/**
 * Main class for the component
 */
export class ZeaParameterContainer {
  /**
   * The parameter owner.
   */
  @Prop() parameterOwner: any

  /**
   * The application data
   */
  @Prop() appData: any

  /**
   * Render method.
   * @return {JSX} The generated html
   */
  render() {
    return (
      <div class="zea-parameter-container">
        {this.parameterOwner.getParameters().map((parameter, index) => {
          const parameterName = parameter.getName()
          const reg = uxFactory.findWidgetReg(parameter)

          if (!reg) {
            return (
              <div>
                Unable to display parameter '{parameterName}', value:
                {parameter.getValue()}, index: {index}
              </div>
            )
          }

          return (
            <div class={`zea-param-widget-wrap ${reg.widget}-wrap`}>
              <label htmlFor={parameterName}>{parameterName}</label>
              <div class="zea-parameter-input-wrap">
                <reg.widget
                  id={parameterName}
                  key={index}
                  appData={this.appData}
                  parameter={parameter}
                ></reg.widget>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
