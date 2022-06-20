import { dbProcess } from "../db/dbprocess.js";
import { indextableinitiate } from "../db/processidxtable.js";
import { CrawlingHtml, crawlpacknamelist } from "../crawl/Crawling.js";
import { urlDeliver } from "../crawl/urlDeliver.js";
import { searchProcess } from "../DBtoFront.js";
import * as fs from "fs";
import * as puppeteer from "puppeteer";

async function testFunc() {
  /* if (fs.existsSync("errorcase.txt")) {
    fs.unlinkSync("errorcase.txt");
  }
  if (fs.existsSync("dblog.txt")) {
    fs.unlinkSync("dblog.txt");
  }

  urlList = urlDeliver();
  for (url of urlList) {
    data = await CrawlingHtml(url);
    .dbProcess(data);
  } */
  //crawlpacknamelist();
  //searchProcess("인페");
  //indextableinitiate();
  var testurl =
    "https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&cid=17362&request_locale=ko";
  const browser = await puppeteer.launch({ headless: false });
  const [page] = await browser.pages();

  page.on("response", async (response) => {
    console.log(response.url());
    if (
      response.url() ==
      "	https://www.db.yugioh-card.com/yugiohdb/get_image.action?type=2&cid=17362&ciid=1&enc=hvqVJXOpeV7ghL2Kw9Wy1g"
    ) {
      const decoder = new TextDecoder("iso-8859-1");
      let buf = await response.buffer();
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
