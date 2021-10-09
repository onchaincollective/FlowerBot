import { getFlower } from "occ-flowers-sdk";
import { Client, Intents, MessageEmbed } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const cloudinaryGifUri = "https://res.cloudinary.com/ds24tivvl/image/upload/flowers/";
const cloudinaryPngUri = "https://res.cloudinary.com/ds24tivvl/image/upload/flowers-pngs/";

client.on('ready', () => {
    console.log('Ready!');
});

// {
//     tokenId: 212,
//     attributes: {
//       petalStyle: 'Lotus',
//       petalColor: 'White',
//       coreSize: 25,
//       noOfPetals: 11,
//       bgColor: 'Light Aprico',
//       bgOverlay: 'Canary Yellow',
//       mutation: 'None',
//       spin: false,
//       bgType: 'Normal'
//     },
//     image: {
//       svg: 'QmZBMHASJbTXRgJeTNP8Sjz5gBcs5iibUa9GQjgwwt8xfq',
//       gif: null,
//       png: 'QmUx2K1RFttB258TeEQmwBqn8b3cNCgJffwT23bB5PnauR'
//     },
//     rarity: {
//       occurrence: { rank: 2951, score: 10607 },
//       probability: { rank: 2972, score: 19.821303355416607 },
//       rarityTools: { rank: 2807, score: 164.42204639094797 }
//     }
//   }

client.on("messageCreate", msg => {

    if (msg.content.startsWith('!gib')) {
        const number = msg.content.split(" ")[1];
        if (parseInt(number) > 4096) {
            msg.reply('👀 I thought there were only 4096 flowerinos');
            return;
        } else if (parseInt(number) < 1 || isNaN(number)) {
            msg.reply("Why don't you try with a legit number 🌼");
            return;
        }

        getFlower(parseInt(number)).then((res) => {
            let imageuri, gifuri;
            imageuri = cloudinaryUri + number + ".png";
            if (res.attributes.spin) {
                gifuri = cloudinaryUri + number + ".gif";
            }
            const flowerEmbed = new MessageEmbed()
            .setColor('#2F3136')
            .setTitle('Flower #' + number)
            .setURL('https://ipfs.io/ipfs/' + res.image.png)
            .addFields(
                { name: 'Petal style', value: res.attributes.petalStyle, inline: true },
                { name: 'Spinny', value: res.attributes.spin ? "Yes" : "No", inline: true },
                { name: 'Mutation', value: res.attributes.mutation, inline: true },
                { name: 'Bg type', value: res.attributes.bgType, inline: true },
                { name: 'Petal count', value: res.attributes.noOfPetals.toString(), inline: true },
                { name: 'Rarity', value: "Rank: " + res.rarity.rarityTools.rank, inline: true },
            )
            .setImage(gifuri ? gifuri : imageuri)
            .setTimestamp()
            msg.reply({ embeds: [flowerEmbed] });
        }).catch(error => {
            console.log(error);
            msg.reply("Oops! Something went wrong");
        });
    }
  })

// Login to Discord with your client's token
client.login(process.env.TOKEN);

