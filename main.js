var fs = require("fs");
var dir = process.env.APPDATA + "/Beat Savior Data/";
var result = [];
fs.readdirSync(dir).forEach((fileName) => {
    if (fileName[0] === "_") return;

    fileData = fs.readFileSync(dir + fileName, { encoding: "utf8" });
    fileData.split(/\r?\n/).forEach((line) => {
        try {
            var obj = JSON.parse(line);
            var noteScores = obj.deepTrackers?.noteTracker?.notes?.map((t) => t.score[0] + t.score[1] + t.score[2]);
            if (!noteScores) return;
            var count = 0;
            var maxCount = 0;
            for (var score of noteScores) {
                if (score === 115) count++;
                else count = 0;
                maxCount = maxCount < count ? count : maxCount;
            }
            result.push([`${obj.songName} : ${obj.songDifficulty}`, maxCount]);
        } catch {}
    });
});

result.sort((a, b) => b[1] - a[1]);
console.table(result.slice(0, 15));
