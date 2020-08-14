import { EventEmitter } from '../../stencil-public-runtime';
export declare class ZeaAppShell {
    hostElement: any;
    /**
     */
    logoUrl: string;
    /**
     */
    userData: any;
    /**
     */
    session: any;
    /**
     */
    leftPanelWidth: string;
    rightPanelWidth: string;
    /**
     */
    leftProgressMessage: string;
    centerProgressMessage: string;
    rightProgressMessage: string;
    /**
     */
    centerProgressBar: any;
    leftProgressBar: any;
    rightProgressBar: any;
    /**
     */
    registerDialog: any;
    registerForm: any;
    shareDialog: any;
    currentUserChip: any;
    userChipSet: any;
    toolsContainer: any;
    /**
     */
    userAuthenticated: EventEmitter;
    /**
     */
    userRegisteredHandler(event: any): void;
    /**
     */
    navDrawerOpenHandler(): void;
    /**
     */
    navDrawerClosedHandler(): void;
    /**
     */
    doUpdate(): Promise<void>;
    /**
     */
    componentWillLoad(): void;
    /**
     */
    componentDidLoad(): void;
    /**
     */
    onShareIconClick(): void;
    /**
     * Main render function
     *
     * @return {JSX} The generated html
     */
    render(): any[];
}
