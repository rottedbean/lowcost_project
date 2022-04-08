dbmodule = require("../db/dbprocess");
crawlmodule = require("./Crawling");
urlmodule = require("./urlDeliver");
searchmodule = require("../search/searchprocess");
const fs = require("fs");

async function testFunc() {
  if (fs.existsSync("errorcase.txt")) {
    fs.unlinkSync("errorcase.txt");
  }
  //searchmodule.searchProcess("트라이브");
  crawlmodule.crawlpacknamelist();

  urlList = await urlmodule.urlDeliver();
  for (url of urlList) {
    data = await crawlmodule.CrawlingHtml(url);
    dbmodule.dbProcess(data);
  }
}
testFunc();
