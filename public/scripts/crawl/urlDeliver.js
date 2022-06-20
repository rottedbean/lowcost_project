//카드디씨의 경우 간혹 접속오류가 생기는 중
import * as cheerio from "cheerio";
import { GetHtml } from "../crawl/Crawling.js";

async function urlDeliver() {
  var list = [];
  tcgshoplist = await getUrlList_tcgshop();
  carddclist = getUrlList_carddc();
  cardkingdomlist = await getUrlList_cardkingdom();
  tcgmartlist = await getUrlList_tcgmart();
  let urlList = list.concat(
    tcgshoplist,
    cardkingdomlist,
    tcgmartlist,
    carddclist
  );
  /*cardkingdomlist, tcgmartlist, carddclist, tcgshoplist*/

  return urlList;
}
async function getUrlList_tcgshop() {
  const urlList = [];
  var html = await GetHtml("http://www.tcgshop.co.kr/");
  const $ = cheerio.load(html.data);
  var $bodylist = $("td#nom_s table tbody tr").children("td.nom_s");
  $bodylist.each(function (i, element) {
    if (
      !$(element)
        .attr("onclick")
        .match(/(=[0-9a-zA-Z]{3,4}-kr)/gi)
    ) {
      //러시혹은 jp,en의 경우
    } else {
      var not_replaced = $(element)
        .attr("onclick")
        .match(
          /'(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?'/gi
        );
      urlList[i] = not_replaced[0].replace(/'/g, "");
    }
  });
  return urlList;
}
async function getUrlList_carddc() {
  let urlList = [];
  urlcases = [
    "116",
    "521",
    "204",
    "1378",
    "704",
    "1414",
    "1418",
    "1419",
    "1420",
    "1421",
  ];
  for (const i of urlcases) {
    list = await processEachURLcase(
      `https://www.carddc.co.kr/product_list.html?page=2&page_num=30&k_sort=inserttime&k_cateno=${i}`
    );
    urlList = urlList.concat(list);
  }

  return urlList;
}
async function getUrlList_tcgmart() {
  let urlList = [];
  urlcases = [
    "9d1c5402c00e4cddbe3c8def39afc1c4",
    "86d9bfa6b8654d01867667d68fd95f19",
  ];
  for (const i of urlcases) {
    list = await processEachURLcase(
      `https://smartstore.naver.com/tcgmart/category/${i}?st=RECENT&free=false&dt=IMAGE&page=10000&size=40`
    );
    urlList = urlList.concat(list);
  }
  return urlList;
}
async function getUrlList_cardkingdom() {
  let urlList = [];
  urlcases = [
    "c21ef27e351b4dac88ef60ead307508d",
    "9d5bd66f88dc4c1c899ee683d401410a",
    "64c2e8f124ac4599b5c0ea3878daf3ff",
  ];
  for (const i of urlcases) {
    list = await processEachURLcase(
      `https://smartstore.naver.com/cardkingdom/category/${i}?st=RECENT&free=false&dt=IMAGE&page=10000&size=40`
    );
    urlList = urlList.concat(list);
  }
  return urlList;
}
async function countNshoplastpage(url) {
  html = await GetHtml(url);
  const pagenummatch = html.request.path.match(/page=[0-9]*/gi);
  lastpagenum = pagenummatch[0].replace(/[^0-9]/g, "");
  return lastpagenum;
}
async function countCarddclastpage(url) {
  html = await GetHtml(url);
  $ = cheerio.load(html.data);
  $bodylist = $("div#page_no ul li a");
  pagenummatch = $bodylist.attr("href").match(/page=[0-9]*/gi);
  lastpagenum = pagenummatch[0].replace(/[^0-9]/g, "");
  return lastpagenum;
}
async function processEachURLcase(url) {
  var urlList = [];
  switch (true) {
    case url.includes("www.carddc.co.kr"):
      var lastpagenum = await countCarddclastpage(url);

      break;
    case url.includes("smartstore.naver.com"):
      var lastpagenum = await countNshoplastpage(url);

      break;
  }

  for (i = 1; i <= lastpagenum; i++) {
    pagei = url.replace(/page=[0-9]*/g, `page=${i}`);
    urlList.push(pagei);
  }
  return urlList;
}

getUrlList_tcgshop();

export { urlDeliver };
