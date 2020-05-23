import { CustomResponse } from '../models/GeneralModels';
import { SignUpRequestModel } from '../models/AccountsModels';
import { AccountsDbHelper } from '../helpers/DbHelpers/AccountsDbHelper';
import { BunyanHelper } from '../helpers/BunyanHelper';
import { GlobalHelper } from '../helpers/GlobalHelper';
import * as path from 'path';
import e = require('express');
import { request as urllibRequest, RequestOptions, HttpClientResponse } from "urllib";
import { ProceduresDbHelper } from '../helpers/DbHelpers/ProceduresDbHelper';
import { CompaniesDbHelper, CompaniesSingleRow } from '../helpers/DbHelpers/CompaniesDbHelper';
import { ScrapCompanyDetails } from '../models/CompanyModels';

export class CompanyController {
    private globalHelper: GlobalHelper;
    private companiesDbHelper: CompaniesDbHelper;
    private globalConfig: any;

    constructor() {
        this.globalHelper = new GlobalHelper();
        this.companiesDbHelper = new CompaniesDbHelper();
        this.globalConfig = this.globalHelper.getConfig("global");
    }

    public async scrapCompanyDetails(req: ScrapCompanyDetails): Promise<CustomResponse> {
        var customResponse = new CustomResponse();
        try {

            const urlToRequest: string = "https://indiawealth.in/api/v1/explore/stocks/?type=all&sortKey=mCap&sortOrder=desc&offset=0&limit=20&category=all&searchFor=" + req.symbol_code;

            var requestHeaders = {
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site",
                    referer: "https://www.indmoney.com/stocks/all/?sortKey=name&shouldReverse=0&selectedCategoryId=all&page=1&query=INFY",
                },
                method: "GET",
            } as RequestOptions;

            await urllibRequest(urlToRequest, requestHeaders)
                .then(
                    async (value: HttpClientResponse<any>) => {
                        var responseBody = JSON.parse(value.data.toString());

                        const responseSymbol = responseBody["data"][0]["symbol"];
                        const responseMarketExchange = responseBody["data"][0]["exchange"];
                        const responseCompanyName = responseBody["data"][0]["name"];
                        const responseCompanySector = responseBody["data"][0]["sector"];
                        const responseCompanyIsIn = responseBody["data"][0]["isin"];
                        const responseCompanyMfSector = responseBody["data"][0]["mfSector"];
                        const responseCompanyCode = responseBody["data"][0]["companyCode"];

                        const singleCompanyRow = {
                            company_symbol_code: responseSymbol,
                            company_name: responseCompanyName,
                            company_sector: responseCompanySector,
                            market_exchange: responseMarketExchange,
                            isin: responseCompanyIsIn,
                            company_mf_sector: responseCompanyMfSector,
                            other_data: {
                                indmoney_company_code: responseCompanyCode
                            }
                        } as CompaniesSingleRow;


                        var insertCompanyResult = await this.companiesDbHelper.insertCompany(singleCompanyRow);

                        if (insertCompanyResult.isError) {
                            customResponse.error_code = 500;
                            customResponse.error_messages = insertCompanyResult.result instanceof Array ? 'Scrapped Successfully but, failed to Store Company Details' : insertCompanyResult.result;
                            customResponse.result = null;
                        } else {
                            // Successfully inserted the user row
                            customResponse.error_code = 200;
                            customResponse.result = responseBody;
                        }

                    },
                    (reason: any) => {
                        console.error(reason);
                        customResponse.error_code = 500;
                        customResponse.error_messages = 'Failed to Scrap Company Details';
                        customResponse.result = null;
                    }
                )
                .catch(
                    (error: any) => {
                        console.error(error);
                        customResponse.error_code = 500;
                        customResponse.error_messages = 'Something went wrong';
                        customResponse.result = null;
                    }
                );

        } catch (error) {
            BunyanHelper.errorLogger.error(error);
            console.error(error);
            customResponse.error_code = 500;
            customResponse.error_messages = "Something went wrong";
            customResponse.result = error;
        } finally {
            return customResponse;
        }
    }
}


