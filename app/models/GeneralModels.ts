import { GlobalHelper } from "../helpers/GlobalHelper";

export class DbHelperReturn {
    public isError: boolean;
    public result?: any;
    constructor() {
        this.isError = true;
    }
}

export class CustomResponse {

    app_version?: string;
    error_code?: number;
    error_messages?: string;
    result?: any;

    constructor() {
        this.app_version = new GlobalHelper().getConfig("global")["api_details"]["app_version"];
        this.error_code = 500;
    }

}
/**
 * Datatable Request Model
 */
export class DatatableRequestModel {
    draw: number;
    columns: Array<{
        data: string;
        name: string;
        searhable: boolean;
        orderable: boolean;
        search: {
            value: string;
            regex: boolean;
        }
    }>;
    order: Array<{
        column: number;
        dir: string;
    }>;
    start: number;
    length: number;
    search: {
        value: string;
        regex: boolean;

    };
    constructor() {
        this.draw = 0;
        this.columns = [];
        this.order = [
            {
                column: 0,
                dir: 'asc'
            }
        ];
        this.start = 0;
        this.length = 0;
        this.search = {
            value: '',
            regex: false
        }
    }
}