const fs = require("fs");
const axios = require("axios");
const db = require("./dbconnection");
const dbmodule = require("./dbprocess");

var imgdownload = async function (url) {
  filename = Math.random().toString(36).substring(11, 2);
  var image_path = "../../public/card_images/" + filename + ".png";
  download_image(url, image_path);
  return filename;
};

async function mainimgdownload(card) {
  var result = await dbmodule.getDBResult(
    `SELECT * FROM idxtable WHERE img = '${card.name
      .replace(/\(.*\)/gi, "")
      .replace(/()/)}'`
  );
  //이미 있는지 여부 확인
  //카드이름을 냅다 검색으로 넣어서 있는지 없는지 찾는건 미친짓거리, 다른 방도를 찾아야
  var is_already_exist = result.length;
  if (!is_already_exist) {
    var url = card.img;
    var mainurl = url.replace(/goods\/gd_/, "goods/");
    var filename = card.name.replace(/\(.*\)/gi, "");
    //카드이름에 특수문자 포함된경우 이름.png가 불가능한 문제
    var image_path = "../../public/card_images/" + filename + ".png";

    download_image(mainurl, image_path);
    //idx테이블에 업데이트
    await db.query(`UPDATE idxtable SET img=? where name = '${filename}'`, [
      filename,
    ]);
  }

  return 0;
}

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: "stream",
  }).then(
    (response) =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on("finish", () => resolve())
          .on("error", (e) => reject(e));
      })
  );

exports.imgdownload = imgdownload;
exports.mainimgdownload = mainimgdownload;
