dbmodule = require("../db/dbprocess");
var db = require("./dbconnection");

function getCodeFromNameTable(keyword) {
  let searchstring = keyword;
  let queryStr = `SELECT code_list FROM SearchTable WHERE name LIKE '%${searchstring}%'`;
  var result = await dbmodule.getDBResult(queryStr);

  if (!(result.length === 0)) {
    dbData = result[0];
    var return_value = dbData.code_list.split(",");
  } else {
    return_value = "none";
  }
  return return_value;
}

async function getDataByCode(list) {
  let record_array = [];
  for (const code of list) {
    let queryStr = `SELECT * FROM card_data WHERE pack_code='${code}'`;
    var result = await dbmodule.getDBResult(queryStr);
    record_array.append(result[0]);
  }
  return record_array;
}

async function searchProcess(str) {
  keyword = str;
  code_array = await getCodeFromNameTable(keyword);
  if ((code_array = "none")) {
    console.log("결과없음");
  }
  searched_data = await getDataByCode(code_array);
  console.log(searched_data);
}

exports.searchProcess = searchProcess;
