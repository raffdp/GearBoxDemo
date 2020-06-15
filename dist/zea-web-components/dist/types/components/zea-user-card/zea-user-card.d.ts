export declare class ZeaUserCard {
    /**
     */
    userData: any;
    /**
     * Whether the card is for the current user session
     */
    isCurrentUser: boolean;
    /**
     * Whether to show the collpase control for additional data
     */
    collapsible: boolean;
    /**
     * Whether additional data is currently shown
     */
    additionalDataShown: boolean;
    /**
     * Density and size of elements
     */
    density: string;
    profileDialog: any;
    /**
     * Initialize the shown state of additional data
     * according to whether collapsing is allowed or not
     */
    componentWillLoad(): void;
    /**
     * Show the profile editor form
     */
    onProfileLinkClick(): void;
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render(): any;
}
