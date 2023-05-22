// NOTE: this file won't be compiled into the package. Just for demo purpose.

import { AzureAppConfigurationProvider } from "./";
import { getDefaultAzureCredential } from "@azure/identity";

const AZURE_APP_CONFIG_ENDPOINT = "https://myappconfig.azconfig.io";
const AZURE_APP_CONFIG_CONNECTION_STRING = "Endpoint=https://myappconfig.azconfig.io;Id=xxx;Secret=xxx";

async function connectionStringSample() {
    const provider = new AzureAppConfigurationProvider({
        connectionString: AZURE_APP_CONFIG_CONNECTION_STRING
    });
    const configs = await provider.load();
}

async function credentialSample() {
    const provider = new AzureAppConfigurationProvider({
        endpoint: AZURE_APP_CONFIG_ENDPOINT,
        credential: getDefaultAzureCredential()
    });
}

async function filterSample() {
    const provider = new AzureAppConfigurationProvider({
        connectionString: AZURE_APP_CONFIG_CONNECTION_STRING
    }, {
        selects: [{ keyFilter: "testApp.*", labelFilter: "dev" }]
    });
}

// Trim key prefixes.
async function trimKeyPrefixes() {
    const provider = new AzureAppConfigurationProvider({
        connectionString: AZURE_APP_CONFIG_CONNECTION_STRING
    }, {
        selects: [{ keyFilter: "testApp.*", labelFilter: "dev" }],
        trimKeyPrefixes: ["testApp."]
    });
}

// Builder pattern.
async function trimKeyPrefixes_2() {
    const builder = new AzureAppConfigurationBuilder()
        .connect({ connectionString: AZURE_APP_CONFIG_CONNECTION_STRING })
        .useSelector({ keyFilter: "testApp.*", labelFilter: "dev" })
        .useTrimKeyPrefixes(["testApp."]);
    const provider = builder.build();
}