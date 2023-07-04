const CONNECTION_STRING = "";
import { load } from "../AzureAppConfigurationProvider";

// Enable geo-relication by providing multiple connections
const settings = await load([
    {
        connectionString: CONNECTION_STRING_1
    },
    {
        connectionString: CONNECTION_STRING_2
    },
    {
        endpoint: APP_CONFIG_ENDPOINT,
        credential: getDefaultAzureCredential()
    }
]);