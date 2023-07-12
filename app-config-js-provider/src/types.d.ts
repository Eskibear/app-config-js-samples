export type Dictionary = { [key: string]: any };

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
