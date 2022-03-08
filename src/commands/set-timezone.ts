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
  "GMT-11": -11,
  "GMT-10": -10,
  "GMT-9": -9,
  "GMT-8": -8,
  "GMT-7": -7,
  "GMT-6": -6,
  "GMT-5": -5,
  "GMT-4": -4,
  "GMT-3": -3,
  "GMT-2": -2,
  "GMT-1": -1,
  GMT: 0,
  "GMT+1": 1,
  "GMT+2": 2,
  "GMT+3": 3,
  "GMT+4": 4,
  "GMT+5": 5,
  "GMT+6": 6,
  "GMT+7": 7,
  "GMT+8": 8,
  "GMT+9": 9,
  "GMT+10": 10,
  "GMT+11": 11,
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
        "GMT" +
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
