//Does some basic defintions in order to make the bot function
const Discord = require("discord.js");
const client = new Discord.Client();
const schedule = require("node-schedule");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
//const settings = require("./settings.json");

//Tracks settings for users with bot
const settingsProvider = new EnmapLevel({name: "settings"});
client.settings = new Enmap({provider: settingsProvider});

//Tracks the amount of bois found
const boiProvider = new EnmapLevel({name: "found"});
client.found = new Enmap({provider: boiProvider});

//Declares variables for werewolf game
//var werewolfOn = false;

//Tracks points for leveling
const pointProvider = new EnmapLevel({name: "points"});
client.points = new Enmap({provider: pointProvider});


//Declares two variables for determining cooldown
var cooldown = 0;
var lastUser;


client.pointsMonitor = (client, message, settings) => {
  //Returns if message is dm
  if (message.channel.type !== "text") return;

  //Returns if it is a bot command
  if (message.content.startsWith("~") || message.content.startsWith("!")) return;

  //Creates a new score tally if the user doesn't have one, or gets their current points
  const score = client.points.get((message.author.id + message.guild.id)) || { points: 0, level: 0 };

  //Checks to see if the user is on cooldown
  if (cooldown < 5) {
    //Adds points
    score.points++;
  }

  if (lastUser == message.author.id || !lastUser) {
    //Adds to cooldown
    cooldown++;
  } else {
    //Resets cooldown
    cooldown = 0;
  }

  //Sets the last user to speak
  lastUser = message.author.id;

  //Calculates your points for your level
  const curLevel = Math.floor(Math.sqrt(score.points));

  //Checks to see if you have enough points to go up a level
  if (score.level < curLevel) {
    //Sends it in specific channel if chill chat, does same channel as user if not
    if (message.guild.id == "98910743633608704") {
      if (settings.mentions == true) {
        client.channels.get("145013323019059200").send(`Congratulations, <@${message.author.id}>, you leveled up to level **${curLevel}**! Ribbit :frog:`);
      } else {
        client.channels.get("145013323019059200").send(`Congratulations, ${message.author.username}, you leveled up to level **${curLevel}**! Ribbit :frog:`);
      }
    } else {
      if (settings.mentions == true) {
        message.channel.send(`Congratulations, <@${message.author.id}>, you leveled up to level **${curLevel}**! Ribbit :frog:`);
      } else {
        message.channel.send(`Congratulations, ${message.author.username}, you leveled up to level **${curLevel}**! Ribbit :frog:`);
      }
    }
    score.level = curLevel;
  }

  //Saves the new score
  client.points.set((message.author.id + message.guild.id), score);
};

//Defines boi array
var boiArray = ["good", "bad", "adequate", "howdy", "normal", "furry", "kinky", "biker", "meme", "frog", "loving", "weird", "space", "magical", "sad", "test", "bye", "awful", "stupid"
  , "terrible", "worst", "worse", "horse", "boing"];

//Tells the bot what token to login with
client.login(process.env.TOKEN);

//Sends startup message when fired
client.on("ready",() => {
  console.log("Frogbot ready for combat!");
  //Sets the bot"s game display message
  client.user.setPresence({ status: "online", game: { name: "on a unicycle", type: 0 } });

  //Sets the table of bois found
  for (var i = 0; i < boiArray.length; i++) {
    client.found.get(i) || { found: false };
  }

});

//Defines the array for each discord channel, names, and colors
var discordChannel = ["98910743633608704", "99249836628406272", "140946564901240832", "99249863128002560", "200384608745947137", "145013323019059200", "308052854227075074", "208739103674466304", "263868020059799552", "348892634250739712", "106046995860332544", "106049853494198272", "276383014890504193", "268216162452635649", "139408808031027200", "192855751063109632", "368823287419240458"];
var colorModifiers = ["Alice", "Antique", "Blanched", "Bluish", "Burly", "Cadet", "Cornflower", "Dark", "Olive", "Sea", "Slate", "Deep", "Sky", "Dim", "Dodger", "Fiery", "Floral", "Forest","Ghost","Golden",
  "Green", "Hot", "Indian", "Lavender", "Lawn", "Lemon", "Light", "Steel", "Lime", "Medium", "Aqua", "Spring", "Violet", "Midnight", "Mint", "Misty", "Navajo", "Old", "Olive", "Orange",
  "Pale", "Papaya", "Peach", "Powder", "Rosy", "Royal", "Saddle", "Sandy", "White", "Yellow"];
var colorNames = ["Blue","White","Aqua","Marine","Azure","Beige","Bisque","Black","Almond","Violet","Brown","Wood","Chartreuse","Chocolate","Coral","Cornsilk","Crimson","Cyan","Gray","Green","Khaki","Magenta","Orange","Orchid"
  ,"Red","Salmon","Turquoise","Pink","Brick","Fuchsia","Gainsboro","Gold","Honeydew","Indigo","Ivory","Lavender","Chiffon","Lime","Linen","Magenta","Maroon","Purple","Mint","Rose","Moccasin","Navy","Lace","Olive","Drab"
  ,"Papaya", "Whip", "Puff","Peru","Plum","Shell","Sienna","Silver","Snow","Tan","Teal","Thistle","Tomato","Wheat","Smoke"];
var randomNouns = ["Square", "Cemetery", "Cow", "Communism", "Soup", "Coast", "Flower", "Crime", "Ice", "Power", "Spider", "Potato", "Economics", "Sand", "Oil", "Eyes", "Tongue", "Engine", "Bomb",
  "Turkey", "Committee", "Theory", "Pollution", "Society", "Wine", "Bee", "Fog", "Earthquake", "Celibacy", "Spark", "Division", "Sail", "Jelly", "Locket", "Undefined", "Popcorn", "Yak", "Zebra", "Plane"
  , "Quicksand", "Capitalism", "Chess", "Fowl", "Spring", "Sugar", "Road", "Grandfather", "Mazie", "Moon", "Skirt"];

//Saves two alternative dice rolling commands
var diceString = new RegExp(/^~r\s\d+d\d+/i);
var diceStringAlt = new RegExp(/^~r\sd\d+/i);
var diceAlt = new RegExp(/\sd/);
var diceSplit = new RegExp(/[^0123456789+\-*/]+/);

//Declares variables for mojave function
var mojaveHour = 0;
var mojaveMinute = 0;
var mojaveRule = new schedule.RecurrenceRule();

//Declares regexps for difference of two squares command
var squaresString = new RegExp(/^~squares\s\d+/i);
var squaresSplit = new RegExp(/[^0123456789]+/);

//Declares regexps for rock paper scissors commands
var rpsString = new RegExp(/^~rps\s[a-z]+/i);
var wordSplit = new RegExp(/[^a-zA-Z]+/g);

//Declares regexp for Mazie command
var mazieString = new RegExp(/^~mazie\s[a-z]+/i);

//Declares regexp for settings mentions command
var settingsMentionsString = new RegExp(/^~settings\smentions\s[a-z]+/i);
var getMentionsString = new RegExp(/^~settings\smentions/i);

//Declares regexp for Boi commands
var boiString = new RegExp(/^[a-z]+\sboi$/i);

var emojiString = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

const padObject = {
  0: 20,
  1: 9,
  2: 10
};

//Functions that determines a new random time for Mojave meme
function mojaveTime() {
  //Sets time for the mojave meme
  mojaveHour = Math.floor((Math.random() * (23 - 0 + 1)) + 0);
  mojaveMinute = Math.floor((Math.random() * (59 - 0 + 1)) + 0);
  mojaveRule.dayOfWeek = 4;
  mojaveRule.hour = mojaveHour;
  mojaveRule.minute = mojaveMinute;
  console.log(mojaveMinute + " " + mojaveHour);
}

//Executes mojaveTime function
mojaveTime();

//Declares function that calculates dice total
function diceCalculator(diceAmount, diceNumber) {
  var diceTotalTemp = 0;
  for (var i = 0; i < diceAmount; i++) {
    diceTotalTemp += Math.floor((Math.random() * diceNumber) + 1);
  }
  return diceTotalTemp;
}

//Sets the prefix required to activate the bot
var prefix = "~";

//Fires on message send in any channel
client.on("message", message => {
  //Creates a variable to save the user"s message time
  var startTime = message.createdTimestamp;

  //Saves the message"s content as a string
  var messageString = message.content;

  //Ignores message if message is sent by another bot or itself
  if (message.author.bot) return;

  //Gets the users settings
  const userSettings = client.settings.get(message.author.id) || { mentions: true };

  //Sends control to pointsMonitor function
  client.pointsMonitor(client, message, userSettings);

  //Ignores message if using strikeout feature
  if (message.content.startsWith("~~")) return;

  if (boiString.test(messageString)) {
    if (message.content.toLowerCase().startsWith(boiArray[0])) {
      message.channel.send("Ribbit :frog:");
    } else if (message.content.toLowerCase().startsWith(boiArray[1])) {
      message.channel.send("<:ChillBinch:248943253221670923>");
    } else if (message.content.toLowerCase().startsWith(boiArray[2])) {
      message.channel.send("Okay...");
    } else if (message.content.toLowerCase().startsWith(boiArray[3])) {
      message.channel.send("yee haw");
      client.user.setPresence({ status: "online", game: { name: "on a bull", type: 0 } });
    } else if (message.content.toLowerCase().startsWith(boiArray[4])) {
      message.channel.send("Ribbit");
      client.user.setPresence({ status: "online", game: { name: "on a unicycle", type: 0 } });
    } else if (message.content.toLowerCase().startsWith(boiArray[5])) {
      message.channel.send("OwO What's this?");
    } else if (message.content.toLowerCase().startsWith(boiArray[6])) {
      message.channel.send("Ewwwwwwwww.");
    } else if (message.content.toLowerCase().startsWith(boiArray[7])) {
      message.channel.send("Vroom vroom.");
      client.user.setPresence({ status: "online", game: { name: "on a motorcycle", type: 0 } });
    } else if (message.content.toLowerCase().startsWith(boiArray[8])) {
      message.channel.send("It is wednesday my dudes.");
    } else if (message.content.toLowerCase().startsWith(boiArray[9])) {
      message.channel.send("Yes.");
    } else if (message.content.toLowerCase().startsWith(boiArray[10])) {
      message.channel.send(":heart:");
    } else if (message.content.toLowerCase().startsWith(boiArray[11])) {
      message.channel.send("?");
    } else if (message.content.toLowerCase().startsWith(boiArray[12])) {
      message.channel.send("Pew pew");
      client.user.setPresence({ status: "online", game: { name: "on a spaceship", type: 0 } });
    } else if (message.content.toLowerCase().startsWith(boiArray[13])) {
      message.channel.send("DO NOT THROW SOUL!");
    } else if (message.content.toLowerCase().startsWith(boiArray[14])) {
      message.channel.send(":frowning:");
    } else if (message.content.toLowerCase().startsWith(boiArray[15])) {
      //Sends a placeholder message to compare times
      message.channel.send(":ping_pong: Pong!").then(message => {
        //Subtracts this message"s time by the user"s message to calculate ping
        message.edit(`This message took \`${Math.round(message.createdTimestamp - startTime)} ms\` to reach you!`);
        //Checks to see if there is a 0 or negative ping value, then displays error message
        if (Math.round(message.createdTimestamp - startTime <= 0)) {
          message.channel.send("Wait a minute, that can\"t be right...");
        }
      });
    } else if (message.content.toLowerCase().startsWith(boiArray[16])) {
      client.channel.send("", {
        file: "http://i0.kym-cdn.com/photos/images/original/001/112/711/28e.jpg"
      });
    } else if (message.content.toLowerCase().startsWith(boiArray[17]) || message.content.toLowerCase().startsWith(boiArray[18]) || message.content.toLowerCase().startsWith(boiArray[19]) || message.content.toLowerCase().startsWith(boiArray[20]) || message.content.toLowerCase().startsWith(boiArray[21])) {
      message.channel.send("No bully!");
    } else if (message.content.toLowerCase().startsWith(boiArray[22])) {
      message.channel.send("Neeeiiiiigggggghhhhh.");
    } else if (message.content.toLowerCase().startsWith(boiArray[23])) {
      message.channel.send("Error: Boing not recognized");
    } else {
      message.channel.send("Error: Boi not recognized");
    }
  }

  //Ignores message if it does not start with prefix
  if (!message.content.startsWith(prefix)) return;

  //Displays the amount of time it took in miliseconds to receive command and to respond
  if (message.content.toLowerCase() === (prefix + "ping")) {
    //Sends a placeholder message to compare times
    message.channel.send(":ping_pong: Pong!").then(message => {
      //Subtracts this message"s time by the user"s message to calculate ping
      message.edit(`This message took \`${Math.round(message.createdTimestamp - startTime)} ms\` to reach you!`);
      //Checks to see if there is a 0 or negative ping value, then displays error message
      if (Math.round(message.createdTimestamp - startTime <= 0)) {
        message.channel.send("Wait a minute, that can\"t be right...");
      }
    });
  } else

  //Message that tells commands, aka huge mess. Need to find a better way to display in source code.
  if (message.content.toLowerCase() === (prefix + "commands")) {
    message.channel.send(`\`\`\`css\nPing - Displays the amount of time it takes the bot to recieve your message and send a response\nDatBoi - Here comes dat boi\nOShitWaddup - O shit waddup\n\`\`\``);
  } else

  //Responds with a meme to a meme hypothesis
  if (message.content.toLowerCase() === (prefix + "datboi")) {
    message.channel.send("O shit waddup!");
  } else

  //Responds with a meme to a meme conclusion
  if (message.content.toLowerCase() === (prefix + "oshitwaddup")) {
    message.channel.send("Here comes dat boi!");
  } else

  //Responds with Pingu noises
  if (message.content.toLowerCase() === (prefix + "pingu")) {
    message.channel.send("Noot Noot :penguin:");
  } else

  //Responds to a message with a relevant image
  if (message.content.toLowerCase() === (prefix + "bitchholdon")) {
    message.channel.send("", {
      file: "https://i.imgur.com/XHBa71T.jpg"
    });
  } else

  //B emoji version of ping command
  if (message.content.toLowerCase() === (prefix + "🅱ing") || message.content.toLowerCase() === (prefix + "🅱️ing")) {
    //Sends a placeholder message to compare times
    message.channel.send(":ping_pong: :b:ong!").then(message => {
      //Subtracts this message"s time by the user"s message to calculate ping
      message.edit(`This :b:essage took \`${Math.round(message.createdTimestamp - startTime)} ms\` to :b:each you!`);
      //Checks to see if there is a 0 or negative ping value, then displays error message
      if (Math.round(message.createdTimestamp - startTime <= 0)) {
        message.channel.send("Wait a :b:inute, that can\"t be :b:ight...");
      }
    });
  } else

  //Palindrome message command
  if (message.content.toLowerCase().startsWith(prefix + "palindrome")) {
    //Creates the new string to send
    var reverseMessage = "";
    //Reverses the message sent one character at a time
    for (var i = messageString.length - 1; i >= 12; i--) {
      reverseMessage += messageString[i];
    }
    //Sends the message back to the channel
    message.channel.send(reverseMessage);
  } else

  //Checks to see if the message follows the dice roll command format
  if (diceString.test(messageString) || diceStringAlt.test(messageString)) {
    //Declares some variables for use later
    var diceAmount = 0;
    var diceNumber = 0;
    var diceTotal = 0;

    //Splits the message into two numbers
    var messageArray = message.content.split(diceSplit);

    //Checks to see if the message is a variant of the dice rolling command
    if (diceAlt.test(messageString)) {
      //Sets the dice amount and dice number
      diceAmount = 1;
      diceNumber = parseInt(messageArray[1]);

      //Checks to see if the dice variables are positive numbers
      if (diceAmount <= 0 || diceNumber <= 0) {
        message.channel.send("Please don\"t send non-positive values.");
        return;
      }

      //Checks to see if the dice variables are bigger or equal to 100,000
      if (diceAmount >= 100000 || diceNumber >= 100000) {
        message.channel.send("Please only use values less than 100,000.");
        return;
      }

      //Calculates the dice total before any operations
      diceTotal = diceCalculator(diceAmount, diceNumber);

      //Applies operators to the dice result
      for (i = 1; i < (Math.floor((messageArray.length + 1) / 2)); i++) {
        if (messageArray[(i + i)] == "+") {
          diceTotal += parseInt(messageArray[(i + i + 1)]);
        } else if (messageArray[(i + i)] == "-") {
          diceTotal -= parseInt(messageArray[(i + i + 1)]);
        } else if (messageArray[(i + i)] == "*") {
          diceTotal *= parseInt(messageArray[(i + i + 1)]);
        } else if (messageArray[(i + i)] == "/") {
          diceTotal = Math.round(diceTotal / parseInt(messageArray[(i + i + 1)]));
        } else {
          message.channel.send("Please only use basic arithmetic operators.");
          return;
        }
      }
    } else {
      //Sets the dice amount and dice number
      diceAmount = parseInt(messageArray[1]);
      diceNumber = parseInt(messageArray[2]);

      //Checks to see if the dice variables are positive numbers
      if (diceAmount <= 0 || diceNumber <= 0) {
        message.channel.send("Please don\"t send non-positive values.");
        return;
      }

      //Checks to see if the dice variables are bigger or equal to 100,000
      if (diceAmount >= 100000 || diceNumber >= 100000) {
        message.channel.send("Please only use values less than 100,000.");
        return;
      }

      //Calculates the dice total before any operations
      diceTotal = diceCalculator(diceAmount, diceNumber);

      //Applies operators to the dice result
      for (i = 1; i < (Math.floor((messageArray.length) / 2)); i++) {
        if (messageArray[(i + i + 1)] == "+") {
          diceTotal += parseInt(messageArray[(i + i + 2)]);
        } else if (messageArray[(i + i + 1)] == "-") {
          diceTotal -= parseInt(messageArray[(i + i + 2)]);
        } else if (messageArray[(i + i + 1)] == "*") {
          diceTotal *= parseInt(messageArray[(i + i + 2)]);
        } else  if (messageArray[(i + i + 1)] == "/") {
          diceTotal = Math.round(diceTotal / parseInt(messageArray[(i + i + 2)]));
        } else {
          message.channel.send("Please only use basic arithmetic operators.");
          return;
        }
      }
    }

    //Adds commas to answer
    var diceTotalString = diceTotal.toLocaleString();

    //Sends the dice total
    message.channel.send(diceTotalString);
  } else

  //Tests to see if the command is in the proper format
  if (squaresString.test(messageString)) {
    //Splits the command into an array
    var squaresMessageArray = message.content.split(squaresSplit);

    //Converts the number in the command to a variable
    var targetNumber = parseInt(squaresMessageArray[1]);

    //Tests to make sure the number is odd
    if (targetNumber % 2 == 1) {
      //Calculates the squares of the number
      var firstSquare = ((targetNumber - 1) / 2) + 1;
      var secondSquare = (targetNumber - 1) / 2;

      //Adds decimal places to numbers
      var targetNumberString = targetNumber.toLocaleString();
      var firstSquareString = firstSquare.toLocaleString();
      var secondSquareString = secondSquare.toLocaleString();

      //Sends the difference of squares for the number
      message.channel.send(firstSquareString + "^2 - " + secondSquareString + "^2 = " + targetNumberString);
    } else {
      //Sends error message if number is not odd
      message.channel.send("Please make sure your number is odd");
    }
  } else

  if (rpsString.test(messageString)) {
    //Declares player choice variable
    var playerChoice;
    var botchoice = Math.floor((Math.random() * 2) + 0);

    //Splits the message into an array
    var rpsMessageArray = message.content.split(wordSplit);

    //Saves input into a string, then converts it to lowercase
    var playerChoiceString = rpsMessageArray[2];
    playerChoiceString = playerChoiceString.toLowerCase();

    //Checks to see if the player put a proper attack
    if (playerChoiceString === "rock" || playerChoiceString === "paper" || playerChoiceString === "scissors"){
      //Converts playing act into number
      if (playerChoiceString === "rock") {
        playerChoice = 0;
      } else if (playerChoiceString === "paper") {
        playerChoice = 1;
      } else {
        playerChoice = 2;
      }

      //Sends the bot"s attack
      if (botchoice == 0) {
        message.channel.send("Rock.");
      } else if (botchoice == 1){
        message.channel.send("Paper.");
      } else {
        message.channel.send("Scissors.");
      }

      //Calculates who won
      if (playerChoice == botchoice) {
        message.channel.send("It was a tie!");
      } else if (playerChoice == 0) {
        if (botchoice == 1) {
          message.channel.send("You lose!");
        } else {
          message.channel.send("You win!");
        }
      } else if (playerChoice == 1) {
        if (botchoice == 0) {
          message.channel.send("You win!");
        } else {
          message.channel.send("You lost!");
        }
      } else {
        if (botchoice == 0) {
          message.channel.send("You lost!");
        } else {
          message.channel.send("You win!");
        }
      }
    } else {
      //Sends error message if the proper command was not chosen
      message.channel.send("Error: Please play with either rock, paper, or scissors");
    }
  } else

  if (message.content.toLowerCase() === (prefix + "points")) {
    try {
      const scorePoints = client.points.get(message.author.id + message.guild.id).points;
      !scorePoints ? message.channel.send("You have no points yet.") : message.channel.send(`You have ${scorePoints} points!`);
      //cooldown = 0;
    } catch(err) {
      message.channel.send("Please send a non-command message first before checking points.");
    }
  } else

  if (message.content.toLowerCase() === (prefix + "level")) {
    try {
      const scoreLevel = client.points.get((message.author.id + message.guild.id)).level;
      !scoreLevel ? message.channel.send("You have no levels yet.") : message.channel.send(`You are currently level ${scoreLevel}!`);
      //cooldown = 0;
    } catch(err) {
      message.channel.send("Please send a non-command message first before checking points.");
    }
  } else

  if (message.content.toLowerCase().startsWith(prefix + "mazie")) {
    if (mazieString.test(messageString)) {
      var mazieMessageArray = message.content.split(wordSplit);
      var userChoice = mazieMessageArray[2];

      if (userChoice == "normal" || userChoice == "double" || userChoice == "noun") {
        if (userChoice == "normal") {
          message.channel.send(colorModifiers[Math.floor(Math.random() * colorModifiers.length)] + "-" + colorNames[Math.floor(Math.random() * colorNames.length)]);
        } else if (userChoice == "double") {
          message.channel.send(colorModifiers[Math.floor(Math.random() * colorModifiers.length)] + "-" + colorModifiers[Math.floor(Math.random() * colorModifiers.length)] + "-" + colorNames[Math.floor(Math.random() * colorNames.length)]);
        } else {
          message.channel.send(colorModifiers[Math.floor(Math.random() * colorModifiers.length)] + "-" + colorNames[Math.floor(Math.random() * colorNames.length)] + " " + randomNouns[Math.floor(Math.random() * randomNouns.length)]);
        }
      }
    } else {
      var wildCard = Math.floor(Math.random() * 3);

      if (wildCard == 0) {
        message.channel.send(colorModifiers[Math.floor(Math.random() * colorModifiers.length)] + "-" + colorModifiers[Math.floor(Math.random() * colorModifiers.length)] + "-" + colorNames[Math.floor(Math.random() * colorNames.length)]);
      } else if (wildCard == 1){
        message.channel.send(colorModifiers[Math.floor(Math.random() * colorModifiers.length)] + "-" + colorNames[Math.floor(Math.random() * colorNames.length)]);
      } else {
        message.channel.send(colorModifiers[Math.floor(Math.random() * colorModifiers.length)] + "-" + colorNames[Math.floor(Math.random() * colorNames.length)] + " " + randomNouns[Math.floor(Math.random() * randomNouns.length)]);
      }
    }
  } else

  if (message.content.toLowerCase() === (prefix + "uptime")) {
    message.channel.send("100% uptime :frog:");
  } else

  if (settingsMentionsString.test(messageString)) {
    var mentionsMessageArray = message.content.split(wordSplit);
    var userchoice = mentionsMessageArray[3];
    userchoice = userchoice.toLowerCase();

    if (userchoice == "on" && userSettings.mentions == false) {
      userSettings.mentions = true;
      client.settings.set((message.author.id), userSettings);
      message.channel.send("Set mentions to: on.");
    } else if (userchoice == "off" && userSettings.mentions == true) {
      userSettings.mentions = false;
      client.settings.set((message.author.id), userSettings);
      message.channel.send("Set mentions to: off.");
    } else {
      message.channel.send("Error: Please only use the settings \"on\" and \"off\", and make sure your setting is not already on the desired setting.");
    }
  } else

  if (getMentionsString.test(messageString)) {
    if (userSettings.mentions == false) {
      message.channel.send("Your current settings for mentions is: off.");
    } else {
      message.channel.send("Your current settings for mentions is: on.");
    }
  } else

  if (message.content.toLowerCase() === (prefix + "leaderboard")) {
    //Converts users into array
    var serverUsers = client.users.array();

    //Defines leaderboard array
    var leaderboardArray = [[]];
    leaderboardArray[1] = [];
    leaderboardArray[2] = [];

    //Keeps track of leaderboardArrayposition
    var pos = 0;

    //Gets all the users points
    for (i = 0; i < serverUsers.length; i++) {
      try {
        leaderboardArray[2][pos] = client.points.get(serverUsers[i].id + message.guild.id).points;
        leaderboardArray[1][pos] = client.points.get(serverUsers[i].id + message.guild.id).level;
        leaderboardArray[0][pos] = serverUsers[i].username;
        pos++;
      } catch (err) {
        continue;
      }
    }

    //Keeps track of the max value in the array
    var max;

    for (i = 0; i < leaderboardArray[0].length; i++) {
      max = leaderboardArray[2][i];
      for (var j = i + 1; j < leaderboardArray[0].length; j++) {
        if (max < leaderboardArray[2][j]) {
          for (var k = 0; k < 3; k++) {
            max = leaderboardArray[k][i];
            leaderboardArray[k][i] = leaderboardArray[k][j];
            leaderboardArray[k][j] = max;
          }
          max = leaderboardArray[2][i];
        }
      }
    }

    var message1 = "```Java\n📋 Rank | Name              | Level  | Points \n\n";
    var message2 = `[1]`.padEnd(8);

    for (i = 0; i < leaderboardArray[0].length; i++) {
      for (j = 0; j < 3; j++) {
        message1 = message1.concat(message2);
        message2 = `| ${leaderboardArray[j][i]}`.replace(emojiString, "");
        message2 = message2.padEnd(padObject[j]);
      }
      message1 = message1.concat(message2 + "\n");
      message2 = `[${i + 2}]`.padEnd(8);
    }

    message1 = message1.concat(`\`\`\``);

    message.channel.send(message1);
  } else {


  //Werewolf game command
  //if (message.content.toLowerCase() === (prefix + "werewolf start" && !werewolfOn)) {
    //Sets werewolf game status to true
    //werewolfOn = true;

    //message.channels.get("145013323019059200").send("A game of werewolf is starting! Type \"~werewolf join\" to join")


  //} else {
    //Debug message
    message.channel.send("Error: Command not recognized.");
  }
});

schedule.scheduleJob({hour: 0, minute: 0, second: 1, dayOfWeek: 2}, function(){
  client.channels.get("140946564901240832").send("", {
    file: "https://i.imgur.com/SPDD3R2.jpg"
  });
});

schedule.scheduleJob(mojaveRule, function(){
  client.channels.get(discordChannel[Math.floor(Math.random() * discordChannel.length)]).send("Patrolling the Mojave almost makes you wish for a nuclear winter.");
});

schedule.scheduleJob({hour: 0, minute: 0, dayOfWeek: 5}, function(){
  mojaveTime();
});


const http = require("http");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
