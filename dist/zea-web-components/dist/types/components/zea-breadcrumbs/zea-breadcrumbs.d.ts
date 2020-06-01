import { EventEmitter } from '../../stencil-public-runtime';
import { Project } from '@zeainc/drive-lib';
export declare class ZeaBreadcrumbs {
    /**
     * Zea project.
     */
    project: Project;
    /**
     * Current folder.
     */
    folder: any;
    clickFolder: EventEmitter;
    /**
     * Get the breadcrumb element
     * @param {any} text The text in the breadcrumb element
     * @return {JSX} The generated JSX
     */
    private static breadcrumbEl;
    /**
     * Main render method for the component
     * @return {JSX} The generated markup
     */
    render(): any;
}
