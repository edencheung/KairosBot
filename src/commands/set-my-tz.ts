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
        .addChoice("GMT-11", -11)
        .addChoice("GMT-10", -10)
        .addChoice("GMT-9", -9)
        .addChoice("GMT-8", -8)
        .addChoice("GMT-7", -7)
        .addChoice("GMT-6", -6)
        .addChoice("GMT-5", -5)
        .addChoice("GMT-4", -4)
        .addChoice("GMT-3", -3)
        .addChoice("GMT-2", -2)
        .addChoice("GMT-1", -1)
        .addChoice("GMT", 0)
        .addChoice("GMT+1", 1)
        .addChoice("GMT+2", 2)
        .addChoice("GMT+3", 3)
        .addChoice("GMT+4", 4)
        .addChoice("GMT+5", 5)
        .addChoice("GMT+6", 6)
        .addChoice("GMT+7", 7)
        .addChoice("GMT+8", 8)
        .addChoice("GMT+9", 9)
        .addChoice("GMT+10", 10)
        .addChoice("GMT+11", 11)
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
