const db = require("./dbconnection");
const dbmodule = require("./dbprocess");

async function countstock(result) {
  idx_array = result.idx_list;
  var nonfilteredlist = idx_array.split(",");
  const list = nonfilteredlist.filter(Boolean);

  for (const idx in list) {
    var is_stock = false;
    var result = await dbmodule.getDBResult(
      `SELECT is_soldout FROM card_data WHERE idx = '${idx}'`
    );
    if (result[0].is_soldout === true) {
      var is_stock = true;
    }
  }
  return is_stock;
}
async function getDataFromDB(cardname) {
  var result = await dbmodule.getDBResult(
    `SELECT * FROM idxtable WHERE name = '${cardname}'`
  );

  is_stock = await countstock(result);

  const res = {
    name: result[0].name,
    info: result[0].status,
    img: result[0].img,
    stock: is_stock,
    price: result[0].price,
  };
  return res;
}

async function getEachcardFromDB(cardname) {
  var resultarray = [];
  var idxlist = dbmodule.getidxlistbyname(cardname);
  for (let idx of idxlist) {
    var result = await dbmodule.getDBResult(
      `SELECT * FROM card_data WHERE idx = '${idx}'`
    );
    res = {
      name: result[0].name,
      packcode: result[0].pack_code,
      rare: result[0].rare,
      img: result[0].img,
      stock: result[0].is_soldout,
      price: result[0].price,
      shop: result[0].shop,
      url: result[0].source_url,
    };
    resultarray.push(res);
  }
  return resultarray;
}

async function getsearchresult(keyword) {
  //검색으로는 idxtable에서 줄수 있는 값만
  var return_value;

  let queryStr = `SELECT * FROM idxtable WHERE name LIKE '%${keyword}%'`;
  var result = await dbmodule.getDBResult(queryStr);
  if (!result.length) {
    return_value = "none";
  } else {
    searchresult_array = [];
    for (let i = 0; i < result.length; i++) {
      searchresult_array[i] = {
        cardname: result[i].name,
        low: result[i].low,
        stat: result[i].status,
        img: result[i].img,
      };
    }
    return_value = searchresult_array;
  }

  return await return_value;
}

async function searchProcess(str) {
  searchresult = await getsearchresult(str);
  if (searchresult === "none") {
    console.log("결과없음");
    return "결과없음";
  } else {
    for (let i of searchresult) {
      fs.appendFile(
        "searchlog.txt",
        Object.values(i) + "\n",
        "utf8",
        function (err) {}
      );
    }
  }
  return searchresult;
}

exports.getDataFromDB = getDataFromDB;
exports.getEachcardFromDB = getEachcardFromDB;
exports.searchProcess = searchProcess;
