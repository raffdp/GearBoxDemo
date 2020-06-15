import { r as registerInstance, c as createEvent } from './index-12ee0265.js';
var RouteRedirect = /** @class */ (function () {
    function RouteRedirect(hostRef) {
        registerInstance(this, hostRef);
        this.ionRouteRedirectChanged = createEvent(this, "ionRouteRedirectChanged", 7);
    }
    RouteRedirect.prototype.propDidChange = function () {
        this.ionRouteRedirectChanged.emit();
    };
    RouteRedirect.prototype.connectedCallback = function () {
        this.ionRouteRedirectChanged.emit();
    };
    Object.defineProperty(RouteRedirect, "watchers", {
        get: function () {
            return {
                "from": ["propDidChange"],
                "to": ["propDidChange"]
            };
        },
        enumerable: true,
        configurable: true
    });
    return RouteRedirect;
}());
export { RouteRedirect as ion_route_redirect };
