import { bot, Command, config } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { usersDB } from "./set-timezone";
import { MessageEmbed, TextChannel } from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("gettimezone")
    .setDescription("Gets the timezone of a given user!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription(
          "Mention a user to get their timezone (defaults to yourself)!"
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    const userTz = usersDB.get(
      interaction.options.getUser("user")?.id ?? interaction.user.id
    )?.timezone;
    const userTag =
      interaction.options.getUser("user")?.tag ?? interaction.user.tag;
    interaction.reply({
      content: `${userTag}'s timezone is ${
        userTz !== undefined
          ? "UTC" + (userTz >= 0 ? "+" : "") + userTz
          : "unassigned yet"
      }.`,
    });

    const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
    logChannel?.send({
      embeds: [
        new MessageEmbed()
          .setTitle("/gettimezone")
          .setDescription(
            `user: ${interaction.options.getUser("user") ?? "N/A"}`
          )
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.avatarURL(),
          }),
      ],
    });
  },
});
