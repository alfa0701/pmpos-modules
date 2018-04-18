var Y = require('yjs');
require('y-array/y-array.js');
require('y-memory');
require('y-map');
require('y-indexeddb')(Y);
import yclient from './lib/y-websockets-client';
export default (function (terminalId, networkName, user, onConnect, onChatEvent, onConfigEvent, onCommitEvent) {
    yclient(Y);
    var persistence = new Y.IndexedDB();
    var y = new Y(networkName, {
        connector: {
            name: 'websockets-client',
            url: 'https://my-websockets-server.herokuapp.com/'
        }
    }, persistence);
    var chatprotocol = y.define('chat', Y.Array);
    var commitProtocol = y.define('commits', Y.Array);
    var configProtocol = y.define('config', Y.Map);
    onConnect(chatprotocol, commitProtocol, configProtocol);
    configProtocol.observe(function (event) {
        var value = event.target;
        var config = value.keys().reduce(function (r, key) { return r.set(key, value.get(key)); }, new Map());
        onConfigEvent(config);
    });
    commitProtocol.observe(function (event) {
        var elements = Array.from(event.addedElements);
        var commits = elements.reduce(function (r, e) {
            r.push.apply(r, e._content);
            return r;
        }, []);
        onCommitEvent(commits);
    });
    chatprotocol.observe(function (event) {
        var elements = Array.from(event.addedElements);
        var messages = elements.reduce(function (r, e) {
            r.push.apply(r, e._content);
            return r;
        }, []);
        onChatEvent(messages);
        if (chatprotocol.length > 10) {
            chatprotocol.delete(0, chatprotocol.length - 10);
        }
    });
});
//# sourceMappingURL=configureProtocol.js.map