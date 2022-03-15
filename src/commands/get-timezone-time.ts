import { Command } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { timezones, usersDB } from "./set-timezone";
import { MessageActionRow, MessageButton } from "discord.js";

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
    const tzName =
      interaction.options.get("timezone").value >= 0
        ? `UTC+${interaction.options.get("timezone").value}`
        : `UTC${interaction.options.get("timezone").value}`;
    const tzHour =
      (new Date().getUTCHours() +
        <number>interaction.options.get("timezone").value +
        24) %
      24;
    const tzHourStr = ("0" + tzHour).slice(-2);
    const tzMinStr = ("0" + new Date().getUTCMinutes()).slice(-2);

    const componentRows: MessageActionRow[] = [];

    if (true)
      componentRows.push(
        new MessageActionRow().addComponents(
          new MessageButton()
            .setEmoji("🔼")
            .setLabel("If you like me, consider upvoting!")
            .setStyle("LINK")
            .setURL("https://top.gg/bot/950382032620503091/vote")
        )
      );

    interaction.reply({
      content: `The local time for ${tzName} is \`${tzHourStr}:${tzMinStr}\`.`,
      components: componentRows,
    });
  },
});
