import { MySQLHelper } from '../MySQLHelper';
import { GlobalHelper } from '../GlobalHelper';
import { BunyanHelper } from "../BunyanHelper";
import { DbHelperReturn } from '../../models/GeneralModels';

export class CompaniesDbHelper {
    private globalHelper: GlobalHelper;
    private globalConfig: any;

    constructor() {
        this.globalHelper = new GlobalHelper();
        this.globalConfig = this.globalHelper.getConfig("global");
    }

    public async insertCompany(
        companySingleRow: CompaniesSingleRow
    ): Promise<DbHelperReturn> {

        var insertCompanyReturn = new DbHelperReturn();

        try {

            let sqlQuery = ""
                + "INSERT INTO `companies`"
                + "("
                + "`company_symbol_code`,"
                + "`market_exchange`,"
                + "`company_name`,"
                + "`company_sector`,"
                + "`isin`,"
                + "`company_mf_sector`,"
                + "`other_data`,"
                + "`dead`"
                + ")"
                + "VALUES"
                + "("
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
                companySingleRow.company_symbol_code?.toUpperCase(),
                companySingleRow.market_exchange?.toUpperCase(),
                companySingleRow.company_name,
                companySingleRow.company_sector?.toUpperCase(),
                companySingleRow.isin?.toUpperCase(),
                companySingleRow.company_mf_sector,
                JSON.stringify(companySingleRow.other_data),
                companySingleRow.dead == null ? 0 : companySingleRow.dead
            ]);

            if (results[0].affectedRows > 0) {
                insertCompanyReturn.isError = false;
            }
            else {
                insertCompanyReturn.isError = true;
            }

            insertCompanyReturn.result = results;

        } catch (error) {
            BunyanHelper.errorLogger.error(error);
            console.error(error);
            insertCompanyReturn.isError = true;
            insertCompanyReturn.result = error;
        } finally {
            return insertCompanyReturn;
        }

    }


    public async getCompanyBy(condition: "id" | "company_symbol_code", conditionValue: string, dead: 0 | 1): Promise<DbHelperReturn> {
        var getUserByReturn = new DbHelperReturn();
        try {            
            let sqlQuery: string = "";

            switch (condition) {
                case "id":
                    sqlQuery = "SELECT * FROM `companies` where `companies`.`id` = ? and `companies`.`dead` = ?";
                    break;
                case "company_symbol_code":
                    sqlQuery = "SELECT * FROM `companies` where `companies`.`company_symbol_code` = ? and `companies`.`dead` = ?";
                    break;
                default:
                    throw "Invalid condition";
            }

            var results = await MySQLHelper.executeQuery(sqlQuery, [conditionValue, dead]);

            if (results[0].length > 0) {
                getUserByReturn.isError = false;
            }
            else {
                getUserByReturn.isError = true;
            }

            getUserByReturn.result = results;

        } catch (error) {
            BunyanHelper.errorLogger.error(error);
            console.error(error);
            getUserByReturn.isError = true;
            getUserByReturn.result = error;
        } finally {
            return getUserByReturn;
        }

    }



}


export class CompaniesSingleRow {
    public id?: number;
    public company_symbol_code?: string;
    public market_exchange?: string;
    public company_name?: string;
    public company_sector?: string;
    public isin?: string;
    public company_mf_sector?: string;
    public other_data?: CompaniesOtherDataJson;
    public dead?: number;
    public modified_dtm?: Date;
    public created_dtm?: Date;
}

export class CompaniesOtherDataJson {
    public indmoney_company_code?: number;
}