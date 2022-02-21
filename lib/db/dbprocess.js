var db = require("./dbconnection");

function searchCard(card) {
  cardCode = card.pack_code;
  cardRare = card.rare;
  cardShop = card.shop;
  is_exist = db.query(
    `SELECT pack_code, rare, shop FROM [TABLE] WHERE pack_code = cardCode, rare = cardRare, shop = cardShop`
  );
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

  db.query("INSERT");
}

function updateCard(card) {
  cardPrice = card.price;
  cardIsSoldout = card.is_soldout;
  updateNeeded = comparePriceAndis_Soldout(cardPrice, cardIsSoldout);
  if (updateNeeded) {
    db.query("UPDATE");
  }
}

function comparePriceAndis_Soldout(price, is_soldout) {
  db.query("SELECT");
  //select로 가져온 is_soldout이 true이고 card.is_soldout이 false인 경우 is_restocked가 true
  if (is_restocked) {
    addToRestocklist(card.name);
  }
  return is_Changed;
}

function addToRestocklist() {}

function dbProcess(datalist) {
  for (card in datalist) {
    isExistInDB = searchCard(card);
    if (isExistInDB) {
      updateCard(card);
    } else {
      insertCard(card);
    }
  }
}
