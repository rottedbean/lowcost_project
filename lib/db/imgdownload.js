const fs = require("fs");
const request = require("request");

var imgdownload = function (url) {
  filename = Math.random().toString(36).substring(11, 2);
  request.head(url, function (err, res, body) {
    request(url).pipe(
      fs.createWriteStream("../../public/card_images/" + filename + ".png")
    );
  });
  return filename;
};

exports.imgdownload = imgdownload;
