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

async function insertToidxtable(eachname, eachurl, eachstat) {
  var code_list = "";
  //eachstat을 객체로 만들고 스트링화해서 넘기기?
  cardhtml = await axios.get(eachurl);
  const $ = cheerio.load(cardhtml.data);

  $bodylist = $("div.t_body").children("div.t_row");

  $bodylist.each(async function (i, element) {
    eachcode = $(element).find("div.card_number").text().replace(/(\s*)/g, "");
    if (!code_list.includes(eachcode)) {
      code_list = code_list + eachcode + ",";
    }
  });
  db.query(
    `INSERT INTO idxtable(name, code_list, status) VALUES(?,?,?) ON DUPLICATE KEY UPDATE code_list = '${code_list}'`,
    [eachname, code_list, eachstat]
  );
  fs.appendFile(
    "indexdblog.txt",
    `insert ${eachname}, ${code_list}, ${eachstat}\n`,
    "utf8",
    function (err) {}
  );
}

async function indextableinitiate() {
  //4/18 Parse Error: Invalid header value char라는 오류가... 아무것도 안했는데 나타났다가 사라짐
  lastpage = await getYUDBlastpage();
  for (let i = 1; i <= lastpage; i++) {
    listhtml = await axios.get(
      `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&sort=21&page=${i}&keyword=&stype=1&ctype=&starfr=&starto=&pscalefr=&pscaleto=&linkmarkerfr=&linkmarkerto=&link_m=2&atkfr=&atkto=&deffr=&defto=&othercon=2&request_locale=ko`
    );
    const $ = cheerio.load(listhtml.data);
    $bodylist = $("div#card_list").children("div");
    $bodylist.each(function (i, element) {
      eachname = $(element).find("span.card_name").text().replace(/(\s*)/g, "");
      eachurl =
        "https://www.db.yugioh-card.com" +
        $(element).find("input.link_value").attr("value") +
        "&request_locale=ko";
      eachstat = $(element)
        .find("dd.box_card_spec.flex_1 > span span")
        .text()
        .replace(/(\s*)/g, "");

      insertToidxtable(eachname, eachurl, eachstat);
    });
  }
  return 0;
}
async function insertspecificidxlist(card) {
  queryStr = `SELECT * FROM idxtable WHERE name = '${card.name.replace(
    /\([ㄱ-ㅎ가-힣0-9a-z.]*\)/gi
  )}'`;
  var result = await dbmodule.getDBResult(queryStr);
  if (!result[0]) {
    var new_code_list = card.pack_code + ",";
  } else {
    var new_code_list = result[0].code_list + card.pack_code + ",";
  }
  db.query(
    `INSERT INTO idxtable(name, code_list, status) VALUES(?,?,?) ON DUPLICATE KEY UPDATE code_list = '${new_code_list}'`,
    [card.name.replace(/\([ㄱ-ㅎ가-힣0-9a-z.]*\)/gi, ""), card.pack_code, ""]
  );
  fs.appendFile(
    "indexdblog.txt",
    `insert spec, ${card.name}, ${card.pack_code}, ""\n`,
    "utf8",
    function (err) {}
  );
  indexaddtolist(card);
}

async function indexaddtolist(card) {
  queryStr1 = `SELECT * FROM idxtable WHERE code_list LIKE '%${card.pack_code}%'`;
  var result1 = await dbmodule.getDBResult(queryStr1);
  if (result1.length === 0) {
    //이미 있는 카드는 찾아서 업데이트, 아예 새로운 카드면 insert?(status가 없는 문제가 있음)
    insertspecificidxlist(card);
  } else {
    let dbData = result1[0];
    let queryStr = `SELECT * FROM card_data WHERE name = '${card.name}' AND pack_code = '${card.pack_code}' AND rare = '${card.rare}' AND shop = '${card.shop}'`;
    let insertedData = await dbmodule.getDBResult(queryStr);
    if (!dbData.idx_list) {
      //is null
      newidxlist = insertedData[0].idx + ",";
      db.query(
        `UPDATE idxtable SET idx_list=? WHERE code_list LIKE '%${card.pack_code}%'`,
        [newidxlist]
      );
      fs.appendFile(
        "indexdblog.txt",
        `${card.name}, null -> ${newidxlist}\n`,
        "utf8",
        function (err) {}
      );
    } else {
      if (!dbData.idx_list.includes(insertedData[0].idx)) {
        newidxlist = dbData.idx_list + insertedData[0].idx + ",";
        db.query(
          `UPDATE idxtable SET idx_list=? WHERE code_list LIKE '%${card.pack_code}%'`,
          [newidxlist]
        );
        console.log("인덱스테이블 항목업데이트");
        fs.appendFile(
          "indexdblog.txt",
          `${card.name}, ${dbData.idx_list} => ${newidxlist}\n`,
          "utf8",
          function (err) {}
        );
      }
    }
  }
}
exports.indextableinitiate = indextableinitiate;
exports.indexaddtolist = indexaddtolist;
