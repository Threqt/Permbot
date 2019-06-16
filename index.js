const config = require("./botconfig");
const Discord = require("discord.js");
var version = "v0.2"
var updateno = "2"
const bot = new Discord.Client({
  disableEverybody: true
});

//Async Functions
async function poll(message, bot){
  if(message.channel.name === "poll-creation"){
    message.channel.send("Poll creation has started. Please type what you want the poll content to be.")
    const filter = m => m.author.id === message.author.id;
    let collected = await message.channel.awaitMessages(filter, {
      max: 1,
      time: 1200000,
      errors: ['time']
    })
    if(!collected){
      return message.channel.send("No content!")
    }
    if(collected.first().content.toLowerCase() == 'cancel'){
      return message.channel.send("Cancelled.")
    }
    message.channel.send("Great! Now type the time in milliseconds on how long you want the poll to last. Use a hours - millisecond convertor if needed \n Common Times: \n 24 Hours: 86400000 milliseconds \n 1 hour: 3600000 milliseconds \n 30 minutes: 1800000 milliseconds ")
    const filter2 = m => m.author.id === message.author.id;
    let collected2 = await message.channel.awaitMessages(filter2, {
      max: 1,
      time: 1800000,
      errors: ['time']
    })
    if(!collected2.first().content){
      return message.channel.send("No content!")
    }
    if(collected2.first().content.toLowerCase() == 'cancel'){
      return message.channel.send("Cancelled.")
    }
    let time1 = parseInt(collected2.first().content)

    let pollEmbed = new Discord.RichEmbed()
      .setAuthor("Tumbleweed Bot", bot.user.avatarURL)
      .setThumbnail(bot.user.avatarURL)
      .setTitle(`Poll by ${message.author.username}#${message.author.discriminator}`)
      .setDescription(collected.first().content)
      .setFooter(`Prefix: ! | Tumbleweed Bot | ${version}`, bot.user.avatarURL)
      .setTimestamp();

    await bot.channels.find(channel => channel.id === "577276201026977802").send(pollEmbed)
    bot.channels.find(channel => channel.id === "577276201026977802").send(`@everyone`).then(async msg => {
      await msg.react('👍')
      await msg.react('👎')

      const agree = '👍'
      const disagree = '👎'

      const filter = reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree
      const results = await msg.awaitReactions(filter, {time: time1})

      let pollResults = new Discord.RichEmbed()
        .setAuthor("Tumbleweed Bot", bot.user.avatarURL)
        .setThumbnail(bot.user.avatarURL)
        .setTitle(`Results of the poll by ${message.author.username}#${message.author.discriminator}`)
        .setDescription(`Poll: ${collected.first().content}`)
        .addField("👍", results.get(agree).count-1)
        .addField("👎", results.get(disagree).count-1)
        .setFooter(`Prefix: ! | Tumbleweed Bot | ${version}`, bot.user.avatarURL)
        .setTimestamp();

      await bot.channels.find(channel => channel.id === "577682587913420830").send(pollResults)
    })
  } else {
    message.delete()
    message.reply("Incorrect Channel!").then(r => r.delete(5000))
  }
}

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("over Tumbleweed", {
    type: "WATCHING"
  });
});

bot.on(`guildMemberAdd`, member => {
  console.log(`User ` + member.user.username + ` has joined`)
  var role = member.guild.roles.find('name', 'Citizen')
  member.addRole(role)
});


bot.on("message", message => {
  if (message.author.bot) return;

  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd === `botinfo` && message.channel.type != "dm") {
    const embed = new Discord.RichEmbed()
      .setAuthor(`Tumbleweed Bot`, bot.user.avatarURL)
      .setThumbnail(bot.user.avatarURL)
      .addField(`Bot Name`, `Tumbleweed Bot`, true)
      .addField(`Created On`, bot.user.createdAt)
      .addField(`Version`, `1.0.0`, true)
      .addField(`Developer`, `Threqt#4377`, true)
      .setFooter("Prefix: ! | This bot is still in it's early phases", bot.user.avatarURL)
      .setTimestamp()
      .setColor(000000);

    return message.channel.send(embed)
  } else
  if (cmd === `serverinfo` && message.channel.type != "dm") {
    let sicon = message.guild.iconURL
    let online = message.guild.members.filter(m => m.presence.status !== 'offline').size
    let categories = message.guild.channels.filter(m => m.type === 'category').size
    let embed2 = new Discord.RichEmbed()
      .setAuthor("Tumbleweed Bot", bot.user.avatarURL)
      .setThumbnail(sicon)
      .addField("Owner", message.guild.owner, true)
      .addField("Created", message.guild.createdAt, true)
      .addField("Join Date", message.guild.joinedAt, true)
      .addField("Roles", message.guild.roles.size, true)
      .addField("Channels", message.guild.channels.size, true)
      .addField("Categories", categories, true)
      .addField("Region", message.guild.region, true)
      .addField("Total Members", message.guild.memberCount, true)
      .addField("Online Members", online, true)
      .setFooter("Prefix: ! | This bot is still in it's early phases", bot.user.avatarURL)
      .setTimestamp();

    return message.channel.send(embed2)
  } else
  if(cmd === `update`){
    let role = message.member.guild.roles.find('name', 'Mr.Bot')
    if(message.member.roles.has(role.id)){
      message.delete()
      let update = new Discord.RichEmbed()
        .setAuthor("Tumbleweed Bot", bot.user.avatarURL)
        .setThumbnail(bot.user.avatarURL)
        .setTitle(`Update Number ${updateno} | Version Number ${version}`)
        //•
        .setDescription("Update Details: \n • Added poll command to use for #public-polls \n \n Planned features: \n • Autorole using emojis \n • Chat moderation")
        .setFooter(`Prefix: ! | Tumbleweed Bot | ${version}`, bot.user.avatarURL)
        .setTimestamp();
      message.channel.send(update)
    }
  } else
  if(cmd === `createpoll`){
    poll(message, bot)
  }
});



bot.login(process.env.token);
