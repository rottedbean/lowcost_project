//tcg샵에서 팩 이름들도 가져와서 객체화해볼까 싶다
//파일만들기보단 걍 바로 리스트를 넘기는게 낫지 않나... 싶다

const cheerio = require("cheerio");
const { get } = require("express/lib/response");
crawlmodule = require("./Crawling");
var fs = require("fs");

function urlDeliver() {
  tcgshoplist = getUrlList_tcgshop();
  carddclist = getUrlList_carddc();
  cardkingdomlist = getUrlList_cardkingdom();
  tcgmartlist = getUrlList_tcgmart();
  let urlList = tcgshoplist.concat(carddclist, cardkingdomlist, tcgmartlist);

  return urlList;
}

async function getUrlList_tcgshop() {
  const urlList = [];
  html = await crawlmodule.GetHtml("http://www.tcgshop.co.kr/");
  const $ = cheerio.load(html.data);
  $bodylist = $("td#nom_s table tbody tr").children("td.nom_s");
  $bodylist.each(function (i, element) {
    not_replaced = $(element)
      .attr("onclick")
      .match(
        /'(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?'/gi
      );
    urlList[i] = not_replaced[0].replace(/'/g, "");
  });
  fs.writeFile(
    "tcgshopURL.txt",
    JSON.stringify(urlList),
    "utf8",
    function (err) {}
  );
  return urlList;
}
function getUrlList_carddc() {
  //urlcase노가다 필요
  urlcase1 =
    "https://smartstore.naver.com/tcgmart/category/9d1c5402c00e4cddbe3c8def39afc1c4?st=RECENT&free=false&dt=IMAGE&page=10000&size=40";
  urlcase2 =
    "https://smartstore.naver.com/tcgmart/category/86d9bfa6b8654d01867667d68fd95f19?st=RECENT&free=false&dt=IMAGE&page=10000&size=40";
  list1 = await processEachURLcase(urlcase1);
  list2 = await processEachURLcase(urlcase2);
  let urlList = list1.concat(list2);
  fs.writeFile(
    "carddcURL.txt",
    JSON.stringify(urlList),
    "utf8",
    function (err) {}
  );
  return urlList;
}
async function getUrlList_tcgmart() {
  urlcase1 =
    "https://smartstore.naver.com/tcgmart/category/9d1c5402c00e4cddbe3c8def39afc1c4?st=RECENT&free=false&dt=IMAGE&page=10000&size=40";
  urlcase2 =
    "https://smartstore.naver.com/tcgmart/category/86d9bfa6b8654d01867667d68fd95f19?st=RECENT&free=false&dt=IMAGE&page=10000&size=40";
  list1 = await processEachURLcase(urlcase1);
  list2 = await processEachURLcase(urlcase2);
  let urlList = list1.concat(list2);
  fs.writeFile(
    "tcgmartURL.txt",
    JSON.stringify(urlList),
    "utf8",
    function (err) {}
  );
  return urlList;
}
async function getUrlList_cardkingdom() {
  urlcase1 =
    "https://smartstore.naver.com/cardkingdom/category/c21ef27e351b4dac88ef60ead307508d?st=RECENT&free=false&dt=IMAGE&page=10000&size=40";
  urlcase2 =
    "https://smartstore.naver.com/cardkingdom/category/9d5bd66f88dc4c1c899ee683d401410a?st=RECENT&free=false&dt=BIG_IMAGE&page=10000&size=40";
  urlcase3 =
    "https://smartstore.naver.com/cardkingdom/category/64c2e8f124ac4599b5c0ea3878daf3ff?st=RECENT&free=false&dt=IMAGE&page=10000&size=40";
  list1 = await processEachURLcase(urlcase1);
  list2 = await processEachURLcase(urlcase2);
  list3 = await processEachURLcase(urlcase3);
  let urlList = list1.concat(list2, list3);
  fs.writeFile(
    "cardkingdomURL.txt",
    JSON.stringify(urlList),
    "utf8",
    function (err) {}
  );
  return await urlList;
}
async function countNshoplastpage(url) {
  html = await crawlmodule.GetHtml(url);
  const pagenummatch = html.request.path.match(/page=[0-9]*/gi);
  lastpagenum = pagenummatch[0].replace(/[^0-9]/g, "");
  return lastpagenum;
}
async function countCarddclastpage(url) {
  html = await crawlmodule.GetHtml(url);
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
getUrlList_carddc();

exports.urlDeliver = urlDeliver;