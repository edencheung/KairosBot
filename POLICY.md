# **KairosBot's Privacy Policy**

### By using KairosBot you accept with its privacy policy.

## 1. What data does KairosBot store?

- User IDs 
- The respective timezone of the user provided in the `/settimezone` command
- Timestamps of when the user can vote next to power the auto voting reminder feature

All data is safely encrypted by the bot.

## 2. Who can access the data?

- Bot developer(s) (currently only `Eden#2972`)

## 3. Why does KairosBot store the data?

It stores user IDs and their timezones because:

- The `/timestamp` command will default the timezone of the input to the user's timezone and calculate the appropriate timestamp
- The `/getusertime` command will use the user's stored timezone to calculate the local time of the user
- The automatic timestamp generation when the bot senses a time in a message will use the stored timezone to calculate the local time of the author so that the timestamp generated is relative to the author's local time.

It stores timestamps because:
- the bot will use the timestamps to remind users when they can vote

## 4. How long do you store my data for?

- Currently, message content data (only messages that the bot detected a timestring in) will be stored for a maximum of 30 days for debugging purposes
- Your timezone will be stored forever until request a deletion of your data
- The voting timestamps will be deleted as soon as the time passes that timestamp, which effectively means the timestamps will be deleted within no more than 12 hours

## 5. How can we delete all our data?

Join our [Support Server](https://discord.gg/J2xKqDKpGt) on discord and contact an online admin/developer.

## 6. What if I need more help?

You can reach us by the following things:

- Join our [Support Server](https://discord.gg/J2xKqDKpGt) on discord
- Contact me on discord (`Eden#2972`)

## Please note, that we can change this policy without any warning at any given time.

#### **Last changed:** `13th April 2022`
