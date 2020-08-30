const readline = require('readline');
const ytdl = require('ytdl-core');
const fs = require('fs')

var dir = './results';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.question('*Все результаты сохраняются в папке results*\nВставьте сюда ютуб ссылку: ', (answer) => {
    // TODO: Log the answer in a database
    if (answer != undefined) {
        if (answer.search(`www.youtube.com`) > 0) {
            ytdl.getInfo(answer).then(video => {
                let result = `${video.videoDetails.title}\nРезультаты : \n`
                let videoversionint = video.formats.length
                for (let index = 0; index < videoversionint; index++) {
                    let audqual = video.formats[index].audioQuality
                    if (audqual == `AUDIO_QUALITY_LOW`) {
                        audqual = [`Низкое качество звука`, 2]
                    } else if (audqual == `AUDIO_QUALITY_MEDIUM`) {
                        audqual = [`Нормальное качество звука`, 3]
                    } else if (audqual == undefined) audqual = [`Без звука`, 1]
                    let videoquality = video.formats[index].quality
                    result = `${result}${index+1}. ${videoquality} - ${audqual[0]} - \n${video.formats[index].url}\n`
                }
                fs.writeFile(`results/${video.videoDetails.title}.txt`, result, (err) => {
                    if (err) {
                        console.log("Название видео невозможно использовать в качестве названия файла | Результаты сохранены в файле YTVideoList.txt")
                        fs.writeFile(`results/YTVideoList.txt`, result, (err) => {
                            if (err) throw Error;
                        });
                    }
                });
            })
        } else if (answer != undefined) {
            console.log(`Не распознана ссылка YouTube!`)
        }
    } else if (answer != undefined) {
        console.log(`Не распознана ссылка YouTube!`)
    }
    rl.close();
});