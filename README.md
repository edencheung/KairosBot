<p align="center">
    <p id=title align="center">
      <img src="https://images-ext-1.discordapp.net/external/mk67v7aLqJzXNRItr4WYQptlCqVDb3pjzTCs7XBmUHg/https/cdn.discordapp.com/avatars/950382032620503091/50f96864ebf0422ad1309f81d577a11b.webp">KairosBot
    </p>
  <p align="center">
    <a href="https://discord.gg/J2xKqDKpGt"><img src="https://img.shields.io/discord/950606768621359104?color=5865F2&logo=discord&logoColor=white" alt="Support discord server" /></a>
    <a href="https://bit.ly/KairosBot"><img src="https://img.shields.io/badge/Invite-KairosBot-5865F2?logo=discord&logoColor=white" alt="Kairos Bot Invite" /></a>
  </p>  
  <p align="center">
    <a href="https://top.gg/bot/950382032620503091">
      <img src="https://top.gg/api/widget/950382032620503091.svg">
    </a> 
  </p>
</p>

<style>
#title {
  font-family: Fantasy;
  font-size: 162px;
  margin-bottom: -40px;
}
</style>

# 📜About KairosBot

KairosBot is a discord bot made by `Eden#2972` for people in different timezones to communicate anything about time seamlessly.

# 🚀Getting started

You can either use the public version of [KairosBot](https://bit.ly/KairosBot) or host your own kairos bot [here](#🤖hosting-your-own-kairosbot). If you are using the public version, skip to the [How the bot works](#❓how-the-bot-works) section.

# 🤖Hosting your own KairosBot

## ✅ Requirements

1. A discord bot token ([Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot))
2. NodeJs [v16.6.0+](https://nodejs.org/en/)

## 🏃‍♂️ Hosting

Setting up:

```
git clone https://github.com/Eden4897/KairosBot.git
cd KairosBot
npm i
```

Config:

1. Create `config.json` in `src`
2. Paste this in `config.json` and fill in the `TOKEN` and `CLIENT-ID`:

```json
{
  "TOKEN": "DISCORD-BOT-TOKEN",
  "CLIENT_ID": "DISCORD-APPLICATION-CLIENT-ID"
}
```

Building and running:

```
npm i typescript -g
npm run deploy
npm run launch
```

# ❓How the bot works

If you have set your timezone and enabled automatic timestring detection and translation, the bot will automatically reply to any message that it detects a timestring in with the timestamp. It can also recognise and translate multiple timestrings in a single message. Here are examples of timestrings:

> 12:00\
> 9:34 pm\
> 07:34AM tmr\
> 2:47 8 days ago\
> 09:51pm 7 days later\
> 11:58 ytd\

Heres an example use case:\
![](https://cdn.discordapp.com/attachments/887637467002458132/950631024247840828/unknown.png)

# 📝Commands

> key: [] is required and () is optional<hr>

## /settimezone [timezone]

Configures your timezone<hr>

## /gettimezone (@user)

Gets the timezone of a given user (defaults to yourself)<hr>

## /gettimezonetime [timezone]

Gets the local time of a given timezone<hr>

## /getusertime [@user]

Gets the local time of a given user<hr>

## /timestamp (hour) (min) (am_pm) (date) (month) (year) (date_format) (timezone) (include_raw)

Creates a timestamp according to the data you provide<hr>

## /enable

Enables automatic timestring detection and translation<hr>

## /disable

Disables automatic timestring detection and translation<hr>

## /help

Sends you some help<hr>

## /timestrings

shows you examples of timestrings<hr>

## /ping

Replies with "Pong" and the latency

# 🔗Misc

- Join the support server [here](https://discord.gg/J2xKqDKpGt),
- and upvote the bot [here](https://top.gg/bot/950382032620503091)!
