const express = require('express'),
    app = express();

app.use(express.static('public'));


app.listen(process.env.PORT || 3000, () => console.log('Ambiente logado com sucesso!'));

const Discord = require('discord.js');
const client = new Discord.Client();
const {MessageAttachment} = require('discord.js');
const config = require('./config.json');

const pokeQuizz = require('./src/js/pokequizz');

//const BotInfo = require('./src/js/botinfo.js');



client.on('ready', () => {
    console.log(`Bot ${client.user.tag} logado com sucesso!`);
    console.log(`Logged in as ${client.user.tag}!`);
});

// Mensagem padão
client.on('message', msg => {
    if (msg.content.toLowerCase() === 'ping') {
      msg.reply('Pong!');
    } else if (msg.content.toLowerCase() === `${config.prefix}foto`)
    {
      msg.reply(msg.author.avatarURL());
    } else if (msg.content.toLowerCase().startsWith(`${config.prefix}perfil`)) {
        let referencia = msg.mentions.members.first();
        if(referencia != null){
          var member = msg.mentions.members.first();
          let user = msg.meber;

          const embed = new Discord.MessageEmbed()
          .setTitle(`Perfil de: ${member.displayName}`)
          .setDescription(`Nome de Usuário: **${member.user.username}**` + 
                          `\nDiscord "tag": **${member.user.tag}**` + 
                          `\nLocalidade: **${member.user.locale}**` + 
                          `\nID: **${member.user.id}**` + 
                          `\nCriado em: **${member.user.createdAt.toString()}**` + 
                          `\nÈ um bot? **${member.user.bot ? "Sim" : "Não"}**`)
          .setImage(member.user.avatarURL())
          .setColor('#275BF0');
          msg.channel.send(embed);
          if(member.user.bot)
          {
            //BotInfo(member, msg);
          }
        }
        else{
          msg.reply(`Você não informou o usuário do perfil!`);
        }
    } else if(msg.content.toLowerCase() === `${config.prefix}pokequizz`){
      // Jogo do pokemon ....
      pokeQuizz(msg, MessageAttachment);
    } else if(msg.content.toLowerCase() === `${config.prefix}help`){
      // Ajuda do bot
      const embed = new Discord.MessageEmbed()
          .setTitle(`Ajuda do Pokémon Bot`)
          .setColor('#275BF0')
          .setDescription('Comandos:\n| &help : ajuda \n| &avatar : sua foto \n' + 
                '| &perfil : uso = &perfil @user \n' +
                '| &ping : tempo de resposta do bot \n| &pokequizz : jogo do pokémon');
      msg.channel.send(embed);
    }
  });


// Mensagens asyncronas 
  client.on("message", async message => {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const comando = args.shift().toLowerCase();
  
  // coamdno ping
  if(comando === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms.`+
    ` A Latencia da API é ${Math.round(client.ping)} ms`);
  } else if (comando === "avatar")
  {
    const m = await message.channel.send(message.author.avatarURL());
  }
  
});

client.login(config.token);

// Url = https://discord.com/oauth2/authorize?client_id=746561710319730769&scope=bot&permissions=8

// Url Public = https://discord.com/oauth2/authorize?client_id=746561710319730769&scope=bot&permissions=511040

