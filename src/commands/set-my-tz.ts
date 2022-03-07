import { Command } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { JSONMap } from "../util/file";
export const usersTzDB = new JSONMap("DB/usersTz.json");

export default new Command({
  data: new SlashCommandBuilder()
    .setName("setmytimezone")
    .setDescription("Configures your timezone.")
    .addNumberOption((option) =>
      option
        .setName("timezone")
        .setDescription("Your timezone")
        .setRequired(true)
        .addChoice("GMT", 0)
        .addChoice("HKT", 8)
    ),
  async execute(interaction) {
    interaction.reply({
      content: `I have set your timezone to ${
        "GMT" +
        (interaction.options.get("timezone").value >= 0 ? "+" : "") +
        interaction.options.get("timezone").value
      }!`,
    });
    usersTzDB.set(
      interaction.user.id,
      interaction.options.get("timezone").value
    );
  },
});
