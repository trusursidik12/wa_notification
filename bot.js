const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const SESSION_FILE_PATH = './session.json';
const checkAqms = require('./include/checkAqms');
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
    QRCode.toFile('qr.png',qr,{type:'terminal', width:1},()=>{
        console.log(`QR Code telah update! Harap Scan QR Code terbaru! \nqr.png`);
    })
});

client.on('ready', () => {
    console.log('Bot WhatsApp berhasil dijalankan!');
});

client.on('message', msg => {
    const request = msg.body;
    if (request == '!help') {
        const message = `
*Selamat datang di menu bantuan TRUSUR BOT* \n
Perintah : \n
!check-aqms (ID Stasiun). \nContoh : !check-aqms jakarta \n
!list-station (Type : CEMS | AQMS | Portable) .\nContoh : !list-station CEMS \n
!team-viewer (ID Stasiun). \nContoh :!team-viewer jakarta \n
!any-desk (ID Stasiun). \nContoh : !any-desk jakarta \n
        `;
        msg.reply(message);
    }
    if(request.indexOf('!check-aqms') == 0){
        const station = request?.split(' ')?.[1];
        if(station == undefined || station == '' || station == null){
            msg.reply('Format perintah salah!');
        }else{
            const checkAqm = checkAqms.checkAqms(station);
            checkAqm.then(response => {
                msg.reply(response);
            }).catch(e => {
                console.log(e.toString());
            })
        }
    }
});

client.initialize();