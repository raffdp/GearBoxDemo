import '../zea-param-widget-boolean/zea-param-widget-boolean';
import '../zea-param-widget-number/zea-param-widget-number';
import '../zea-param-widget-vec2/zea-param-widget-vec2';
import '../zea-param-widget-vec3/zea-param-widget-vec3';
import '../zea-param-widget-vec4/zea-param-widget-vec4';
import '../zea-param-widget-color/zea-param-widget-color';
import '../zea-param-widget-xfo/zea-param-widget-xfo';
import '../zea-param-widget-string/zea-param-widget-string';
import '../zea-param-widget-bbox/zea-param-widget-bbox';
export declare class ZeaParameterContainer {
    /**
     * The parameter owner.
     */
    parameterOwner: any;
    /**
     * The application data
     */
    appData: any;
    /**
     * Render method.
     * @return {JSX} The generated html
     */
    render(): any;
}
