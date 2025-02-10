import { bot, Command, config } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { usersDB } from "./set-timezone";
import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from "discord.js";

const tc = require("timezonecomplete");

export default new Command({
  data: new SlashCommandBuilder()
    .setName("getusertime")
    .setDescription("Gets the local time of a given user!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription(
          "Mention a user to get their local time (defaults to yourself)!"
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const userTz = usersDB.get(
      interaction.options.get("user").user.id
    )?.timezone;
    const userTag = interaction.options.get("user").user.tag;

    if (userTz === undefined)
      return interaction.reply(
        `${userTag} has not configured their timezone yet.`
      );

    let description = "";

    if(typeof userTz === "string") description = `${tc.now(tc.zone(userTz)).hour()}:${tc.now(tc.zone(userTz)).minute()}.`;
    
    else description = `\`${(
      "0" +
      ((new Date().getUTCHours() + userTz + 24) % 24)
    ).slice(-2)}:${("0" + new Date().getUTCMinutes()).slice(-2)}\`.`;

    const componentRows: MessageActionRow[] = [];

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`${userTag}'s local time`)
          .setDescription(description),
      ],
      components: componentRows,
    });

    const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
    logChannel?.send({
      embeds: [
        new MessageEmbed()
          .setTitle("/getusertime")
          .setDescription(`user: ${interaction.options.getUser("user")}`)
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.avatarURL(),
          }),
      ],
    });
  },
});
