import { MySQLHelper } from '../MySQLHelper';
import { GlobalHelper } from '../GlobalHelper';
import { BunyanHelper } from "../BunyanHelper";
import { DbHelperReturn } from '../../models/GeneralModels';

export class StockHistoryDbHelper {
    private globalHelper: GlobalHelper;
    private globalConfig: any;

    constructor() {
        this.globalHelper = new GlobalHelper();
        this.globalConfig = this.globalHelper.getConfig("global");
    }

    public async insertStockHistory(
        stockHistorySingleRow: StocksHistorySingleRow
    ): Promise<DbHelperReturn> {

        var insertStockHistoryReturn = new DbHelperReturn();

        try {

            let sqlQuery = ""
                + "INSERT INTO `stocks_history`"
                + "("
                + "`company_id`,"
                + "`on_date`,"
                + "`open_price`,"
                + "`high_price`,"
                + "`low_price`,"
                + "`close_price`,"
                + "`per`,"
                + "`volume`,"
                + "`dead`"
                + ")"
                + "VALUES"
                + "("
                + "?,"
                + "(SELECT STR_TO_DATE(?,'%Y-%m-%d')),"
                + "?,"
                + "?,"
                + "?,"
                + "?,"
                + "?,"
                + "?,"
                + "? "
                + ")";

            if (this.globalConfig["settings"]["log_verbose"]) {
                BunyanHelper.activityLogger.info(sqlQuery);
            }

            let onDateValueString = "";
            if (stockHistorySingleRow.on_date != null) {
                onDateValueString = ((stockHistorySingleRow.on_date.getFullYear()) + "-" + (stockHistorySingleRow.on_date.getMonth() + 1) + "-" + (stockHistorySingleRow.on_date.getDate())).toString();
            } else {
                BunyanHelper.activityLogger.error("on_date is null");
            }

            let results = await MySQLHelper.executeQuery(sqlQuery, [
                stockHistorySingleRow.company_id,
                onDateValueString,
                stockHistorySingleRow.open_price,
                stockHistorySingleRow.high_price,
                stockHistorySingleRow.low_price,
                stockHistorySingleRow.close_price,
                stockHistorySingleRow.per,
                stockHistorySingleRow.volume,
                stockHistorySingleRow.dead == null ? 0 : stockHistorySingleRow.dead
            ]);

            if (results[0].affectedRows > 0) {
                insertStockHistoryReturn.isError = false;
            }
            else {
                insertStockHistoryReturn.isError = true;
            }

            insertStockHistoryReturn.result = results;

        } catch (error) {
            BunyanHelper.errorLogger.error(error);
            console.error(error);
            insertStockHistoryReturn.isError = true;
            insertStockHistoryReturn.result = error;
        } finally {
            return insertStockHistoryReturn;
        }

    }

    public async getStockHistory(companyId: number, orderDir: "asc" | "desc", limit: number): Promise<DbHelperReturn> {
        var getUserByReturn = new DbHelperReturn();
        try {

            let sqlQuery: string = "select * from `stocks_history` where `company_id` = ? and `dead` = ? order by `on_date` " + orderDir + " limit " + limit;

            var results = await MySQLHelper.executeQuery(sqlQuery, [companyId, 0]);

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


export class StocksHistorySingleRow {
    public id?: number;
    public company_id?: number;
    public on_date?: Date;
    public open_price?: number;
    public high_price?: number;
    public low_price?: number;
    public close_price?: number;
    public per?: number;
    public volume?: number;
    public dead?: number;
}