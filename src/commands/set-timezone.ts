import { bot, Command, config } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { JSONObjectMap } from "../util/file";
import { MessageEmbed, TextChannel } from "discord.js";
export const usersDB = new JSONObjectMap<{
  enabled: boolean;
  timezone: number;
  premExpiry?: number;
  topggNextVote?: number;
  iblNextVote?: number;
  dblNextVote?: number;
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
        (interaction.options.getNumber("timezone") >= 0 ? "+" : "") +
        interaction.options.getNumber("timezone")
      }!`,
      ephemeral: true,
    });
    usersDB.setAttribute(
      interaction.user.id,
      "timezone",
      interaction.options.getNumber("timezone")
    );
    usersDB.setAttribute(interaction.user.id, "enabled", true);
    const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
    logChannel?.send({
      embeds: [
        new MessageEmbed()
          .setTitle("/settimezone")
          .setDescription(
            `timezone: ${interaction.options.getNumber("timezone")}`
          )
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.avatarURL(),
          }),
      ],
    });
  },
});
