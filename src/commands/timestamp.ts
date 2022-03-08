import { MessageEmbed } from "discord.js";
import { bot, Command } from "..";
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
        .setRequired(true)
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
      <number>interaction.options.get("timezone")?.value;
    if (userTzOffset === undefined)
      return interaction.reply(
        "Please use the `/setmytimezone` command to set your timezone first or provide a timezone for the time."
      );

    const date = new Date();

    const userHour = userTzOffset + date.getUTCHours();
    let hourDiff = <number>interaction.options.get("hour").value - userHour;
    if (interaction.options.get("am_pm")?.value == "pm") hourDiff += 12;

    date.setUTCFullYear(
      <number>interaction.options.get("year")?.value ?? date.getUTCFullYear()
    );
    date.setUTCMonth(
      <number>interaction.options.get("month")?.value ?? date.getUTCMonth()
    );
    date.setUTCDate(
      <number>interaction.options.get("date")?.value ?? date.getUTCDate()
    );
    date.setUTCHours(date.getUTCHours() + hourDiff);
    date.setUTCMinutes(<number>interaction.options.get("min")?.value ?? 0);
    date.setUTCSeconds(0);

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor(`#384c5c`)
          .setDescription(
            `<t:${Math.round(date.getTime() / 1000)}:${
              interaction.options.get("date_format")?.value ?? "R"
            }>${
              interaction.options.get("include_raw")?.value
                ? `\nRaw text: \`<t:${Math.round(date.getTime() / 1000)}:${
                    interaction.options.get("date_format")?.value ?? "R"
                  }>\``
                : ""
            }`
          )
          .setFooter({
            iconURL: bot.user.avatarURL(),
            text: "If you like the bot, consider upvoting it https://top.gg/bot/950382032620503091",
          }),
      ],
    });
  },
});
