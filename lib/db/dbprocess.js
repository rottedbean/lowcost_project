//인덱스테이블 관련 별도 모듈로 분리 필요
const db = require("./dbconnection");
const cheerio = require("cheerio");
const fs = require("fs");
const crawlmodule = require("../crawl/Crawling");
const { default: axios } = require("axios");

const getDBResult = (queryStr) => {
  return new Promise((resolve, reject) => {
    db.query(queryStr, function (error, result, field) {
      resolve(result);
    });
  });
};

async function getYUDBlastpage() {
  html = await axios.get(
    "https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&keyword=&stype=1&ctype=&starfr=&starto=&pscalefr=&pscaleto=&linkmarkerfr=&linkmarkerto=&link_m=2&atkfr=&atkto=&deffr=&defto=&othercon=2&request_locale=ko"
  );
  const $ = cheerio.load(html.data);
  $bodylist = $("div.page_num_title div strong");
  lastpage =
    Number(
      $("div.page_num_title div strong")
        .text()
        .match(/([0-9]+),([0-9]+)/)[0]
        .replace(/,/g, "")
    ) /
      10 +
    1;
  return lastpage;
}

async function insertToidxtable(eachname, eachurl) {
  code_list = [];
  cardhtml = await axios.get(eachurl);
  const $ = cheerio.load(cardhtml.data);
  $bodylist = $("div#article_body div table tbody").children("tr.row");
  $bodylist.each(function (element) {
    //이부분에서 막힘, 디버그 필요
    eachcode = $(element).find("td:nth-of-type(2)").text();
    code_list.push(eachcode);
  });
  //const arrUnique = [...new Set(code_list)];
  //console.log(arrUnique);
  db.query(`INSERT INTO idxtable(name, code_list) VALUES(?,?)`, [
    eachname,
    code_list,
  ]);
  fs.appendFile(
    "indexdblog.txt",
    `${eachname}, ${code_list}\n`,
    "utf8",
    function (err) {}
  );
}

async function indextableupdate() {
  lastpage = await getYUDBlastpage();
  console.log(lastpage);
  for (let i = 1; i <= lastpage; i++) {
    listhtml = await axios.get(
      `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&page=${i}&keyword=&stype=1&ctype=&starfr=&starto=&pscalefr=&pscaleto=&linkmarkerfr=&linkmarkerto=&link_m=2&atkfr=&atkto=&deffr=&defto=&othercon=2&request_locale=ko`
    );
    const $ = cheerio.load(listhtml.data);
    $bodylist = $("ul.box_list").children("li");
    $bodylist.each(async function (i, element) {
      //각 카드 속성, 레벨, 종족등의 정보도 가져올 수 있을듯
      eachname = $(element)
        .find("dl dt.box_card_name span.card_status strong")
        .text()
        .trim();
      eachurl =
        "https://www.db.yugioh-card.com" +
        $(element).find("input.link_value").attr("value") +
        "&request_locale=ko";
      let querystr = `SELECT * FROM idxtable WHERE name = '${eachname}'`;
      var result = await getDBResult(querystr);

      if (result.length === 0) {
        insertToidxtable(eachname, eachurl);
      } else {
        console.log("blah");
      }
    });
  }
  return 0;
}
async function indexaddtolist(card) {
  queryStr1 = `SELECT * FROM idxtable WHERE code_list LIKE '%${card.pack_code}%'`;
  var result = await getDBResult(queryStr1);
  if (result.length === 0) {
    //insert중인 카드가 마법의 테이블에 없는 경우
    indextableupdate();
  } else {
    let dbData = result[0];
    if (!dbData.idx_list.includes(card.idx)) {
      newidxlist = dbData.idx_list + card.idx + ",";
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

async function searchCard(card) {
  let queryStr = `SELECT * FROM card_data WHERE name = '${card.name}' AND pack_code = '${card.pack_code}' AND rare = '${card.rare}' AND shop = '${card.shop}'`;
  let result = await getDBResult(queryStr);
  return result;
}

function insertCard(card) {
  console.log(`insert ${card.name}`);
  fs.appendFile(
    "dblog.txt",
    `insert 
  ${card.name},
  ${card.pack_code},
  ${card.rare},
  ${card.price},
  ${card.is_soldout},
  ${card.shop},
  ${card.img},
  ${card.source_url}`,
    "utf8",
    function (err) {}
  );
  let queryStr = `INSERT INTO card_data(name, pack_code, rare, price, is_soldout, shop, img, source_url) VALUES(?,?,?,?,?,?,?,?)`;
  db.query(queryStr, [
    card.name,
    card.pack_code,
    card.rare,
    card.price,
    card.is_soldout,
    card.shop,
    card.img,
    card.source_url,
  ]);
  return 0;
}

async function updateCard(card, result) {
  updateNeeded = await comparePriceAndis_Soldout(card, result);
  if (updateNeeded) {
    db.query(
      `UPDATE card_data SET price=?, is_soldout=? WHERE pack_code = '${card.pack_code}' AND rare = '${card.rare}' AND shop = '${card.shop}'`,
      [card.price, card.is_soldout]
    );

    console.log(`update ${card.name}`);
    fs.appendFile(
      "dblog.txt",
      `update  
  ${card.name},
  ${card.pack_code},
  ${card.rare},
  ${card.price},
  ${card.is_soldout},
  ${card.shop},
  ${card.img},
  ${card.source_url}`,
      "utf8",
      function (err) {}
    );
  } else {
    console.log(`not update ${card.name}`);
    fs.appendFile(
      "dblog.txt",
      `didn't update  
      ${card.name}`,
      "utf8",
      function (err) {}
    );
  }
  return 0;
}

async function comparePriceAndis_Soldout(card, result) {
  let is_restocked;
  let is_Changed;
  let dbData = result[0];
  if (!(dbData.price == card.price && dbData.is_soldout == card.is_soldout)) {
    is_Changed = 1;
    if (dbData.is_soldout == "true" && card.is_soldout == "false") {
      is_restocked = 1;
    }
  }

  if (is_restocked) {
    let queryStr = `SELECT * FROM restock_list WHERE name = '${card.name}'`;
    let result = await getDBResult(queryStr);
    if (result.length === 0) {
      addToRestocklist(card.name);
    }
  }
  return is_Changed;
}

function addToRestocklist(restockedCard) {
  db.query(`INSERT INTO restock_list (name, restocked_date) VALUES (?,NOW())`, [
    restockedCard,
  ]);

  console.log(`add ${restockedCard} to restocklist`);
  fs.appendFile(
    "dblog.txt",
    `restock   
    ${restockedCard.name}`,
    "utf8",
    function (err) {}
  );
  return 0;
}

async function dbProcess(datalist) {
  for (const card of datalist) {
    searchResult = await searchCard(card);
    if (searchResult.length === 0) {
      await insertCard(card);
      indexaddtolist(card);
    } else {
      updateCard(card, searchResult);
    }
  }
  return 0;
}

exports.getDBResult = getDBResult;
exports.dbProcess = dbProcess;
exports.indextableupdate = indextableupdate;
