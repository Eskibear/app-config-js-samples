create file `.env` with content:
```env
AZURE_APP_CONFIG_CONNECTION_STRING=<connection string of an azure app config resource>
```

```sh
npm i
node app.js
```

Open http://localhost:3000, which prints value of config `TestApp:Settings:Message`.