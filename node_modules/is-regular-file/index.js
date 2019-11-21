'use strict';

const fs = require('fs');

function isRegularFile(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stat) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    return resolve(false);
                }

                return reject(err);
            }

            resolve(stat.isFile());
        });
    });
}

function isRegularFileSync(path) {
    try {
        const stats = fs.statSync(path);

        return stats.isFile();
    } catch (err) {
        if (err.code === 'ENOENT') {
            return false;
        }

        throw err;
    }
}

module.exports = isRegularFile;
module.exports.sync = isRegularFileSync;
