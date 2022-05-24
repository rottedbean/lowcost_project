// 순서
// 빈 페이지 로드 => 서버에서 필요한 인덱스 리스트 호출
// => 캐시 로딩 => 인덱스 값 카드 호출 및 페이지 로딩
// idx 검색 함수 이름 callIdx로 일단 통일
// callIdx에서 받는 인자 순서 정하기


window.onload = function(){
    //localStorage.setItem("name", JSON.stringify([123, 456, 789]));
    initCategory();
    // 로컬 스토리지 로드를 통한 최근 검색 목록
    // 로컬스토리지 'name'가 비어있을 경우
    if(localStorage.getItem('name') == null){
        $("#main_cont_1").css("display", "block");
        $("#main_cont_2").css("display", "none");
        console.log("!");
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
            $(dir + " .card_price").html(addComma(temp.price));
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
        $(dir + " .card_price").html(addComma(temp.price));
        if (!temp.pop){
            $(dir + " #img1").css("display", "none");
        }
        if (!temp.stock){
            $(dir + " #img2").css("display", "none");
        }
    }
};


function callPopList(){
    return [1, 2, 3, 4, 5, 6];
}
//임시 더미 함수들
function callIdx(idx){
    if (idx == 123){
        const res = {
            name : "가나다",
            price : 76400,
            link : "#",
            img_link : "",
            pop : true,
            stock : false
        };
        return res
    }
    else if (idx == 456){
        const res = {
            name : "abcdef",
            price : 2700,
            link : "#",
            img_link : "",
            pop : true,
            stock : true
        };
        return res
    }
    else if (idx == 789){
        const res = {
            name : "789",
            price : 5088690,
            link : "#",
            img_link : "",
            pop : true,
            stock : true
        };
        return res
    }
    else if (idx == 1){
        const res = {
            name : "1",
            price : 111111,
            link : "#",
            img_link : "",
            pop : true,
            stock : true
        };
        return res
    }
    else if (idx == 2){
        const res = {
            name : "2",
            price : 2,
            link : "#",
            img_link : "",
            pop : true,
            stock : true
        };
        return res
    }
    else if (idx == 3){
        const res = {
            name : "3",
            price : 333,
            link : "#",
            img_link : "",
            pop : true,
            stock : true
        };
        return res
    }
    else if (idx == 4){
        const res = {
            name : "4",
            price : 4444,
            link : "#",
            img_link : "",
            pop : true,
            stock : true
        };
        return res
    }
    else if (idx == 5){
        const res = {
            name : "5",
            price : 55,
            link : "#",
            img_link : "",
            pop : true,
            stock : true
        };
        return res
    }
    else if (idx == 6){
        const res = {
            name : "6",
            price : 5088690,
            link : "#",
            img_link : "",
            pop : true,
            stock : true
        };
        return res
    }
}