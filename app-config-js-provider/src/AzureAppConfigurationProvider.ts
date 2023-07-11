import { AppConfigurationClient, AppConfigurationClientOptions } from "@azure/app-configuration";
import { TokenCredential } from "@azure/core-auth";
import { SettingSelector } from ".";
import { USER_AGENT } from "./constants";

type Dictionary = { [key: string]: any };

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

const DEFAULT_OPTIONS: IAzureAppConfigurationOptions = {
    // default
};

class AzureAppConfiguration {
    private _client: AppConfigurationClient;
    private _options: IAzureAppConfigurationOptions;
    private _configs?: Map<string, any>;

    /**
     * Initialize client and options.
     * @param connectOptions specify connection string or endpoint with credential to connect to Azure App Configuration.
     * @param options  specify other options like selects and trimKeyPrefixes.
     */
    constructor(connections: IConnectOptions, options?: IAzureAppConfigurationOptions) {
        const clientOptions: AppConfigurationClientOptions = {
            userAgentOptions: { userAgentPrefix: USER_AGENT }
        };

        let connectOptions = connections;
        // if (Array.isArray(connections)) {
        //     // geo-replica
        //     connectOptions = connections[0]; // TODO: should impl geo-replica failover
        // } else {
        //     connectOptions = connections;
        // }

        if (connectOptions.connectionString) {
            this._client = new AppConfigurationClient(connectOptions.connectionString, clientOptions);
        } else if (connectOptions.endpoint && connectOptions.credential) {
            const { endpoint, credential } = connectOptions;
            this._client = new AppConfigurationClient(endpoint, credential, clientOptions);
        } else {
            throw new Error("Missing endpoint specification in connection options to create a client.");
        }

        this._options = options ?? DEFAULT_OPTIONS;
    }

    // TODO: support JSON/FeatureFlag etc. by content type.
    public async load(): Promise<Dictionary> {
        this._configs = new Map<string, string>();

        for (const select of this._options.selects ?? [SettingSelector.DEFAULT_SELECTOR]) {
            const settings = this._client.listConfigurationSettings({
                keyFilter: select.keyFilter,
                labelFilter: select.labelFilter
            });

            // TODO: by page to descrease # of connections?
            for await (const setting of settings) {
                if (setting.key && setting.value) {
                    // TODO: Trim keys by prefix.
                    this._options.trimKeyPrefixes;
                    this._configs.set(setting.key, setting.value);
                }
            }
        }
        return this.configs;

    }

    public get configs(): Dictionary {
        return this._configs ? Object.fromEntries(this._configs.entries()) : {};
    }

}

/**
 * Connection options to connect to Azure App Configuration.
 */
export interface IConnectOptions {
    connectionString?: string;
    endpoint?: string;
    credential?: TokenCredential;
}

/**
 * Provider options to filter configurations and other advanced features.
 */
export interface IAzureAppConfigurationOptions {
    selects?: SettingSelector[];
    trimKeyPrefixes?: string[];
    clientOptions?: AppConfigurationClientOptions;
    refreshOptions?: {
        key: string;
        refreshAll: boolean;
        callback: (payload: { [key: string]: any }) => void;
    }[]
}
