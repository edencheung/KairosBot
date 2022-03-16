import { Client, Guild, MessageEmbed, TextChannel } from "discord.js";
import { config } from "..";

export default async (bot: Client, guild: Guild) => {
  const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
  logChannel?.send({
    embeds: [
      new MessageEmbed()
        .setTitle("Left guild")
        .setThumbnail(guild.iconURL())
        .setDescription(
          `Name: ${guild.name}\n` +
            `Created: ${guild.createdAt}\n` +
            `Members: ${guild.memberCount}`
        )
        .setAuthor({
          name: (await guild.fetchOwner()).user.tag,
          iconURL: (await guild.fetchOwner()).user.displayAvatarURL(),
        }),
    ],
  });
};
