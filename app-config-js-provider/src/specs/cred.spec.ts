const CONNECTION_STRING = "";
import { load } from "../AzureAppConfigurationProvider";
const settings = await load({
    endpoint: APP_CONFIG_ENDPOINT,
    credential: AZURE_CREDENTIAL
});