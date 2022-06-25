const fs = require("fs");
const request = require("request");
const db = require("./dbconnection");
const dbmodule = require("./dbprocess");

var imgdownload = function (url) {
  filename = Math.random().toString(36).substring(11, 2);
  request.head(url, function (err, res, body) {
    request(url).pipe(
      fs.createWriteStream("../../public/card_images/" + filename + ".png")
    );
  });
  return filename;
};

async function mainimgdownload(card) {
  var result = await dbmodule.getDBResult(
    `SELECT * FROM idxtable WHERE img = '${card.name.replace(/\(.*\)/gi, "")}'`
  );
  //이미 있는지 여부 확인
  is_already_exist = result.length;
  if (!is_already_exist) {
    url = card.source_url;
    mainurl = url.replace(/goods\/gd_/, "goods/");
    filename = `${card.name.replace(/\(.*\)/gi, "")}`;
    request.head(mainurl, function (err, res, body) {
      request(mainurl).pipe(
        fs.createWriteStream("../../public/card_images/" + filename + ".png")
      );
    });
    //idx테이블에 업데이트
    db.query(`UPDATE idxtable SET img=? where name = '${filename}'`, [
      filename,
    ]);
  }

  return 0;
}

exports.imgdownload = imgdownload;
exports.mainimgdownload = mainimgdownload;
