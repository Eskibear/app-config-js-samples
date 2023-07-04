const CONNECTION_STRING = "";
import { load } from "../AzureAppConfigurationProvider";
const settings = await load({
    connectionString: CONNECTION_STRING
});