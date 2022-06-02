// 순서
// 빈 페이지 로드 => 서버에서 필요한 인덱스 리스트 호출
// => 캐시 로딩 => 인덱스 값 카드 호출 및 페이지 로딩
// idx 검색 함수 이름 callIdx로 일단 통일
// callIdx에서 받는 인자 순서 정하기


window.onload = function(){
    initCategory();
    // 로컬 스토리지 로드를 통한 최근 검색 목록
    // 로컬스토리지 'name'가 비어있을 경우
    if(localStorage.getItem('name') == null){
        $("#main_cont_1").css("display", "block");
        $("#main_cont_2").css("display", "none");
    }
    // 로컬 스토리지 'name'가 있을 경우
    else{
        $("#main_cont_1").css("display", "none");
        $("#main_cont_2").css("display", "block");
        //'name'의 인덱스 값에 차례대로 접근
        var lis = JSON.parse(localStorage.getItem("name"))
        for(var i = 0; i < lis.length; i++){
            var dir = "#main_cont_2 > .card_slot:eq(" + i + ")";
            $(dir).css("display", "block");
            var temp = callIdx(lis[i]);
            $(dir).attr("href", temp.link);
            $(dir + " > img").attr("src", temp.img_link);
            $(dir + " .card_name").html(temp.name);
            $(dir + " .card_price").html(addComma(temp.low));
            if (!temp.pop){
                $(dir + " #img1").css("display", "none");
            }
            if (!temp.stock){
                $(dir + " #img2").css("display", "none");
            }
        }
    }

    // 서버에서 인기 상품 리스트 호출
    var popList = callPopList()
    for(var i = 0; i < popList.length; i++){
        var dir = "#main_cont_3 > .card_slot:eq(" + i + ")";
        $(dir).css("display", "block");
        var temp = callIdx(popList[i]);
        $(dir).attr("href", temp.link);
        $(dir + " > img").attr("src", temp.img_link);
        $(dir + " .card_name").html(temp.name);
        $(dir + " .card_price").html(addComma(temp.low));
        if (!temp.pop){
            $(dir + " #img1").css("display", "none");
        }
        if (!temp.stock){
            $(dir + " #img2").css("display", "none");
        }
    }

    // 로컬 스토리지 통해 최근 검색 목록 불러오기
    recentSearch();
    resetBasket();
};


function callPopList(){
    return [1, 2, 3, 4, 5, 6];
}