const Music = require('../../models/Music')

module.exports = {
    Query : {
        async getMusic() {
            try{
                const musics = await Music.find();
                return musics;

            }
            catch(err){
                throw new Error(err);
            }
        }
    }
}
