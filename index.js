var browserstack = require('browserstack-local');
const { Builder, By, Key, until } = require('selenium-webdriver');
const http = require('http');
const fs = require('fs')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html' })
  fs.createReadStream('index.html').pipe(res)
})

server.listen(process.env.PORT || 8000)
//creates an instance of Local
var bs_local = new browserstack.Local();

// replace <browserstack-accesskey> with your key. You can also set an environment variable - "BROWSERSTACK_ACCESS_KEY".
var bs_local_args = { 'key': process.env.BROWSERSTACK_ACCESS_KEY };

// starts the Local instance with the required arguments
bs_local.start(bs_local_args, function() {
  console.log("Started BrowserStackLocal");
  console.log(bs_local.isRunning());
  const BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME';
    const BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY';

    let HttpAgent = new http.Agent({
        keepAlive: true,
    });

    let capabilities = {
        browserName: 'Firefox',
        name: 'Firefox Test',
        os: 'Windows',
        build: 'Test Build 01',
        project: 'My Awesome App',
        'browserstack.debug': true,
        "browserstack.local" : true,
    };

    let driver = new Builder()
        .usingHttpAgent(HttpAgent)
        .withCapabilities(capabilities)
        .usingServer(`http://${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`)
        .build();

    driver.get('localhost:8000').then(() => {
        bs_local.stop(function() {
            console.log("Stopped BrowserStackLocal");
        });
        driver.quit();
        server.close();     
    });

});

// check if BrowserStack local instance is running





// stop the Local instance



