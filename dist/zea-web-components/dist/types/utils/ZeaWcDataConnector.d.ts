/// <reference types="pouchdb-find" />
/// <reference types="pouchdb-core" />
/// <reference types="pouchdb-mapreduce" />
/// <reference types="pouchdb-replication" />
/**
 */
declare class ZeaWcDataConnector {
    /**
     *
     */
    getDb(dataType: any): PouchDB.Database<{}>;
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
