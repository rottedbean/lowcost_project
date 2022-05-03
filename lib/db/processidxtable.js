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

async function process_eachstat(eachstat) {
  const regex = new RegExp("^(마법|함정)");
  if (regex.test(eachstat)) {
    //마함
    if (!eachstat.replace(/(마법|함정)/g, "")) {
      var a = "일반";
    } else {
      var a = eachstat.replace(/(마법|함정)/g, "");
    }
    b = eachstat.match(/(마법|함정)/g)[0];
    var processed_eachstat = {
      무슨: a,
      마or함: b,
    };
  } else {
    //몹
    a = eachstat.match(/^(어둠|빛|땅|물|화염|바람|신)/g)[0];
    b = eachstat
      .match(/\[[가-힣\/]+]/g)[0]
      .replace(/[[\]]/g, "")
      .split("/")
      .filter(Boolean);
    c = eachstat.match(/(레벨|랭크|링크)[0-9]*/g)[0];
    d = eachstat.match(/공격력[0-9]*/g)[0];
    e = (eachstat.match(/수비력[0-9]*/g) || ["-"])[0];
    var processed_eachstat = {
      속성: a,
      종족: b,
      레벨랭크링크: c,
      공격력: d.replace(/[^0-9]/g, ""),
      수비력: e.replace(/[^0-9]/g, ""),
    };
  }
  stringified = JSON.stringify(processed_eachstat);
  return stringified;
}

async function insertToidxtable(eachname, eachurl, eachstat) {
  var code_list = "";
  cardhtml = await axios.get(eachurl);
  const $ = cheerio.load(cardhtml.data);

  $bodylist = $("div.t_body").children("div.t_row");

  $bodylist.each(async function (i, element) {
    eachcode = $(element).find("div.card_number").text().replace(/(\s*)/g, "");
    if (!code_list.includes(eachcode)) {
      code_list = code_list + eachcode + ",";
    }
  });
  processedstat = await process_eachstat(eachstat);

  db.query(
    `INSERT INTO idxtable(name, code_list, status) VALUES(?,?,?) ON DUPLICATE KEY UPDATE code_list = '${code_list}'`,
    [eachname, code_list, processedstat]
  );
  fs.appendFile(
    "indexdblog.txt",
    `insert ${eachname}, ${code_list}, ${processedstat}\n`,
    "utf8",
    function (err) {}
  );
}

async function indextableinitiate() {
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
    [card.name.replace(/\([ㄱ-ㅎ가-힣0-9a-z.]*\)/gi, ""), new_code_list, ""]
  );
  fs.appendFile(
    "indexdblog.txt",
    `insert spec, ${card.name}, ${new_code_list}, ""\n`,
    "utf8",
    function (err) {}
  );
}

async function indexaddtolist(card) {
  queryStr1 = `SELECT * FROM idxtable WHERE code_list LIKE '%${card.pack_code}%'`;
  var result1 = await dbmodule.getDBResult(queryStr1);
  if (result1.length === 0) {
    await insertspecificidxlist(card);
    await indexaddtolist(card);
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
