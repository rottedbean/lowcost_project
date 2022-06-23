dbmodule = require("../db/dbprocess");
idxdbmodule = require("../db/processidxtable");
crawlmodule = require("./Crawling");
urlmodule = require("./urlDeliver");
frontmodule = require("../db/DBtoFront");
const fs = require("fs");

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
    await dbmodule.dbProcess(data);
  } */
  await dbmodule.updateLowcost();
  //crawlmodule.crawlpacknamelist();
  //frontmodule.searchProcess("인페");
  //idxdbmodule.indextableinitiate();
}
testFunc();
