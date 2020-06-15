/**
 */
declare class ZeaWcDataConnector {
    /**
     *
     */
    getDb(dataType: any): any;
    /**
     */
    upsertDoc(data: any): Promise<unknown>;
    /**
     */
    getDoc(id: any): Promise<unknown>;
    /**
     */
    deleteDoc(id: any): Promise<unknown>;
    /**
     */
    getDocs(options: any): Promise<unknown>;
    /**
     */
    destroyDb(name: any): Promise<unknown>;
}
export { ZeaWcDataConnector };
