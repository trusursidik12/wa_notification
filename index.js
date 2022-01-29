const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const SESSION_FILE_PATH = './session.json';
const getNotif = require('./include/getNotification')
const intervalCheck = 300000; // ms | 5 mins
const delaySending = 60000; // ms | 1 mins

let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) { // Restore session
    sessionData = require(SESSION_FILE_PATH);
}
const client = new Client({
    session: sessionData
});

client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
});

client.on('qr', (qr) => {
    var QRCode = require('qrcode')
    var qrCodeTerminal = require('qrcode-terminal');
    qrCodeTerminal.generate(qr,{small:true});
    QRCode.toFile('qr.png',qr,{type:'terminal', width:1},()=>{
        console.log(`QR Code telah update! Harap Scan QR Code terbaru! \nqr.png`);
    })
});

client.on('ready', async () => {
    console.log('Bot WhatsApp berhasil dijalankan!');
    try{
        setInterval(async () => {
            console.log('Trying to get notifications...');
            const notifications = await getNotif.getNotif();
            notifications.forEach(async (value)=>{
                const chatId = getNotif.getChatId(value);
                setTimeout(async() => {
                    /**
                     * sendMessage(chatId[string], content[string|image|etc])
                     */
                    client.sendMessage(chatId, value.content);
                    await getNotif.updateStatus(value.id);
                }, delaySending);
            })
         }, intervalCheck);
    }catch(err){
        console.log(`Apps was forced to close. Because : ${err}`);
    }
});
client.on('disconnected', () => {
    console.log('Bot WhatsApp berhenti berjalan!');
    console.log('Disconnected from Device! Please Reconnect!');
});


client.initialize();