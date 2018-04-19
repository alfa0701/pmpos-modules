"use strict";
/* global indexedDB, location, BroadcastChannel */
Object.defineProperty(exports, "__esModule", { value: true });
let fs = require('fs');
const FILE_NAME = './model.db';
const PREFERRED_TRIM_SIZE = 500;
function extendYTextFileDBPersistence(Y) {
    class TextFileDBPersistence extends Y.AbstractPersistence {
        constructor(opts) {
            super(opts);
        }
        init(y) {
            let cnf = this.ys.get(y);
            let room = y.room;
            if (typeof BroadcastChannel !== 'undefined') {
                cnf.channel = new BroadcastChannel('__yjs__' + room);
                cnf.channel.addEventListener('message', e => {
                    cnf.mutualExclude(function () {
                        y.transact(function () {
                            Y.utils.integrateRemoteStructs(y, new Y.utils.BinaryDecoder(e.data));
                        });
                    });
                });
            }
            else {
                cnf.channel = null;
            }
            return new Promise(r => r());
        }
        deinit(y) {
            super.deinit(y);
        }
        /**
         * Remove all persisted data that belongs to a room.
         * Automatically destroys all Yjs all Yjs instances that persist to
         * the room. If `destroyYjsInstances = false` the persistence functionality
         * will be removed from the Yjs instances.
         */
        removePersistedData(room, destroyYjsInstances = true) {
            super.removePersistedData(room, destroyYjsInstances);
            return new Promise((resolve, reject) => fs.unlink(FILE_NAME, (err) => {
                if (err) {
                    reject();
                }
                ;
                resolve();
            }));
        }
        saveUpdate(y, update) {
            let cnf = this.ys.get(y);
            if (cnf.channel !== null) {
                cnf.channel.postMessage(update);
            }
            fs.appendFile(FILE_NAME, new Buffer(update), err => {
                if (err) {
                    fs.unlink(FILE_NAME, () => { });
                }
            });
            // let t = cnf.db.transaction(['updates'], 'readwrite')
            // let updatesStore = t.objectStore('updates')
            // updatesStore.put(update)
            // let cntP = rtop(updatesStore.count())
            // cntP.then(cnt => {
            //   if (cnt >= PREFERRED_TRIM_SIZE) {
            //     this.persist(y)
            //   }
            // })
        }
        saveStruct(y, struct) {
            super.saveStruct(y, struct);
        }
        retrieve(y) {
            // let cnf = this.ys.get(y)
            fs.readFile(FILE_NAME, null, (err, nb) => {
                if (nb)
                    super.retrieve(y, nb.buffer);
                // var ab = nb.buffer;
                // console.log(ab); // all is well
                // console.log(new Uint8Array(ab)); // all is well
            });
            // let t = cnf.db.transaction(['updates', 'model'], 'readonly')
            // let modelStore = t.objectStore('model')
            // let updatesStore = t.objectStore('updates')
            // return Promise.all([rtop(modelStore.get(0)), rtop(updatesStore.getAll())])
            //   .then(([model, updates]) => {
            //     super.retrieve(y, model, updates)
            //   })
        }
    }
    Y.TextFileDB = TextFileDBPersistence;
    return TextFileDBPersistence;
}
exports.default = extendYTextFileDBPersistence;
if (typeof Y !== 'undefined') {
    extendYTextFileDBPersistence(Y); // eslint-disable-line
}
//# sourceMappingURL=y-textfiledb.js.map