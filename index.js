const Discord = require('discord.js');
const Sequelize = require('sequelize');

const client = new Discord.Client();
const PREFIX = '!';

// [alpha]
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});
// [beta]
/*
 * equivalent to: CREATE TABLE tags(
 * name VARCHAR(255),
 * description TEXT,
 * username VARCHAR(255),
 * usage INT
 * );
 */
const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	title: Sequelize.TEXT,
	text: Sequelize.TEXT,
	color: Sequelize.TEXT,
    thumbnail: Sequelize.TEXT,
    image: Sequelize.TEXT,
    url: Sequelize.TEXT,
    channel: Sequelize.TEXT,
    username: Sequelize.TEXT,
    post: Sequelize.BOOLEAN,
    messageid: Sequelize.TEXT
	}
);

client.once('ready', () => {
    // [gamma]
	Tags.sync();
	console.log('ready!')
});





client.on('message', async message => {
	if (message.author = message.author.bot) {
        return
    }else {
    
    if (message.member.hasPermission("KICK_MEMBERS")){
	
	if (message.content.startsWith(PREFIX)) {
		const input = message.content.slice(PREFIX.length).split(' ');
		const command = input.shift();
        let commandArgs = input.join(' ');
        var seperator = "=="
        

		if (command === 'addannouncement') {
            if (commandArgs === "") {
                var newMessage = new Discord.RichEmbed()
                    .setTitle("Usage")
                    .setColor("#0000ee")
                    .setDescription(`Make an announcement by using the command \n !addannouncement MessageName(used to edit later on) ${seperator} Title ${seperator} Message ${seperator} Color(USE HEXADECIMAL COLORS) ${seperator} Thumbnail(link to online image, i.e. Imgur) ${seperator} Image(link to online image, i.e. Imgur) ${seperator} URL ${seperator} Channel`);
                return message.channel.send(newMessage)
            }
            Args = commandArgs.split(seperator);

            if (Args[1] == undefined) Args[1] = ""
            if (Args[2] == undefined) Args[2] = ""
            if (Args[3] == undefined) Args[3] = "#eeeeee";
            if (Args[4] == undefined) Args[4] = "";
            if (Args[5] == undefined) Args[5] = "";
            if (Args[6] == undefined) Args[6] = "";
            if (Args[7] == undefined) Args[7] = "bot-commands"

            var options = {
                name: Args[0].trim(),
                title: Args[1].trim() || "Announcement",
                message: Args[2].trim() || "No Content Given",
                color: Args[3].trim(),
                thumbnail: Args[4].trim(),
                image: Args[5].trim(),
                URL: Args[6].trim(),
                channel: Args[7].trim()
            }
            
            var announcer = message.author;

            var announcementEmbed = new Discord.RichEmbed()
                .setTitle(`${options.title}`)
                .setColor(`${options.color}`)
                .setURL(`${options.URL}`)
                .setThumbnail(`${options.thumbnail}`)
                .setImage(`${options.image}`)
                .setDescription(`${options.message} \n\n this is announcement: ${Args[0]}`)
                .setTimestamp()
                .setFooter(`Bot Created and copyrighted by: M1, Vincent Evers`);
            
            var announcementChannel = message.guild.channels.find('name', options.channel);
            if (!announcementChannel) return message.channel.send("Can't find the selected channel")

            message.channel.send(announcementEmbed)
            try {
                const tag = await Tags.create({
                    name: options.name,
                    title: options.title,
                    text: options.message,
                    color: options.color,
                    thumbnail: options.thumbnail,
                    image: options.image,
                    url: options.URL,
                    channel: options.channel,
                    username: message.author,
                    post: false
                });
                const tag2 = await Tags.findOne({ where: { name: options.name }})
                message.channel.send(tag2.get('name'))
                return message.reply(`Announcement ${tag.name} added.`)
            }
            catch (e) {
                if (e.name === "SequelizeUniqueConstraintError") {
                    return message.reply("That Announcement already exists.")
                }
                return message.reply("Something went wrong.")
            }
                

		} else if (command === 'tag') {
            // [epsilon]
            const tagName = commandArgs;
            const tag = await Tags.findOne({ where: { name: tagName }});
            console.log(tag)
            if (tag) {
                

            var options = {
                title: tag.get('title'),
                message: tag.get("text"),
                color: tag.get("color"),
                thumbnail: tag.get("thumbnail"),
                image: tag.get("image"),
                URL: tag.get("url"),
                channel: tag.get("channel")
            }
            

            var announcementEmbed = new Discord.RichEmbed()
                .setTitle(`${options.title}`)
                .setColor(`${options.color}`)
                .setURL(`${options.URL}`)
                .setThumbnail(`${options.thumbnail}`)
                .setImage(`${options.image}`)
                .setDescription(`${options.message} \n\n this is announcement: ${tagName}`)
                .setTimestamp()
                .setFooter(`Bot Created and copyrighted by: M1, Vincent Evers`);
            

            return message.channel.send(announcementEmbed)
            }
            return message.reply(`could not find announcement ${tagName}`)
		} else if (command === 'edittitle') {
            // [zeta]
            if (commandArgs === "") {
                var newMessage = new Discord.RichEmbed()
                    .setTitle("Usage")
                    .setColor("#0000ee")
                    .setDescription(`Edit the title of an announcement by using the command \n !edittilte MessageName ${seperator} Title`);
                return message.channel.send(newMessage)
            }
            Args = commandArgs.split(seperator);
            tagName = Args[0].trim();
            tagTitle = Args[1].trim();
			const affectedRows = await Tags.update({ title: tagTitle }, { where: { name: tagName } });
            if (affectedRows > 0) {
	            return message.reply(`Tag ${tagName} was edited.`);
            }
            return message.reply(`Could not find a tag with name ${tagName}.`);

		} else if (command === 'editcolor') {
			// [zeta]
			if (commandArgs === "") {
                var newMessage = new Discord.RichEmbed()
                    .setTitle("Usage")
                    .setColor("#0000ee")
                    .setDescription(`Edit the color of an announcement by using the command \n !editcolor MessageName ${seperator} color(HEXADECIMAL!!!)`);
                return message.channel.send(newMessage)
            }
            Args = commandArgs.split(seperator);
            tagName = Args[0].trim();
            tagTitle = Args[1].trim();
			const affectedRows = await Tags.update({ color: tagTitle }, { where: { name: tagName } });
            if (affectedRows > 0) {
	            return message.reply(`Tag ${tagName} was edited.`);
            }
            return message.reply(`Could not find a tag with name ${tagName}.`);
		} else if (command === 'edittext') {
			// [zeta]
			if (commandArgs === "") {
                var newMessage = new Discord.RichEmbed()
                    .setTitle("Usage")
                    .setColor("#0000ee")
                    .setDescription(`Edit the text of an announcement by using the command \n !edittilte MessageName ${seperator} Text`);
                return message.channel.send(newMessage)
            }
            Args = commandArgs.split(seperator);
            tagName = Args[0].trim();
            tagTitle = Args[1].trim();
			const affectedRows = await Tags.update({ text: tagTitle }, { where: { name: tagName } });
            if (affectedRows > 0) {
	            return message.reply(`Tag ${tagName} was edited.`);
            }
            return message.reply(`Could not find a tag with name ${tagName}.`);
		} else if (command === 'editthumbnail') {
            // [zeta]
            if (commandArgs === "") {
                var newMessage = new Discord.RichEmbed()
                    .setTitle("Usage")
                    .setColor("#0000ee")
                    .setDescription(`Edit the thumbnail of an announcement by using the command \n !editthumbnail MessageName ${seperator} URL(online image)`);
                return message.channel.send(newMessage)
            }
            Args = commandArgs.split(seperator);
            tagName = Args[0].trim();
            tagTitle = Args[1].trim();
			const affectedRows = await Tags.update({ thumbnail: tagTitle }, { where: { name: tagName } });
            if (affectedRows > 0) {
	            return message.reply(`Tag ${tagName} was edited.`);
            }
            return message.reply(`Could not find a tag with name ${tagName}.`);
        } else if (command === 'editimage') {
            // [zeta]
            if (commandArgs === "") {
                var newMessage = new Discord.RichEmbed()
                    .setTitle("Usage")
                    .setColor("#0000ee")
                    .setDescription(`Edit the image of an announcement by using the command \n !editimage MessageName ${seperator} URL(online image)`);
                return message.channel.send(newMessage)
            }
            Args = commandArgs.split(seperator);
            tagName = Args[0].trim();
            tagTitle = Args[1].trim();
			const affectedRows = await Tags.update({ image: tagTitle }, { where: { name: tagName } });
            if (affectedRows > 0) {
	            return message.reply(`Tag ${tagName} was edited.`);
            }
            return message.reply(`Could not find a tag with name ${tagName}.`);
        } else if (command === 'editurl') {
            // [zeta]
            if (commandArgs === "") {
                var newMessage = new Discord.RichEmbed()
                    .setTitle("Usage")
                    .setColor("#0000ee")
                    .setDescription(`Edit the URL of an announcement by using the command \n !editurl MessageName ${seperator} URL(online image)`);
                return message.channel.send(newMessage)
            }
            Args = commandArgs.split(seperator);
            tagName = Args[0].trim();
            tagTitle = Args[1].trim();
			const affectedRows = await Tags.update({ url: tagTitle }, { where: { name: tagName } });
            if (affectedRows > 0) {
	            return message.reply(`Tag ${tagName} was edited.`);
            }
            return message.reply(`Could not find a tag with name ${tagName}.`);
        } else if (command === 'editchannel') {
            // [zeta]
            if (commandArgs === "") {
                var newMessage = new Discord.RichEmbed()
                    .setTitle("Usage")
                    .setColor("#0000ee")
                    .setDescription(`Edit the channel of an announcement by using the command \n !editchannel MessageName ${seperator} channel(without hashtag #)`);
                return message.channel.send(newMessage)
            }
            Args = commandArgs.split(seperator);
            tagName = Args[0].trim();
            tagTitle = Args[1].trim();
			const affectedRows = await Tags.update({ channel: tagTitle }, { where: { name: tagName } });
            if (affectedRows > 0) {
	            return message.reply(`Tag ${tagName} was edited.`);
            }
            return message.reply(`Could not find a tag with name ${tagName}.`);
		} else if (command === 'showtags') {
			// [lambda]
			const tagList = await Tags.findAll({ attributes: ['name'] });
			const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
			return message.channel.send(`List of tags: ${tagString}`);
		} else if (command === 'removetag') {
			// [mu]
			const tagName = commandArgs;

			const rowCount = await Tags.destroy({ where: { name: tagName } });
			if (!rowCount) return message.reply('That tag did not exist.');
			return message.reply('Tag deleted.');
        } else if (command === 'post') {
            // [zeta]
            if (commandArgs === "") {
                var newMessage = new Discord.RichEmbed()
                    .setTitle("Usage")
                    .setColor("#0000ee")
                    .setDescription(`Post an announcement by using the command \n !post MessageName`);
                return message.channel.send(newMessage)
            }
            Args = commandArgs.split(seperator);
            tagName = Args[0].trim();
            const tag = await Tags.findOne({ where: { name: tagName }});
            console.log(tag)
            if (tag) {
                

            var options = {
                title: tag.get('title'),
                message: tag.get("text"),
                color: tag.get("color"),
                thumbnail: tag.get("thumbnail"),
                image: tag.get("image"),
                URL: tag.get("url"),
                channel: tag.get("channel"),
                posted: tag.get("post")
            }
            

            var announcementEmbed = new Discord.RichEmbed()
                .setTitle(`${options.title}`)
                .setColor(`${options.color}`)
                .setURL(`${options.URL}`)
                .setThumbnail(`${options.thumbnail}`)
                .setImage(`${options.image}`)
                .setDescription(`${options.message}`)
                .setTimestamp()
                .setFooter(`Bot Created and copyrighted by: M1, Vincent Evers`);
            if (options.posted === false) {
            const sendchannel = client.channels.find("name", options.channel);
            sendchannel.send(announcementEmbed)
            var messagei
            sendchannel.fetchMessages({ limit: 1 }).then(messages => {
                messagei = messages.first().id;
            })
            .catch(e => console.log(e));
            console.log("DIT DOET HET !!")
            try {
            const updated = await Tags.update({ post: true }, { where: { name: tagName } })
            }
            catch (e) {
                if (e.name === "SequelizeUniqueConstraintError") {
                    return message.reply("That Announcement already exists.")
                }
            }
            
            } else message.reply(`Announcement ${tagName} already posted, want to repost? Delete the old message and use this message again`)
            }
            return message.reply(`could not find announcement ${tagName}`)
        } 
	
}}}});

client.login('NjQyMTE2OTk2NDk4MTk0NDMz.XcSQEw.wlrUKBFhREBSmdbHnv50E-RNwl8');