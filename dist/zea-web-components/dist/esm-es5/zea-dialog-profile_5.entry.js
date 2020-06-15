import { r as registerInstance, h, c as createEvent } from './index-12ee0265.js';
var zeaDialogProfileCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-dialog-profile{color:var(--color-foreground-1)}.scrollpane-container{width:100%;height:100%;padding:10px;-webkit-box-sizing:border-box;box-sizing:border-box}";
var ZeaProfileDialog = /** @class */ (function () {
    function ZeaProfileDialog(hostRef) {
        registerInstance(this, hostRef);
        /**
         */
        this.allowClose = true;
        /**
         */
        this.shown = false;
        /**
         */
        this.showLabels = true;
    }
    /**
     */
    ZeaProfileDialog.prototype.todoCompletedHandler = function () {
        this.shown = false;
    };
    /**
     */
    ZeaProfileDialog.prototype.userRegisteredHandler = function () {
        console.log('userRegistered');
        this.shown = false;
    };
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    ZeaProfileDialog.prototype.render = function () {
        return (h("div", { class: "zea-dialog-profile" }, h("zea-dialog", { width: "320px", allowClose: this.allowClose, showBackdrop: true, shown: this.shown, addPadding: false }, h("div", { slot: "body" }, h("div", { class: "scrollpane-container" }, h("zea-scroll-pane", null, h("zea-form-profile", { userData: this.userData, showLabels: this.showLabels, welcomeHtml: "My Profile" })))))));
    };
    return ZeaProfileDialog;
}());
ZeaProfileDialog.style = zeaDialogProfileCss;
var zeaFormCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-form{color:var(--color-foreground-1)}zea-button.submit{margin-top:2em;width:100%}";
var ZeaForm = /** @class */ (function () {
    function ZeaForm(hostRef) {
        registerInstance(this, hostRef);
        /**
         */
        this.submitText = 'SUBMIT';
        /**
         */
        this.validate = true;
        /**
         */
        this.isValid = true;
        /**
         */
        this.formValue = {};
        /**
         */
        this.inputs = [];
    }
    /**
     */
    ZeaForm.prototype.getFormValue = function () {
        var _this = this;
        this.checkValidation();
        this.inputs.forEach(function (inputElement) {
            _this.formValue[inputElement.name] = inputElement.value;
        });
        return this.formValue;
    };
    /**
     */
    ZeaForm.prototype.checkValidation = function () {
        if (!this.validate) {
            return true;
        }
        for (var i = 0; i < this.inputs.length; i++) {
            var inputElement = this.inputs[i];
            if (inputElement.isValid) {
                inputElement.invalidMessageShown = false;
                this.isValid = true;
            }
            else {
                inputElement.invalidMessageShown = true;
                this.isValid = false;
                return false;
            }
        }
        return true;
    };
    /**
     */
    ZeaForm.prototype.onSubmit = function () {
        if (this.submitCallback) {
            this.submitCallback(this.getFormValue());
        }
    };
    /**
     */
    ZeaForm.prototype.componentDidRender = function () {
        this.setupChildren();
    };
    /**
     * Run some setup for the children items
     */
    ZeaForm.prototype.setupChildren = function () {
        var _this = this;
        this.formContainer
            .querySelector('slot')
            .assignedElements()
            .forEach(function (element) {
            if (element.tagName.match(/^ZEA-INPUT/i)) {
                _this.inputs.push(element);
            }
        });
    };
    // eslint-disable-next-line require-jsdoc
    ZeaForm.prototype.render = function () {
        var _this = this;
        return (h("div", { class: "zea-form", ref: function (el) { return (_this.formContainer = el); } }, h("slot", null), h("zea-button", { onClick: this.onSubmit.bind(this), class: "submit" }, this.submitText)));
    };
    return ZeaForm;
}());
ZeaForm.style = zeaFormCss;
var zeaFormProfileCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-form-profile{color:var(--color-foreground-1)}zea-form{width:280px;display:block;padding:20px;-webkit-box-sizing:border-box;box-sizing:border-box}zea-input{margin:2em 0 1em;display:block}zea-input-text{margin:1em 0 0}";
var ZeaProfileForm = /** @class */ (function () {
    function ZeaProfileForm(hostRef) {
        registerInstance(this, hostRef);
        /**
         * A test prop.
         */
        this.welcomeHtml = "Welcome to Zea Construction. We just need <br />a few details and\n  then you're ready to go.";
        /**
         * A test prop.
         */
        this.submitButtonText = 'SAVE';
        /**
         */
        this.showLabels = true;
        /**
         */
        this.userData = {};
        this.userRegistered = createEvent(this, "userRegistered", 7);
    }
    /**
     */
    ZeaProfileForm.prototype.submitCallback = function (formValues) {
        if (this.formElement.isValid) {
            this.userRegistered.emit(formValues);
        }
    };
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    ZeaProfileForm.prototype.render = function () {
        var _this = this;
        return (h("div", { class: "zea-form-profile" }, h("zea-form", { ref: function (el) { return (_this.formElement = el); }, id: "quick-access-form", submitCallback: this.submitCallback.bind(this), "submit-text": this.submitButtonText, validate: true }, this.welcomeHtml && h("div", { innerHTML: this.welcomeHtml }), h("zea-input-text", { id: "quick-access-name", label: "First Name (required)", name: "firstName", showLabel: true, required: true, value: this.userData.firstName || '' }), h("zea-input-text", { id: "quick-access-lastname", label: "Last Name", showLabel: this.showLabels, name: "lastName", value: this.userData.lastName || '' }), h("zea-input-text", { id: "quick-access-email", label: "Email", showLabel: this.showLabels, name: "email", value: this.userData.email || '' }), h("zea-input-text", { id: "quick-access-phone", label: "Phone", showLabel: this.showLabels, name: "phone", value: this.userData.phone || '' }), h("zea-input-text", { id: "quick-access-company", label: "Company", showLabel: this.showLabels, name: "company", value: this.userData.company || '' }), h("zea-input", { id: "quick-access-photo", type: "photo", label: "Photo", showLabel: this.showLabels, name: "avatar", value: this.userData.avatar || '' }), h("zea-input", { id: "quick-access-color", type: "color", label: "Color", showLabel: this.showLabels, name: "color", value: this.userData.color || '' }))));
    };
    return ZeaProfileForm;
}());
ZeaProfileForm.style = zeaFormProfileCss;
var zeaUserCardCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-user-card{color:var(--color-foreground-1);font-size:13px}.zea-user-card{min-width:290px;background-color:var(--color-background-2);display:grid;grid-template-columns:-webkit-min-content auto -webkit-min-content;grid-template-columns:min-content auto min-content;-ms-flex-align:start;align-items:flex-start;position:relative;z-index:10000000}.zea-user-card.small{min-width:280px}.user-chip-container,.user-focuser-container{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.user-focuser-container zea-icon{}.user-focuser{padding:8px}.zea-user-card .user-info{padding-left:0}.user-name{padding-top:5px;padding-bottom:4px}.user-company{color:var(--color-foreground-3)}.zea-user-card>*{padding:10px}.additional-data{grid-column-start:1;grid-column-end:4;grid-gap:1em;padding:1em;border-top:1px solid var(--color-grey-3);display:none}.additional-data.shown{display:grid}.user-phone,.user-email{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.user-phone zea-icon,.user-email zea-icon{-ms-flex-positive:0;flex-grow:0;width:32px}.profile-link{font-size:13px;color:var(--color-secondary-1);margin-top:3px;cursor:pointer}.additional-data-collapser{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;grid-column-start:span 3;padding-left:15px;padding-top:5px}.collapser-label{-ms-flex-positive:1;flex-grow:1}.small{font-size:12px}.small .additional-data{display:none !important}.small .user-company{display:none}.small .user-chip-container{padding:5px}.small .user-focuser-container{padding:0}:host-context(.overflow-entry.shown){-webkit-box-sizing:border-box;box-sizing:border-box;border:1px solid var(--color-grey-3);margin-right:10px}";
var ZeaUserCard = /** @class */ (function () {
    function ZeaUserCard(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Whether the card is for the current user session
         */
        this.isCurrentUser = false;
        /**
         * Whether to show the collpase control for additional data
         */
        this.collapsible = true;
        /**
         * Density and size of elements
         */
        this.density = 'normal';
    }
    /**
     * Initialize the shown state of additional data
     * according to whether collapsing is allowed or not
     */
    ZeaUserCard.prototype.componentWillLoad = function () {
        this.additionalDataShown = !this.collapsible;
    };
    /**
     * Show the profile editor form
     */
    ZeaUserCard.prototype.onProfileLinkClick = function () {
        this.profileDialog.shown = true;
    };
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    ZeaUserCard.prototype.render = function () {
        var _this = this;
        var firstName = this.userData.firstName || this.userData.given_name;
        var lastName = this.userData.lastName || this.userData.family_name;
        var company = this.userData.company;
        var phone = this.userData.phone;
        var email = this.userData.email;
        return (h("div", { class: "zea-user-card " + this.density }, h("div", { class: "user-chip-container" }, h("zea-user-chip", { showProfileCard: false, showTooltip: false, userData: this.userData, density: this.density == 'normal' ? 'large' : this.density })), h("div", { class: "user-info" }, h("div", { class: "user-name" }, firstName, " ", lastName), h("div", { class: "user-company" }, company), this.isCurrentUser && (h("div", { onClick: this.onProfileLinkClick.bind(this), class: "profile-link" }, "My Profile"))), !this.isCurrentUser && (h("div", { class: "user-focuser-container" }, h("div", { class: "user-focuser" }, h("zea-icon", { type: "zea", name: "find-user", size: 28 })))), !this.isCurrentUser && this.collapsible && (phone || email) && (h("div", { class: "additional-data-collapser", onClick: function () { return (_this.additionalDataShown = !_this.additionalDataShown); } }, h("span", { class: "collapser-label" }, this.additionalDataShown ? 'Less' : 'More'), h("span", { class: "collapser-icon" }, h("zea-icon", { name: this.additionalDataShown
                ? 'chevron-up-outline'
                : 'chevron-down-outline', size: 14 })))), !this.isCurrentUser && (phone || email) && (h("div", { class: {
                'additional-data': true,
                shown: this.additionalDataShown,
            } }, phone && (h("div", { class: "user-phone" }, h("zea-icon", { name: "phone-portrait-outline" }), h("span", null, phone))), email && (h("div", { class: "user-email" }, h("zea-icon", { name: "mail-outline" }), h("span", null, email))))), this.isCurrentUser && (h("zea-dialog-profile", { ref: function (el) { return (_this.profileDialog = el); }, userData: this.userData }))));
    };
    return ZeaUserCard;
}());
ZeaUserCard.style = zeaUserCardCss;
var zeaUserChipCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-chip{color:var(--color-foreground-1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.zea-chip-avatar{border:2px solid var(--color-background-2);width:32px;height:32px;border-radius:18px;color:white;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;position:relative;font-size:13px}.active .zea-chip-avatar{-webkit-box-shadow:0px 0px 1px 2px var(--color-primary-1);box-shadow:0px 0px 1px 2px var(--color-primary-1)}.avatar-image{position:absolute;top:0;left:0;bottom:0;right:0;border-radius:18px;background-size:cover;background-position:center center}.empty-user-chip{display:none}.small .zea-chip-avatar{width:28px;height:28px;border-radius:36px;font-size:13px}.small .avatar-image{border-radius:36px}.large .zea-chip-avatar{width:60px;height:60px;border-radius:36px;font-size:18px}.large .avatar-image{border-radius:36px}zea-user-card{position:absolute;margin-top:3px}zea-user-card.align-right{margin-left:-256px}.tooltip{position:absolute;padding:4px 7px;border-radius:4px;font-size:12px;color:var(--color-foreground-1);background-color:var(--color-grey-3);z-index:100000000;white-space:nowrap;margin-left:18px;-webkit-transform:translateX(-50%);transform:translateX(-50%);display:none}.zea-chip:hover .tooltip{display:block}.tooltip.bleeded-right{right:0;-webkit-transform:none;transform:none}.tooltip.bleeded-left{left:0;margin-left:0;-webkit-transform:none;transform:none}";
var ZeaUserChip = /** @class */ (function () {
    function ZeaUserChip(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Whether the chip is for the current user session
         */
        this.isCurrentUser = false;
        /**
         * Whether the chip is currently active
         */
        this.isActive = false;
        /**
         * Whether avatar images should be shown or not
         */
        this.showImages = true;
        /**
         * The density of the chip (large|normal|small|tiny)
         */
        this.density = 'normal';
        /**
         * Whether the tooltip should be shown
         */
        this.showTooltip = true;
        /**
         * Whether to ever show the profile card
         */
        this.showProfileCard = true;
        /**
         * Whether the profile card is currently shown
         */
        this.profileCardShown = false;
        /**
         * Alignment of the profile card (right|left)
         */
        this.profileCardAlign = 'left';
        /**
         * Used as background color for the chip
         */
        this.randomColor = '#000000'.replace(/0/g, function () {
            // limit the random number range so that colors
            // are not too dark nor too bright
            // eslint-disable-next-line no-bitwise
            return (~~(5 + Math.random() * 7)).toString(16);
        });
        this.zeaUserClicked = createEvent(this, "zeaUserClicked", 7);
    }
    /**
     * Listen to click events on the whole document
     * @param {any} e The event
     */
    ZeaUserChip.prototype.handleClick = function (e) {
        if (e.composedPath().includes(this.chipElement)) {
            if (!e.composedPath().includes(this.profileCardElement)) {
                this.profileCardShown = !this.profileCardShown;
            }
        }
        else {
            this.profileCardShown = false;
        }
    };
    /**
     * Handle click on user chip: emit custom zeaUserClicked event
     * @param {any} userData the userData
     */
    ZeaUserChip.prototype.onChipClick = function () {
        this.zeaUserClicked.emit(this.userData);
    };
    /**
     * On avatar over, fix tooltip position when its out of the screen
     */
    ZeaUserChip.prototype.onAvatarOver = function () {
        this.fixTooltipPosition();
    };
    /**
     * On component render, fix tooltip position when its out of the screen
     */
    ZeaUserChip.prototype.componentDidRender = function () {
        this.fixTooltipPosition();
    };
    /**
     * Fix the tooltip position if it goes out of screen
     */
    ZeaUserChip.prototype.fixTooltipPosition = function () {
        if (!this.tooltipElement)
            return;
        var bbox = this.tooltipElement.getBoundingClientRect();
        if (bbox.x + bbox.width > window.innerWidth) {
            this.tooltipElement.classList.add('bleeded-right');
        }
        else {
            this.tooltipElement.classList.remove('bleeded-right');
        }
        if (bbox.x < 0) {
            this.tooltipElement.classList.add('bleeded-left');
        }
        else {
            this.tooltipElement.classList.remove('bleeded-left');
        }
    };
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    ZeaUserChip.prototype.render = function () {
        var _this = this;
        if (!this.userData)
            return h("span", { class: "empty-user-chip" });
        // Ensure that the zea-user-chip is compatible with a variety of userData values.
        var firstName = this.userData.firstName || this.userData.given_name;
        var lastName = this.userData.lastName || this.userData.family_name;
        var avatar = this.userData.avatar || this.userData.picture;
        var initials = '';
        var backgroundColor = this.userData.color;
        {
            var firstLetter = '';
            var secondLetter = '';
            if (firstName) {
                firstLetter = firstName.charAt(0);
            }
            if (lastName) {
                secondLetter = lastName.charAt(0);
            }
            else if (firstLetter) {
                // if no last name but it does have a firstName,
                // use the firstName's second letter
                secondLetter = firstName.charAt(1);
            }
            initials = String(firstLetter + secondLetter).toUpperCase();
        }
        if (!backgroundColor) {
            backgroundColor = this.randomColor;
            this.userData.color = this.randomColor;
        }
        var containerClass = { active: this.isActive, 'zea-chip': true };
        containerClass[this.density] = true;
        return (h("div", { ref: function (el) { return (_this.chipElement = el); }, class: containerClass, onClick: this.onChipClick.bind(this) }, h("div", { class: "zea-chip-avatar", onMouseOver: this.onAvatarOver.bind(this), style: {
                backgroundColor: backgroundColor,
            } }, h("span", null, initials), this.showImages && !!avatar && (h("div", { class: "avatar-image", style: {
                backgroundImage: "url(" + avatar + ")",
            } }))), this.showTooltip && !this.profileCardShown && (h("div", { ref: function (el) { return (_this.tooltipElement = el); }, class: "tooltip" }, firstName + " " + (lastName ? lastName : ''))), this.showProfileCard && (h("zea-user-card", { collapsible: true, isCurrentUser: this.isCurrentUser, ref: function (el) { return (_this.profileCardElement = el); }, class: "align-" + this.profileCardAlign, style: { display: this.profileCardShown ? 'block' : 'none' }, userData: this.userData }))));
    };
    return ZeaUserChip;
}());
ZeaUserChip.style = zeaUserChipCss;
export { ZeaProfileDialog as zea_dialog_profile, ZeaForm as zea_form, ZeaProfileForm as zea_form_profile, ZeaUserCard as zea_user_card, ZeaUserChip as zea_user_chip };
