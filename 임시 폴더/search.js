// 페이지 10개 넘어가면 1~10, 11~20 되게 하기
// 변수
var value = '';
var randomString = [
    "승리하면 조금 배울 수 있고 패배하면 모든 것을 배울 수 있다 -매튜슨-",
    "두려움 때문에 갖는 존경심만큼 비열한 것은 없다 -카뮈-",
    "당신이 잘 하는 일이라면 무엇이나 행복에 도움이 된다 -러셀-",
    "스스로를 신뢰하는 사람만이 다른 사람들에게 성실할 수 있다 -에릭 프롬-",
    "과거를 지배하는 자가 마래를 지배하며 현재를 지배하는 자가 과거를 지배한다 -조지 오웰-",
    "노동은 세개의 큰 악, 즉, 지루함, 부도덕, 그리고 가난을 제거한다 -괴테-",
    "힘 있을 때 친구는 친구가 아니다 -헨리 애덤스-",
    "배움이 없는 자유는 언제나 위험하며 자유가 없는 배움은 언제나 헛된 일이다 -존 F. 케네디-",
    "무례한 사람의 행위는 내 행실을 바로 잡게 해주는 스승이다 -공자-",
    "군자가 예절이 없으면 역적이 되고, 소인이 예절이 없으면 도적이 된다 -명심보감-"
]
// 검색페이지용 글로벌 변수
var searchOption = [1, 0, 10, 1];
var searchListChk = [true, false];
var list = new Array();

// 페이지 흐름
window.onload = function(){
    // 카테고리 초기화
    initCategory();
    // 파라미터에서 검색어 가져오기
    value = getPara();
    $('input[name=title]').val(value);
    $("#current_search_result").html("' " + value + " '");
    // 검색어를 통해 해당 인덱스 DB에서 호출
    idxConv(callSearchResult(value));
    $('#current_search_text').html(`${addComma(list.length)}개의 검색결과`);
    searchListReset();
    recentSearch();
    resetBasket();
};

// 파라미터 값 가져오기
function getPara(){
    const url = new URL(window.location.href);
    const urlParams = url.searchParams;
    value = urlParams.get('value');
    return value;
}

// 인덱스 => 오브젝트 변환
function idxConv(idxList){
    for (var i = 0; i < idxList.length; i++){
        list.push(callIdx(idxList[i]));
    }
}

// 인덱스 반환용 임시 검색
function callSearchResult(value){
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



//검색 페이지 리셋
function searchListReset(){
    if (list.length != 0){
        $(".search_list_line:eq(0)").css("display", "block");
        // 페이지 개수 계산
        var pageNum = Math.floor((list.length - 1) / searchOption[2]) + 1;
        var pageLeng = 0;
        var pageStart = (searchOption[0] - 1) * 10;
        var min = 0;
        var leng = 0;
        // 한 페이지 안에 쌉가능
        if (pageNum == 1){
            min = 0;
            leng = list.length;
            pageLeng = 1;
        }
        // 한 페이지 안에는 안되는데 10페이지 안에는 쌉가능
        else if(pageNum <= 10){
            min = (searchOption[1] * searchOption[2]);
            if (pageNum == (searchOption[1] + 1)){
                leng = list.length - (searchOption[2] * searchOption[1]);
            }
            else{
                leng = searchOption[2];
            }
            pageLeng = pageNum;
        }
        // 검색 결과가 10페이지가 넘음;
        else {
            // 페이지 개수 셀라기
            var pageLayerNum = Math.floor(pageNum / 10) + 1;
            // 페이지 레이어가 1이면? 왼쪽 못감 ㅎㅎ
            if (searchOption[0] == 1){
                min = (searchOption[1] * searchOption[2]);
                leng = searchOption[2];
                pageLeng = 10;
                $("#right_arrow").css("display", "block");
                $("#left_arrow").css("display", "none");
            }
            // 페이지 레이어가 마지막이면? 오른쪽 못감 ㅎㅎ
            else if(searchOption[0] == pageLayerNum){
                min = ((searchOption[0] - 1) * (10 * searchOption[2])) + (searchOption[1] * searchOption[2]);
                if (pageNum == ((searchOption[1] + 1) + pageStart)){
                    leng = list.length - (pageStart * 10) - (searchOption[2] * searchOption[1]);
                }
                else{
                    leng = searchOption[2];
                }
                pageLeng = pageNum - pageStart;
                $("#right_arrow").css("display", "none");
                $("#left_arrow").css("display", "block");
            }
            else{
                $("#right_arrow").css("display", "block");
                $("#left_arrow").css("display", "block");
                min = ((searchOption[0] - 1) * (10 * searchOption[2])) + (searchOption[1] * searchOption[2]);
                leng = searchOption[2];
                pageLeng = 10;
            }
        }
        //검색 화면 바꾸기
        for (var i = 0; i < searchOption[2]; i++){
            var dir = '.search_list_box:eq(' + i + ')';
            var rand = Math.floor(Math.random() * 10);
            if (i < leng){
                $(dir).css("display", "flex");
                $(dir).attr('href', list[min + i].link);
                $(dir + ' img').attr("src", list[min + i].img);
                $(dir + ' .search_list_name').text(list[min + i]['name']);
                $(dir + ' .search_list_price').text(addComma(list[min + i]['low']));
                $(dir + ' .search_list_count').text(randomString[rand]);
                $('.search_list_line:eq(' + (i + 1) + ')').css("display", "block");
            }
            else{
                $(dir).css("display", "none");
                $('.search_list_line:eq(' + (i + 1) + ')').css("display", "none");
            }
        }
        //페이지 목록 바꾸기
        var linkDir = '.search_list_page_link:eq(';
        var lineDir = '.search_list_page_line:eq(';
        var pageStart = (searchOption[0] - 1) * 10;
        $(".search_list_page_line:eq(0)").css("display", "block");
        for (var i = 0; i < 10; i++){
            if (i < pageLeng){
                $(linkDir + i + ")").html(pageStart + i + 1);
                $(linkDir + i + ')').css("display", "block");
                $(linkDir + i + ')').attr("href", 'javascript:void(0);');
                $(linkDir + i + ')').attr("onclick", 'pageChange(' + i + ')');
                $(lineDir + (i + 1) + ')').css("display", "block");
            }
            else{
                $(linkDir + i + ')').css("display", "none");
                $(lineDir + (i + 1) + ')').css("display", "none");
            }
        }
        //현재 페이지 표시
        $('.search_now_page').removeClass("search_now_page");
        $(linkDir + searchOption[1] + ')').addClass("search_now_page");
        $(".search_now_page").removeAttr('href');
        $(".search_now_page").removeAttr('onclick');
    }

    else{
        $(".search_list_line:eq(0)").css("display", "none");
        $("#empty_search_page").css("display", "block");
        $(".search_list_box").css("display", "none");
    }
};


// 페이지값 변경하면
function pageChange(i){
    searchOption[1] = i;
    searchListReset();
    $('html, body').stop().animate({scrollTop: 0}, 300);
    $("#search_option").css('top', '0px');
}

// 페이지 레이어 변경
function pageLayerChange(dir){
    // 왼쪽 버튼, 마이너스
    if (dir == 0){ 
        searchOption[0] -= 1; 
        searchOption[1] = 9;
    }
    // 오른쪽 버튼, 플러스
    else{ 
        searchOption[0] += 1;
        searchOption[1] = 0; 
    }
    searchListReset()
    $('html, body').stop().animate({scrollTop: 0}, 300);
    $("#search_option").css('top', '0px');
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

// 옵션 값 변경
$(function(){
    $('select').on("change", function(){
        searchOption[3] = $('#option_sort option:selected').val();
        searchOption[2] = $('#option_count option:selected').val();
        searchOption[1] = 0;
        searchOption[0] = 1;
        searchListReset();
    })
    $('input[name=option]').on("change", function(){
        $('input[name=option]').each(function(idx){
            searchListChk[idx] = $(this).is(":checked");
        });
    });
});