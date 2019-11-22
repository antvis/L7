"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isWindows = /^win/.test(process.platform);
var logOnError = function (error) {
    if (error) {
        console.error(error);
    }
};
function createQueuedSender(childProcess) {
    if (isWindows) {
        var msgQueue_1 = [];
        var isSending_1 = false;
        var cb_1 = function (error) {
            logOnError(error);
            if (msgQueue_1.length > 0) {
                setImmediate(doSendLoop_1);
            }
            else {
                isSending_1 = false;
            }
        };
        var doSendLoop_1 = function () {
            ;
            childProcess.send(msgQueue_1.shift(), cb_1);
        };
        var send = function (msg) {
            msgQueue_1.push(msg);
            if (isSending_1) {
                return;
            }
            isSending_1 = true;
            doSendLoop_1();
        };
        return { send: send };
    }
    else {
        var send = function (msg) {
            ;
            childProcess.send(msg, logOnError);
        };
        return { send: send };
    }
}
exports.createQueuedSender = createQueuedSender;
//# sourceMappingURL=send.js.map