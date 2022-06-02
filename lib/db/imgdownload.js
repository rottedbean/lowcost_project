const fs = require("fs");
const request = require("request");

var imgdownload = function (url) {
  filename =
    "../../public/card_images/" +
    Math.random().toString(36).substring(11, 2) +
    ".png";
  request.head(url, function (err, res, body) {
    request(url).pipe(fs.createWriteStream(filename));
  });
  return filename;
};

exports.imgdownload = imgdownload;
