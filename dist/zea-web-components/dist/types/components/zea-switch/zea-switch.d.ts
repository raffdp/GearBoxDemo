export declare class ZeaSwitch {
    private element;
    /**
     * Text/html to be displayed inside the button
     */
    name: string;
    /**
     * Whether the switch is disabled
     */
    disabled: boolean;
    /**
     * Whether the switch is checked
     */
    checked: boolean;
    /**
     * State label to show next to the switch
     */
    stateLabel: string;
    /**
     * Class to change presentation according to switch state
     */
    elementClass: string;
    /**
     * Listen for changes on the checked prop
     * @param {boolean} checked the checked state
     */
    onCheckedChanged(checked: boolean): void;
    /**
     * Listen for changes on the disabled prop
     * @param {boolean} disabled the disabled state
     */
    onDisabledChanged(disabled: boolean): void;
    /**
     * Update element class according to switch state
     */
    private updateElementClass;
    /**
     * Change switch state on click
     */
    private toggleCheck;
    /**
     * Runs when component loads
     */
    componentDidLoad(): void;
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render(): any;
}
