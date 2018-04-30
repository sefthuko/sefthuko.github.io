import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { IUsageRecord, TwilioClient } from "./models/twilio";

// Create the tableauConnector object
const tableauConnector = tableau.makeConnector();

// Define the schema
tableauConnector.getSchema = (schemaCallback) => {
    const usageRecordSchemaColumns = [
        {
            alias: "Account SID",
            dataType: tableau.dataTypeEnum.string,
            description: "The Account that accrued the usage.",
            id: "account_sid",
        },
        {
            alias: "API Version",
            dataType: tableau.dataTypeEnum.string,
            description: "Version of the API used to access this data.",
            id: "api_version",
        },
        {
            alias: "Category",
            dataType: tableau.dataTypeEnum.string,
            description: "The category of usage.",
            id: "category",
        },
        {
            alias: "Count",
            dataType: tableau.dataTypeEnum.int,
            description: "The number of usage events (e.g. the number of calls).",
            id: "count",
        },
        {
            alias: "Count Unit",
            dataType: tableau.dataTypeEnum.string,
            description: "The units in which Count is measured. For example calls for calls, messages for SMS.",
            id: "count_unit",
        },
        {
            alias: "Description",
            dataType: tableau.dataTypeEnum.string,
            description: "A human-readable description of the usage category.",
            id: "description",
        },
        {
            alias: "End Date",
            dataType: tableau.dataTypeEnum.date,
            description: "The last date for which usage is included in this UsageRecord," +
                         " formatted as YYYY-MM-DD. All dates are in GMT.",
            id: "end_date",
        },
        {
            alias: "Price",
            dataType: tableau.dataTypeEnum.float,
            description: "The total price of the usage, in the currency associated with the account.",
            id: "price",
        },
        {
            alias: "Price Unit",
            dataType: tableau.dataTypeEnum.string,
            description: "The currency in which Price is measured, in ISO 4127 format (e.g. usd, eur, jpy).",
            id: "price_unit",
        },
        {
            alias: "Start Date",
            dataType: tableau.dataTypeEnum.date,
            description: "The first date for which usage is included in this UsageRecord," +
                         " formatted as YYYY-MM-DD. All dates are in GMT.",
            id: "start_date",
        },
        {
            alias: "URI",
            dataType: tableau.dataTypeEnum.string,
            description: "The URI that returns only this UsageRecord, relative to https://api.twilio.com.",
            id: "uri",
        },
        {
            alias: "Usage",
            dataType: tableau.dataTypeEnum.float,
            description: "The amount of billed usage (e.g. the number of call minutes billed for)." +
                         " This is frequently the same as Count, but may be different for certain" +
                         " usage categories like calls, where Count represents the number of calls" +
                         " and Usage represents the number of rounded, billed minutes.",
            id: "usage",
        },
        {
            alias: "Usage Unit",
            dataType: tableau.dataTypeEnum.string,
            description: "The units in which Usage is measured. For example minutes for calls, messages for SMS.",
            id: "usage_unit",
        },
    ];

    schemaCallback([{
        columns: usageRecordSchemaColumns,
        description: "Twilio Usage Data",
        id: "twilioUsageData",
    }]);
};

// Download the data
tableauConnector.getData = (table, doneCallback) => {
    const twilioClient = new TwilioClient(tableau.username, tableau.password);
    twilioClient.getUsageRecords(doneCallback, (records: IUsageRecord[]) => {
        table.appendRows(records);
    });
};

tableau.registerConnector(tableauConnector);

function getInputValue(id: string): string {
    return (document.getElementById(id) as HTMLInputElement).value;
}

// Create event listeners for when the user submits the form
window.onload = () => {
    document.getElementById("submitButton").addEventListener("click", (e: Event) => {
        tableau.connectionName = "Twilio Usage Data";
        tableau.username = getInputValue("sid");
        tableau.password = getInputValue("token");
        tableau.submit();
    });
};
