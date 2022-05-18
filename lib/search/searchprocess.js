dbmodule = require("../db/dbprocess");
const fs = require("fs");

async function getidxlistFromNameTable(keyword) {
  var return_value;

  let queryStr = `SELECT * FROM idxtable WHERE name LIKE '%${keyword}%'`;
  var result = await dbmodule.getDBResult(queryStr);
  if (!result.length) {
    return_value = "none";
  } else {
    searchresult_array = [];
    for (let i = 0; i < result.length; i++) {
      if (!result[i].idx_list) {
        //result의 idx_list가 null인 경우처리
        searchresult_array[i] = {
          cardname: result[i].name,
          lowcost: 0,
          idxlist: "",
          stat: result[i].status,
        };
      } else {
        lowcost = await getLowcost(result[i].idx_list);
        searchresult_array[i] = {
          cardname: result[i].name,
          lowcost: lowcost,
          idxlist: result[i].idx_list,
          stat: result[i].status,
        };
      }
    }
    return_value = searchresult_array;
  }

  return await return_value;
}

async function getLowcost(idx_array) {
  var lowcost = {};
  var nonfilteredlist = idx_array.split(",");
  const list = nonfilteredlist.filter(Boolean);
  for (let i = 0; i < list.length; i++) {
    let indexnum = list[i];
    let queryStr = `SELECT price,shop FROM card_data WHERE idx = '${indexnum}'`;
    var result = await dbmodule.getDBResult(queryStr);
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
  lowcost.lowest = Math.min.apply(null, Object.values(lowcost).filter(Boolean));

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
        Object.values(i) + Object.entries(i.lowcost) + "\n",
        "utf8",
        function (err) {}
      );
    }
  }
  return searchresult;
}

exports.searchProcess = searchProcess;
