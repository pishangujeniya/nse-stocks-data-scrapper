import { MySQLHelper } from '../MySQLHelper';
import { GlobalHelper } from '../GlobalHelper';
import { } from "promise";
import { BunyanHelper } from "../BunyanHelper";
import { DbHelperReturn, DatatableRequestModel } from '../../models/GeneralModels';

/**
 * Every procedure of our database should be called from here.
 * So that any parameter changes and procedure response changes can be done directly inside here rather than look to into each and every database helper.
 *  ## Why single procedure db  helper? 
 *  - Its because in MySQL Procedures are also all in one folder, they are not like individual tables related like Triggers.
 */
export class ProceduresDbHelper {
    private globalHelper: GlobalHelper;
    private globalConfig: any;

    constructor() {
        this.globalHelper = new GlobalHelper();
        this.globalConfig = this.globalHelper.getConfig("global");
    }

    /**
     * returns all users
     */
    public async getUsers(dataTableRequestParams: DatatableRequestModel): Promise<DbHelperReturn> {
        var usersReturn = new DbHelperReturn();
        try {
            // var sqlQuery = "SELECT * FROM `users`";
            var sqlQuery = "CALL get_users(?, ?, ?, ?, ?, ?, @num_rows); select @num_rows as num_rows;";
            BunyanHelper.activityLogger.info(sqlQuery);

            var args = new Array();
            args.push(
                '',
                dataTableRequestParams.search.value,
                dataTableRequestParams.columns[dataTableRequestParams.order[0]["column"]]["data"],
                dataTableRequestParams.order[0]["dir"],
                dataTableRequestParams.start,
                dataTableRequestParams.length
            );
            var results = await MySQLHelper.executeQuery(sqlQuery, args);

            if (results[0].length > 0) {
                usersReturn.isError = false;
            }
            else {
                usersReturn.isError = true;
            }

            usersReturn.result = results;
        } catch (error) {
            BunyanHelper.errorLogger.error(error);
            console.error(error);
            usersReturn.isError = true;
            usersReturn.result = error;
        }
        return usersReturn;
    }

    public async deleteUserAndDataPemenent(user_uuid: string): Promise<DbHelperReturn> {
        var deleteUserAndDataPemenentReturn = new DbHelperReturn();

        try {
            var sqlQuery = "CALL `delete_user_and_data_permanent`('" + user_uuid + "')";

            BunyanHelper.activityLogger.info(sqlQuery);

            var results = await MySQLHelper.executeQuery(sqlQuery, [
                user_uuid
            ]);

            if (results[0].length > 0) {
                deleteUserAndDataPemenentReturn.isError = false;
            }
            else {
                deleteUserAndDataPemenentReturn.isError = true;
            }

            deleteUserAndDataPemenentReturn.result = results;

        }
        catch (error) {
            BunyanHelper.errorLogger.error(error);
            console.error(error);
            deleteUserAndDataPemenentReturn.isError = true;
            deleteUserAndDataPemenentReturn.result = error;
        }
        finally {
            return deleteUserAndDataPemenentReturn;
        }
    }
}



