import { Client, Collection, CommandInteraction, Intents } from "discord.js";
import { readdir } from "fs";
import { SlashCommandBuilder } from "@discordjs/builders";
import config from "./util/global";

export const bot: Client = new Client({
  intents: [Intents.FLAGS.DIRECT_MESSAGES],
  partials: ["CHANNEL"],
}); //use 48893 if no privileged intents (GUILD_PRESENCES and GUILD_MEMBERS)

export { config, commands };

export class Command {
  data: Pick<SlashCommandBuilder, "toJSON" | "name" | "description">;
  execute: (interaction: CommandInteraction) => any;
  constructor(opt: Command) {
    Object.assign(this, opt);
  }
}

let commands: Collection<string, Command> = new Collection<string, Command>();

readdir(`${__dirname}\\commands`, (err, files) => {
  if (err) return console.error;
  files.forEach((file: string) => {
    if (!file.endsWith(`.js`)) return;
    const command: Command = require(`${__dirname}\\commands\\${file}`).default;
    commands.set(command.data.name, command);
  });
});

readdir(`${__dirname}\\events/`, (err, files) => {
  if (err) return console.error;
  files.forEach((file: string) => {
    if (!file.endsWith(`.js`)) return;
    const event: () => any = require(`${__dirname}\\events\\${file}`).default;
    const eventName: string = file.split(`.`)[0];
    bot.on(eventName, event.bind(null, bot));
  });
});

bot.login(config.TOKEN);
