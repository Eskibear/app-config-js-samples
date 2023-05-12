const AZURE_APP_CONFIG_CONNECTION_STRING = "<connection-string>";

const { AppConfigurationClient } = require("@azure/app-configuration");

async function main() {

    // Use SDK to fetch configs.
    const client = new AppConfigurationClient(AZURE_APP_CONFIG_CONNECTION_STRING);
    const messageSetting = await client.getConfigurationSetting({
        key: "TestApp:Settings:Message"
    });
    console.log(messageSetting);
    const h1 = document.getElementById("h1");
    h1.innerText = messageSetting.value;
}

main()