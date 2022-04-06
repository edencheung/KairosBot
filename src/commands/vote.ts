import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import { bot, Command, config } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
import { buttonRowGen } from "../votes";
export default new Command({
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Shows you what you can upvote!"),
  async execute(interaction) {
    const embed0: MessageEmbed = new MessageEmbed()
      .setColor(`#4c5e6c`)
      .setTitle("Vote for me!")
      .setDescription("Here are some sites you can upvote me on.");

    const buttonRow = buttonRowGen(interaction.user.id);

    await interaction.reply({
      embeds: [embed0],
      content: null,
      components: [buttonRow],
    });

    const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
    logChannel?.send({
      embeds: [
        new MessageEmbed().setTitle("/vote").setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.avatarURL(),
        }),
      ],
    });
  },
});
