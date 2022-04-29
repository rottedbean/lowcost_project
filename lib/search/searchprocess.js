dbmodule = require("../db/dbprocess");
const fs = require("fs");

async function getidxlistFromNameTable(keyword) {
  var return_value;

  let queryStr = `SELECT * FROM idxtable WHERE name LIKE '%${keyword}%'`;
  var result = await dbmodule.getDBResult(queryStr);
  if (!(result.length === 0)) {
    searchresult_array = [];
    for (let i = 0; i < result.length; i++) {
      lowcost = await getLowcost(result[i].idx_list);
      searchresult_array[i] = {
        cardname: result[i].name,
        lowcost: lowcost,
        idxlist: result[i].idx_list,
        stat: result[i].status,
      };
    }
    return_value = searchresult_array;
  } else {
    return_value = "none";
  }

  return await return_value;
}

async function getLowcost(idx_array) {
  //다포함해서 최저가 필요
  var lowcost = {};
  var nonfilteredlist = idx_array.split(",");
  const list = nonfilteredlist.filter(Boolean);
  //console.log(idx_array);
  for (let i = 0; i < list.length; i++) {
    let queryStr = `SELECT price,shop FROM card_data WHERE idx = '${list[i]}'`;
    var result = await dbmodule.getDBResult(queryStr);
    console.log(result);
    if (Object.keys(lowcost).includes(result[i].shop)) {
      obj = Object.getOwnPropertyDescriptor(lowcost, result[i].shop);
      if (obj.value > result[i].price || obj.value == 0) {
        lowcost[result[i].shop] = result[i].price;
      }
    } else {
      lowcost[result[i].shop] = result[i].price;
    }
  }

  return lowcost;
}
async function searchProcess(str) {
  searchresult = await getidxlistFromNameTable(str);
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

    return searchresult;
  }
}

exports.searchProcess = searchProcess;
