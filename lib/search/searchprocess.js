dbmodule = require("../db/dbprocess");
const fs = require("fs");

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

exports.searchProcess = searchProcess;
