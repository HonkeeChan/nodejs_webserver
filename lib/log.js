/**
 * Created by MH-JCZ on 2016/7/14.
 */

var log4js = require('log4js');
log4js.configure({
        "appenders": [
            {"type": "console"}
        ],
        "levels":{ "normal": "DEBUG"}
});
var logger = log4js.getLogger("normal");

exports.logger = logger;
exports.use = function (app) {
    app.use(log4js.connectLogger(logger, {level: 'debug', format: ':method :url'}));
};