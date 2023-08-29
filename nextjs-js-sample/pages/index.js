// import { AppConfigurationClient } from '@azure/app-configuration';
import { load } from '@azure/app-configuration-provider';
import { useState, useEffect } from 'react';
function Header({ title }) {
  return <h1>{title ? title : 'Default title'}</h1>;
}

export default function HomePage() {
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];

  const [likes, setLikes] = useState(0);
  const [fontColor, setFontColor] = useState("black");

  const getSettingsFromAppConfiguration = async () => {
    // const client = new AppConfigurationClient(process.env.NEXT_PUBLIC_CONNECTION_STRING, {
    //   userAgentOptions: {
    //     userAgentPrefix: "yanzh-nextjs-app"
    //   }
    // });
    // console.log(process.env.NEXT_PUBLIC_CONNECTION_STRING)
    // const setting = await client.getConfigurationSetting({ key: "app.settings.fontColor", label: "\0" });
    // const color = setting.value;
    // setFontColor(color);

    const settings = await load(process.env.NEXT_PUBLIC_CONNECTION_STRING, {
      selectors: [{
        keyFilter: "app.settings.*",
        labelFilter: "\0"
      }],
      trimKeyPrefixes: ["app.settings."]
    });
    const color = settings.get("fontColor");
    setFontColor(color);
  };

  useEffect(() => { getSettingsFromAppConfiguration(); }, []);

  function handleClick() {
    setLikes(likes + 1);
  }

  return (
    <div style={{ color: fontColor }}>
      <Header title="Develop. Preview. Ship. 🚀" />
      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <button onClick={handleClick}>Like ({likes})</button>
    </div>
  );
}

