// 존나 이해가 안됨, 변수명 다 뜯어고치고 정리해야할듯
dbmodule = require("../db/dbprocess");
var db = require("../db/dbconnection");

async function getCodeFromNameTable(keyword) {
  let searchstring = keyword;
  var return_value;

  let queryStr = `SELECT * FROM SearchTable WHERE name LIKE '%${searchstring}%'`;
  var result = await dbmodule.getDBResult(queryStr);
  console.log("서치테이블 결과:" + result[0]);

  if (!(result.length === 0)) {
    code_array = [];
    for (card of result) {
      code_array.push(card.code_list.split(","));
    }
    return_value = code_array;
  } else {
    return_value = "none";
  }

  return return_value;
}

async function getDataByCode(array) {
  var record_array = [];
  for (const eachcard of array) {
    console.log("변수eachcard:" + eachcard);
    var record_list = [];
    for (const eachcode of eachcard) {
      console.log("변수eachcode:" + eachcode);
      let queryStr = `SELECT * FROM card_data WHERE pack_code='${eachcode}'`;
      var result = await dbmodule.getDBResult(queryStr);
      console.log("특정 코드 검색결과 " + result[0].name);
      record_list.push(result);
    }
    console.log("특정 카드 검색결과 " + record_list[0][0].name);
    record_array.push(record_list);
  }
  console.log("카드들 검색결과 " + record_array[0][0][0].name);
  return await record_array;
}

async function searchProcess(str) {
  code_array = await getCodeFromNameTable(str);
  console.log("코드배열:" + code_array);
  if (code_array === "none") {
    console.log("결과없음");
  } else {
    searched_data = await getDataByCode(code_array);
    console.log("반환값:" + searched_data[1][0][0].name);
  }
}

exports.searchProcess = searchProcess;
