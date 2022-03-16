import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import { bot, Command, config } from "..";
import { SlashCommandBuilder } from "@discordjs/builders";
export default new Command({
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Shows you what you can upvote!"),
  async execute(interaction) {
    const embed0: MessageEmbed = new MessageEmbed()
      .setColor(`#4c5e6c`)
      .setTitle("Vote for me!")
      .setDescription("Here are some sites you can upvote me on.");

    const buttonRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setEmoji("953542648550023199")
        .setStyle("LINK")
        .setLabel("Top.gg")
        .setURL("https://top.gg/bot/950382032620503091/vote"),
      new MessageButton()
        .setEmoji("953548945458626601")
        .setStyle("LINK")
        .setLabel("Infinity Bots")
        .setURL("https://infinitybots.gg/bots/950382032620503091/vote"),
      new MessageButton()
        .setEmoji("953561327341817856")
        .setStyle("LINK")
        .setLabel("Discord Extreme List (Can only be voted once)")
        .setURL("https://discordextremelist.xyz/en-US/bots/950382032620503091"),
      new MessageButton()
        .setEmoji("953579545213161502")
        .setStyle("LINK")
        .setLabel("Discord Bot List")
        .setURL("https://discordbotlist.com/bots/kairosbot/upvote")
    );

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
