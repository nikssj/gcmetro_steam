require('dotenv').config({ path: `${__dirname}/.env` })
const FS = require('fs'); const { config } = require('./config');
const steamTotp = require('steam-totp'); const steamUser = require('steam-user');
const Reply = FS.readFileSync('./response.txt', { encoding: 'utf-8' });
const Welcome = FS.readFileSync('./welcome.txt', { encoding: 'utf-8' });
function SLEEP(sec) { return new Promise(r => setTimeout(r, sec * 1000)) };

const SENPAY = new steamUser(); let userLogs = {};
const logOptions = {
    accountName: "gcmetro",
    password: "Change88!",
    // twoFactorCode: steamTotp.generateAuthCode(process.env.SHARED)
}

SENPAY.logOn(logOptions)
SENPAY.on("loggedOn", () => {
    SENPAY.setPersona(1);
    console.log(`[Logged On] Successfully logged on to steam as ${SENPAY.steamID}`);
    SENPAY.setUIMode(1);
   
    setInterval(() => {
        SENPAY.gamesPlayed(config.statusDisplay);
    }, 30000);
})

// //Accept friends + Welcome message
// SENPAY.on("friendsList", async (SID, RELATION) => {
//     if (config.acceptOflineFriends) return;
//     await SLEEP(5);
//     const FRIENDS = SENPAY.myFriends;
//     for (let SID in FRIENDS) {
//         if (FRIENDS[SID] == 2 && config.sendResponseAfterAccept) {
//             SENPAY.addFriend(SID);
//             console.log(`[friendsList] Accepted an offline pending request of ${SID}`);
//             await SLEEP(2);
//             SENPAY.chatMessage(SID, `${Welcome}`);
//         } else if (FRIENDS[SID] == 2 && !config.sendResponseAfterAccept) {
//             SENPAY.addFriend(SID);
//             console.log(`[friendsList] Accepted an offline pending request of ${SID}`);
//         }
//     }
// });

// //Accept friends online
// SENPAY.on("friendRelationship", async (Recipient, RELATION) => {
//     if (config.acceptFriends && RELATION == 2) { //request
//         SENPAY.addFriend(Recipient);
//         console.log(`[Relations] Accepted a friend request from ${Recipient}`);
//         return;
//     };
//     if (RELATION == 3 && config.sendResponseAfterAccept) {
//         await SLEEP(3);
//         SENPAY.chatMessage(Recipient, `${Welcome}`);
//         console.log(`[Relations] Send Response Message To ${Recipient}`);
//         return;
//     }
// })
// Error checks
SENPAY.on('error', async (error) => {
    switch (error.eresult) {
        case steamUser.EResult.AccountDisabled: {
            console.log(`[Client Handler] Disabled Account!`);
        } break;
        case steamUser.EResult.InvalidPassword: {
            console.log(`[Client Handler] Invalid Password!`);
        } break;
        case steamUser.EResult.RateLimitExceeded: {
            console.log(`[Client Handler] Rate Limit Exceeded, Next Relogin: 35 Minutes.`);
            setTimeout(() => {
                console.log(`[RateLimitExceeded] Retry Now..`);
                SENPAY.logOn(logOptions);
            }, 35 * 60000);
        } break;
        case steamUser.EResult.LogonSessionReplaced: {
            console.log(`[Client Handler] Disconnected!, This Account Have Logged In Another Place. Relogin Again In 45 Seconds.`);
            setTimeout(() => {
                console.log(`[LogonSessionReplaced] Retry Now..`);
                SENPAY.logOn(logOptions);
            }, 45 * 1000);
        } break;
        default: {
            console.log(`[Client Handler] Unexpected Disconnection!, Relogin Again In 45 Seconds.`);
            setTimeout(() => {
                console.log(`[Unexpected Disconnection] Retry Now..`);
                SENPAY.logOn(logOptions);
            }, 45 * 1000);
        } break;
    }
})

// setInterval(() => {
//     for (let i = 0; i < Object.keys(userLogs).length; i++) {
//         if (userLogs[Object.keys(userLogs)[i]] > 1 && config.spamPunish) {
//             SENPAY.chatMessage(Object.keys(userLogs)[i], `/quote Why Spamming! You Shall Be Removed!`);
//             SENPAY.removeFriend(Object.keys(userLogs)[i]);
//             if (config.spamPunish && config.Notify4Spam) {
//                 setTimeout(() => {
//                     if (config.ADMIN != "") SENPAY.chatMessage(config.ADMIN, `/code ${Object.keys(userLogs)[i]} Has Been Removed For Spam!`)
//                 }, 2000)
//             }
//             console.log(`[Bot Actions] ${Object.keys(userLogs)[i]} Has Been Removed For Spam!`);
//         }
//     }
//     userLogs = {};
// }, 1000);

// //BOT AUTO-RESPONSE
// SENPAY.on("friendMessage", async (senderID, senderMessage) => {

//      console.log("ID a investigar: " + senderID);
    
//     //Ignored accounts
//     if (config.ignoredAccounts.includes(senderID)) {
//         console.log(`Ignored an Account. (${senderID})`);
//         return;
//     }
    
//     if(senderID == 76561199247902802) {
//        console.log(`Ignored an Account. (${senderID})`);
//         return;
//     }
    
//      if(senderID == 76561199003979511) {
//        console.log(`Ignored an Account. (${senderID})`);
//         return;
//     }
    
//     if(senderID == 76561198166580491) {
//        console.log(`Ignored an Account. (${senderID})`);
//         return;
//     }
    
    
//     //Conejo
//     if(senderID == 76561199034776049) {
//        console.log(`Ignored an Account. (${senderID})`);
//         return;
//     }
    
    
    
    
//     //Trade offers
//     if (senderMessage.toString().match(`^\[tradeoffer sender=\d+ id=\d+\](.+)\[\/tradeoffer\]$`)) {
//     console.log(`Received trade offer (${senderID}) + Word: (${senderMessage})` );
//         return;
//     }
   
//     if (config.ADMIN != "" && senderID != config.ADMIN) {
//         if (userLogs[senderID.getSteamID64()]) userLogs[senderID.getSteamID64()] += 1;
//         else userLogs[senderID.getSteamID64()] = 1;
//     };

//     SENPAY.chatMessage(senderID, `${Reply}`);
    
//     console.log(`[Bot Actions] Auto Response Triggered by ${senderID}!`);
// })
