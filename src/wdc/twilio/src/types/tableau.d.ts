// tslint:disable-next-line:no-namespace
declare namespace tableau {
    type IAppendRows = (rows: any[]) => void;
    type IEmptyCallback = () => void;
    type IInit = (initCallback: IEmptyCallback) => void;
    type IGetData = (table: ITable, doneCallback: IEmptyCallback) => void;
    type IGetSchema = (schemaCallback: ISchemaCallback) => void;
    type ISchemaCallback = (schema: any[]) => void;

    interface ITable {
        appendRows: IAppendRows;
    }

    interface IConnector {
        init: IInit;
        getData: IGetData;
        getSchema: IGetSchema;
    }

    enum authTypeEnum {
        none = "none",
        basic = "basic",
        custom = "custom",
    }

    enum dataTypeEnum {
        bool = "bool",
        date = "date",
        datetime = "datetime",
        float = "float",
        int = "int",
        string = "string",
        geometry = "geometry",
    }

    enum phaseEnum {
        interactivePhase = "interactive",
        authPhase = "auth",
        gatherDataPhase = "gatherData",
    }

    let authType: authTypeEnum;
    let connectionName: string;
    let username: string;
    let password: string;
    let phase: phaseEnum;

    function makeConnector(): IConnector;
    function registerConnector(connector: IConnector): void;
    function submit(): void;
}
