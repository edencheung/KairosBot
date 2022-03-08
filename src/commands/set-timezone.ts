import { Command } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { JSONObjectMap } from "../util/file";
export const usersDB = new JSONObjectMap<{
  enabled: boolean;
  timezone: number;
}>("DB/users.json");

export const timezones: {
  [tzName: string]: number;
} = {
  "UTC-11": -11,
  "UTC-10": -10,
  "UTC-9": -9,
  "UTC-8": -8,
  "UTC-7": -7,
  "UTC-6": -6,
  "UTC-5": -5,
  "UTC-4": -4,
  "UTC-3": -3,
  "UTC-2": -2,
  "UTC-1": -1,
  UTC: 0,
  "UTC+1": 1,
  "UTC+2": 2,
  "UTC+3": 3,
  "UTC+4": 4,
  "UTC+5": 5,
  "UTC+6": 6,
  "UTC+7": 7,
  "UTC+8": 8,
  "UTC+9": 9,
  "UTC+10": 10,
  "UTC+11": 11,
  HKT: 8,
};

export default new Command({
  data: new SlashCommandBuilder()
    .setName("settimezone")
    .setDescription("Configures your timezone!")
    .addNumberOption((option) =>
      option
        .setName("timezone")
        .setDescription("Your timezone")
        .setRequired(true)
        .setChoices(Object.entries(timezones))
    ),
  async execute(interaction) {
    interaction.reply({
      content: `I have set your timezone to ${
        "UTC" +
        (interaction.options.get("timezone").value >= 0 ? "+" : "") +
        interaction.options.get("timezone").value
      }!`,
      ephemeral: true,
    });
    usersDB.set(interaction.user.id, {
      timezone: <number>interaction.options.get("timezone").value,
      enabled: true,
    });
  },
});
