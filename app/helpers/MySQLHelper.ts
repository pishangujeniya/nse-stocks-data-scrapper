import * as mysql from 'mysql2';
import { BunyanHelper } from './BunyanHelper';
import { GlobalHelper } from './GlobalHelper';
export class MySQLHelper {

    private static globalConfig = new GlobalHelper().getConfig("global")["database"];

    private static host = MySQLHelper.globalConfig["host"];
    private static port = MySQLHelper.globalConfig["port"];
    private static username = MySQLHelper.globalConfig["username"];
    private static password = MySQLHelper.globalConfig["password"];
    private static database = MySQLHelper.globalConfig["db_name"];
    private static maxConnectionLimit = MySQLHelper.globalConfig["max_connections"];

    private static mysqlPool = mysql.createPool(
        {
            host: MySQLHelper.host,
            port: MySQLHelper.port,
            user: MySQLHelper.username,
            password: MySQLHelper.password,
            database: MySQLHelper.database,
            connectTimeout: 111111111,
            waitForConnections: true,
            connectionLimit: MySQLHelper.maxConnectionLimit,
            queueLimit: 0,
            multipleStatements: true
        }
    );

    private static promisePool = MySQLHelper.mysqlPool.promise();

    /**
     * Executes Query
     * @param sql sql statement (prepared) to execute
     * @param args arguments array for question marks
     */
    public static async executeQuery(sql: string, args?: any) {
        try {

            const results = await MySQLHelper.promisePool.query(sql, args);

            return results;
        } catch (error) {
            BunyanHelper.errorLogger.error(error);
            console.error(error);
            throw error;
        } finally {

        }
    }

}