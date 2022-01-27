const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const SESSION_FILE_PATH = './session.json';
const getNotif = require('./include/getNotification')
const intervalCheck = 50000; // ms
const delaySending = 10000; // ms

let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
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
            const notifications = await getNotif.getNotif();
            notifications.forEach(async (value)=>{
                const chatId = getNotif.getChatId(value);
                console.log(`Sending to ${chatId}`);
                setTimeout(async() => {
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