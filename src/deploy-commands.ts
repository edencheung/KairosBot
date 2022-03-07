import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { CLIENT_ID, TOKEN } from "./config.json";
import { Command } from ".";
import { readdir } from "fs/promises";
import path = require("path");

const commands: Array<any> = [];

const rest = new REST({ version: "9" }).setToken(TOKEN);

(async () => {
  const files = await readdir(`${__dirname}\\commands`);

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
    .put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
})();
