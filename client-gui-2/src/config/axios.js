import axios from 'axios'
import {NotificationManager} from 'react-notifications'
var hieuAxios = axios.create();

hieuAxios.interceptors.response.use(
    (res) => res.data,
    (err) => {
        if(err.response && err.response.status === 401){
            window.location  = "/login"
        }
        else{
            NotificationManager.error("hhihi", 'Error', 3000, () => {}, false);
        }
    }
)
export {hieuAxios}