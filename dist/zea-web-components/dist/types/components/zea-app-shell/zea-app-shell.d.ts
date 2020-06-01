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
    /**
     */
    userAuthenticated: EventEmitter;
    /**
     */
    userRegisteredHandler(event: any): void;
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
