import { Client, Guild, MessageEmbed, TextChannel } from "discord.js";
import { config } from "..";

export default async (bot: Client, guild: Guild) => {
  const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
  logChannel?.send({
    embeds: [
      new MessageEmbed()
        .setTitle("Left guild")
        .setImage(guild.iconURL())
        .setDescription(
          `Name: ${guild.name}\nOwner: ${(await guild.fetchOwner()).user.tag}`
        ),
    ],
  });
};
