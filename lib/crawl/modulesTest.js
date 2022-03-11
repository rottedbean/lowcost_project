dbmodule = require("../db/dbprocess");
crawlmodule = require("./Crawling");
urlmodule = require("./urlDeliver");

async function testFunc() {
  url = urlmodule.urlDeliver();
  for (const url in urlList) {
    data = await crawlmodule.CrawlingHtml(url);
    dbmodule.dbProcess(data);
  }
}
testFunc();
