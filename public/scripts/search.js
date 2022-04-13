// 변수
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
var searchListCount = 10;
var searchListSort = 1;
var searchListChk = [true, false];
var searchPage = 1;
var list = new Array();
var tempNameList = ['참치', '꽁치', '김치', '멸치', '삼치', '한치', '명치', '국치', '그치', '아치',
    '홍일동', '홍이동', '홍삼동', '홍사동', '홍오동', '홍육동', '홍칠동', '홍팔동', '홍구동', '홍영동',
    '박지성', '손흥민', '류현진', '사사키 로키', '오타니 쇼헤이', '임요환', '페이커', '이천수', '강백호', '끝나간다', '마지막']
for(var i = 0; i < 31; i++){
    list.push(['#', tempNameList[i], (i+1)*100]);
}

//첫 호출
window.onload = function(){
    //리스트 받아오는 기능 추가
    searchListReset();
};

// 옵션 값 변경
$(function(){
    $('select').on("change", function(){
        searchListSort = $('#option_sort option:selected').val();
        searchListCount = $('#option_count option:selected').val();
        searchPage = 1;
        searchListReset();
    })
    $('input[name=option]').on("change", function(){
        $('input[name=option]').each(function(idx){
            searchListChk[idx] = $(this).is(":checked");
        });
    });
});

// 페이지값 변경하면
function pageChange(i){
    searchPage = i;
    searchListReset();
    $('html, body').stop().animate({scrollTop: 0}, 300);
    $("#search_option").css('top', '0px');
}

//검색 페이지 리셋
function searchListReset(){
    //리스트 내부는 img_link, name, price 순으로
    $('.search_list_box').css("display", "none");
    $('.search_list_line').css("display", "none");
    $('.search_list_page_line').css("display", "none");
    $('.search_list_page_link').css("display", "none");
    if (list.length != 0){
        $('.search_list_line:eq(0)').css("display", "block");
    }
    var min = 0;
    var leng = 0;
    // 목록 개수가 한 페이지에 보일 목록보다 많으면
    if (list.length > searchListCount){
        min = ((searchPage - 1) * searchListCount);
        // 이번 페이지에 보일 목록 개수
        if (searchListCount < (list.length - (searchListCount * (searchPage - 1)))){
            leng = searchListCount;
        }
        else{
            leng = list.length - (searchListCount * (searchPage - 1));
        }
        // 페이지 번호 아 ㄹㅇ 빡세네
        var temp = Math.floor(list.length / searchListCount) + 1;
        $('.search_list_page_line:eq(0)').css("display", "block");
        for(var i = 0; i < temp; i++){
            $('.search_list_page_link:eq(' + i + ')').css("display", "block");
            $('.search_list_page_link:eq(' + i + ')').attr("href", 'javascript:void(0);');
            $('.search_list_page_link:eq(' + i + ')').attr("onclick", 'pageChange(' + (i + 1) + ')');
            $('.search_list_page_line:eq(' + (i + 1) + ')').css("display", "block");
        }
        $('.search_now_page').removeClass("search_now_page");
        $('.search_list_page_link:eq(' + (searchPage - 1) + ')').addClass("search_now_page");
    }
    // 목록 개수가 적으면
    else{
        min = 0;
        leng = list.length;
    }
    //검색 화면 바꾸기
    for (var i = 0; i < leng; i++){
        var rand = Math.floor(Math.random() * 10);
        $('.search_list_box:eq(' + i + ')').css("display", "flex");
        $('.search_list_box:eq(' + i + ') img').attr("src", list[min + i][0]);
        $('.search_list_box:eq(' + i + ') .search_list_name').text(list[min + i][1]);
        $('.search_list_box:eq(' + i + ') .search_list_price').text(addComma(list[min + i][2]));
        $('.search_list_box:eq(' + i + ') .search_list_count').text(randomString[rand]);
        $('.search_list_line:eq(' + (i + 1) + ')').css("display", "block");
    }
};

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

