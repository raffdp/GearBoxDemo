import '@ionic/core';
import { EventEmitter } from '../../stencil-public-runtime';
import { Project, Folder } from '@zeainc/drive-lib';
export declare class ZeaFileSystemBrowser {
    private unsubFileWithProgress;
    private zeaSession;
    changeFolder: EventEmitter;
    /**
     * Zea project.
     */
    project: Project;
    /**
     * Folder Id inside project.
     */
    folderId: string;
    /**
     * Display only FS Objects that match this filter.
     */
    filter: string;
    /**
     * Current folder.
     */
    folder: Folder;
    galleryFolder: Folder;
    /**
     * Used for a visual effect when there is a dragging action in progress.
     */
    isHighlighted: boolean;
    showProjectSettingsDialog: boolean;
    showAppStoreDialog: boolean;
    currentApp: Project;
    currentAppReadmeTextContent: string;
    availableApps: Project[];
    readmeTextContent: string;
    fileAssociations: any;
    componentWillLoad(): void;
    componentWillUpdate(): void;
    componentDidUnload(): void;
    /**
     * Load README.md file.
     */
    private loadReadmeFile;
    /**
     * Files associations.
     */
    private loadFileAssociations;
    /**
     * Zea Session.
     */
    private handleZeaSession;
    /**
     * Set folder.
     */
    private setFolder;
    /**
     * Handle drop.
     * @Param {Event} e Event.
     */
    private handleDrop;
    /**
     * Prevent defaults.
     * @Param {Event} e Event.
     */
    private static preventDefaults;
    /**
     * Fetch apps.
     */
    private fetchAvailableApps;
    /**
     * Main render function
     * @return {JSX} the generated html
     */
    render(): any;
}
