const stdio = require("stdio")
const ytdl = require('ytdl-core');
const fs = require('fs-extra');

var dir = __dirname+'/results';


if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}
function start() {
    console.log("\n")
    return new Promise((resolve, reject) => {
        stdio.ask("*Все результаты сохраняются в папке results*\nВставьте сюда ютуб ссылку").then(answer => {
            // TODO: Log the answer in a database
            if (answer != undefined) {
                if (answer.search(`www.youtube.com`) > 0) {
                    ytdl.getInfo(answer).then(video => {
                        let result = `${video.videoDetails.title}\nРезультаты : \n`
                        let videoversionint = video.formats.length
                        new Promise((resolve) => {
                            for (let index = 0; index < videoversionint; index++) {
                                //      AUDIOPARSING
                                //
                                let audqual = video.formats[index].audioQuality
                                if (audqual == `AUDIO_QUALITY_LOW`) {
                                    audqual = [`Низкое качество звука`, 2]
                                } else if (audqual == `AUDIO_QUALITY_MEDIUM`) {
                                    audqual = [`Нормальное качество звука`, 3]
                                } else if (audqual == undefined) audqual = [`Только видео`, 1]
                                //      VIDEOPARSING
                                //
                                let videoquality = video.formats[index].quality
                                if (videoquality == "large") {
                                    videoquality = "Большое"
                                } else if (videoquality == "medium") {
                                    videoquality = "Среднее"
                                } else if (videoquality == "small") {
                                    videoquality = "Маленькое"
                                } else if (videoquality == "tiny") {
                                    videoquality = "Только звук"
                                }
                                //      SAVING RESULTS
                                //
                                result = `${result}${index + 1}. ${videoquality} - ${audqual[0]} - \n${video.formats[index].url}\n`
                                if (index <= videoversionint) { resolve(true) }
                            }
                        }).then(() => {

                            fs.writeFile(`results/${video.videoDetails.title}.txt`, result, (err) => {
                                if (err) {
                                    console.log("Название видео невозможно использовать в качестве названия файла!\n Результаты сохранены в файле YTVideoList.txt")
                                    fs.writeFile(`results/YTVideoList.txt`, result, (err) => {
                                        if (err) throw Error;

                                    });
                                    resolve(true)
                                } else {
                                    console.log("Всё хорошо!\n" + video.videoDetails.title)
                                    resolve(true)
                                }
                            });
                        })
                    })
                } else if (answer != undefined) {
                    console.log(`Не распознана ссылка YouTube!`)
                    resolve(true)
                }
            } else if (answer != undefined) {
                console.log(`Не распознана ссылка YouTube!`)
                resolve(true)
            }
        })

    }).then(() => {
        start()
    })
}

start()