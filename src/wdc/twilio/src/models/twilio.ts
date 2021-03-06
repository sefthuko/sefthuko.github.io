import * as request from "request";

export interface IUsageRecord {
    account_sid: string;
    api_version: string;
    category: string;
    count: number;
    count_unit: string;
    description: string;
    end_date: string;
    price: number;
    price_unit: string;
    start_date: string;
    uri: string;
    usage: number;
    usage_unit: string;
}

interface IUsageResponse {
    usage_records: IUsageRecord[];
    next_page_uri: string;
}

export class TwilioClient {
    private sid: string;
    private token: string;
    private PAGE_SIZE = 1000;

    constructor(sid: string, token: string) {
        this.sid = sid;
        this.token = token;
    }

    public getDailyCallUsageRecords(doneCallback: () =>  void, callback: (elem: any) => void): void {
        // tslint:disable-next-line:max-line-length
        this.get(`https://api.twilio.com/2010-04-01/Accounts/${this.sid}/Usage/Records/Daily.json?Category=calls&PageSize=${this.PAGE_SIZE}`,
            doneCallback,
            (body) => {
                callback(body);
            });
    }

    private get(url: string, doneCallback: () => void, callback: (records: IUsageRecord[]) => void) {
        const options = {
            auth: {
                password: this.token,
                user: this.sid,
            },
            json: true,
            url,
        };

        request(options, (err, response, resp: IUsageResponse) => {
            if (typeof resp.usage_records !== "undefined") {
                callback(resp.usage_records);
            } else {
                doneCallback();
                return;
            }

            if (resp.next_page_uri !== null) {
                this.get(`https://api.twilio.com${resp.next_page_uri}`, doneCallback, callback);
            } else {
                doneCallback();
            }
        });
    }
}
