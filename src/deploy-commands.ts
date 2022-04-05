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

  rest
    .put(Routes.applicationCommands(config.CLIENT_ID), {
      body: commands,
    })
    .then(() => {
      console.log("Successfully registered application commands.");
      process.exit();
    })
    .catch(console.error);
})();
