dbmodule = require("../db/dbprocess");
crawlmodule = require("./Crawling");
urlmodule = require("./urlDeliver");

async function testFunc() {
  url =
    "https://smartstore.naver.com/cardkingdom/category/c21ef27e351b4dac88ef60ead307508d?st=POPULAR&free=false&dt=IMAGE&page=2&size=40";
  data = await crawlmodule.CrawlingHtml(url);
  dbmodule.dbProcess(data);
  //urlList = urlmodule.urlDeliver();
  // for (const url in urlList) {
  //}
}
testFunc();
