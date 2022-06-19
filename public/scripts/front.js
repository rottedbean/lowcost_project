DBtoFront = require("../../lib/db/DBtoFront");
// 나중에 할 일 '차후' 라고 검색
var is_basket = false;

// ========================================================
// ======================= 카테고리 =======================
// 카테고리 드롭다운
$(function () {
  $("#category2").mouseover(function () {
    $("#category").css("width", "582px");
  });
  $("#category1 > .cate_box_li").mouseover(function () {
    $("#category1 > .cate_box_li").removeClass("cate_box_li_selected");
    $(this).addClass("cate_box_li_selected");
    $("#category2 > .cate_box_li").removeClass("cate_box_li_selected");
  });
  $("#category2 > .cate_box_li").mouseover(function () {
    $("#category2 > .cate_box_li").removeClass("cate_box_li_selected");
    $(this).addClass("cate_box_li_selected");
    $("#category3 > .cate_box_li").removeClass("cate_box_li_selected");
  });
  $("#category3 > .cate_box_li").mouseover(function () {
    $("#category3 > .cate_box_li").removeClass("cate_box_li_selected");
    $(this).addClass("cate_box_li_selected");
  });
});

// 카테고리 초기화
function initCategory() {
  category = callCategory();
  for (var i = 0; i < 10; i++) {
    var dir = "#category1 li:eq(" + i + ")";
    if (i < category[0].length) {
      $(dir).html(category[0][i]);
    } else {
      $(dir).css("display", "none");
    }
  }
  for (var i = 0; i < 10; i++) {
    var dir = "#category2 li:eq(" + i + ")";
    if (i < category[1][0].length) {
      $(dir).html(category[1][0][i]);
    } else {
      $(dir).css("display", "none");
    }
  }
}

// 카테고리 바꾸기
function setCategory(a, b) {
  if (a != -1) {
    for (var i = 0; i < 10; i++) {
      var dir = "#category2 li:eq(" + i + ")";
      if (i < category[1][a].length) {
        $(dir).html(category[1][a][i]);
        $(dir).css("display", "block");
      } else {
        $(dir).css("display", "none");
      }
    }
    page2 = a;
  }
  if (b != -1) {
    for (var i = 0; i < 10; i++) {
      var dir = "#category3 li:eq(" + i + ")";
      if (i < category[2][page2][b].length) {
        $(dir).html(category[2][page2][b][i]);
        $(dir).css("display", "block");
      } else {
        $(dir).css("display", "none");
      }
    }
  }
}

// 카테고리 임시
// 차후 이 함수로 카테고리 값 가져오기
function callCategory() {
  return {
    0: ["ㄱ", "ㄴ", "ㄷ"],
    1: {
      0: ["가", "갸", "거", "겨"],
      1: ["나", "냐", "너"],
      2: ["다", "댜", "더", "뎌", "도"],
    },
    2: {
      0: {
        0: ["각", "간", "갇", "갈", "감"],
        1: ["갹", "갼", "갿", "걀"],
        2: ["걱", "건", "걷", "걸", "검", "겁"],
        3: ["격", "견", "겯", "결", "겸"],
      },
      1: {
        0: ["낙", "난", "낟", "날"],
        1: ["냑", "냔"],
        2: ["넉", "넌", "넏", "널", "넘"],
      },
      2: {
        0: ["다1"],
        1: ["다2"],
        2: ["다3"],
        3: ["다4"],
        4: ["다5"],
      },
    },
  };
}

// ========================================================
// ====================== 로컬 저장소 ======================

// 로컬 스토리지 불러오기
function callLS(stgName) {
  var localValue = localStorage.getItem(stgName);
  if (localValue == "") {
    return [];
  } else {
    return localValue.split(",");
  }
}

// 로컬 스토리지 값 추가
function addLS(stgName, value) {
  // 최근 검색 목록, 최근 방문 목록
  var stgLong = 0;
  if (stgName == "recSer") {
    stgLong = 4;
  } else {
    stgLong = 6;
  }
  var localValue = localStorage.getItem(stgName);
  if (localValue == null) {
    localStorage.setItem(stgName, value);
  } else {
    localValue = localValue.split(",");
    if (localValue.includes(value)) {
      localValue.splice(localValue.indexOf(value), 1);
      localValue.unshift(value);
    } else {
      localValue.unshift(value);
      if (localValue.length > stgLong) {
        localValue.pop();
      }
    }
    localStorage.setItem(stgName, arrToStr(localValue));
  }
}

// 로컬 스토리지 값 제거
function subLS(num) {
  var localValue = localStorage.getItem(stgName).split(",");
  localValue.splice(num, 1);
  localStorage.setItem(stgName, arrToStr(localValue));
}

// 로컬 스토리지 초기화
function reset(stgName) {
  // 전체 초기화용
  if (stgName == "all") {
    localStorage.clear();
    location.reload();
  } else {
    localStorage.setItem(stgName, "");
  }
}

// ========================================================
// ======================= 장바구니 =======================

// 장바구니 열고닫기
function basket() {
  if (is_basket) {
    $("#basket").css("top", "820px");
    $("#curtain").css("background-color", "rgba(255,255,255,0)");
    $("#basket_button_img").attr("src", "images/option_up.png");
    is_basket = false;
  } else {
    $("#basket").css("top", "350px");
    $("#curtain").css("background-color", "rgba(100,100,100,0.5)");
    $("#basket_button_img").attr("src", "images/option_down.png");
    is_basket = true;
  }
}

// 장바구니 초기화
function resetBasket() {
  var nameList = callLS("basket");
  var cnt = {
    name: [],
    sum: [],
  };
  var obj = callCardsBasket(nameList);
  $(".basket_card_slot").css("display", "none");
  $(".receipt_list_one").css("display", "none");
  // 카드 파트 세팅
  for (var i = 0; i < obj.length; i++) {
    var dir = ".basket_card_slot:eq(" + i + ")";
    $(dir).css("display", "block");
    $(dir + " img").attr("src", obj[i].img);
    $(dir + " .basket_card_name").html(obj[i].name);
    $(dir + " .basket_card_price").html(addComma(obj[i].low));
    $(dir + " .basket_card_box").attr(
      "href",
      "/detail?value=" + encodeURI(obj[i].name, "utf-8")
    );

    if (cnt.name.includes(obj[i].name)) {
      cnt.sum[obj[i].name.indexOf(obj[i].name)][0] += 1;
    } else {
      cnt.name.push(obj[i].name);
      cnt.sum.push([1, obj[i].low]);
    }
  }
  //영수증 파트 세팅
  var sum = [0, 0];
  for (var i = 0; i < cnt.name.length; i++) {
    var dir = ".receipt_list_one:eq(" + i + ")";
    $(dir).css("display", "flex");
    $(dir + " .receipt_list_name").text(cnt.name[i]);
    $(dir + " .receipt_list_price").text(`₩ ${addComma(cnt.sum[i][1])}`);
    $(dir + " .receipt_list_calc").text(
      `${addComma(cnt.sum[i][1])} x ${cnt.sum[i][0]} ea`
    );
    $(dir + " .receipt_list_total").text(
      `₩ ${addComma(cnt.sum[i][1] * cnt.sum[i][0])}`
    );
    sum[0] += cnt.sum[i][1] * cnt.sum[i][0];
    sum[1] += cnt.sum[i][0];
  }
  $("#receipt_total_count").text(`총 ${sum[1]}개`);
  $("#receipt_total_sum").text(`₩ ${addComma(sum[0])}`);
}

// 장바구니 추가
function addBasket(name) {
  var nameList = callLS("basket");
  nameList.unshift(name);
  localStorage.setItem("basket", arrToStr(nameList));
  resetBasket();
}

// 장바구니 삭제
function removeBasket(i) {
  //인자는 index가 아니라 몇번째인지
  var nameList = callLS("basket");
  nameList.splice(i, 1);
  localStorage.setItem("basket", arrToStr(nameList));
  resetBasket();
}

// ========================================================
// ========================= 검색 =========================

// 최근 검색 목록
function recentSearch() {
  var recSer = callLS("recSer");
  $(".recent_history ~ a").css("display", "none");
  for (var i = 0; i < recSer.length; i++) {
    dir = ".recent_history ~ a:eq(" + i + ")";
    $(dir).css("display", "inline-block");
    $(dir).html(recSer[i]);
    $(dir).attr("href", "/search?value=" + encodeURI(recSer[i], "utf-8"));
  }
}

// 검색
function searchFunc() {
  var value = $("input[name=title]").val();
  var url = "/search?value=";
  addLS("recSer", value);
  location.href = url + encodeURI(value, "utf-8");
}

// ========================================================
// ======================= 기능 함수 =======================

// 배열 => 문자열
function arrToStr(arr) {
  if (arr.length == 0) {
    return "";
  } else {
    var result = arr[0];
    for (var i = 1; i < arr.length; i++) {
      result += "," + arr[i];
    }
    return result;
  }
}

// 1000단위 콤마찍기
function addComma(value) {
  temp = String(value);
  temp = temp.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return temp;
}

// 파라미터 값 가져오기
function getPara() {
  const url = new URL(window.location.href);
  const urlParams = url.searchParams;
  value = urlParams.get("value");
  return value;
}

// 임시 더미 불러오기
// 차후에는 이 시점에서 DB가 알아서 해줄 예정
// 장바구니
function callCardsBasket(list) {
  var result = [];
  for (var i = 0; i < list.length; i++) {
    result.push(callCard(list[i]));
  }
  return result;
}

// 최근 방문 목록
function callCardsRecent(list) {
  var result = [];
  for (var i = 0; i < list.length; i++) {
    result.push(callCard(list[i]));
  }
  return result;
}

// 인덱스 페이지
function callCardsIndex() {
  var result = [];
  popcardlist = [];

  var popname = getPopcardname();
  for (var i = 0; i < 2; i++) {
    popcardlist.push(callCard(popname[i]));
    result.push(popcardlist);
  }

  restocklist = DBtoFront.getRestockcard();
  result.push(restocklist);

  return result;
}

// 검색 페이지
function callCardsSearch(keyword) {
  var result = DBtoFront.searchProcess(keyword);
  return result;
}

// 상세 페이지
function callCardsDetail(cardname) {
  const res = DBtoFront.getEachcardFromDB(cardname);
  return res;
}

// 임시 더미들
function callCard(cardname) {
  const res = DBtoFront.getDataFromDB(cardname);
  return res;
}
