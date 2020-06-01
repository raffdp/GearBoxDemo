'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-81865576.js');

const zeaProgressBarCss = ":host,input,button,select,textarea{font-family:'Roboto', sans-serif}.zea-progress-bar{position:absolute;bottom:0;left:0;width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden}.progress{overflow:hidden;max-width:100%;-webkit-transition:width 0.4s;transition:width 0.4s}.indeterminate .progress{position:absolute;-webkit-animation-name:indeterminate_progress_continuous;animation-name:indeterminate_progress_continuous;-webkit-animation-duration:1.4s;animation-duration:1.4s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-timing-function:linear;animation-timing-function:linear}.indeterminate.pulsating .progress{position:absolute;width:20% !important;-webkit-animation-name:indeterminate_progress_pulsating;animation-name:indeterminate_progress_pulsating;-webkit-animation-duration:1.4s;animation-duration:1.4s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-timing-function:linear;animation-timing-function:linear}@-webkit-keyframes indeterminate_progress_continuous{0%{width:0;left:0}50%{width:100%;left:0}100%{width:0%;left:100%}}@keyframes indeterminate_progress_continuous{0%{width:0;left:0}50%{width:100%;left:0}100%{width:0%;left:100%}}@-webkit-keyframes indeterminate_progress_pulsating{0%{width:0;left:0}25%{width:30%;left:0}50%{width:50%;left:25%}75%{width:30%;left:75%}100%{width:0%;left:100%}}@keyframes indeterminate_progress_pulsating{0%{width:0;left:0}25%{width:30%;left:0}50%{width:50%;left:25%}75%{width:30%;left:75%}100%{width:0%;left:100%}}";

const ZeaProgressBar = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        /**
         * The bar type (determinate | indeterminate)
         */
        this.type = 'determinate';
        /**
         * The progress (width) percentage for the bar
         */
        this.percent = 50;
        /**
         * The size (height) of the progress bar
         */
        this.size = 3;
        /**
         * The color for the bar
         */
        this.color = 'var(--color-primary-1)';
        /**
         * The color for the background track
         */
        this.backgroundColor = 'var(--color-primary-3)';
        /**
         * The animation type for the indeterminate bar ( continuous | pulsating)
         */
        this.indeterminateAnimation = 'continuous';
    }
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render() {
        return (index.h("div", { class: `zea-progress-bar ${this.type} ${this.indeterminateAnimation}`, style: {
                backgroundColor: this.backgroundColor,
                height: this.size + 'px',
            } }, index.h("div", { class: "progress", style: {
                width: this.percent + '%',
                height: this.size + 'px',
                backgroundColor: this.color,
            } })));
    }
};
ZeaProgressBar.style = zeaProgressBarCss;

exports.zea_progress_bar = ZeaProgressBar;
