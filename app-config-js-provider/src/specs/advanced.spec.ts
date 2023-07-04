const CONNECTION_STRING = "";
import { load } from "../AzureAppConfigurationProvider";
const settings = await load({
    connectionString: CONNECTION_STRING
}, {
    selects: [{ keyFilter: "testApp.*", labelFilter: "dev" }],
    trimKeyPrefixes: ["testApp."],
    clientOptions: {
        retryOptions: { maxRetries: 5 }
    } 
});