import { EventEmitter } from '../../stencil-public-runtime';
export declare class ZeaProfileForm {
    /**
     * A test prop.
     */
    welcomeHtml: string;
    /**
     * A test prop.
     */
    submitButtonText: string;
    /**
     */
    showLabels: boolean;
    /**
     */
    userData: any;
    /**
     */
    formElement: any;
    /**
     */
    userRegistered: EventEmitter;
    /**
     */
    submitCallback(formValues: any): void;
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render(): any;
}
