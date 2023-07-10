import { AppConfigurationClient, AppConfigurationClientOptions, ConfigurationSetting } from "@azure/app-configuration";
import { TokenCredential } from "@azure/core-auth";
import { SettingSelector } from ".";
import { USER_AGENT } from "./constants";

/**
 * Load data from stores. 
 * @param connections specify connection string or endpoint with credential to connect to Azure App Configuration.  
 * @param options  specify preference to load configurations, e.g. selects to filter configurations, trimmed keys etc.
 * @returns A dict of stored configs.
 */
export async function load(
    connections: IConnectOptions | IConnectOptions[],
    options?: IProviderOptions
): Promise<{[key: string]: any}> {
    // basic impl.
    const provider = new AzureAppConfigurationProvider(connections, options);
    return provider.load();
}

class AzureAppConfigurationProvider {
    private _client: AppConfigurationClient;
    private _selects: SettingSelector[] = [SettingSelector.DEFAULT_SELECTOR];
    private _trimKeyPrefixes: string[] = [];

    /**
     * Initialize client and options.
     * @param connectOptions specify connection string or endpoint with credential to connect to Azure App Configuration.
     * @param options  specify other options like selects and trimKeyPrefixes.
     */
    constructor(connections: IConnectOptions | IConnectOptions[], options?: IProviderOptions) {
        const clientOptions: AppConfigurationClientOptions = {
            userAgentOptions: { userAgentPrefix: USER_AGENT }
        };

        let connectOptions;
        if (Array.isArray(connections)) {
            // geo-replica
            connectOptions = connections[0]; // TODO: wrong, should impl geo-replica
        } else {
            connectOptions = connections;
        }

        if (connectOptions.connectionString) {
            this._client = new AppConfigurationClient(connectOptions.connectionString, clientOptions);
        } else if (connectOptions.endpoint && connectOptions.credential) {
            const { endpoint, credential } = connectOptions;
            this._client = new AppConfigurationClient(endpoint, credential, clientOptions);
        } else {
            throw new Error("Missing endpoint specification in connection options to create a client.");
        }

        if (options?.selects && options.selects.length > 0) {
            this._selects = options.selects;
        }

        if (options?.trimKeyPrefixes && options.trimKeyPrefixes.length > 0) {
            this._trimKeyPrefixes = options.trimKeyPrefixes;
        }
    }

    // TODO: support JSON/FeatureFlag etc. by content type.
    public async load(): Promise<Map<string, string>> {
        const dict = new Map<string, string>();

        for (const select of this._selects) {
            const settings = this._client.listConfigurationSettings({
                keyFilter: select.keyFilter,
                labelFilter: select.labelFilter
            });

            // TODO: by page to descrease # of connections?
            for await (const setting of settings) {
                if (setting.key && setting.value) {
                    // TODO: Trim keys by prefix.
                    this._trimKeyPrefixes;
                    dict.set(setting.key, setting.value);
                }
            }
        }
        return dict;

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
export interface IProviderOptions {
    selects?: SettingSelector[];
    trimKeyPrefixes?: string[];
    clientOptions?: AppConfigurationClientOptions;
    refreshOptions?: {
        key: string;
        refreshAll: boolean;
        callback: (payload: {[key: string]:any}) => void;
    }[]
}