// 변수 선언
var searchOption = [10]; // 검색 개수
var pageStatus = [0, 1] // 페이지 페이지, 현재 페이지 순
var value = "";
var allList = [];
var list = [];

// 파라미터 값 가져오고 리스트 생성
function getPara(){
    const url = new URL(window.location.href);
    const urlParams = url.searchParams;
    value = urlParams.get('value');
    allList = callCardsSearch(tempSearch());
}

// 검색 페이지 초기화
function searchPageReset(){
    $('input[name=title]').val(value);
    $("#current_search_result").html("' " + value + " '");
    if (allList.length == 0){
        $(".search_list_line:eq(0)").css("display", "none");
        $("#empty_search_page").css("display", "block");
        $(".search_list_box").css("display", "none");
    }
    else if (allList.length <= searchOption[0]) {
        list = allList;
    }
    else {

    }
};

// 

// 인덱스 반환용 임시 검색
function tempSearch(){
    if (value == "참치"){
        return ["고추참치", "참치마요", "동원참치"];
    }
    if (value == "김치"){
        return ["배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치"];
    }
    else{
        return [];
    }
}