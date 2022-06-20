import {
  initCategory,
  recentSearch,
  resetBasket,
  callLS,
  callCardsRecent,
  callCardsIndex,
  addComma,
  encodeURI,
} from "./front.js";
// 메인 페이지

// 페이지 로딩 후 처음
window.onload = function () {
  // 카테고리 초기화
  initCategory();
  // 최근 방문 목록
  recentCards();
  // 로컬 스토리지 통해 최근 검색 목록 불러오기
  recentSearch();
  // 인기 상품 및 재입고 상품 불러오기
  indexPageCards();
  // 장바구니 리셋
  resetBasket();
};

// 최근 방문 카드 불러오기
function recentCards() {
  var list = callLS("cards");
  if (list.length == 0) {
    $("#main_cont_1").css("display", "block");
    $("#main_cont_2").css("display", "none");
  } else {
    $("#main_cont_1").css("display", "none");
    $("#main_cont_2").css("display", "block");
    var obj = callCardsRecent(list);
    $("#main_cont_2 > .card_slot").css("display", "none");
    for (var i = 0; i < obj.length; i++) {
      var dir = "#main_cont_2 > .card_slot:eq(" + i + ")";
      $(dir).css("display", "block");
      $(dir).attr("href", "/detail?value=" + encodeURI(obj[i].name, "utf-8"));
      $(dir + " > img").attr("src", obj[i].img);
      $(dir + " .card_name").html(obj[i].name);
      $(dir + " .card_price").html(addComma(obj[i].low));
      if (!obj[i].pop) {
        $(dir + " #img1").css("display", "none");
      }
      if (!obj[i].stock) {
        $(dir + " #img2").css("display", "none");
      }
    }
  }
}

// 인기 상품 + 재입고 상품
// 무조건 6개씩은 꼭 받아야함..
function indexPageCards() {
  var list = callCardsIndex();
  $("#main_cont_3 > .card_slot").css("display", "none");
  $("#main_cont_4 > .card_slot").css("display", "none");
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < list[i].length; j++) {
      var dir = "#main_cont_" + (i + 3) + "> .card_slot:eq(" + j + ")";
      $(dir).css("display", "block");
      $(dir).attr(
        "href",
        "/detail?value=" + encodeURI(list[i][j].name, "utf-8")
      );
      $(dir + " > img").attr("src", list[i][j].img);
      $(dir + " .card_name").html(list[i][j].name);
      $(dir + " .card_price").html(addComma(list[i][j].low));
      if (!list[i][j].pop) {
        $(dir + " #img1").css("display", "none");
      }
      if (!list[i][j].stock) {
        $(dir + " #img2").css("display", "none");
      }
    }
  }
}
