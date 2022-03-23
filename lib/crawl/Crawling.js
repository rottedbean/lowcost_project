//레어도가 특정 enum에 해당하지 않으면 리스트에 넣지않는 걸로 카드외 상품문제가 해결 가능할지도
//dbprocess로 넘겨주기전에 undefined 아닌가 확인하는 절차 필요할지도
//가격은 숫자로 ,떼고 넘기는게 좋지않나 싶기도
//카드킹덤 특정팩 수록카드들 팩코드 없는경우를 확인 다른 팩도 확인 필요
const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

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
    list[i] = {
      name: $(element).find("tbody tr td.glist_01 a").text(),
      pack_code: $(element)
        .find("tbody tr td span.glist_02")
        .text()
        .replace(/[()]/gi, ""),
      rare: $(element)
        .find("tbody tr:nth-of-type(5) td span:nth-of-type(1)")
        .text()
        .trim(),
      price: $(element)
        .find("tbody tr table tbody tr td span.glist_price12")
        .text()
        .replace(/[^0-9]/g, ""),
      is_soldout:
        "./upload/no_good_img" ==
        $(element).find("tbody tr:nth-of-type(8) td img").attr("src"),
      shop: "tcgshop",
      img: $(element).find("tbody tr td a img").attr("src"),
      source_url: $(element).find("tbody tr td.glist_01 a").attr("href"),
    };
  });

  return await list;
}

async function Case_carddc($) {
  list = [];
  $bodylist = $("table.prodcut_list_table tbody tr").children("td");
  $bodylist.each(function (i, element) {
    list[i] = {
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
  });
  return await list;
}

async function Case_cardkingdom($) {
  list = [];
  $bodylist = $("ul.wOWfwtMC_3._3cLKMqI7mI._3GwACmAYfW").children(
    "li.-qHwcFXhj0"
  );
  $bodylist.each(function (i, element) {
    list[i] = {
      name: $(element)
        .find("strong.QNNliuiAk3")
        .text()
        .replace("유희왕", "")
        .replace("한글판", "")
        .replace(/\(?([0-9a-zA-Z]{3,4})-kr([0-9a-zA-Z]{3})\)?/gi, "")
        .replace("히든서머너즈", "")
        .replace(
          /( [가-힣]* ?레어 )|([a-z]* ?[a-z]*? rare)|(노멀)|(normal)/gi,
          ""
        )
        .replace(/ \/ /, "")
        .trim(),
      pack_code: $(element)
        .find("strong.QNNliuiAk3")
        .text()
        .match(/([0-9a-zA-Z]{3,4})-kr([0-9a-zA-Z]{3})/gi),
      rare: $(element)
        .find("strong.QNNliuiAk3")
        .text()
        .match(/( [가-힣]* ?레어 )|([a-z]* ?[a-z]*? rare)|(노멀)|(normal)/gi)
        .trim(),
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
  });
  return await list;
}

async function Case_tcgmart($) {
  list = [];
  $bodylist = $("ul.wOWfwtMC_3._3cLKMqI7mI._3GwACmAYfW").children(
    "li.-qHwcFXhj0"
  );
  $bodylist.each(function (i, element) {
    var split = $(element)
      .find("strong.QNNliuiAk3")
      .text()
      .replace(/[()]/gi, "")
      .split(" ");
    list[i] = {
      name: split[0],
      pack_code: split[1],
      rare: split[2],
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
  });
  return await list;
}

exports.GetHtml = GetHtml;
exports.CrawlingHtml = CrawlingHtml;
