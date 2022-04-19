const cheerio = require("cheerio");
const fs = require("fs");
const db = require("./dbconnection");
const { default: axios } = require("axios");
const dbmodule = require("./dbprocess");

async function getYUDBlastpage() {
  html = await axios.get(
    "https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&keyword=&stype=1&ctype=&starfr=&starto=&pscalefr=&pscaleto=&linkmarkerfr=&linkmarkerto=&link_m=2&atkfr=&atkto=&deffr=&defto=&othercon=2&request_locale=ko"
  );
  const $ = cheerio.load(html.data);
  lastpage =
    Number(
      $("div.sort_set div.text")
        .text()
        .match(/([0-9]+),([0-9]+)/)[0]
        .replace(/,/g, "")
    ) /
      10 +
    1;
  return lastpage;
}

async function is_existIdxdb(eachname, code_list) {
  let querystr = `SELECT * FROM idxtable WHERE name = '${eachname}'`;
  var result = await dbmodule.getDBResult(querystr);
  var is_exist;

  if (result.length === 0 || result[0].code_list === code_list) {
    is_exist = false;
  } else {
    is_exist = true;
  }
  return is_exist;
}
async function insertToidxtable(eachname, eachurl, eachstat) {
  var code_list = "";
  cardhtml = await axios.get(eachurl);
  const $ = cheerio.load(cardhtml.data);

  $bodylist = $("div.t_body").children("div.t_row");

  $bodylist.each(function (i, element) {
    eachcode = $(element).find("div.card_number").text().replace(/(\s*)/g, "");
    if (!code_list.includes(eachcode)) {
      code_list = code_list + eachcode + ",";
    }
  });
  if (is_existIdxdb(eachname, code_list)) {
    //갱신필요 없음
  } else {
    db.query(`INSERT INTO idxtable(name, code_list, stat) VALUES(?,?,?)`, [
      eachname,
      code_list,
      eachstat,
    ]);
    fs.appendFile(
      "indexdblog.txt",
      `${eachname}, ${code_list},${eachstat}\n`,
      "utf8",
      function (err) {}
    );
  }
}

async function indextableupdate() {
  //4/18 Parse Error: Invalid header value char라는 오류가... 아무것도 안했는데 나타났다가 사라짐
  lastpage = await getYUDBlastpage();
  console.log(lastpage);
  for (let i = 1; i <= lastpage; i++) {
    listhtml = await axios.get(
      `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&page=${i}&keyword=&stype=1&ctype=&starfr=&starto=&pscalefr=&pscaleto=&linkmarkerfr=&linkmarkerto=&link_m=2&atkfr=&atkto=&deffr=&defto=&othercon=2&request_locale=ko`
    );
    const $ = cheerio.load(listhtml.data);
    $bodylist = $("div#card_list").children("div");
    $bodylist.each(function (i, element) {
      eachname = $(element).find("span.card_name").text().replace(/(\s*)/g, "");
      eachurl =
        "https://www.db.yugioh-card.com" +
        $(element).find("input.link_value").attr("value") +
        "&request_locale=ko";
      eachstat = $(element).find("dd.box_card_spec.flex_1 > span span").text();
      console.log(eachstat).replace(/(\s*)/g, "");

      insertToidxtable(eachname, eachurl, eachstat);
    });
  }
  return 0;
}
async function indexaddtolist(card) {
  //에러가 났을때 마지막 시점부터 다시 하도록 할 순 없을까
  queryStr1 = `SELECT * FROM idxtable WHERE code_list LIKE '%${card.pack_code}%'`;
  var result = await dbmodule.getDBResult(queryStr1);
  if (result.length === 0) {
    //insert중인 카드가 마법의 테이블에 없는 경우
    indextableupdate();
  } else {
    let dbData = result[0];
    let queryStr = `SELECT * FROM card_data WHERE name = '${card.name}' AND pack_code = '${card.pack_code}' AND rare = '${card.rare}' AND shop = '${card.shop}'`;
    let insertedData = await getDBResult(queryStr);
    if (!dbData.idx_list.includes(insertedData[0].idx)) {
      newidxlist = dbData.idx_list + insertedData[0].idx + ",";
      db.query(
        `UPDATE idxtable SET idx_list=? WHERE code_list LIKE '%${card.pack_code}%'`[
          newidxlist
        ]
      );
      console.log("인덱스테이블 항목업데이트");
      fs.appendFile(
        "indexdbupdatelog.txt",
        `${card.name}, ${dbData.idx_list} => ${newidxlist}\n`,
        "utf8",
        function (err) {}
      );
    }
  }
}
indextableupdate();
exports.indexaddtolist = indexaddtolist;
