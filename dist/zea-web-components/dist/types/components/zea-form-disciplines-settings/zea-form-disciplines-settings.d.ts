import { EventEmitter } from '../../stencil-public-runtime';
import { ZeaWcDataConnector } from '../../utils/ZeaWcDataConnector';
export declare class ZeaFormDisciplinesSettings {
    /**
     */
    contentId: string;
    /**
     */
    disciplines: any;
    /**
     */
    db: ZeaWcDataConnector;
    abbrInput: any;
    nameInput: any;
    colorInput: any;
    rowElements: any;
    editRowElements: any;
    nameElements: any;
    abbrElements: any;
    colorElements: any;
    /**
     */
    dialogResize: EventEmitter;
    /**
     */
    getDefaultDisciplines(): any[];
    /**
     */
    applyDefaultDisciplines(): Promise<unknown>;
    /**
     */
    resetDefatuls(): Promise<unknown>;
    /**
     */
    saveDiscipline(): void;
    /**
     */
    updateDiscipline(id: any): void;
    /**
     */
    refreshDisciplines(): void;
    /**
     */
    componentWillLoad(): void;
    /**
     */
    deleteDisclipline(id: any): void;
    /**
     */
    componentDidRender(): void;
    /**
     * Main render function
     * @return {JSX} The generated html
     */
    render(): any;
}
