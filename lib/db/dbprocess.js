const db = require("./dbconnection");
const fs = require("fs");
const idxmodule = require("./processidxtable");
const imgdown = require("./imgdownload");

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

async function getcardbyindex(indexnum) {
  let queryStr = `SELECT * FROM card_data WHERE idx = '${indexnum}'`;
  let result = await getDBResult(queryStr);
  return result;
}

async function searchCard(card) {
  let queryStr = `SELECT * FROM card_data WHERE name = '${card.name}' AND pack_code = '${card.pack_code}' AND rare = '${card.rare}' AND shop = '${card.shop}'`;
  let result = await getDBResult(queryStr);
  return result;
}

function insertCard(card) {
  imglocalLocation = imgdown.imgdownload(card.img);
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
    let queryStr = `SELECT * FROM restock_list WHERE name = '${card.name}'`;
    let result = await getDBResult(queryStr);
    if (result.length === 0) {
      addToRestocklist(card);
    }
  }
  return is_Changed;
}

function addToRestocklist(restockedCard) {
  db.query(`INSERT INTO restock_list (idx, restocked_date) VALUES (?,NOW())`, [
    restockedCard.idx,
  ]);

  console.log(`add ${restockedCard.name} to restocklist`);
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
      updateCard(card, searchResult);
    }
  }
  return 0;
}

exports.getDBResult = getDBResult;
exports.dbProcess = dbProcess;
