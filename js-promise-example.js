const API_URL = `http://ws.audioscrobbler.com/2.0/`
const API_KEY = 'f24de288e091abddcced618594c9b012'
const FORMAT = `json`
const NUMBER_OF_ARTISTS = 5

function getTopArtists(){
    const METHOD = `chart.gettopartists`
    const url = `${API_URL}?method=${METHOD}&api_key=${API_KEY}&format=${FORMAT}`
    
    return new Promise( (resolve, reject) => {
        $.get(url, (topArtists) => {
            resolve(topArtists)
        }).fail( () => reject(topArtists) )
    })
}

function getTopSongPerArtist(artistName){
    const METHOD = `artist.getTopTracks`
    const url = `${API_URL}?method=${METHOD}&artist=${artistName}&api_key=${API_KEY}&format=${FORMAT}`

    return new Promise( (resolve, reject) => {
        $.get(url, (topSong) => {
            resolve(topSong)
        }).fail( () => reject(topSong) )
    })
}

var songsOfTopArtists = () => {
    //Get top artists
    getTopArtists()
        .then( (topArtists) => {
            var topFiveArtists = topArtists.artists.artist.slice(0, NUMBER_OF_ARTISTS)
            
            //Get first song of each top artist
            var topSongsPromises = topFiveArtists.map(artist => getTopSongPerArtist(artist.name))
            Promise.all(topSongsPromises)
                .then( topSong => {
                    topSong.map(curSong => { 
                        console.log(`${curSong.toptracks['@attr'].artist}: ${curSong.toptracks.track[0].name}`)
                    })
                })
                .catch( 
                    err => console.log(err) 
                )
        })
        .catch( (err) => console.log(err) )
}

songsOfTopArtists()