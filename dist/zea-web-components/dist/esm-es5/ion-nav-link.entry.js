import { r as registerInstance, h, d as getElement, H as Host } from './index-12ee0265.js';
var navLink = function (el, routerDirection, component, componentProps) {
    var nav = el.closest('ion-nav');
    if (nav) {
        if (routerDirection === 'forward') {
            if (component !== undefined) {
                return nav.push(component, componentProps, { skipIfBusy: true });
            }
        }
        else if (routerDirection === 'root') {
            if (component !== undefined) {
                return nav.setRoot(component, componentProps, { skipIfBusy: true });
            }
        }
        else if (routerDirection === 'back') {
            return nav.pop({ skipIfBusy: true });
        }
    }
    return Promise.resolve(false);
};
var NavLink = /** @class */ (function () {
    function NavLink(hostRef) {
        var _this = this;
        registerInstance(this, hostRef);
        /**
         * The transition direction when navigating to another page.
         */
        this.routerDirection = 'forward';
        this.onClick = function () {
            return navLink(_this.el, _this.routerDirection, _this.component, _this.componentProps);
        };
    }
    NavLink.prototype.render = function () {
        return (h(Host, { onClick: this.onClick }));
    };
    Object.defineProperty(NavLink.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: true,
        configurable: true
    });
    return NavLink;
}());
export { NavLink as ion_nav_link };
