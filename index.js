const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
var results = [];
const total = 3;
const url = 'http://127.0.0.1:9000';


(async () => {

    for (let index = 0; index < total; index++) {
        const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
        const flag = { logLevel: 'info', output: 'json', onlyCategories: ['performance', 'first-meaningful-paint', 'speed-index', 'interactive'], port: chrome.port };
        const config = {
            extends: 'lighthouse:default',
            settings: {
                formFactor: 'mobile',
                throttling: {
                    rttMs: 40,
                    throughputKbps: 10240,
                    cpuSlowdownMultiplier: 1,
                    requestLatencyMs: 0,
                    downloadThroughputKbps: 0,
                    uploadThroughputKbps: 0
                },
                screenEmulation: {
                    mobile: true,
                    width: 1350,
                    height: 940,
                    deviceScaleFactor: 1,
                    disabled: false
                },
                emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4143.7 Safari/537.36 Chrome-Lighthouse'
            }
        }
        const runnerResult = await lighthouse(url, flag, config);

        const firstContentful = runnerResult.lhr.audits['first-contentful-paint'].numericValue / 1000;
        const speedIndex = runnerResult.lhr.audits['speed-index'].numericValue / 1000;
        const largstContentful = runnerResult.lhr.audits['largest-contentful-paint'].numericValue / 1000;
        const interactive = runnerResult.lhr.audits['interactive'].numericValue / 1000;
        const totatBlockingTotal = runnerResult.lhr.audits['total-blocking-time'].numericValue / 1000;

        results.push({
            firstContentful,
            speedIndex,
            largstContentful,
            interactive,
            totatBlockingTotal
        })

        await chrome.kill();
        console.log(`||||||||||||||||| Teste : ${index + 1} de ${total} |||||||||||||||||`);
    }
    results.forEach((row) => {
        console.log(`${row.firstContentful}, ${row.speedIndex}, ${row.largstContentful}, ${row.interactive}, ${row.totatBlockingTotal}`);
    })
})();
