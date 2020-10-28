const config = require('../../config.json');
const axios = require('axios');
const { MessageAttachment } = require('discord.js');

function formatName(str){
    let newStr = str.replace(/[_]/g,' ');
    newStr = newStr.charAt(0).toUpperCase() + newStr.slice(1);
    return newStr;
}

module.exports = (msg, MessageAttachment) => {
    let number = Math.floor((Math.random() * config.maxpokemon) + 1);
    const header = {
        method: "get",
        url: config.endpoint + number
    }

    axios(header)
        .then((response) => {
            let res = response.data;
            let item = {
                "question" : "Quem é este Pokémon? *(Você tem 90 segundos)*",
                "answer" : [`${formatName(res.name)}`]
            }

            const filter = response => {
                return item.answer.some(answer => answer.toLowerCase() === response.content.toLowerCase());
            }

            msg.channel.send(item.question).then(() => {
                const attachmentback = new MessageAttachment(res.sprites.back_default);
                const attachment = new MessageAttachment(res.sprites.front_default);
                msg.channel.send(attachment); //.catch(console.error);
                msg.channel.send(attachmentback);
                msg.channel.awaitMessages(filter, { max: 1, time: 90000, errors: ['time'] })
                    .then( collected => {
                        msg.channel.send(`${collected.first().author} acertou a resposta!`);
                    })
                    .catch( collected => {
                        msg.channel.send(`O nome do pokémon é ... **${item.answer}**`);
                    })
            });
        })
        .catch(error => {
            console.log('Erro no Axios!!!');
            console.log(error);
        })
}