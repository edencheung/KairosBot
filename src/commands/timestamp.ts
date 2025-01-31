import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import { bot, Command, config } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { timezones, usersDB } from "./set-timezone";
const tc = require("timezonecomplete");

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
    .addStringOption((option) =>
      option
        .setName("timezone")
        .setDescription(
          "Sets the timezone of the time (defaults to your timezone)"
        )
        .setAutocomplete(true)
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("include_raw")
        .setDescription(
          "whether to include the raw timestamp string so that you can copy and paste it"
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    const dateObj = new Date();
    if(interaction.options.getInteger("month") == 2 && interaction.options.getInteger("date") > 29){
      return interaction.reply({
        content: "Invalid date provided for February.",
        ephemeral: true
      });
    }
    if(interaction.options.getInteger("month") == 4 || interaction.options.getInteger("month") == 6 || interaction.options.getInteger("month") == 9 || interaction.options.getInteger("month") == 11){
      if(interaction.options.getInteger("date") > 30){
        return interaction.reply({
          content: "Invalid date provided for this month.",
          ephemeral: true
        });
      }
    }

    const year = interaction.options.getInteger("year") ?? dateObj.getUTCFullYear();

    const month = interaction.options.getInteger("month") ?? dateObj.getUTCMonth() + 1;

    let date = interaction.options.getInteger("date") ?? dateObj.getUTCDate();
    
    let hour = interaction.options.getInteger("hour") ?? dateObj.getUTCHours();

    const min = interaction.options.getInteger("min") ?? dateObj.getUTCMinutes();

    if (interaction.options.getInteger("am_pm") == 12){
      console.log(hour)
      if(interaction.options.getInteger("hour") != 12){
        if(hour < 12) hour = hour + 12;
        else {
          hour = hour - 12;
          date = date + 1;
        }
      } 
      console.log(hour)
    }

    let userTzOffset: number | null  = null

    if(interaction.options.getString("timezone") && !timezones.includes(interaction.options.getString("timezone"))){
      return interaction.reply({
        content: "Invalid timezone provided. Please provide a valid timezone.",
        ephemeral: true
    });
    }

    if(interaction.options.getString("timezone")) {
      userTzOffset = tc.zone(interaction.options.getString("timezone")).offsetForUtc(year, month, date, hour, min, 0)
    }
    else if(usersDB.get(interaction.user.id)?.timezone == null && interaction.options.getString("timezone") == null) {
      return interaction.reply(
        "Please use the `/setmytimezone` command to set your timezone first or provide a timezone for the time."
      );
    }
    else if(usersDB.get(interaction.user.id)?.timezone instanceof String || typeof usersDB.get(interaction.user.id)?.timezone === 'string') {
      userTzOffset = tc.zone(usersDB.get(interaction.user.id)?.timezone).offsetForUtc(year, month, date, hour, min, 0)
    }
    else if(usersDB.get(interaction.user.id)?.timezone instanceof Number || typeof usersDB.get(interaction.user.id)?.timezone === 'number') {
      userTzOffset = usersDB.get(interaction.user.id)?.timezone * 60
    }
         
    if (userTzOffset === null){
      return interaction.reply(
        "Please use the `/setmytimezone` command to set your timezone first or provide a timezone for the time."
      );
    }
    dateObj.setUTCFullYear(year);
    dateObj.setUTCMonth(month - 1);
    dateObj.setUTCDate(date);
    if(hour - Math.floor(userTzOffset / 60) < 24 && hour - Math.floor(userTzOffset / 60) >= 0){
      dateObj.setUTCHours(hour - Math.floor(userTzOffset / 60));
    }
    else if(hour - Math.floor(userTzOffset / 60) >= 24){
      dateObj.setUTCHours(hour - Math.floor(userTzOffset / 60) - 24);
      dateObj.setUTCDate(date + 1);
    }
    else if(hour - Math.floor(userTzOffset / 60) < 0){
      dateObj.setUTCHours(hour - Math.floor(userTzOffset / 60) + 24);
      dateObj.setUTCDate(date - 1);
    }
    dateObj.setUTCMinutes(min - userTzOffset % 60);
    

    const epoch = Math.round(dateObj.getTime() / 1000);

    const componentRows: MessageActionRow[] = [];

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
                interaction.options.getInteger("am_pm")?.toString() ?? "N/A",
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
                interaction.options.getString("timezone") ?? "N/A",
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

    return interaction.reply({
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
  },
});
