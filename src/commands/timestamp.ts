import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import { bot, Command, config } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { timezones, usersDB } from "./set-timezone";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("timestamp")
    .setDescription("Creates a timestamp according to the data you provide!")
    .addIntegerOption((option) =>
      option
        .setMinValue(0)
        .setMaxValue(11)
        .setName("hour")
        .setDescription("The hour component of the time")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("min")
        .setDescription("The minute component of the time (defaults to 0)")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("am_pm")
        .setDescription("The am/pm component of the time (defaults to am)")
        .setRequired(false)
        .addChoices([
          ["am", 0],
          ["pm", 12],
        ])
    )
    .addIntegerOption((option) =>
      option
        .setName("date")
        .setDescription("The date component of the time")
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(31)
    )
    .addIntegerOption((option) =>
      option
        .setName("month")
        .setDescription("The month component of the time")
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(12)
    )
    .addIntegerOption((option) =>
      option
        .setName("year")
        .setDescription("The year component of the time")
        .setRequired(false)
        .setMinValue(0)
    )
    .addStringOption((option) =>
      option
        .setName("date_format")
        .setDescription("The format of your timestring (defaults to relative)")
        .setChoices([
          ["Relative", "R"],
          ["Short time", "t"],
          ["Long time", "T"],
          ["Short date", "d"],
          ["Long date", "D"],
          ["Long date with short time", "f"],
          ["Long date with day of the week with short time", "F"],
        ])
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("timezone")
        .setDescription(
          "Sets the timezone of the time (defaults to your timezone)"
        )
        .setChoices(Object.entries(timezones))
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("include_raw")
        .setDescription(
          "whether to include the raw timestamp string so that you can copy and paste it (defaults to false)"
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    const userTzOffset =
      usersDB.get(interaction.user.id)?.timezone ??
      interaction.options.getInteger("timezone");
    if (userTzOffset === undefined)
      return interaction.reply(
        "Please use the `/setmytimezone` command to set your timezone first or provide a timezone for the time."
      );

    const dateObj = new Date();

    const userHour = (userTzOffset + dateObj.getUTCHours() + 24) % 24;
    let hourDiff = (interaction.options.getInteger("hour") ?? 0) - userHour;
    if (interaction.options.getString("am_pm") == "pm") hourDiff += 12;

    const year = interaction.options.getInteger("year")
      ? interaction.options.getInteger("year")
      : dateObj.getUTCFullYear();

    const month = interaction.options.getInteger("month")
      ? interaction.options.getInteger("month") - 1
      : dateObj.getUTCMonth();

    const date = interaction.options.getInteger("date")
      ? interaction.options.getInteger("date")
      : dateObj.getUTCDate();

    dateObj.setUTCFullYear(year, month, date);
    dateObj.setUTCHours(dateObj.getUTCHours() + hourDiff);
    dateObj.setUTCMinutes(interaction.options.getInteger("min") ?? 0);
    dateObj.setUTCSeconds(0);

    const epoch = Math.round(dateObj.getTime() / 1000);

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
      embeds: [
        new MessageEmbed()
          .setColor(`#384c5c`)
          .setDescription(
            `<t:${epoch}:${
              interaction.options.getString("date_format") ?? "R"
            }>${
              interaction.options.getBoolean("include_raw")
                ? `\nRaw text: \`<t:${epoch}:${
                    interaction.options.getString("date_format") ?? "R"
                  }>\``
                : ""
            }`
          ),
      ],
      components: componentRows,
    });
    const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
    logChannel?.send({
      embeds: [
        new MessageEmbed()
          .setTitle("/timestamp")
          .addFields([
            {
              name: "hour",
              value:
                interaction.options.getInteger("hour")?.toString() ?? "N/A",
              inline: true,
            },
            {
              name: "min",
              value: interaction.options.getInteger("min")?.toString() ?? "N/A",
              inline: true,
            },
            {
              name: "am_pm",
              value:
                interaction.options.getBoolean("am_pm")?.toString() ?? "N/A",
              inline: true,
            },
            {
              name: "date",
              value:
                interaction.options.getInteger("date")?.toString() ?? "N/A",
              inline: true,
            },
            {
              name: "month",
              value:
                interaction.options.getInteger("month")?.toString() ?? "N/A",
              inline: true,
            },
            {
              name: "year",
              value:
                interaction.options.getInteger("year")?.toString() ?? "N/A",
              inline: true,
            },
            {
              name: "date_format",
              value: interaction.options.getString("date_format") ?? "N/A",
              inline: true,
            },
            {
              name: "timezone",
              value:
                interaction.options.getInteger("timezone")?.toString() ?? "N/A",
              inline: true,
            },
            {
              name: "include_raw",
              value:
                interaction.options.getBoolean("include_raw")?.toString() ??
                "N/A",
              inline: true,
            },
          ])
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.avatarURL(),
          }),
      ],
    });
  },
});
