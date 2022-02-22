dbmodule = require("../db/dbprocess");
crawlmodule = require("./Crawling");

crawlmodule.CrawlingHtml(
  "http://www.tcgshop.co.kr/card_list.php?searchstring=BODE-KR&sortStr=card_no&sort=asc&s_window=on#card_list",
  function (crawled_list) {
    dbmodule.dbProcess(crawled_list);
  }
);
