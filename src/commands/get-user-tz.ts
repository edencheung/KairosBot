import { Command } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { usersTzDB } from "./set-my-tz";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("getusertimezone")
    .setDescription("Configures your timezone.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Mention a user to get their timezone!")
        .setRequired(true)
    ),
  async execute(interaction) {
    interaction.reply({
      content: `${interaction.options.get("user").user.tag}'s timezone is ${
        usersTzDB.get(interaction.options.get("user").user.id) !== undefined
          ? "GMT" +
            (parseInt(usersTzDB.get(interaction.options.get("user").user.id)) >=
            0
              ? "+"
              : "") +
            parseInt(usersTzDB.get(interaction.options.get("user").user.id))
          : "unassigned yet"
      }.`,
    });
  },
});
