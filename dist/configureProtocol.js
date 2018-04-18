"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Y = require('yjs');
require('y-array/y-array.js');
require('y-memory');
require('y-map');
require('y-indexeddb')(Y);
// require('y-websockets-client')(Y);
const y_websockets_client_1 = require("./lib/y-websockets-client");
exports.default = (enablePersistence, terminalId, networkName, user, onConnect, onChatEvent, onConfigEvent, onCommitEvent) => {
    y_websockets_client_1.default(Y);
    const persistence = enablePersistence ? new Y.IndexedDB() : undefined;
    let y = new Y(networkName, {
        connector: {
            name: 'websockets-client',
            url: 'https://my-websockets-server.herokuapp.com/'
        }
    }, persistence);
    let chatprotocol = y.define('chat', Y.Array);
    let commitProtocol = y.define('commits', Y.Array);
    let configProtocol = y.define('config', Y.Map);
    onConnect(chatprotocol, commitProtocol, configProtocol);
    configProtocol.observe(event => {
        let value = event.target;
        let config = value.keys().reduce((r, key) => r.set(key, value.get(key)), new Map());
        onConfigEvent(config);
    });
    commitProtocol.observe(event => {
        let elements = Array.from(event.addedElements);
        let commits = elements.reduce((r, e) => {
            r.push(...e._content);
            return r;
        }, []);
        onCommitEvent(commits);
    });
    chatprotocol.observe(event => {
        let elements = Array.from(event.addedElements);
        let messages = elements.reduce((r, e) => {
            r.push(...e._content);
            return r;
        }, []);
        onChatEvent(messages);
        if (chatprotocol.length > 10) {
            chatprotocol.delete(0, chatprotocol.length - 10);
        }
    });
};
//# sourceMappingURL=configureProtocol.js.map