var db = require("./dbconnection");

function searchCard(card) {
  cardCode = card.pack_code;
  cardRare = card.rare;
  cardShop = card.shop;
  is_exist = db.query(
    `SELECT EXISTS (SELECT pack_code, rare, shop FROM card_data WHERE pack_code = cardCode, rare = cardRare, shop = cardShop) as isChk`
  );
  console.log("3");
  return is_exist;
}

function insertCard(card) {
  cardName = card.name;
  cardCode = card.pack_code;
  cardRare = card.rare;
  cardPrice = card.price;
  cardIsSoldout = card.is_soldout;
  cardShop = card.shop;
  cardImage = card.img;
  cardUrl = card.source_url;
  console.log("4");
  db.query(
    `INSERT INTO card_data(name, pack_code, rare, price, is_soldout, shop, img, source_url) VALUES(cardName, cardCode, cardRare, cardPrice, cardIsSoldout, cardShop, cardImage, cardUrl)`
  );
}

function updateCard(card) {
  updateNeeded = comparePriceAndis_Soldout(card);
  if (updateNeeded) {
    db.query(`UPDATE card_data SET price=?, is_soldout=?`, [
      card.price,
      card.is_soldout,
    ]);
    console.log("5");
  }
}

function comparePriceAndis_Soldout(card) {
  db.query(
    `SELECT price, is_soldout FROM card_data WHERE pack_code = card.code, rare = card.rare, shop = card.shop`,
    function (result) {
      if (
        result[0].price == card.price &&
        result[0].is_soldout == card.is_soldout
      ) {
      } else {
        is_Changed = 1;
        if (result[0].is_soldout == "true" && card.is_soldout == "false") {
          is_restocked = 1;
        }
      }
    }
  );
  //select로 가져온 is_soldout이 true이고 card.is_soldout이 false인 경우 is_restocked가 true
  if (is_restocked) {
    addToRestocklist(card.name);
  }
  return is_Changed;
}

function addToRestocklist(restockedCard) {
  db.query(`INSERT INTO restock_list (name, restocked_date) VALUES (?,NOW())`, [
    restockedCard,
  ]);
}

function dbProcess(datalist) {
  console.log("2");
  console.log(datalist);
  for (card in datalist) {
    isExistInDB = searchCard(card);
    if (isExistInDB) {
      updateCard(card);
    } else {
      insertCard(card);
    }
  }
  return 0;
}

exports.dbProcess = dbProcess;
