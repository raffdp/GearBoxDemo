import { ZeaWcDataConnector } from '../../utils/ZeaWcDataConnector';
export declare class ZeaFormDrawingSetup {
    /**
     */
    disciplines: any[];
    /**
     */
    scales: any[];
    db: ZeaWcDataConnector;
    drawingNumberInput: any;
    titleInput: any;
    disciplineInput: any;
    /**
     *
     */
    onDisciplinesSelect(value: any): void;
    /**
     *
     */
    onScalesSelect(value: any): void;
    /**
     *
     */
    componentWillLoad(): void;
    /**
     */
    render(): any;
}
