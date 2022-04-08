const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
var fs = require("fs");

async function GetHtml(url) {
  try {
    const html = await axios.get(url, {
      responseType: "arraybuffer",
      responseEncoding: "binary",
    });
    return html;
  } catch (error) {
    console.error(error);
  }
}

function testlistconsistency(list) {
  var testresult = true;

  for (i in list) {
    if (list[i] === "") {
      var testresult = false;
    }
  }
  return testresult;
}

function logerrorcase(list) {
  console.log("error call");
  fs.appendFile(
    "errorcase.txt",
    JSON.stringify(list),
    "utf8",
    function (err) {}
  );
}

async function crawlpacknamelist() {
  const urlList = [];
  html = await crawlmodule.GetHtml("http://www.tcgshop.co.kr/");
  decodedhtml = iconv.decode(html.data, "euc-kr");
  const $ = cheerio.load(decodedhtml);

  $bodylist = $("td#nom_s table tbody tr").children("td.nom_s");
  $bodylist.each(function (i, element) {
    if (
      !$(element)
        .attr("onclick")
        .match(/(=[0-9a-zA-Z]{3,4}-kr)/gi)
    ) {
      //러시혹은 jp,en의 경우
    } else {
      //공식명칭과 동일화위한 replace 필요
      urlList[i] = $(element).text().trim();
    }
  });
  fs.writeFile(
    "packnamelist.txt",
    JSON.stringify(urlList),
    "utf8",
    function (err) {}
  );
  return 0;
}

async function CrawlingHtml(url) {
  var crawledData;
  let html = await GetHtml(url);
  let is_utf_8 = JSON.stringify(html.headers).includes("utf-8");
  if (!is_utf_8) {
    var encodedhtml = iconv.decode(html.data, "euc-kr");
  } else {
    var encodedhtml = html.data;
  }
  const $ = cheerio.load(encodedhtml);
  switch (true) {
    case url.includes("www.tcgshop.co.kr"):
      crawledData = await Case_tcgshop($);

      break;
    case url.includes("www.carddc.co.kr"):
      crawledData = await Case_carddc($);

      break;
    case url.includes("cardkingdom"):
      crawledData = await Case_cardkingdom($);

      break;
    case url.includes("tcgmart"):
      crawledData = await Case_tcgmart($);

      break;
  }

  return await crawledData;
}

async function Case_tcgshop($) {
  const list = [];
  $bodylist = $("table.border_box tbody tr td table tbody tr td").children(
    "table"
  );
  $bodylist.filter(":even").each(function (i, element) {
    untrimpackcode =
      $(element)
        .find("tbody tr td span.glist_02")
        .text()
        .match(/([0-9a-zA-Z]{3,4})-kr([0-9a-zA-Z]{3})/gi) || [];

    var templist = {
      name: $(element)
        .find("tbody tr td.glist_01 a")
        .text()
        .replace(/\([ㄱ-ㅎ가-힣0-9a-z.]*\)/gi, ""),
      pack_code: untrimpackcode[0],
      rare: $(element)
        .find("tbody tr:nth-of-type(5) td span:nth-of-type(1)")
        .text()
        .trim(),
      price: parseInt(
        $(element)
          .find("tbody tr table tbody tr td span.glist_price12")
          .text()
          .replace(/[^0-9]/g, "")
      ),
      is_soldout:
        "./upload/no_good_img" ==
        $(element).find("tbody tr:nth-of-type(8) td img").attr("src"),
      shop: "tcgshop",
      img: $(element).find("tbody tr td a img").attr("src"),
      source_url: $(element).find("tbody tr td.glist_01 a").attr("href"),
    };

    isnotblank = testlistconsistency(templist);

    if (isnotblank) {
      for (i in templist) {
        list[i] = list[i].trim();
      }
      list.push(templist);
    } else {
      logerrorcase(templist);
    }
  });

  return await list;
}

async function Case_carddc($) {
  list = [];
  $bodylist = $("table.prodcut_list_table tbody tr").children("td");
  $bodylist.each(function (i, element) {
    templist = {
      name: $(element).find("ul.pro_t li a").text(),
      pack_code: $(element).find("ul.pro_t li.pro_info_t2").text(),
      rare: $(element).find("ul.pro_t li.pro_info_t").text(),
      price: $(element)
        .find("ul.pro_t li.price_t")
        .text()
        .trim()
        .replace(/[^0-9]/g, ""),
      is_soldout:
        "/images/icon_sortout.jpg" ==
        $(element).find("ul.pro_t li img").attr("src"),
      shop: "carddc",
      img: $(element).find("ul li.pro_img a img").attr("src"),
      source_url: $(element).find("ul li.pro_img a").attr("href"),
    };
    isnotblank = testlistconsistency(templist);

    if (isnotblank) {
      for (i in templist) {
        list[i] = list[i].trim();
      }
      list.push(templist);
    } else {
      logerrorcase(templist);
    }
  });
  return await list;
}

async function Case_cardkingdom($) {
  list = [];
  $bodylist = $("ul.wOWfwtMC_3._3cLKMqI7mI._3GwACmAYfW").children(
    "li.-qHwcFXhj0"
  );
  $bodylist.each(function (i, element) {
    var untrimpackcode =
      $(element)
        .find("strong.QNNliuiAk3")
        .text()
        .match(/([0-9a-zA-Z]{3,4})-kr([0-9a-zA-Z]{3})/gi) || [];
    var untrimrarity =
      $(element)
        .find("strong.QNNliuiAk3")
        .text()
        .match(
          /( [가-힣]*?(슈퍼|울트라|얼티미트|패러렐|시크릿|홀로그래픽|골드)* ?레어 )|([a-z]* ?[a-z]* ?rare)|(노멀)|(normal)/gi
        ) || []; //~(공백)~(공백)레어를 처리하지못하는 문제
    templist = {
      name: $(element)
        .find("strong.QNNliuiAk3")
        .text()
        .replace("유희왕", "")
        .replace("한글판", "")
        .replace(/\(?([0-9a-zA-Z]{3,4})-kr([0-9a-zA-Z]{3})\)?/gi, "")
        .replace("히든서머너즈", "")
        .replace(
          /( [가-힣]*?레어 )|([a-z]* ?[a-z]* ?rare)|(노멀)|(normal)|( 패러렐 레어 )/gi,
          ""
        )
        .replace(/ \/ /, "")
        .trim(),
      pack_code: untrimpackcode[0],
      rare: untrimrarity[0],
      price: $(element)
        .find("a div._23DThs7PLJ strong span.nIAdxeTzhx")
        .text()
        .replace(/[^0-9]/g, ""),
      is_soldout:
        "일시 품절" ==
        $(element)
          .find("div._18kuVNtTNE span._3cvKLOZJUt span._3Btky8fCyp span")
          .text(),
      shop: "cardkingdom",
      img: $(element)
        .find("a div._2Yq8Q_jTJv div div img._25CKxIKjAk")
        .attr("src"),
      source_url: $(element).find("a").attr("href"),
    };
    isnotblank = testlistconsistency(templist);

    if (isnotblank) {
      for (i in templist) {
        list[i] = list[i].trim();
      }
      list.push(templist);
    } else {
      logerrorcase(templist);
    }
  });
  return await list;
}

async function Case_tcgmart($) {
  list = [];
  $bodylist = $("ul.wOWfwtMC_3._3cLKMqI7mI._3GwACmAYfW").children(
    "li.-qHwcFXhj0"
  );
  $bodylist.each(function (i, element) {
    var untrimpackcode =
      $(element)
        .find("strong.QNNliuiAk3")
        .text()
        .match(/([0-9a-zA-Z]{3,4})-kr([0-9a-zA-Z]{3})/gi) || [];
    var untrimrarity =
      $(element)
        .find("strong.QNNliuiAk3")
        .text()
        .match(/([a-z]* ?[a-z]* ?rare)|(normal)/gi) || [];
    var split = $(element)
      .find("strong.QNNliuiAk3")
      .text()
      .replace(/[()]/gi, "")
      .split(" ");
    templist = {
      name: split[0],
      pack_code: untrimpackcode[0].trim(),
      rare: untrimrarity[0].trim(),
      price: $(element)
        .find("a div._23DThs7PLJ strong span.nIAdxeTzhx")
        .text()
        .replace(/[^0-9]/g, ""),
      is_soldout:
        "일시 품절" ==
        $(element)
          .find("div._18kuVNtTNE span._3cvKLOZJUt span._3Btky8fCyp span")
          .text(),
      shop: "tcgmart",
      img: $(element)
        .find("a div._2Yq8Q_jTJv div div img._25CKxIKjAk")
        .attr("src"),
      source_url: $(element).find("a").attr("href"),
    };
    isnotblank = testlistconsistency(templist);

    if (isnotblank) {
      for (i in templist) {
        list[i] = list[i].trim();
      }
      list.push(templist);
    } else {
      logerrorcase(templist);
    }
  });
  return await list;
}

exports.GetHtml = GetHtml;
exports.CrawlingHtml = CrawlingHtml;
exports.crawlpacknamelist = crawlpacknamelist;
