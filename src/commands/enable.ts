import { bot, Command, config } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { usersDB } from "./set-timezone";
import { TextChannel, MessageEmbed } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("enable")
    .setDescription("Enables automatic timestring detection and translation!"),
  async execute(interaction) {
    const userInfo = usersDB.get(interaction.user.id);
    if (userInfo == undefined)
      return interaction.reply({
        content: "Please use `/settimezone` to set your timezone first.",
        ephemeral: true,
      });
    if (userInfo.enabled)
      return interaction.reply({
        content:
          "You have already enabled timestring detection and translation!",
        ephemeral: true,
      });
    usersDB.setAttribute(interaction.user.id, "enabled", true);
    interaction.reply({
      content:
        "Successfully enabled automatic timestring detection and translation.",
      ephemeral: true,
    });

    const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
    logChannel?.send({
      embeds: [
        new MessageEmbed().setTitle("/disable").setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.avatarURL(),
        }),
      ],
    });
  },
});
