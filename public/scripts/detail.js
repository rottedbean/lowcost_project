//이름 같은 카드 목록 불러오는 함수 작성
//메인 카드 정보 불러오는 함수 작성
//지금은 임시로 사용중

//220602
//저거 상세 페이지 가격 부분 링크 위해서 사이트랑 링크 걸 방법 연구

var idx = 0;
var mainCard = {};

var cardList = {
    name : new Array(),
    imgLink : new Array(),
    code : new Array(),
    stock : new Array()
};

window.onload = function(){
    initCategory();
    idx = getPara();
    addLocalStorage(idx);
    mainCard = callIdx(idx);
    recentSearch();
    setMainCard();
    temp_card(7);
    same_card();
};


// 파라미터 값 가져오기
function getPara(){
    const url = new URL(window.location.href);
    const urlParams = url.searchParams;
    value = urlParams.get('idx');
    return value;
}

// 로컬에 저장 
function addLocalStorage(idx){
    // localStorage.setItem("name", null);
    var local = JSON.parse(localStorage.getItem('name'));
    if (local == null){ // 로컬 스토리지 비어있음
        localStorage.setItem("name", JSON.stringify([idx]));
    }
    else{
        if (local.includes(idx)){ //해당 요소가 배열 안에 있으면?
            if (local.indexOf(idx) != 0){
                local.splice(local.indexOf(idx), 1);
                local.unshift(idx);
                localStorage.setItem("name", JSON.stringify(local));
            }
        }
        else{ //해당 요소가 배열안에 없으면?
            if (local.length < 6){ //로컬 스토리지 0 < 로컬 < 6
                local.unshift(idx);
                localStorage.setItem("name", JSON.stringify(local));
            }
            else { //로컬 스토리지 6 이상
                local.unshift(idx);
                local.pop();
                localStorage.setItem("name", JSON.stringify(local));
            }
        }
        
    }
    resetBasket();
}

// 메인 카드 페이지 생성
function setMainCard(){
    $("#main_detail_image").attr("src", mainCard['img_link']);
    $("#card_detail_name").html(mainCard['name']);
    var temp = '';
    for (var key in mainCard.info){
        temp += key + " : " + mainCard.info[key] + "<br>";
    }
    $("#card_detail_info").html(temp);
    $("#low_price").html(`₩ ${addComma(mainCard.low)}`);
    var count = 0;
    for (var key in mainCard.price){
        var dir = ".detail_price:eq(";
        $(dir + count + ")").css("display","block");
        $(dir + count + ")").html(key);
        $(dir + (count + 10) + ")").css("display","block");
        $(dir + (count + 10) + ")").html(`₩ ${addComma(mainCard.price[key])}`);
        count += 1;
    }
    $("#addBasket_img").attr("onclick", "addBasket(" + mainCard.idx + ");")
    var text = '';
    for (var i in mainCard.price){
        text += `${i}`
    }
}

//임시 카드 선언
function temp_card(n){
    var temp = ['참치', '꽁치', '김치', '멸치', '삼치', '한치', '명치', '국치', '그치', '아치',
                '홍일동', '홍이동', '홍삼동', '홍사동', '홍오동', '홍육동', '홍칠동', '홍팔동', '홍구동', '홍영동',
                '박지성', '손흥민', '류현진', '사사키 로키', '오타니 쇼헤이', '임요환', '페이커', '이천수', '강백호', '끝나간다', '마지막'];
    for (var i = 0; i < n; i++){
        cardList.name.push(temp[i]);
        cardList.code.push(i);
        cardList.imgLink.push("");
        if (i % 2 == 0){
            cardList.stock.push(true)
        }
        else{
            cardList.stock.push(false)
        }
    }
}

function same_card(){
    for (var i = 0; i < cardList.name.length; i++){
        $(".same_name_card:eq(" + i + ")").css("display", "block");
        $(".same_name_card:eq(" + i + ") img").attr("src", cardList.imgLink[i]);
        $(".same_name_card:eq(" + i + ") #same_name_card_name").text(cardList.name[i]);
        $(".same_name_card:eq(" + i + ") #same_name_card_code").text(cardList.code[i]);
        $(".same_name_card:eq(" + i + ") #same_name_card_stock").text(cardList.stock[i]);
    }
}

// 장바구니 추가 버튼 띄우기
$(function(){
    $("#main_detail_image").mouseover(function(){
        $("#basket_add_button").css("display", "block");
    });
    $("#main_detail_image").mouseleave(function(){
        $("#basket_add_button").css("display", "none");
    });
});

