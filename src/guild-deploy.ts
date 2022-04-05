import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Command, config } from ".";
import { readdir } from "fs/promises";
import path = require("path");

const commands: Array<any> = [];

const rest = new REST({ version: "9" }).setToken(config.TOKEN);

(async () => {
  const files = await readdir(path.join(__dirname, "commands"));

  files.forEach((file: string) => {
    if (!file.endsWith(`.js`)) return;
    const command: Command = require(path.join(
      __dirname,
      "commands",
      file
    )).default;
    commands.push(command.data.toJSON());
  });
  await rest.put(
    Routes.applicationGuildCommands(config.CLIENT_ID, "781129041969021000"),
    {
      body: commands,
    }
  );
  await rest.put(
    Routes.applicationGuildCommands(config.CLIENT_ID, "918787350849523772"),
    {
      body: commands,
    }
  );
  console.log("Successfully registered application commands.");
  process.exit();
})();
