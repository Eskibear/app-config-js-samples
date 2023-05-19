import { AppConfigurationClient, ConfigurationSetting } from "@azure/app-configuration";
import { TokenCredential } from "@azure/core-auth";
import { SettingSelector } from ".";
import { USER_AGENT } from "./constants";

export class AzureAppConfigurationProvider {
    private _client: AppConfigurationClient;
    private _selects: SettingSelector[];

    constructor(connectOptions: IConnectOptions, options?: IProviderOptions) {
        const clientOptions = {
            userAgentOptions: { userAgentPrefix: USER_AGENT }
        };
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
        } else {
            this._selects = [SettingSelector.DEFAULT_SELECTOR];
        }
    }

    // TODO: support JSON/FeatureFlag etc. by content type.
    public async load(): Promise<Map<string, string>> {
        const dict = new Map<string, string>();

        for (const select of this._selects) {
            const configs = this._client.listConfigurationSettings({
                keyFilter: select.keyFilter,
                labelFilter: select.labelFilter
            });

            // TODO: by page to descrease # of connections?
            let config: IteratorResult<ConfigurationSetting<string>, any> | undefined;
            do {
                config = await configs.next();
                const kv = config?.value;
                if (kv?.key && kv?.value) {
                    dict.set(kv.key, kv.value);
                }
            }
            while(config && !config.done);
        }
        return dict;

    }
}

export interface IConnectOptions {
    connectionString?: string;
    endpoint?: string;
    credential?: TokenCredential;
}

export interface IProviderOptions {
    selects?: SettingSelector[];
}