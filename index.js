//Does some basic defintions in order to make the bot function
const Discord = require("discord.js");
const client = new Discord.Client();
const schedule = require("node-schedule");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const config = require("./config.json");
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
  if (message.content.startsWith(config.prefix) || message.content.startsWith("!")) return;

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

function ping(message, startTime) {
  //Sends a placeholder message to compare times
  message.channel.send(":ping_pong: Pong!").then(message => {
    //Subtracts this message"s time by the user"s message to calculate ping
    message.edit(`This message took \`${Math.round(message.createdTimestamp - startTime)} ms\` to reach you!`);
    //Checks to see if there is a 0 or negative ping value, then displays error message
    if (Math.round(message.createdTimestamp - startTime <= 0)) {
      message.channel.send("Wait a minute, that can\"t be right...");
    }
  });
}

//Declares function that calculates dice total
function diceCalculator(diceAmount, diceNumber) {
  var diceTotalTemp = 0;
  for (let i = 0; i < diceAmount; i++) {
    diceTotalTemp += Math.floor((Math.random() * diceNumber) + 1);
  }
  return diceTotalTemp;
}

const padObject = {
  0: 20,
  1: 9,
  2: 10
};

//Tells the bot what token to login with
client.login(process.env.TOKEN);

//Sends startup message when fired
client.on("ready",() => {
  console.log("Frogbot ready for combat!");
  //Sets the bot"s game display message
  client.user.setPresence({ status: "online", game: { name: "on a unicycle", type: 0 } });

  //Sets the table of bois found
  for (let i = 0; i < boiArray.length; i++) {
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

//Declares variables for mojave function
var mojaveHour = 0;
var mojaveMinute = 0;
var mojaveRule = new schedule.RecurrenceRule();

//Declares variables for tragedy functions
var tragedyHour = 0;
var tragedyMinute = 0;
var tragedyRule = new schedule.RecurrenceRule();

var emojiString = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

const textBois = {
  "good boi": "Ribbit :frog:",
  "bad boi": "<:ChillBinch:248943253221670923>",
  "adequate boi": "Okay...",
  "furry boi": "OwO What's this?",
  "kinky boi": "Ewwwwwwwww.",
  "meme boi": "It is wednesday my dudes.",
  "frog boi": "Yes.",
  "loving boi": ":heart:",
  "weird boi": "?",
  "magical boi": "DO NOT THROW SOUL!",
  "sad boi": ":frowning:",
  "awful boi": "No bully!",
  "stupid boi": "No bully!",
  "terrible boi": "No bully!",
  "worst boi": "No bully!",
  "worse boi": "No bully!",
  "horse boi": "Neeeiiiiigggggghhhhh.",
  "boing boi": "Error: Boing not recognized"
};

const funcBois = {
  "howdy boi": function (details) {
    details[1].channel.send("yee haw");
    details[0].user.setPresence({ status: "online", game: { name: "on a bull", type: 0 } });
  },
  "normal boi": function (details) {
    details[1].channel.send("Ribbit");
    details[0].user.setPresence({ status: "online", game: { name: "on a unicycle", type: 0 } });
  },
  "biker boi": function (details) {
    details[1].channel.send("Vroom vroom");
    details[0].user.setPresence({ status: "online", game: { name: "on a motorcycle", type: 0 } });
  },
  "space boi": function (details) {
    details[1].channel.send("Pew pew");
    details[0].user.setPresence({ status: "online", game: { name: "on a spaceship", type: 0 } });
  },
  "test boi": function (details) {
    //Sends a placeholder message to compare times
    details[1].channel.send(":ping_pong: Pong!").then(message => {
      //Subtracts this message"s time by the user"s message to calculate ping
      message.edit(`This message took \`${Math.round(message.createdTimestamp - details[2])} ms\` to reach you!`);
      //Checks to see if there is a 0 or negative ping value, then displays error message
      if (Math.round(message.createdTimestamp - details[2] <= 0)) {
        message.channel.send("Wait a minute, that can\"t be right...");
      }
    });
  },
  "bye boi": function (details) {
    details[1].channel.send("", {
      file: "http://i0.kym-cdn.com/photos/images/original/001/112/711/28e.jpg"
    });
  }
};

//Functions that determines a new random time for Mojave meme
function mojaveTime() {
  //Sets time for the mojave meme
  mojaveHour = Math.floor((Math.random() * (23 - 0 + 1)) + 0);
  mojaveMinute = Math.floor((Math.random() * (59 - 0 + 1)) + 0);
  mojaveRule.dayOfWeek = 4;
  mojaveRule.hour = mojaveHour;
  mojaveRule.minute = mojaveMinute;
  console.log(mojaveHour + " " + mojaveMinute);
}

//Functions that determines a new random time for Mojave meme
function tragedyTime() {
  //Sets time for the mojave meme
  tragedyHour = Math.floor((Math.random() * (23 - 0 + 1)) + 0);
  tragedyMinute = Math.floor((Math.random() * (59 - 0 + 1)) + 0);
  tragedyRule.dayOfWeek = 2;
  tragedyRule.hour = tragedyHour;
  tragedyRule.minute = tragedyMinute;
  console.log(tragedyHour + " " + tragedyMinute);
}

//Executes mojaveTime function
mojaveTime();

//Fires on message send in any channel
client.on("message", message => {
  //Ignores message if message is sent by another bot or itself
  if (message.author.bot) return;

  //Creates a variable to save the user"s message time
  const startTime = message.createdTimestamp;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const details = [client, message, startTime];

  //Gets the users settings
  const userSettings = client.settings.get(message.author.id) || { mentions: true };

  //Sends control to pointsMonitor function
  client.pointsMonitor(client, message, userSettings);

  //Ignores message if using strikeout feature
  if (message.content.startsWith("~~")) return;


  //Handles the boi function
  if(textBois[message.content.toLowerCase()]) {
    message.channel.send(textBois[message.content.toLowerCase()]);
  } else if (funcBois[message.content.toLowerCase()]) {
    funcBois[message.content.toLowerCase()](details);
  }


  //Ignores message if it does not start with prefix
  if (!message.content.startsWith(config.prefix)) return;

  //Displays the amount of time it took in miliseconds to receive command and to respond
  if (command === "ping") {
    ping(message, startTime);
  } else

  //Message that tells commands, aka huge mess. Need to find a better way to display in source code.
  if (command === "help") {
    message.channel.send(`\`\`\`css\nPing - Displays the amount of time it takes the bot to recieve your message and send a response\nDatBoi - Here comes dat boi\nOShitWaddup - O shit waddup\n\`\`\``);
  } else

  //Responds with a meme to a meme hypothesis
  if (command === "datboi") {
    message.channel.send("O shit waddup!");
  } else

  //Responds with a meme to a meme conclusion
  if (command === "oshitwaddup") {
    message.channel.send("Here comes dat boi!");
  } else

  //Responds with Pingu noises
  if (command === "pingu") {
    message.channel.send("Noot Noot :penguin:");
  } else

  //Responds to a message with a relevant image
  if (command === "bitchholdon") {
    message.channel.send("", {
      file: "https://i.imgur.com/XHBa71T.jpg"
    });
  } else

  //B emoji version of ping command
  if (command === "🅱ing" || command === "🅱️ing") {
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
  if (command === "palindrome") {
    if (args[0] === undefined) {
      message.channel.send("Please have at least one word in order to use this command.");
      return;
    }

    //Creates the new string to send
    let reverseMessage = "";

    //Reverses the message sent one character at a time
    for (let i = 0; i < args.length; i++) {
      for (let j = args[i].length - 1; j >= 0; j--) {
        reverseMessage += args[i][j];
      }
    }

    //Sends the message back to the channel
    message.channel.send(reverseMessage);
  } else

  //Checks to see if the message follows the dice roll command format
  if (command === "r") {
    //Declares some variables for use later
    var diceAmount = 1;
    var diceNumber = 0;
    var diceTotal = 0;

    //Trims the dice command into two separate numbers
    var diceArray = args[0].trim().split(/d/g);

    //Checks to see if the message is a variant of the dice rolling command
    if (diceArray[0] != "") {
      //Sets the dice amount and dice number
      diceAmount = parseInt(diceArray[0]);
      diceNumber = parseInt(diceArray[1]);
    } else {
      diceNumber = parseInt(diceArray[1]);
    }

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
    for (let i = 1; i < Math.floor((args.length + 1) / 2); i++) {
      if (args[i] === "+") {
        diceTotal += parseInt(args[i + i]);
      } else if (args[i] === "-") {
        diceTotal -= parseInt(args[i + i]);
      } else if (args[i] === "*") {
        diceTotal *= parseInt(args[i + i]);
      } else if (args[i] === "/") {
        diceTotal = Math.round(diceTotal / parseInt(args[i + i]));
      } else {
        message.channel.send("Please only use basic arithmetic operators.");
        return;
      }
    }

    //Adds commas to answer
    var diceTotalString = diceTotal.toLocaleString();

    //Sends the dice total
    message.channel.send(diceTotalString);
  } else

  //Tests to see if the command is in the proper format
  if (command === "squares") {
    //Converts the number in the command to a variable
    var targetNumber = parseInt(args[0]);

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

  if (command === "rps") {
    //Declares player choice variable
    var playerChoice;
    var botchoice = Math.floor((Math.random() * 2) + 0);

    if ((Math.floor((Math.random() * 10) + 0)) == 9) {
      botchoice = 3;
    }
    //Saves input into a string, then converts it to lowercase
    args[0] = args[0].toLowerCase();

    //Checks to see if the player put a proper attack
    if (args[0] == "rock" || args[0] == "paper" || args[0] == "scissors"){
      //Converts playing act into number
      if (args[0] == "rock") {
        playerChoice = 0;
      } else if (args[0] == "paper") {
        playerChoice = 1;
      } else {
        playerChoice = 2;
      }

      //Sends the bot"s attack
      if (botchoice == 0) {
        message.channel.send("Rock.");
      } else if (botchoice == 1){
        message.channel.send("Paper.");
      } else if (botchoice == 3) {
        message.channel.send("Gun.");
        message.channel.send("You lose!");
        return;
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
      message.channel.send("Error: Please play with either rock, paper, or scissors.");
    }
  } else

  if (command === "points") {
    try {
      const scorePoints = client.points.get(message.author.id + message.guild.id).points;
      !scorePoints ? message.channel.send("You have no points yet.") : message.channel.send(`You have ${scorePoints} points!`);
      //cooldown = 0;
    } catch(err) {
      message.channel.send("Please send a non-command message first before checking points.");
    }
  } else

  if (command === "level") {
    try {
      const scoreLevel = client.points.get((message.author.id + message.guild.id)).level;
      !scoreLevel ? message.channel.send("You have no levels yet.") : message.channel.send(`You are currently level ${scoreLevel}!`);
      //cooldown = 0;
    } catch(err) {
      message.channel.send("Please send a non-command message first before checking points.");
    }
  } else

  if (command === "mazie") {
    var wildCard = -1;

    if (!args[0]) {
      wildCard = Math.floor(Math.random() * 3);
    }

    if (args[0] == "normal" || wildCard == 0) {
      message.channel.send(colorModifiers[Math.floor(Math.random() * colorModifiers.length)] + "-" + colorNames[Math.floor(Math.random() * colorNames.length)]);
    } else if (args[0] == "double" || wildCard == 1) {
      message.channel.send(colorModifiers[Math.floor(Math.random() * colorModifiers.length)] + "-" + colorModifiers[Math.floor(Math.random() * colorModifiers.length)] + "-" + colorNames[Math.floor(Math.random() * colorNames.length)]);
    } else if (args[0] == "noun" || wildCard == 2){
      message.channel.send(colorModifiers[Math.floor(Math.random() * colorModifiers.length)] + "-" + colorNames[Math.floor(Math.random() * colorNames.length)] + " " + randomNouns[Math.floor(Math.random() * randomNouns.length)]);
    } else {
      message.channel.send("Error: Please use \"noun\", \"double\", or \"normal\" modifiers.");
    }
  } else

  if (command === "uptime") {
    message.channel.send("100% uptime :frog:");
  } else

  if (command === "settings" && args[0] === "mentions" && args[1]) {
    args[1] = args[1].toLowerCase();

    if (args[1] == "on" && userSettings.mentions == false) {
      userSettings.mentions = true;
      client.settings.set((message.author.id), userSettings);
      message.channel.send("Set mentions to: on.");
    } else if (args[1] == "off" && userSettings.mentions == true) {
      userSettings.mentions = false;
      client.settings.set((message.author.id), userSettings);
      message.channel.send("Set mentions to: off.");
    } else {
      message.channel.send("Error: Please only use the settings \"on\" and \"off\", and make sure your setting is not already on the desired setting.");
    }
  } else

  if (command === "settings" && args[0] === "mentions") {
    if (userSettings.mentions == false) {
      message.channel.send("Your current settings for mentions is: off.");
    } else {
      message.channel.send("Your current settings for mentions is: on.");
    }
  } else

  if (command === "leaderboard") {
    //Converts users into array
    var serverUsers = client.users.array();

    //Defines leaderboard array
    var leaderboardArray = [[]];
    leaderboardArray[1] = [];
    leaderboardArray[2] = [];

    //Keeps track of leaderboardArrayposition
    var pos = 0;

    //Gets all the users points
    for (let i = 0; i < serverUsers.length; i++) {
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

    for (let i = 0; i < leaderboardArray[0].length; i++) {
      max = leaderboardArray[2][i];
      for (let j = i + 1; j < leaderboardArray[0].length; j++) {
        if (max < leaderboardArray[2][j]) {
          for (let k = 0; k < 3; k++) {
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

    for (let i = 0; i < leaderboardArray[0].length; i++) {
      for (let j = 0; j < 3; j++) {
        message1 = message1.concat(message2);
        message2 = `| ${leaderboardArray[j][i]}`.replace(emojiString, "");
        message2 = message2.padEnd(padObject[j]);
      }
      message1 = message1.concat(message2 + "\n");
      message2 = `[${i + 2}]`.padEnd(8);
    }

    message1 = message1.concat(`\`\`\``);

    message.channel.send(message1);
  } else

  if (command === "tragedy") {
    message.channel.send("Did you ever hear the tragedy of Darth Plagueis The Wise? I thought not. It’s not a story the Jedi would tell you. It’s a Sith legend. Darth Plagueis was a Dark Lord of the Sith, so powerful and so wise he could use the Force to influence the midichlorians to create life… He had such a knowledge of the dark side that he could even keep the ones he cared about from dying. The dark side of the Force is a pathway to many abilities some consider to be unnatural. He became so powerful… the only thing he was afraid of was losing his power, which eventually, of course, he did. Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. Ironic. He could save others from death, but not himself.");
  }  else {


  //Werewolf game command
  //if (message.content.toLowerCase() === (config.prefix + "werewolf start" && !werewolfOn)) {
    //Sets werewolf game status to true
    //werewolfOn = true;

    //message.channels.get("145013323019059200").send("A game of werewolf is starting! Type \"~werewolf join\" to join")


  //} else {
    //Debug message
    message.channel.send("Error: Command not recognized.");
  }
});

schedule.scheduleJob({hour: 5, minute: 0, second: 1, dayOfWeek: 3}, function(){
  client.channels.get("140946564901240832").send("", {
    file: "https://i.imgur.com/SPDD3R2.jpg"
  });
  tragedyTime();
});

schedule.scheduleJob(mojaveRule, function(){
  client.channels.get(discordChannel[Math.floor(Math.random() * discordChannel.length)]).send("Patrolling the Mojave almost makes you wish for a nuclear winter.");
});

schedule.scheduleJob(tragedyRule, function(){
  client.channels.get(discordChannel[Math.floor(Math.random() * discordChannel.length)]).send("Did you ever hear the tragedy of Darth Plagueis The Wise? I thought not. It’s not a story the Jedi would tell you. It’s a Sith legend. Darth Plagueis was a Dark Lord of the Sith, so powerful and so wise he could use the Force to influence the midichlorians to create life… He had such a knowledge of the dark side that he could even keep the ones he cared about from dying. The dark side of the Force is a pathway to many abilities some consider to be unnatural. He became so powerful… the only thing he was afraid of was losing his power, which eventually, of course, he did. Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. Ironic. He could save others from death, but not himself.");
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
