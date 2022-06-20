dbmodule = require("../db/dbprocess");
idxdbmodule = require("../db/processidxtable");
crawlmodule = require("./Crawling");
urlmodule = require("./urlDeliver");
frontmodule = require("../DBtoFront");
const fs = require("fs");
const puppeteer = require("puppeteer");
const request_client = require("request-promise-native");

async function testFunc() {
  /* if (fs.existsSync("errorcase.txt")) {
    fs.unlinkSync("errorcase.txt");
  }
  if (fs.existsSync("dblog.txt")) {
    fs.unlinkSync("dblog.txt");
  }

  urlList = await urlmodule.urlDeliver();
  for (url of urlList) {
    data = await crawlmodule.CrawlingHtml(url);
    dbmodule.dbProcess(data);
  } */
  //crawlmodule.crawlpacknamelist();
  //frontmodule.searchProcess("인페");
  //idxdbmodule.indextableinitiate();
  var testurl = "https://www.naver.com/";
  const browser = await puppeteer.launch({ headless: false });
  const [page] = await browser.pages();

  page.on("response", async (response) => {
    console.log(response.url());
    if (response.url() == "https://www.naver.com/") {
      const decoder = new TextDecoder("iso-8859-1");
      buf = await response.buffer();
      const text = decoder.decode(buf);
      console.log(await response.text());

      response.buffer().then((data) => {
        //console.log(data.toString());
        //fs.writeFile("dasd.txt", data, function (err) {});
      });
    }
  });

  await page.goto(testurl, { waitUntil: "networkidle2" });
  await page.waitForResponse((response) => response.status() === 200);

  await browser.close();
}
testFunc();
