export declare class ZeaCheckbox {
    private element;
    /**
    /**
     * Text/html to be displayed inside the button
     */
    name: string;
    /**
    /**
     * Whether the checkbox is disabled
     */
    disabled: boolean;
    /**
    /**
     * Whether the checkbox is checked
     */
    checked: boolean;
    /**
    /**
     * Class to change presentation according to checkbox state
     */
    elementClass: string;
    /**
    /**
     * Listen for changes on the checked prop
     * @param {boolean} checked New value for the checked prop
     */
    onCheckedChanged(checked: boolean): void;
    /**
    /**
     * Listen for changes on the disabled prop
     * @param {boolean} disabled New value for the disabled prop
     */
    onDisabledChanged(disabled: boolean): void;
    /**
    /**
     * Update element class according to checkbox state
     */
    private updateElementClass;
    /**
     * Change checkbox state on click
     */
    private toggleCheck;
    /**
     * Called everytime component loads
     */
    componentDidLoad(): void;
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render(): any;
}
