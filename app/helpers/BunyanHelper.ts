import * as bunyan from 'bunyan';
import * as fs from 'fs';
import * as path from 'path';
import { GlobalHelper } from './GlobalHelper';
export class BunyanHelper {

    public static date = new Date().toJSON().slice(0, 10);
    // public static logsDirWithDate = path.resolve(__dirname, "..", "..", "logs", BunyanHelper.date);
    public static logDir = new GlobalHelper().getConfig("global")["settings"]["log_dir"];
    public static logsDirWithDate = path.resolve(BunyanHelper.logDir, "logs", BunyanHelper.date);

    /**
     * creates folder for logs if not available
     */
    public static createLogsDirectory(): fs.PathLike {
        if (!fs.existsSync(BunyanHelper.logsDirWithDate)) {
            fs.mkdirSync(BunyanHelper.logsDirWithDate, { recursive: true, mode: 0o777 } as fs.MakeDirectoryOptions);
        }
        return BunyanHelper.logsDirWithDate;
    };

    /**
     * writes activity logs
     */
    public static activityLogger = bunyan.createLogger({
        name: 'ACTIVITY',
        level: "info",
        src: true,
        streams: [
            {
                path: path.resolve(BunyanHelper.createLogsDirectory().toString(), "Activity.log.json")
                // `type: 'file'` is implied
            },
            {
                stream: process.stdout
            }
        ],
        serializers: {
            req: bunyan.stdSerializers.req,
            res: bunyan.stdSerializers.res,
            err: bunyan.stdSerializers.err
        }
    });

    /**
     * writes error logs
     */
    public static errorLogger = bunyan.createLogger({
        name: 'ERROR',
        level: "error",
        src: true,
        streams: [
            {
                path: path.resolve(BunyanHelper.createLogsDirectory().toString(), "Error.log.json")
            },
            {
                stream: process.stdout
            }
        ],
        serializers: {
            req: bunyan.stdSerializers.req,
            res: bunyan.stdSerializers.res,
            err: bunyan.stdSerializers.err
        }
    });

    /**
     * writes request logs
     */
    public static requestLogger = bunyan.createLogger({
        name: 'REQUEST',
        level: "warn",
        src: true,
        streams: [
            {
                path: path.resolve(BunyanHelper.createLogsDirectory().toString(), "Request.log.json")
            },
            {
                stream: process.stdout
            }
        ],
        serializers: {
            req: function auditRequestSerializer(req) {
                if (!req) {
                    return (false);
                }
                return ({
                    // account for native and queryParser plugin usage
                    query: (typeof req.query === 'function') ?
                        req.query() : req.query,
                    method: req.method,
                    url: req.url,
                    headers: req.headers,
                    httpVersion: req.httpVersion,
                    trailers: req.trailers,
                    body: req.body,
                    clientClosed: req.clientClosed
                });
            },
            res: function auditResponseSerializer(res) {
                if (!res) {
                    return (false);
                }


                var body = res._body;

                // if (options.body === true) {
                //     if (res._body instanceof HttpError) {
                //         body = res._body.body;
                //     } else {
                //         body = res._body;
                //     }
                // }

                return ({
                    statusCode: res.statusCode,
                    headers: res._headers,
                    trailer: res._trailer || false,
                    body: body
                });
            },
            err: bunyan.stdSerializers.err
        }
    });

    constructor() {
    }

    /**
     * writes activity log
     * takes params:
     * logText(any), methodName(optional)
     */
    public static writeActivityLog(logText: any, methodName?: string) {
        // var stackTrace = require("stack-trace/lib/stack-trace");
        // var thistrace = stackTrace.get();
        // var parent_name = thistrace[1].getFunctionName();
        // var parent_eval = thistrace[1].getEvalOrigin();
        BunyanHelper.activityLogger.info('Action: ' + methodName + ' | Message:', logText);
    }

    /** 
     * writes error log
     * takes params:
     * logText(any), methodName(optional)
     * */
    public static writeErrorLog(logText: any, methodName?: string) {
        BunyanHelper.errorLogger.error('Action: ' + methodName + ' | Message:', logText)
    }

}