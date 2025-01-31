import { bot, Command, config } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { timezones } from "./set-timezone";
import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from "discord.js";

const tc = require("timezonecomplete");

export default new Command({
  data: new SlashCommandBuilder()
    .setName("gettimezonetime")
    .setDescription("Gets the local time of a given timezone!")
    .addStringOption((option) =>
      option
        .setName("timezone")
        .setDescription("The timezone you want to check")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async execute(interaction) {
    if(!timezones.includes(interaction.options.getString("timezone"))){
      return interaction.reply({
        content: "Invalid timezone provided. Please provide a valid timezone.",
        ephemeral: true
      });
    }
    const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
    logChannel?.send({
      embeds: [
        new MessageEmbed()
          .setTitle("/gettimezonetime")
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
      content: `The local time for ${interaction.options.getString("timezone")} is \`${tc.now(tc.zone(interaction.options.getString("timezone"))).hour()}:${tc.now(tc.zone(interaction.options.getString("timezone"))).minute()}\`.`,
    });
  },
});
