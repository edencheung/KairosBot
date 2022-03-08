import { Command } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { usersDB } from "./set-timezone";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("gettimezone")
    .setDescription("Gets the timezone of a given user!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription(
          "Mention a user to get their timezone (defaults to yourself)!"
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    const userTz = usersDB.get(
      interaction.options.get("user").user.id ?? interaction.user.id
    )?.timezone;
    const userTag =
      interaction.options.get("user")?.user.tag ?? interaction.user.tag;
    interaction.reply({
      content: `${userTag}'s timezone is ${
        userTz !== undefined
          ? "UTC" + (userTz >= 0 ? "+" : "") + userTz
          : "unassigned yet"
      }.`,
    });
  },
});
