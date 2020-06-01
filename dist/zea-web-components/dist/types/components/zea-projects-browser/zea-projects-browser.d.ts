import '@ionic/core';
import { EventEmitter } from '../../stencil-public-runtime';
import { Project } from '@zeainc/drive-lib';
export declare class ZeaProjectsBrowser {
    dblClickProject: EventEmitter;
    /**
     * Zea projects client.
     */
    projectsClient: any;
    /**
     * Zea projects.
     */
    projects: Project[];
    showCreateProjectDialog: boolean;
    render(): any;
}
