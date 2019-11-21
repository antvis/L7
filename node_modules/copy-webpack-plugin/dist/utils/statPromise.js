"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (inputFileSystem, path) {
    return new Promise(function (resolve, reject) {
        inputFileSystem.stat(path, function (err, stats) {
            if (err) {
                return reject(err);
            }

            return resolve(stats);
        });
    });
};