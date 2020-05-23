import { MySQLHelper } from '../MySQLHelper';
import { GlobalHelper } from '../GlobalHelper';
import { BunyanHelper } from "../BunyanHelper";
import { DbHelperReturn } from '../../models/GeneralModels';

export class AccountsDbHelper {
    private globalHelper: GlobalHelper;
    private globalConfig: any;

    constructor() {
        this.globalHelper = new GlobalHelper();
        this.globalConfig = this.globalHelper.getConfig("global");
    }


    /**
     * Insert user in database
     * @param first_name first name
     * @param last_name last name
     * @param email_id email id
     * @param mobile_number mobile number in string
     * @param password password in normal string
     */
    public async insertUser(first_name: string, last_name: string, email_id: string, mobile_number: string, password: string): Promise<DbHelperReturn> {

        var insertUserReturn = new DbHelperReturn();

        try {

            let sqlQuery = ""
                + "INSERT INTO `users`"
                + "("
                + "`user_uuid`,"
                + "`first_name`,"
                + "`last_name`,"
                + "`email_id`,"
                + "`email_confirmed`,"
                + "`mobile_number`,"
                + "`mobile_confirmed`,"
                + "`password_hash`,"
                + "`kyc_confirmed`)"
                + "VALUES("
                + "?,"
                + "?,"
                + "?,"
                + "?,"
                + "?,"
                + "?,"
                + "?,"
                + "?,"
                + "?"
                + ")";

            if (this.globalConfig["settings"]["log_verbose"]) {
                BunyanHelper.activityLogger.info(sqlQuery);
            }

            var results = await MySQLHelper.executeQuery(sqlQuery, [
                this.globalHelper.getNewUUID(),
                first_name,
                last_name,
                email_id,
                0,
                mobile_number,
                0,
                this.globalHelper.hashString(password),
                0
            ]);

            if (results[0].affectedRows > 0) {
                insertUserReturn.isError = false;
            }
            else {
                insertUserReturn.isError = true;
            }

            insertUserReturn.result = results;

        } catch (error) {
            BunyanHelper.errorLogger.error(error);
            console.error(error);
            insertUserReturn.isError = true;
            insertUserReturn.result = error;
        } finally {
            return insertUserReturn;
        }

    }


}