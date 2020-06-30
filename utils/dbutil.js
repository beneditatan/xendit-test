'use strict';

class DBUtil {
    constructor(db) {
        this.db = db;
    }

    asyncDbRun(query, values) {
        return new Promise((resolve, reject) => {
            this.db.run(query, values, function(err) {
                if (err) {
                    return reject(err);
                }

                resolve(this);
            })
        })
    }

    asyncDbAll(query) {
        return new Promise((resolve, reject) => {
            this.db.all(query, function(err, rows) {
                if(err) {
                    return reject(err);
                }

                resolve(rows);
            })
        })
    }
}

module.exports = DBUtil;