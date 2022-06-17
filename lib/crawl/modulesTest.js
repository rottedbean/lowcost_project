dbmodule = require("../db/dbprocess");
idxdbmodule = require("../db/processidxtable");
crawlmodule = require("./Crawling");
urlmodule = require("./urlDeliver");
searchmodule = require("../search/searchprocess");
const fs = require("fs");
const puppeteer = require("puppeteer-core");

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
  //searchmodule.searchProcess("인페");
  //idxdbmodule.indextableinitiate();
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    "https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&cid=17362&request_locale=ko",
    { waitUntil: "networkidle0" }
  );
  page.on("response", async (response) => {
    console.log(await response);
  });

  await browser.close();
}
testFunc();
