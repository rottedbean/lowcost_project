// callMain() 나중에 필요없어지면 지우기

window.onload = function(){
    // 카테고리 초기화
    initCategory();
    // 최근 방문 목록
    recentCards();
    // 로컬 스토리지 통해 최근 검색 목록 불러오기
    recentSearch();
    // 인기 상품 및 재입고 상품 불러오기
    mainPageCards();
    // 장바구니 리셋
    resetBasket();
};

// 최근 방문 목록 ==========================================
function recentCards(){
    var lis = callLocStg('name');
    // 로컬 스토리지 'name'가 비어있을 경우
    if(lis == null){
        $("#main_cont_1").css("display", "block");
        $("#main_cont_2").css("display", "none");
    }
    // 로컬 스토리지 'name'가 있을 경우
    else{
        $("#main_cont_1").css("display", "none");
        $("#main_cont_2").css("display", "block");
        var obj = callMain(lis);
        //'name'의 인덱스 값에 차례대로 접근
        for(var i = 0; i < obj.length; i++){
            // name, img, low, pop, stock
            var dir = "#main_cont_2 > .card_slot:eq(" + i + ")";
            $(dir).css("display", "block");
            $(dir).attr("href", "/detail?value=" + encodeURI(obj[i].name, "utf-8"));
            $(dir + " > img").attr("src", obj[i].img);
            $(dir + " .card_name").html(obj[i].name);
            $(dir + " .card_price").html(addComma(obj[i].low));
            if (!obj[i].pop){
                $(dir + " #img1").css("display", "none");
            }
            if (!obj[i].stock){
                $(dir + " #img2").css("display", "none");
            }
        }
    }
}

// 인기상품 ======================================================
// 나중에 병합하면 바꿔야함...
function mainPageCards(){
    // callMainList 함수 돌리면 오브젝트 2중 배열 반환
    // var obj = callMainList();
    var popList = callMainList();
    for (var v = 0; v < 2; v++){
        var obj = callMain(popList[v].split(','));
        for(var i = 0; i < obj.length; i++){
            var dir = "#main_cont_" + (v + 3)+ "> .card_slot:eq(" + i + ")";
            $(dir).css("display", "block");
            $(dir).attr("href", "/detail?value=" + encodeURI(obj[i].name, "utf-8"));
            $(dir + " > img").attr("src", obj[i].img);
            $(dir + " .card_name").html(obj[i].name);
            $(dir + " .card_price").html(addComma(obj[i].low));
            if (!obj[i].pop){
                $(dir + " #img1").css("display", "none");
            }
            if (!obj[i].stock){
                $(dir + " #img2").css("display", "none");
            }
        }
    }
}

// 재입고 상품 =====================================


function callMainList(){
    return ['고추참치,참치마요,핵김치,총각김치,배추김치,파김치', '고추참치,참치마요,핵김치,총각김치,배추김치,파김치'];
}