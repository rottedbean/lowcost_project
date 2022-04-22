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
  try {
    let querystr = `SELECT * FROM idxtable WHERE name = '${eachname}'`;
    var result = await dbmodule.getDBResult(querystr);
    var is_exist;
    if (result.length === 0 || !(result[0].code_list === code_list)) {
      is_exist = false;
    } else {
      is_exist = true;
    }
  } catch (error) {
    console.log("에러1");
    fs.appendFile("errorlog.txt", `${error}1`, "utf8", function (err) {});
    let querystr = `SELECT * FROM idxtable WHERE name = '${eachname}'`;
    var result = await dbmodule.getDBResult(querystr);
    var is_exist;

    if (result.length === 0 || !(result[0].code_list === code_list)) {
      is_exist = false;
    } else {
      is_exist = true;
    }
  }

  return is_exist;
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

  try {
    var is_exist = await is_existIdxdb(eachname, code_list);
  } catch (error) {
    console.log("에러2");
    fs.appendFile("errorlog.txt", `${error}2\n`, "utf8", function (err) {});
    var is_exist = await is_existIdxdb(eachname, code_list);
  }

  if (is_exist) {
    //갱신필요 없음
    //여따 update set 넣음 될듯
    console.log(`${eachname} 없뎃`);
    fs.appendFile(
      "indexdblog.txt",
      `${eachname} 갱신 불필요\n`,
      "utf8",
      function (err) {}
    );
  } else {
    try {
      db.query(`INSERT INTO idxtable(name, code_list, status) VALUES(?,?,?)`, [
        eachname,
        code_list,
        eachstat,
      ]);
      console.log(`${eachname}, ${code_list},${eachstat} update`);
      fs.appendFile(
        "indexdblog.txt",
        `${eachname}, ${code_list},${eachstat}\n`,
        "utf8",
        function (err) {}
      );
    } catch (error) {
      console.log("에러3");
      fs.appendFile("errorlog.txt", `${error}3`, "utf8", function (err) {});
      db.query(`INSERT INTO idxtable(name, code_list, status) VALUES(?,?,?)`, [
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
  db.query(`INSERT INTO idxtable(name, code_list, status) VALUES(?,?,?)`, [
    card.name,
    card.pack_code,
    "",
  ]);
  fs.appendFile(
    "indexdblog.txt",
    `insert spec, ${eachname}, ${code_list}, ""\n`,
    "utf8",
    function (err) {}
  );
}

async function updatespecificname(card, result) {
  new_code_list = result[0].code_list + card.pack_code + ",";
  db.query(
    `UPDATE idxtable SET code_list = ? WHERE name = ${card.name.replace(
      /\([ㄱ-ㅎ가-힣0-9a-z.]*\)/gi,
      ""
    )}`,
    [new_code_list]
  );
}

async function indexaddtolist(card) {
  queryStr1 = `SELECT * FROM idxtable WHERE code_list LIKE '%${card.pack_code}%'`;
  var result1 = await dbmodule.getDBResult(queryStr1);
  if (result1.length === 0) {
    //insert중인 카드가 마법의 테이블에 없는 경우
    //한글판 유희왕카드데이터베이스가 업뎃이 겁나게 느린 문제
    //이미 있는 카드는 찾아서 업데이트, 아예 새로운 카드면 insert?(status가 없는 문제가 있음)
    //근데 이렇게하면 유희왕db에서 가져오는게 무슨 의미가 있는거냐 대체
    filterdname = card.name.replace(/\([ㄱ-ㅎ가-힣0-9a-z.]*\)/gi, "");
    queryStr2 = `SELECT * FROM idxtable WHERE name = '${filterdname}'`;
    var result2 = await dbmodule.getDBResult(queryStr2);
    if (!(result2.length === 0)) {
      updatespecificname(card, result2);
    } else {
      insertspecificidxlist(card);
    }
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
exports.indextableinitiate = indextableinitiate;
exports.indexaddtolist = indexaddtolist;
