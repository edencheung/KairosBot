import { MessageEmbed } from "discord.js";
import { Command } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
export default new Command({
  data: new SlashCommandBuilder()
    .setName("timestrings")
    .setDescription("Shows you examples of timestrings!"),
  async execute(interaction) {
    const embed0: MessageEmbed = new MessageEmbed()
      .setColor(`#4c5e6c`)
      .setTitle("Examples of timestrings")
      .setDescription(
        `> 12:00\n` +
          `> 9:34 pm\n` +
          `> 07:34AM tmr\n` +
          `> 2:47 8 days ago\n` +
          `> 09:51pm 7 days later\n` +
          `> 11:58 ytd\n` +
          `etc...`
      );

    const embed1: MessageEmbed = new MessageEmbed()
      .setColor(`#384c5c`)
      .setDescription(
        `If you need more help, want to suggest a feature or submit a bug report, join the [support server](https://discord.gg/J2xKqDKpGt)!\n\n` +
          `If you like the bot, consider upvoting it [here](https://top.gg/bot/950382032620503091).`
      );

    await interaction.reply({
      embeds: [embed0, embed1],
      content: null,
    });
  },
});
