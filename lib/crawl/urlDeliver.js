//해당 사이트의 모든 카드가 포함되도록 각 사이트의 url을 가져와서 리스트 안에 다 집어넣기
//tcg샵은 한글판 카드 부분만 태그로 떼어낸 다음 url 크롤링 하면 될 듯
//네이버샵쪽은 한글판 카드 url의 페이지 넘버 부분만 바꾸기, 검색결과가 없는 경우 까지 반복

const cheerio = require("cheerio");
crawlmodule = require("./Crawling");

function urlDeliver() {
  var urlarray = [];
  urlList.push(getUrlList_tcgshop().each);
  urlList.push();
  urlList.push();
  urlList.push();

  return urlList;
}

async function getUrlList_tcgshop() {
  html = await crawlmodule.gethtml("http://www.tcgshop.co.kr/");
  const $ = cheerio.load(html);
  return urls;
}
function getUrlList_carddc() {
  return urls;
}
function getUrlList_tcgmart() {
  urlcase1 = "";
  urlcase2 = "";
  urlcase3 = "";
  list1 = processEachURLcase(urlcase1);
  list2 = processEachURLcase(urlcase2);
  list3 = processEachURLcase(urlcase3);
  urlList = list1.concat(list2, list3);
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
  console.log(urlList);
  return urlList;
}
async function countNshoplastpage(url) {
  html = await crawlmodule.GetHtml(url);
  const path = html.request.path.match(/page=[0-9]*/);
  lastpagenum = path[0].replace(/[^0-9]/g, "");
  return lastpagenum;
}
function processEachURLcase(url) {
  var urlList = [];
  lastpagenum = countNshoplastpage(url);
  for (i = 1; i < lastpagenum + 1; i++) {
    urlList.push(url.replace(/page=[0-9]*/, `page=${i}`));
  }
  console.log(urlList);
  return urlList;
}
getUrlList_cardkingdom();

exports.urlDeliver = urlDeliver;
