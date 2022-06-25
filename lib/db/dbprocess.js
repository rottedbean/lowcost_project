import * as db from "./dbconnection.js";
import * as fs from "fs";
import * as idxmodule from "./processidxtable.js";
import * as imgdown from "./imgdownload.js";

const getDBResult = (queryStr) => {
  return new Promise((resolve, reject) => {
    db.query(queryStr, function (error, result, field) {
      if (!result) {
        getDBResult(queryStr);
      } else {
        resolve(result);
      }
    });
  });
};

async function getidxlistbyname(cardname) {
  var result = await getDBResult(
    `SELECT * FROM idxtable WHERE name = '${cardname}'`
  );
  if (result[0].idx_list !== null) {
    try {
      idx_array = result[0].idx_list;
      var nonfilteredlist = idx_array.split(",");
      const list = nonfilteredlist.filter(Boolean);

      return list;
    } catch (error) {
      console.error(`GetHtml errored ${cardname}`);
    }
  }
  return 0;
}

async function updateLowcost() {
  let queryString = `SELECT name FROM idxtable`;
  let preresult = await getDBResult(queryString);
  for (let i = 0; i < preresult.length; i++) {
    let cardname = preresult[i].name;
    const list = await getidxlistbyname(cardname);
    var lowcost = await getlowcostprocess(list);
    lowcost.lowest = Math.min.apply(
      null,
      Object.values(lowcost).filter(Boolean)
    );
    stringlow = JSON.stringify(lowcost);
    db.query(`UPDATE idxtable SET low=? WHERE name = '${cardname}'`, [
      stringlow,
    ]);
  }
  return 0;
}

async function getlowcostprocess(list) {
  var lowcost = {};
  for (let i = 0; i < list.length; i++) {
    let indexnum = list[i];
    let queryStr = `SELECT price,shop FROM card_data WHERE idx = '${indexnum}'`;
    let result = await getDBResult(queryStr);
    if (Object.keys(lowcost).includes(result[0].shop)) {
      if (!result[0].price) {
        //price == 0
      } else {
        obj = Object.getOwnPropertyDescriptor(lowcost, result[0].shop);
        if (obj.value > result[0].price || obj.value == 0) {
          lowcost[result[0].shop] = result[0].price;
        }
      }
    } else {
      lowcost[result[0].shop] = result[0].price;
    }
  }
  return await lowcost;
}

async function searchCard(card) {
  let queryStr = `SELECT * FROM card_data WHERE name = '${card.name}' AND pack_code = '${card.pack_code}' AND rare = '${card.rare}' AND shop = '${card.shop}'`;
  let result = await getDBResult(queryStr);
  return result;
}

function insertCard(card) {
  imglocalLocation = imgdown.imgdownload(card.img);
  //메인이미지 다운 추가 필요
  if (card.source_url.includes("www.tcgshop.co.kr")) {
    imgdown.mainimgdownload(card);
  }
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
  ${imglocalLocation},
  ${card.source_url}\n`,
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
    imglocalLocation,
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
      ${card.name}\n`,
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
    addToRestocklist(card);
  }
  return is_Changed;
}

function addToRestocklist(restockedCard) {
  var today = new Date();

  var year = today.getFullYear();
  var month = ("0" + (today.getMonth() + 1)).slice(-2);
  var day = ("0" + today.getDate()).slice(-2);

  var dateString = year + "-" + month + "-" + day;
  filtedname = restockedCard.name.replace(/\(.*\)/gi, "");
  db.query(
    `INSERT INTO restock_list (idx, cardname, restocked_date) VALUES (?,?,DATE_FORMAT(now(), '%Y-%m-%d')) ON DUPLICATE KEY UPDATE restocked_date = '${dateString}'`,
    [restockedCard.idx, filtedname]
  );

  console.log(`add ${filtedname} to restocklist`);
  fs.appendFile(
    "restocklog.txt",
    `restock   
    ${restockedCard}`,
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
      await idxmodule.indexaddtolist(card);
    } else {
      await updateCard(card, searchResult);
    }
  }

  return 0;
}

exports.getDBResult = getDBResult;
exports.dbProcess = dbProcess;
exports.updateLowcost = updateLowcost;
