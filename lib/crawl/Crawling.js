//각카드가 아니라 카드 종류하나당 하나의 이미지만 있어야 하지 않을까...
const axios = require("axios");
const axiosRetry = require("axios-retry");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const fs = require("fs");

axiosRetry(axios, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 2000; // time interval between retries
  },
  retryCondition: (error) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return error.response.status === 503;
  },
});

async function GetHtml(url) {
  //에러처리가 안되는 문제
  try {
    const html = await axios.get(url, {
      responseType: "arraybuffer",
      responseEncoding: "binary",
    });
    return html;
  } catch (error) {
    console.error("GetHtml errored");
  }
}

function testlistconsistency(list) {
  values = Object.values(list);
  var testresult = true;
  for (i of values) {
    if (typeof i == "undefined" || i == null || i == "") {
      var testresult = false;
    }
  }
  return testresult;
}

function logerrorcase(list) {
  console.log("error call");
  fs.appendFile(
    "errorcase.txt",
    JSON.stringify(list) + "\n",
    "utf8",
    function (err) {}
  );
}

async function crawlpacknamelist() {
  //카드 데이터베이스에서 가져오는게 나을지도
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
      urlList[i] = $(element).text().replace(/(\s*)/g, "");
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
    var templist = {
      name: $(element).find("tbody tr td.glist_01 a").text(),
      pack_code: ($(element)
        .find("tbody tr td span.glist_02")
        .text()
        .match(/([0-9a-zA-Z]{3,4})-k([0-9a-zA-Z]{3,4})/gi) || [])[0],
      rare: $(element)
        .find("tbody tr:nth-of-type(5) td span:nth-of-type(1)")
        .text(),
      price:
        parseInt(
          $(element)
            .find("tbody tr table tbody tr td span.glist_price12")
            .text()
            .replace(/[^0-9]/g, "")
        ) || 0,
      is_soldout: (
        "./upload/no_good_img" ==
        $(element).find("tbody tr:nth-of-type(8) td img").attr("src")
      ).toString(),
      shop: "tcgshop",
      img:
        "http://www.tcgshop.co.kr/" +
        $(element).find("tbody tr td a img").attr("src"),
      source_url:
        "http://www.tcgshop.co.kr/" +
        $(element).find("tbody tr td.glist_01 a").attr("href"),
    };

    isnotblank = testlistconsistency(templist);

    if (isnotblank) {
      templist.name = templist.name.replace(/(\s*)/g, "");
      templist.pack_code = templist.pack_code.replace(/(\s*)/g, "");
      templist.rare = templist.rare.replace(/(\s*)/g, "");
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
        .replace(/(\s*)/g, "")
        .replace(/[^0-9]/g, ""),
      is_soldout: (
        "/images/icon_sortout.jpg" ==
        $(element).find("ul.pro_t li img").attr("src")
      ).toString(),
      shop: "carddc",
      img: $(element).find("ul li.pro_img a img").attr("src"),
      source_url: $(element).find("ul li.pro_img a").attr("href"),
    };
    isnotblank = testlistconsistency(templist);

    if (isnotblank) {
      templist.name = templist.name.replace(/(\s*)/g, "");
      templist.pack_code = templist.pack_code.replace(/(\s*)/g, "");
      templist.rare = templist.rare.replace(/(\s*)/g, "");
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
    templist = {
      name: $(element)
        .find("strong.QNNliuiAk3")
        .text()
        .replace(/(\/)$/gi, "")
        .replace(/(유희왕|유희왕 카드)/, "")
        .replace("한글판", "")
        .replace(
          /(엑스트라팩2018|히든서머너즈|데스티니솔저스|숨겨진세력|새비지스트라이크)/gi,
          ""
        )
        .replace(/\(?([0-9a-zA-Z]{3,4})-kr([0-9a-zA-Z]{3,4})\)?/gi, "")
        .replace(
          / (밀레니엄|프리즈마틱|슈퍼|엑스트라|프리미엄|울트라|시크릿|노멀)?((슈퍼|울트라|얼티미트|얼미미트|시크릿|홀로그래픽|골드|패러랠|페러렐|페러랠|패러럴|패퍼렐|패럴렐|패러렐)? ?레어 ?)|([a-z]* ?[a-z]* ?rare)|(노멀)|(normal)/gi,
          ""
        )
        .replace(/ \/ /, ""),
      pack_code: ($(element)
        .find("strong.QNNliuiAk3")
        .text()
        .match(/([0-9a-zA-Z]{3,4})-k([0-9a-zA-Z]{3,4})/gi) || [])[0],
      rare: ($(element)
        .find("strong.QNNliuiAk3")
        .text()
        .match(
          / (밀레니엄|프리즈마틱|슈퍼|엑스트라|프리미엄|울트라|시크릿|노멀)?((슈퍼|울트라|얼티미트|얼미미트|시크릿|홀로그래픽|골드|패러랠|페러렐|페러랠|패러럴|패퍼렐|패럴렐|패러렐)? ?레어 ?)|([a-z]* ?[a-z]* ?rare)|(노멀)|(normal)/gi
        ) || [])[0],
      price: $(element)
        .find("a div._23DThs7PLJ strong span.nIAdxeTzhx")
        .text()
        .replace(/[^0-9]/g, ""),
      is_soldout: (
        "일시 품절" ==
        $(element)
          .find("div._18kuVNtTNE span._3cvKLOZJUt span._3Btky8fCyp span")
          .text()
      ).toString(),
      shop: "cardkingdom",
      img: $(element)
        .find("a div._2Yq8Q_jTJv div div img._25CKxIKjAk")
        .attr("src"),
      source_url:
        "https://smartstore.naver.com" + $(element).find("a").attr("href"),
    };
    isnotblank = testlistconsistency(templist);

    if (isnotblank) {
      templist.name = templist.name.replace(/(\s*)/g, "");
      templist.pack_code = templist.pack_code.replace(/(\s*)/g, "");
      templist.rare = templist.rare.replace(/(\s*)/g, "");

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
    templist = {
      name: $(element)
        .find("strong.QNNliuiAk3")
        .text()
        .replace(/([0-9a-zA-Z]{3,4})-k([0-9a-zA-Z]{3,4})/gi, "")
        .replace(/[()]/gi, "")
        .split(" ")[0],

      pack_code: ($(element)
        .find("strong.QNNliuiAk3")
        .text()
        .match(/([0-9a-zA-Z]{3,4})-k([0-9a-zA-Z]{3,4})/gi) || [])[0],
      rare: ($(element)
        .find("strong.QNNliuiAk3")
        .text()
        .match(/([a-z]* ?[a-z]* ?rare)|(normal)|nomal/gi) || [])[0],
      price: $(element)
        .find("a div._23DThs7PLJ strong span.nIAdxeTzhx")
        .text()
        .replace(/[^0-9]/g, "") || [""],
      is_soldout: (
        "일시 품절" ==
        $(element)
          .find("div._18kuVNtTNE span._3cvKLOZJUt span._3Btky8fCyp span")
          .text()
      ).toString(),
      shop: "tcgmart",
      img: $(element)
        .find("a div._2Yq8Q_jTJv div div img._25CKxIKjAk")
        .attr("src"),
      source_url:
        "https://smartstore.naver.com" + $(element).find("a").attr("href"),
    };
    isnotblank = testlistconsistency(templist);

    if (isnotblank) {
      templist.name = templist.name.replace(/(\s*)/g, "");
      templist.pack_code = templist.pack_code.replace(/(\s*)/g, "");
      templist.rare = templist.rare.replace(/(\s*)/g, "");
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
