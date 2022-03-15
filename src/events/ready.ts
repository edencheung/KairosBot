import { Client, MessageEmbed, TextChannel } from "discord.js";
import { config } from "..";

export default async (bot: Client) => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("/help", { type: "LISTENING" });

  const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
  logChannel?.send({
    embeds: [new MessageEmbed().setTitle("I am now online!")],
  });
};
