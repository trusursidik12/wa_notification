const axios = require('axios').default;
const apiKey = `TrusurR2h2s12123x!@`;
// const baseUrl = `http://192.168.1.31:8081`;
const baseUrl = `https://dashboards.trusur.tech`;

const sleep = (ms)=>{
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
const getNotif = async ()=>{
    try{
        let {data} = await axios.get(`${baseUrl}/api/notifications`,{
        // let {data} = await axios.get(`http://localhost/xyz/test.php`,{
            params : {
                'APIKey' : apiKey
            },
        });
        if(data.success){
            return data.data;
        }
    }catch(err){
        console.log(err.toString());
    }
    return null;
}
const getChatId = (data) =>{
    return (data.is_group == "1" ? `${data.receiver}@g.us` : `${data.receiver}@c.us`);
}
const sendNotif = (data, callback)=>{
    try{
        const receiver = (data.is_group == "1" ? `${data.receiver}@g.us` : `${data.receiver}@c.us`);
        console.log(`Notif Sent to ${receiver}`);
        return true;
    }catch(err){
        console.log(`Error sending notification : ${err}`);
        return false;
    }
}

const updateStatus = async (id)=> {
    try{
        let {data} = await axios.get(`${baseUrl}/api/notification/update/${id}`,{
            headers : {
                'APIKey' : `${apiKey}#`
            },
        })
        if(data.success){
            return true;
        }
        throw 'exit';
        return false;
    }catch(err){
        return false;
    }
}
module.exports = {
    getNotif, updateStatus, getChatId
}