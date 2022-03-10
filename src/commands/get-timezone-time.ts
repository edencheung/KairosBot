import { Command } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { timezones, usersDB } from "./set-timezone";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("gettimezonetime")
    .setDescription("Gets the local time of a given timezone!")
    .addNumberOption((option) =>
      option
        .setName("timezone")
        .setDescription("Your timezone")
        .setRequired(true)
        .setChoices(Object.entries(timezones))
    ),
  async execute(interaction) {
    interaction.reply({
      content: `The local time for ${
        interaction.options.get("timezone").value >= 0
          ? `UTC+${interaction.options.get("timezone").value}`
          : `UTC${interaction.options.get("timezone").value}`
      } is \`${(
        "0" +
        ((new Date().getUTCHours() +
          <number>interaction.options.get("timezone").value +
          24) %
          24)
      ).slice(-2)}:${("0" + new Date().getUTCMinutes()).slice(-2)}\`.`,
    });
  },
});
