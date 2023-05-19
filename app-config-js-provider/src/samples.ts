import { AzureAppConfigProvider } from "./";
import { getDefaultAzureCredential } from "@azure/identity";

const AZURE_APP_CONFIG_ENDPOINT = "https://myappconfig.azconfig.io";
const AZURE_APP_CONFIG_CONNECTION_STRING = "Endpoint=https://myappconfig.azconfig.io;Id=xxx;Secret=xxx";

async function connectionStringSample() {
    const provider = new AzureAppConfigProvider({
        connectionString: AZURE_APP_CONFIG_CONNECTION_STRING
    });
    const configs = await provider.load();
}

async function credentialSample() {
    const provider = new AzureAppConfigProvider({
        endpoint: AZURE_APP_CONFIG_ENDPOINT,
        credential: getDefaultAzureCredential()
    });
}

async function filterSample() {
    const provider = new AzureAppConfigProvider({
        connectionString: AZURE_APP_CONFIG_CONNECTION_STRING
    }, {
        selects: [{
            keyFilter: "testApp.*",
            labelFilter: "dev"
        }]
    });
}
