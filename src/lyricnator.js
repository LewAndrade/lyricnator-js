const open = require('open')
const Genius = require('node-genius')
const {execSync} = require("child_process");

const Client = new Genius(process.env.GENIUS_ACCESS_TOKEN)
const listSpotifyProcessesCommand = 'tasklist /fi "imagename eq Spotify.exe" /fo list /v'

const getSongTitle = () => {
    let resultList = []
    let resultObj = {}
    let spotifyProcessesList = execSync(listSpotifyProcessesCommand).toString().split(/\r?\n/)
    spotifyProcessesList.forEach(item => {
            if (item.startsWith("Window Title") && !((item.includes("AngleHiddenWindow") || item.includes("N/A"))))
                resultList.push(item)
        }
    )
    resultList.forEach((item, index) => {
        resultObj[index] = item.split(": ")[1]
    })

    return resultObj[0]
};

let songTitle = getSongTitle()

if (!(songTitle === "Spotify Premium"))
    Client.search(songTitle, (error, results) => {
        if (error)
            console.error("Yikes, something went wrong: ", error)
        else {
            let {response: {hits: [{result: {url}}]}} = JSON.parse(results)
            open(url)
        }
    })
else
    console.error("No song playing currently... start one and then run the program again.")