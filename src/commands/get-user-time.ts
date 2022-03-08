import { Command } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { usersDB } from "./set-timezone";

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

    interaction.reply({
      content: `${userTag}'s local time is \`${(
        "0" +
        (new Date().getUTCHours() + userTz)
      ).slice(-2)}:${("0" + new Date().getUTCMinutes()).slice(-2)}\`.`,
    });
  },
});
