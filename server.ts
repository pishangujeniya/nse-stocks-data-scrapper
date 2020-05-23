import { App } from './app/app';
import { BunyanHelper } from './app/helpers/BunyanHelper';
import { GlobalHelper } from './app/helpers/GlobalHelper';

var globalHelper = new GlobalHelper();

var globalConfig = globalHelper.getConfig("global");

var PORT = globalConfig["api_details"]["api_port"];

let app = new App();

app.app.listen(PORT, () => {
    BunyanHelper.activityLogger.info("Server running on : " + PORT);
});