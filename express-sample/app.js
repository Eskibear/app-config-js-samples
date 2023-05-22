const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require('express')
const { AppConfigurationClient } = require("@azure/app-configuration");
const { AzureAppConfigurationProvider } = require("app-config-js-provider");
const app = express()
const port = 3000

async function main() {

    //// Use SDK to fetch configs.
    // const client = new AppConfigurationClient(process.env.AZURE_APP_CONFIG_CONNECTION_STRING);
    // const messageSetting = await client.getConfigurationSetting({
    //     key: "TestApp:Settings:Message"
    // }).value;

    // const configs = client.listConfigurationSettings();
    // for await (const config of configs) {
    //     console.log(config);
    // }


    // Use Provider
    const provider = new AzureAppConfigurationProvider({
        connectionString: process.env.AZURE_APP_CONFIG_CONNECTION_STRING
    });
    const configs = await provider.load();
    const messageSetting = configs.get("TestApp:Settings:Message");


    // express application setup
    app.get('/', (req, res) => {
        res.send(messageSetting);
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

main()
