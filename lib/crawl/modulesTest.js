dbmodule = require("../db/dbprocess");
idxdbmodule = require("../db/processidxtable");
crawlmodule = require("./Crawling");
urlmodule = require("./urlDeliver");
frontmodule = require("../db/DBtoFront");
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
  var testurl =
    "https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&cid=17362&request_locale=ko";
  const browser = await puppeteer.launch();
  const [page] = await browser.pages();

  page.on("response", async (response) => {
    if (
      response.url() ==
      "https://www.db.yugioh-card.com/yugiohdb/get_image.action?type=1&cid=17362&ciid=1&enc=hvqVJXOpeV7ghL2Kw9Wy1g"
    ) {
      const decoder = new TextDecoder("utf-8");
      buf = await response.buffer();
      const text = decoder.decode(buf);
      console.log(text);

      response.buffer().then((data) => {
        //console.log(data.toString());
        //fs.writeFile("dasd.txt", data, function (err) {});
      });
    }
  });

  await page.goto(testurl, { waitUntil: "networkidle0" });

  await browser.close();
}
testFunc();
