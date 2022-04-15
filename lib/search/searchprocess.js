// 존나 이해가 안됨, 변수명 다 뜯어고치고 정리해야할듯
// idxtable 기반으로 바꾸면서 리팩토링을 넘어서 그냥 다 바꿔야함
dbmodule = require("../db/dbprocess");
const fs = require("fs");

async function getidxlistFromNameTable(keyword) {
  var return_value;

  let queryStr = `SELECT * FROM idxtable WHERE name LIKE '%${keyword}%'`;
  var result = await dbmodule.getDBResult(queryStr);

  fs.appendFile("searchlog.txt", `${result}`, "utf8", function (err) {});

  if (!(result.length === 0)) {
    idxlist_array = [];
    for (card of result) {
      idxlist_array.push(card.idx_list);
    }
    return_value = idxlist_array;
  } else {
    return_value = "none";
  }

  return return_value;
}

async function searchProcess(str) {
  idx_array = await getidxlistFromNameTable(str);
  if (idx_array === "none") {
    console.log("결과없음");
  } else {
    console.log("반환값:" + idx_array);
  }
}

exports.searchProcess = searchProcess;
