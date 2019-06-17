const config = require("./config");
const Discord = require("discord.js");
const rbx = require("noblox.js")
const db = require("quick.db")
const bot = new Discord.Client({
  disableEverybody: true
});

async function loginRank(bot, message, rbx){
  await rbx.cookieLogin(`_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_848B0B5279F07AEE7D37261FE7394FABB13FE2E6747BB2F63CB6873F9D078E21114906687347B9A481B6A834B9B4FAB56E4F5DE3AA2C73A1C26DD8F31F498E39E7280E89C41CF673DFD94C5D91AFC4A236C24DFE16720AADFC9FCE69F01D35583786AB2BEFF716E91EED155B9E15DF309424C42CFB6BD0CA946C2E8876AF9F9F414A5D4319AEB84E9D619BBE39ED06F4746E6E87D12BE28FFF4DD6CC4E1AB90ED98A5E71E18EFB4ECD6A2CE537A6790C0070E4EE08C9938691349B58D039AF706BE32935232F4771961BE60E052973CEE0D858C378AF3DC38EF5870F2C5EA8BF0A051F86E845A5E9A9CC69F748B2A20A021B57D5497252A44E50A0C9C18A39C5F374D035E7A774243AFC5011D43734347F07C011728673B63EE7839C73FC7092E2F86921`)
  var options = {
    group: 4912192,
    target: 410523781,
    name: 'E-1| Private'
  }
  rbx.setRank(18, 2470023, 10).then(function (newrole) {
    console.log(`The new role is ${JSON.stringify(newrole)}`)
  })
  let currentuser = await rbx.getCurrentUser()
}
bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
});

bot.on(`guildMemberAdd`, member => {
  return
});


bot.on("message", async message => {
  if (message.author.bot) return;

  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if(cmd === `ping`){
    let msg = await message.channel.send("Testing how long it takes for perm to attach to bot...")
    msg.edit(`It takes ${msg.createdTimestamp - message.createdTimestamp}ms to attach perm to bot. Ping is ${Math.round(bot.ping)}ms`)
  } else
  if(cmd === `rank`){
    loginRank(bot, message, rbx)
  }
});

bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => console.info(e));

bot.login(process.env.token);
