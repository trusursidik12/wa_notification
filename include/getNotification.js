const axios = require('axios').default;
const apiKey = `TrusurR2h2s12123x!@`;
const baseUrl = `http://localhost:8080`;
// const baseUrl = `https://trusur-dashboards.ispumaps.id`;

const sleep = (ms)=>{
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
const getNotif = async ()=>{
    try{
        let {data} = await axios.get(`${baseUrl}/api/notifications`,{
            params : {
                'APIKey' : apiKey
            },
        });
        if(data.success){
            console.log(`Total Notifications: ${data.total}`);
            return data.data;
        }
        return null;

    }catch(err){
        console.log(err.toString());
    }
}
const getChatId = (data) =>{
    return (data.is_group == "1" ? `${data.receiver}@g.us` : `${data.receiver}@c.us`);
}
const sendNotif = (data, callback)=>{
    try{
        const receiver = (data.is_group == "1" ? `${data.receiver}@g.us` : `${data.receiver}@c.us`);
        console.log(`Notif Sent to ${receiver}`);
        // Sent Message
        return true;
    }catch(err){
        console.log(`Error sending notification : ${err}`);
        return false;
    }
}

const updateStatus = async (id)=> {
    try{
        let {data} = await axios.post(`${baseUrl}/api/notification/update/${id}`,null,{
            headers : {
                'APIKey' : `${apiKey}#`
            },
        })
        if(data.success){
            console.log(`Notification was updated to sent!`);
            return true;
        }
        console.log(data.messages);
        return false;
    }catch(err){
        console.log(`Error Update Status Notification: ${err}`);
        return false;
    }
}
module.exports = {
    getNotif, updateStatus, getChatId
}