import * as fs from "fs";
import * as request from "request";

var imgdownload = function (url) {
  filename = Math.random().toString(36).substring(11, 2);
  request.head(url, function (err, res, body) {
    request(url).pipe(
      fs.createWriteStream("../../public/card_images/" + filename + ".png")
    );
  });
  return filename;
};

export { imgdownload };
