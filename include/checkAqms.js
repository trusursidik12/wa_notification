const axios = require('axios').default;

const checkAqms =  async (station) => {
    try{
        station = station.toUpperCase();
        const {data} = await axios.get(`https://ispu.menlhk.go.id/apimobile/v1/getDetail/stasiun/${station}`);
        if(data?.messages == undefined){
            const row = data.rows[0];
            const messages = `
* St. ${station} *
Data terakhir terkirim: ${row?.waktu} \n
PM10 : ${row?.pm10} ${checkCategory(row?.pm10)} \n
PM25 : ${row?.pm25} ${checkCategory(row?.pm25)} \n
SO2 : ${row?.pm25} ${checkCategory(row?.so2)} \n
CO : ${row?.pm25} ${checkCategory(row?.co)} \n
O3 : ${row?.pm25} ${checkCategory(row?.o3)} \n
NO2 : ${row?.pm25} ${checkCategory(row?.no2)} \n
HC : ${row?.pm25} ${checkCategory(row?.hc)} \n
Kesimpulan: ${row?.cat}  dengan ISPU ${row?.val} \n
Parameter Kritis : ${row?.param}
            `;
             return messages;
        }
        return `Stasiun tidak ditemukan`;
    }catch(e){
        return e.toString();
    }
}
const checkCategory = (val) => {
    if (val <= 50){
        return `BAIK`;
    }else if (val >= 51 && val <= 100){
        return `SEDANG`;
    }else if (val >= 101 && val <= 200){
        return `TIDAK SEHAT`;
    }else if (val >= 201 && val <= 300){
        return `SANGAT TIDAK SEHAT`;
    }else if (val >= 301){
        return `BERBAHAYA`;
    }else{
        return `-`
    }    
}
exports.checkAqms = checkAqms;