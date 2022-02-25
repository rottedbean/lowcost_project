dbmodule = require("../db/dbprocess");
crawlmodule = require("./Crawling");

async function testFunc() {
  data = await crawlmodule.CrawlingHtml(
    "https://smartstore.naver.com/tcgmart/category/e459180a862444e6b7bea244bcb7c037?cp=1"
  );

  dbmodule.dbProcess(data);
}
testFunc();
