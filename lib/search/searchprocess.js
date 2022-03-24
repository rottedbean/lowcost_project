dbmodule = require("../db/dbprocess");
var db = require("../db/dbconnection");
// 3/17 5:26 메모: select로 날아오는 수많은 list들을 어떻게 처리해야 할련지 의문, 검색시 뭘 넘겨줘야
//할지 잘 생각해 봐야긋다

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
  let record_array = [];
  for (const eachcard of array) {
    console.log("변수list:" + list);
    var record_list = [];
    for (const eachcode of eachcard) {
      console.log("변수eachcode:" + eachcode);
      let queryStr = `SELECT * FROM card_data WHERE pack_code='${eachcode}'`;
      var result = await dbmodule.getDBResult(queryStr);
      console.log("카드데이터 result" + result[0].name);
      record_list.push(result);
    }
    console.log("레코드 리스트" + record_list[0][0].name);
    record_array.push(record_list);
  }
  console.log("변수 레코드 어레이" + record_array[0][0][0].name);
  return record_array;
}

async function searchProcess(str) {
  keyword = str;
  code_array = await getCodeFromNameTable(keyword);
  console.log("코드배열:" + code_array);
  if (code_array === "none") {
    console.log("결과없음");
  } else {
    searched_data = await getDataByCode(code_array);
    console.log("검색결과:" + searched_data.name);
  }
}

exports.searchProcess = searchProcess;
