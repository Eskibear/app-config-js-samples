require("dotenv").config();
const express = require('express')
const { AppConfigurationClient } = require("@azure/app-configuration");

const app = express()
const port = 3000

async function main() {

    // Use SDK to fetch configs.
    const client = new AppConfigurationClient(process.env.AZURE_APP_CONFIG_CONNECTION_STRING);
    const messageSetting = await client.getConfigurationSetting({
        key: "TestApp:Settings:Message"
    })

    app.get('/', (req, res) => {
        res.send(messageSetting.value);
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

main()
