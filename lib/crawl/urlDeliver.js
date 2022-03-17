//해당 사이트의 모든 카드가 포함되도록 각 사이트의 url을 가져와서 리스트 안에 다 집어넣기
//tcg샵은 한글판 카드 부분만 태그로 떼어낸 다음 url 크롤링 하면 될 듯
//네이버샵쪽은 한글판 카드 url의 페이지 넘버 부분만 바꾸기, 검색결과가 없는 경우 까지 반복

const axios = require("axios");
const cheerio = require("cheerio");

function urlDeliver() {
  const urlList = [];
  urlList.push(getUrl_tcgshop());
  urlList.push();
  urlList.push();
  urlList.push();

  return urlList;
}

async function getUrl_tcgshop() {
  html = await crawlmodule.gethtml("http://www.tcgshop.co.kr/");
  const $ = cheerio.load(html);
  return urls;
}
function getUrl_carddc() {
  return urls;
}
function getUrl_tcgmart() {
  return urls;
}
function getUrl_cardkingdom() {
  let pageNum = 1;
  `https://smartstore.naver.com/cardkingdom/category/c21ef27e351b4dac88ef60ead307508d?st=RECENT&free=false&dt=IMAGE&page=${pageNum}&size=40`;
  return urls;
}

exports.urlDeliver = urlDeliver;
