import { AzureAppConfiguration } from "./AzureAppConfiguration";
import { Dictionary, IAzureAppConfigurationOptions, IConnectOptions } from "./types";

export { SettingSelector } from "./SettingSelector";

/**
 * Load data from stores.
 * @param connections Specify connection string or endpoint with credential to connect to Azure App Configuration.
 * @param options Specify preference to load configurations, e.g. selects to filter configurations, trimmed keys etc.
 * @returns A dict of stored configs.
 */
export async function load(
    connections: IConnectOptions, // TODO: IConnectOptions[], multiple endpoints to enable geo replica failover.
    options?: IAzureAppConfigurationOptions
): Promise<Dictionary> {
    const provider = new AzureAppConfiguration(connections, options);
    return await provider.load();
}