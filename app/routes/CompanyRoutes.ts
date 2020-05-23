import { Request, Response } from 'express';
import { GlobalHelper } from '../helpers/GlobalHelper';
import { CustomResponse } from '../models/GeneralModels';
import { CompanyController } from '../controllers/CompanyController';
import { ScrapCompanyDetails } from '../models/CompanyModels';
/**
 * Routes for Account Controller
 */
export class CompanyRoutes {
    public router: any;
    private companyController: CompanyController = new CompanyController();
    private globalHelper: GlobalHelper;
    constructor(express: any) {
        this.router = express.Router();
        this.globalHelper = new GlobalHelper();
        this.assignRoutes();
    }

    private assignRoutes() {

        this.router.route('/scrap_company_details')
            .post(async (req: Request, res: Response) => {
                var customResponse: CustomResponse = new CustomResponse();

                try {
                    var reqBody = req.body as ScrapCompanyDetails;
                    customResponse = await this.companyController.scrapCompanyDetails(reqBody);
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

        this.router.route('/scrap_stock_history')
            .post(async (req: Request, res: Response) => {
                var customResponse: CustomResponse = new CustomResponse();

                try {
                    var reqBody = req.body as ScrapCompanyDetails;
                    customResponse = await this.companyController.scrapCompanyDetails(reqBody);
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