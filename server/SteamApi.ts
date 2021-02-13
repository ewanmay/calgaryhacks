const axios = require('axios').default;

class SteamApi {

    key: string;
   
    constructor(key: string) {
        this.key = key;
    }

    getUserGameList(steamid, callback) {
    axios.get('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/', {
        params: {
            key: this.key,
            steamid: steamid,
            format: 'json'
        }
        })
        .then(response =>callback(response))
        .catch(error =>{
            console.log(error);
            callback();
        })
        .then(function () {
            // always executed
        });
    }

    getGameList(callback){
        axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/')
            .then(response =>callback(response))
            .catch(error =>{
                console.log(error);
                callback();
            })
            .then(function () {
                // always executed
            });          
    }
}

module.exports = SteamApi;