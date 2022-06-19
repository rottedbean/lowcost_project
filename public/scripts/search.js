// 변수 선언
var searchOption = 10; // 검색 개수
var pageStatus = [0, 1] // 현재 페이지 순
var maxPage = 1 // 페이지 최대값
var value = "";
var list = []; // 검색 결과 값을 모두 저장

window.onload = function(){
    // 카테고리 초기화
    initCategory();
    // 로컬 스토리지 통해 최근 검색 목록 불러오기
    recentSearch();
    // 파라미터값 가져오기
    value = getPara();
    // 검색 목록 불러오기
    // 차후에 여기 변경
    list = callCardsSearch(tempSearch())
    // 검색 값 표시
    searchPageReset();
    // 장바구니 리셋
    resetBasket();
}

// 검색 페이지 초기화
function searchPageReset(){
    var leng = list.length;
    maxPage = Math.floor(list.length / searchOption) + 1;
    $('input[name=title]').val(value);
    $("#current_search_result").html("' " + value + " '");
    $('#current_search_text').html(`${addComma(list.length)}개의 검색결과`);
    $(".search_list_box").css("display", "none");
    $('.search_list_line').css("display", "none");
    $('.search_list_page_link').css('display', 'none');
    $('.search_list_page_line').css('display', 'none');
    // 검색값 변환
    if (leng == 0){ // 검색 반환 값이 0개일 경우
        $("#empty_search_page").css("display", "block");
    }
    else { // 검색 반환 값이 있는 경우
        $('.search_list_line:eq(0)').css("display", "block");
        // 검색값 표시
        for (var i = 0; i < searchOption; i++){
            var page = (((pageStatus[1]) - 1) * searchOption) + i;
            if (list[page] != undefined){ // 값이 있으면
                var obj = list[page];
                var dir = '.search_list_box:eq(' + i + ')';
                $(dir).css("display", "flex");
                $(dir).attr('href', '/detail?value=' + obj.cardname);
                $(dir + ' img').attr("src", obj.img);
                $(dir + ' .search_list_name').text(obj.cardname);
                $(dir + ' .search_list_price').text(addComma(obj.low));
                $(dir + ' .search_list_count').text(obj.stat);
                $('.search_list_line:eq(' + (i + 1) + ')').css("display", "block");
            }
        }

        // 페이지 표시
        var linkDir = '.search_list_page_link:eq(';
        var lineDir = '.search_list_page_line:eq(';
        $(".search_list_page_line:eq(0)").css("display", "block");
        for (var i = 0; i < 10; i++){
            if ((pageStatus[0] * 10) + (i + 1) <= maxPage){
                $(linkDir + i + ')').css("display", "block");
                $(linkDir + i + ")").html((pageStatus[0] * 10) + (i + 1));
                $(linkDir + i + ')').attr("href", 'javascript:void(0);');
                $(linkDir + i + ')').attr("onclick", 'pageChange(' + (i + 1) + ')');
                $(lineDir + (i + 1) + ')').css("display", "block");
            }
        }

        // 현재 페이지 표시
        $('.search_now_page').removeClass("search_now_page");
        $(linkDir + (pageStatus[1] - 1) + ')').addClass("search_now_page");
        $(".search_now_page").removeAttr('href');
        $(".search_now_page").removeAttr('onclick');

        // 페이지 변경 화살표
        $("#right_arrow").css("display", "none");
        $("#left_arrow").css("display", "none");
        if (pageStatus[0] != 0){
            $("#left_arrow").css("display", "block");
        }
        if (pageStatus[0] < Math.floor((maxPage - 1) / 10)){
            $("#right_arrow").css("display", "block");
        }
    }

    
};

// 페이지 변경 함수
function pageChange(i){
    pageStatus[1] = i;
    searchPageReset();
    $('html, body').stop().animate({scrollTop: 0}, 300);
    $("#search_option").css('top', '0px');
}

// 페이지 화살표
function pageLayerChange(dir){
    // 왼쪽 버튼, 마이너스
    if (dir == 0){ 
        pageStatus[0] -= 1; 
        pageStatus[1] = 10;
    }
    // 오른쪽 버튼, 플러스
    else{ 
        pageStatus[0] += 1;
        pageStatus[1] = 1; 
    }
    searchPageReset()
    $('html, body').stop().animate({scrollTop: 0}, 300);
    $("#search_option").css('top', '0px');
}


// 인덱스 반환용 임시 검색
function tempSearch(){
    if (value == "참치"){
        return ["고추참치", "참치마요", "동원참치"];
    }
    if (value == "김치"){
        return ["배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치",
                "배추김치", "파김치", "총각김치", "김치라면", "김치김밥", "핵김치"];
    }
    else{
        return [];
    }
}

// 옵션 따라다니기
$(document).ready(function(){
    var currentPosition = parseInt($("#search_option").css("top"));
    $(window).scroll(function() {
        var position = $(window).scrollTop();
        if (position > 200){
            $("#search_option").stop().animate({"top":position+currentPosition+(-200)+"px"},700); 
        }
        else{
            $("#search_option").stop().animate({"top":0+"px"},1000); 
        }
    }); 
});