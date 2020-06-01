import { EventEmitter } from '../../stencil-public-runtime';
import { FsObject, Project } from '@zeainc/drive-lib';
import { Session } from '@zeainc/zea-collab';
export declare class ZeaThumbnail {
    /**
     * Constructor.
     */
    constructor();
    clickThumbnail: EventEmitter;
    dblClickThumbnail: EventEmitter;
    /**
     * The Zea model instance to represent.
     */
    zeaModelInstance: FsObject | Project;
    icon: any;
    zeaSession: Session;
    isSelected: boolean;
    fileProgress: any;
    componentWillLoad(): void;
    componentWillUpdate(): void;
    /**
     * Subscribe to incoming file progress actions.
     */
    private subToFileProgress;
    /**
     * Handle click.
     */
    private handleClick;
    /**
     * Handle double click.
     */
    private handleDblClick;
    render(): any;
}
