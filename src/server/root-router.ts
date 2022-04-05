import { MessageEmbed, TextChannel } from "discord.js";
import express, { Request, Response } from "express";
import path from "path";
import { escape } from "querystring";
import { bot, config } from "..";

export const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  return res.send('{"hi": "lol"}');
});

rootRouter.get("/invited", async (req, res) => {
  const source = req.query.source;
  if (source !== undefined && req.query.code !== undefined) {
    const logChannel = <TextChannel>await bot.channels.fetch(config.LOG);
    logChannel?.send({
      embeds: [new MessageEmbed().setDescription(`From: ${source}`)],
    });
    return res.redirect("/invited");
  }
  return res.sendFile(path.join(__dirname, "../../assets/index/invited.html"));
});

rootRouter.get("/invited.css", (req, res) => {
  res.sendFile(path.join(__dirname, "../../assets/index/invited.css"));
});

rootRouter.get("/i", (req, res) => {
  res.redirect("/invite");
});

rootRouter.get("/invite", (req, res) => {
  let source = req.query.source;
  if (source === undefined) {
    source = "Home";
  }
  return res.redirect(
    "https://discord.com/oauth2/authorize" +
      "?client_id=950382032620503091&scope=bot%20applications.commands" +
      "&permissions=274877926400" +
      "&response_type=code" +
      "&redirect_uri=" +
      escape("https://" + req.hostname + `/invited?source=${source}`)
  );
});

rootRouter.get("/support", (req, res) => {
  return res.redirect("https://discord.gg/J2xKqDKpGt");
});

rootRouter.get("/vote", (req, res) => {
  return res.redirect("https://top.gg/bot/950382032620503091");
});
