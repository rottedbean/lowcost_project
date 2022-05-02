dbmodule = require("../db/dbprocess");
idxdbmodule = require("../db/processidxtable");
crawlmodule = require("./Crawling");
urlmodule = require("./urlDeliver");
searchmodule = require("../search/searchprocess");
const fs = require("fs");

async function testFunc() {
  if (fs.existsSync("errorcase.txt")) {
    fs.unlinkSync("errorcase.txt");
  }
  if (fs.existsSync("dblog.txt")) {
    fs.unlinkSync("dblog.txt");
  }

  urlList = await urlmodule.urlDeliver();
  for (url of urlList) {
    data = await crawlmodule.CrawlingHtml(url);
    dbmodule.dbProcess(data);
  }
  //crawlmodule.crawlpacknamelist();
  //searchmodule.searchProcess("인페");
  //indextableinitiate();
}
testFunc();
