import { Request, Response } from 'express';
import { GlobalHelper } from '../helpers/GlobalHelper';
import { CustomResponse } from '../models/GeneralModels';
import { StockHistoryController } from '../controllers/StockHistoryController';
import { ScrapStockHistory } from '../models/StockHistoryModels';
/**
 * Routes for Account Controller
 */
export class StockHistoryRoutes {
    public router: any;
    private stockHistoryController: StockHistoryController = new StockHistoryController();
    private globalHelper: GlobalHelper;
    constructor(express: any) {
        this.router = express.Router();
        this.globalHelper = new GlobalHelper();
        this.assignRoutes();
    }

    private assignRoutes() {

        this.router.route('/scrap_stock_history')
            .post(async (req: Request, res: Response) => {
                var customResponse: CustomResponse = new CustomResponse();

                try {
                    var reqBody = req.body as ScrapStockHistory;
                    customResponse = await this.stockHistoryController.scrapStockHistory(reqBody);
                    if (customResponse.error_code != 200 && customResponse.error_code != undefined) {
                        res.status(customResponse.error_code);
                    } else {
                        res.status(200);
                    }
                } catch (error) {
                    console.log(error);
                    customResponse.error_code = 500;
                    customResponse.error_messages = "Something went wrong";
                }
                finally {
                    res.send(customResponse);
                }
            });

    }
}