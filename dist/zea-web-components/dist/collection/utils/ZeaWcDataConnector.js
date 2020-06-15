import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);
/**
 */
class ZeaWcDataConnector {
    /**
     *
     */
    getDb(dataType) {
        const localDB = new PouchDB(dataType, {
            auto_compaction: true,
        });
        return localDB;
    }
    /**
     */
    upsertDoc(data) {
        return new Promise((resolve, reject) => {
            if (!data || !('type' in data) || !data.type) {
                const err = 'ZeaWcDataConnector: Data must have a type property';
                console.error(err);
                resolve(err);
            }
            const db = this.getDb(data.type);
            const doPut = () => {
                db.put(data)
                    .then(function (response) {
                    resolve(response);
                })
                    .catch((err) => {
                    reject(err);
                });
            };
            if (data._id) {
                db.get(data._id)
                    .then((doc) => {
                    data = Object.assign(Object.assign({}, doc), data);
                    doPut();
                })
                    .catch(() => {
                    doPut();
                });
            }
            else {
                data._id = `${data.type}|${new Date().getTime()}`;
                doPut();
            }
        });
    }
    /**
     */
    getDoc(id) {
        return new Promise((resolve) => {
            if (!id) {
                const err = 'ZeaWcDataConnector: Id must be provided';
                console.error(err);
                resolve(err);
            }
            const type = id.split('|', 0);
            const db = this.getDb(type);
            db.get(id)
                .then((doc) => {
                resolve(doc);
            })
                .catch(function (err) {
                console.error(err);
                resolve(err);
            });
        });
    }
    /**
     */
    deleteDoc(id) {
        return new Promise((resolve, reject) => {
            if (!id) {
                const err = 'ZeaWcDataConnector: Id to delete must be provided';
                console.error(err);
                resolve(err);
            }
            const type = id.split('|')[0];
            const db = this.getDb(type);
            db.get(id)
                .then((doc) => {
                doc._deleted = true;
                this.upsertDoc(doc)
                    .then(() => {
                    resolve(doc);
                })
                    .catch(function (err) {
                    console.error(err);
                    reject(err);
                });
            })
                .catch(function (err) {
                console.error(err);
                reject(err);
            });
        });
    }
    /**
     */
    getDocs(options) {
        return new Promise((resolve, reject) => {
            const defaults = {
                limit: 10,
                skip: 0,
            };
            options = Object.assign(Object.assign({}, defaults), options);
            if (!options.type) {
                const err = 'ZeaWcDataConnector: Type must be provided';
                console.error(err);
                resolve(err);
            }
            const db = this.getDb(options.type);
            const selector = {};
            db.find({
                selector: selector,
                limit: options.limit,
                skip: options.skip,
            })
                .then(function (response) {
                resolve(response);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    }
    /**
     */
    destroyDb(name) {
        return new Promise((resolve, reject) => {
            this.getDb(name)
                .destroy()
                .then(() => {
                resolve();
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
}
export { ZeaWcDataConnector };
