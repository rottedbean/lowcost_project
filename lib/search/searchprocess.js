//상세결과 페이지는 이미 검색결과페이지에 넘긴 데이터 제외하고 각 카드 인덱스기반 상세데이터만 전부 반환
dbmodule = require("../db/dbprocess");
const fs = require("fs");

async function getidxlistFromNameTable(keyword) {
  var return_value;

  let queryStr = `SELECT * FROM idxtable WHERE name LIKE '%${keyword}%'`;
  var result = await dbmodule.getDBResult(queryStr);

  if (!(result.length === 0)) {
    searchresult_array = [];
    for (let i = 0; i < result.length; i++) {
      console.log(result[i].idx_array);
      lowcost = await getLowcost(result[i].idx_array);
      searchresult_array[i] = {
        cardname: result[i].name,
        lowcost: lowcost,
      };
    }
    return_value = searchresult_array;
  } else {
    return_value = "none";
  }

  return return_value;
}

async function getLowcost(idx_array) {
  var lowcost = 0;
  var is_lowcost;
  var list = idx_array.split(",");
  for (const i = 0; i < list.length; i++) {
    let queryStr = `SELECT price FROM card_data WHERE idx = '${list[i]}'`;
    var result = await dbmodule.getDBResult(queryStr);
    if (!result[i].price) {
      is_lowcost = 0;
    } else {
      is_lowcost = result[i].price;
    }
    if (lowcost === 0 || is_lowcost < lowcost) {
      lowcost = is_lowcost;
    }
  }
  return lowcost;
}
async function searchProcess(str) {
  searchresult = await getidxlistFromNameTable(str);
  if (idx_array === "none") {
    console.log("결과없음");
  } else {
    console.log("반환값:" + searchresult);
    fs.appendFile(
      "searchlog.txt",
      `${searchresult}`,
      "utf8",
      function (err) {}
    );
  }
}

exports.searchProcess = searchProcess;
