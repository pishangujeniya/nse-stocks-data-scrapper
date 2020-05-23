import { readFileSync } from "fs";
import { join } from "path";
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';



export class GlobalHelper {

    constructor() {

    }

    public getConfig(fileName: "global" | "payment"): any {
        let configJson = JSON.parse(readFileSync(join(__dirname, '../configs', fileName + ".json"), 'utf8'));
        return configJson;
    }

    public getNewUUID(): string {
        return uuid.v4();
    }

    /**
     * Hashing of string using bcrypt.
     * salt is inside static passed, if the value of salt is changed then it will make each and every password expire.
     * @param str string hash
     */
    public hashString(str: string): string {
        return bcrypt.hashSync(str, 10);
    }

    public verifyHash(hashString: string, rawStr: string): boolean {
        if (bcrypt.compareSync(rawStr, hashString)) {
            return true;
        } else {
            return false;
        }
    }


    public escapeRegExp(str: string) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    public replaceAll(str: string, find: string, replace: string) {
        return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
    }

    /**
     * @return Dat in MySQL TIMESTAMP Format
     * @param inputDate date in typescript date datatype
     */
    public getMySQLDateFormat(inputDate: Date) {

        if (inputDate == null) {
            inputDate = new Date();
        }

        const result = inputDate.getFullYear() + '-' +
            ('00' + (inputDate.getMonth() + 1)).slice(-2) + '-' +
            ('00' + inputDate.getDate()).slice(-2) + ' ' +
            ('00' + inputDate.getHours()).slice(-2) + ':' +
            ('00' + inputDate.getMinutes()).slice(-2) + ':' +
            ('00' + inputDate.getSeconds()).slice(-2);

        // let result = inputDate.toISOString().slice(0, 19).replace('T', ' ');

        // console.log('getMySQLDateFormat | input : ' + inputDate + ' | output : ' + result);

        return result;
    }

    /**
     * @return Javascript date datatype.
     * @param inputDate mysql datetime string
     */
    public getJavaScriptDateFromMySQLDateString(inputDate: string): Date {

        let t = null;
        let result;

        t = inputDate.split(/[- :]/);
        var x = Array<number>();
        for (let index = 0; index < t.length; index++) {
            x.push(Number(t[index]));
        }
        // when t[3], t[4] and t[5] are missing they defaults to zero
        // you should be using new Date(Date.UTC(...)) other wise the answer is wrong by up to 24 hours
        result = new Date(Number(x[0]), Number(Number(x[1]) - 1), x[2], x[3] || 0, x[4] || 0, x[5] || 0);

        // console.log('getJavaScriptDateFromMySQLDateString | input : ' + inputDate + ' | output : ' + result);

        return result;
    }

    /**
    * @return Unique array of objects
    * @param userData Array of any object
     */
    public removeDuplicateFromArrayOfObjects(userData: any[]) {
        const uniqueArray = userData.filter((data, index) => {
            const stringfyData = JSON.stringify(data);
            return index === userData.findIndex(obj => {
                return JSON.stringify(obj) === stringfyData;
            });
        });
        return uniqueArray;
    }

}