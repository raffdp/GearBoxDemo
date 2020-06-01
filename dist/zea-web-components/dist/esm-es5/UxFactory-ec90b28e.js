var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import './zea-ux.esm-7961f302.js';
/** Class representing a UX factory. */
var UxFactory = /** @class */ (function () {
    /**
     * Create a UX factory.
     */
    function UxFactory() {
        this.treeItemFactories = [];
        this.widgetFactories = [];
        this.inspectorFactories = [];
    }
    /**
     * The registerInpector method.
     * @param {any} inspector - The inspector param.
     * @param {any} rule - The rule param.
     */
    UxFactory.prototype.registerInpector = function (inspector, rule) {
        this.inspectorFactories.push({ inspector: inspector, rule: rule });
    };
    /**
     * The constructInspector method.
     * @param {...object} ...args - The ...args param
     * @return {any} The return value.
     */
    UxFactory.prototype.constructInspector = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // Note: Iterate over the factories in reverse order.
        // This allows widgets to override existing widgets in special cases.
        // E.g. display a custom color picker in VR compared to the
        // material editor.
        var baseItem = args[0];
        for (var i = this.inspectorFactories.length; i-- > 0;) {
            var reg = this.inspectorFactories[i];
            if (reg.rule(baseItem)) {
                return new ((_a = reg.inspector).bind.apply(_a, __spreadArrays([void 0], args)))();
            }
        }
        console.warn("Inspector factory not found for parameter '" + baseItem.getName() + "' of class '" + baseItem.constructor.name + "'");
    };
    /**
     * The registerTreeItemElement method.
     * @param {any} treeItemElement - The treeItemElement param.
     * @param {any} rule - The rule param.
     */
    UxFactory.prototype.registerTreeItemElement = function (treeItemElement, rule) {
        this.treeItemFactories.push({ treeItemElement: treeItemElement, rule: rule });
    };
    /**
     * The constructTreeItemElement method.
     * @param {...object} ...args - The ...args param
     * @return {any} The return value.
     */
    UxFactory.prototype.constructTreeItemElement = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // Note: Iterate over the factories in reverse order.
        // This allows widgets to override existing widgets in special cases.
        // E.g. display a custom color picker in VR compared to the
        // material editor.
        var treeItem = args[0];
        for (var i = this.treeItemFactories.length; i-- > 0;) {
            var reg = this.treeItemFactories[i];
            if (reg.rule(treeItem)) {
                return new ((_a = reg.treeItemElement).bind.apply(_a, __spreadArrays([void 0], args)))();
            }
        }
        console.warn("Tree item factory not found for parameter '" + treeItem.getName() + "' of class '" + treeItem.constructor.name + "'");
    };
    /**
     * The registerWidget method.
     * @param {any} widget - The treeItemElement param.
     * @param {any} rule - The rule param.
     */
    UxFactory.prototype.registerWidget = function (widget, rule) {
        this.widgetFactories.push({ widget: widget, rule: rule });
    };
    /**
     * The findWidgetReg method.
     * @param {any} param - The param param.
     * @return {any} The return value.
     */
    UxFactory.prototype.findWidgetReg = function (param) {
        for (var i = this.widgetFactories.length; i-- > 0;) {
            var reg = this.widgetFactories[i];
            if (reg.rule(param)) {
                return reg;
            }
        }
    };
    /**
     * The constructWidget method.
     * @param {...object} ...args - The ...args param
     * @return {any} The return value.
     */
    UxFactory.prototype.constructWidget = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // Note: Iterate over the widgetFactories in reverse order.
        // This allows widgets to override existing widgets in special cases.
        // E.g. display a custom color picker in VR compared to the
        // material editor.
        var param = args[0];
        for (var i = this.widgetFactories.length; i-- > 0;) {
            var reg = this.widgetFactories[i];
            if (reg.rule(param)) {
                return new ((_a = reg.widget).bind.apply(_a, __spreadArrays([void 0], args)))();
            }
        }
        console.warn("Widget factory not found for parameter '" + param.getName() + "' of class '" + param.constructor.name + "'");
    };
    return UxFactory;
}());
var uxFactory = new UxFactory();
export { uxFactory as u };
