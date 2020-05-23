import { Request, Response } from 'express';
import { AccountsController } from '../controllers/AccountsController';
import { SignUpRequestModel } from '../models/AccountsModels';
import { GlobalHelper } from '../helpers/GlobalHelper';
import { CustomResponse } from '../models/GeneralModels';
/**
 * Routes for Account Controller
 */
export class AccountsRoutes {
    public router: any;
    private accountsController: AccountsController = new AccountsController();
    private globalHelper: GlobalHelper;
    constructor(express: any) {
        this.router = express.Router();
        this.globalHelper = new GlobalHelper();
        this.assignRoutes();
    }

    private assignRoutes() {

        /**
         * login
         */
        this.router.route('/signup')
            .post(async (req: Request, res: Response) => {
                var customResponse: CustomResponse = new CustomResponse();

                try {
                    var reqBody = req.body as SignUpRequestModel;
                    customResponse = await this.accountsController.signUpUser(reqBody);
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