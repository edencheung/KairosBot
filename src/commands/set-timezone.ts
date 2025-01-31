import { bot, Command, config } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { JSONObjectMap } from "../util/file";
import { MessageEmbed, TextChannel } from "discord.js";

const tzData = require("tzdata");

export const usersDB = new JSONObjectMap<{
  enabled: boolean;
  timezone: any;
  premExpiry?: number;
  topggNextVote?: number;
  iblNextVote?: number;
  dblNextVote?: number;
  discordsNextVote?: number;
}>("DB/users.json");

export const timezones: string[] = Object.keys(tzData.zones);

export default new Command({
  data: new SlashCommandBuilder()
    .setName("settimezone")
    .setDescription("Configures your timezone!")
    .addStringOption((option) =>
      option
        .setName("timezone")
        .setDescription("Your timezone")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async execute(interaction) {
    if(!timezones.includes(interaction.options.getString("timezone")))
      return interaction.reply({
        content: "Invalid timezone!",
        ephemeral: true,
      });
    usersDB.setAttribute(
      interaction.user.id,
      "timezone",
      interaction.options.getString("timezone")
    );
    usersDB.setAttribute(interaction.user.id, "enabled", true);
    const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
    logChannel?.send({
      embeds: [
        new MessageEmbed()
          .setTitle("/settimezone")
          .setDescription(
            `timezone: ${interaction.options.getString("timezone")}`
          )
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.avatarURL(),
          }),
      ],
    });
    return interaction.reply({
      content: `I have set your timezone to ${interaction.options.getString("timezone")}!`,
      ephemeral: true,
    });
  },
});