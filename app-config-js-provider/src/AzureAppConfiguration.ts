import { AppConfigurationClient, AppConfigurationClientOptions } from "@azure/app-configuration";
import { SettingSelector } from "./SettingSelector";
import { USER_AGENT } from "./constants";
import { Dictionary, IAzureAppConfigurationOptions, IConnectOptions } from "./types";

const DEFAULT_OPTIONS: IAzureAppConfigurationOptions = {
    // default
};

export class AzureAppConfiguration {
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
