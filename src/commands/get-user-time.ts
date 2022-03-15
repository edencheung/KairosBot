import { Command } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { usersDB } from "./set-timezone";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

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

    let description = `\`${(
      "0" +
      ((new Date().getUTCHours() + userTz + 24) % 24)
    ).slice(-2)}:${("0" + new Date().getUTCMinutes()).slice(-2)}\`.`;

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
          .setTitle(`${userTag}'s local time`)
          .setDescription(description),
      ],
      components: componentRows,
    });
  },
});
