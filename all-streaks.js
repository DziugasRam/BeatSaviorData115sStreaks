var fs = require("fs");
var dir = process.env.APPDATA + "/Beat Savior Data/";
var result = [];
fs.readdirSync(dir).forEach((fileName) => {
    if (fileName[0] === "_") return;

    fileData = fs.readFileSync(dir + fileName, { encoding: "utf8" });
    fileData.split(/\r?\n/).forEach((line) => {
        try {
            var obj = JSON.parse(line);
            var noteAccs = obj.deepTrackers?.noteTracker?.notes
                ?.map((t) => (t.score[0] + t.score[1] + t.score[2] > 0 ? t.score[1] : undefined));
            if (!noteAccs) return;

            var count = [];
            var maxCount = [];
            for (var acc = 0; acc <= 15; ++acc) { // lohl
                count.push(0);
                maxCount.push(0);
            }
            var prevAcc = -1;
            for (var acc of noteAccs) {
                if (acc !== prevAcc) {
                    count = count.map((c) => 0); // lohl
                }
                prevAcc = acc;
                if(acc === undefined) continue;
                count[acc]++;
                maxCount[acc] = maxCount[acc] < count[acc] ? count[acc] : maxCount[acc];
            }
            result.push([`${obj.songName} : ${obj.songDifficulty}`, maxCount]);
        } catch {}
    });
});

for (var acc = 0; acc <= 15; ++acc) {
    result.sort((a, b) => b[1][acc] - a[1][acc]);
    console.log();
    console.log(acc);
    var printableResult = result
        .slice(0, 10)
        .reduce((obj, [songName, maxCount]) => ([...obj, [songName, maxCount[acc]]]), []);
    console.table(printableResult);
}
