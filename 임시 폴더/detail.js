//이름 같은 카드 목록 불러오는 함수 작성
//메인 카드 정보 불러오는 함수 작성
//지금은 임시로 사용중

//220602
//저거 상세 페이지 가격 부분 링크 위해서 사이트랑 링크 걸 방법 연구

var value = '';
var mainCard = {};

var cardList = [];

window.onload = function(){
    initCategory();
    value = getPara();
    addLocalStorage();
    mainCard = callIdx(value);
    recentSearch();
    setMainCard();

    //임시 파트
    temp_card();
    same_card();
};


// 파라미터 값 가져오기
function getPara(){
    const url = new URL(window.location.href);
    const urlParams = url.searchParams;
    value = urlParams.get('value');
    return value;
}

// 로컬에 저장 
function addLocalStorage(){
    var local = callLocStg('name');
    if (local == null){ // 로컬 스토리지 비어있음
        localStorage.setItem("name", value);
    }
    else{
        if (local.includes(value)){ //해당 요소가 배열 안에 있으면?
            local.splice(local.indexOf(value), 1);
            local.unshift(value);
            localStorage.setItem("name", arrToStr(local));
        }
        else{ //해당 요소가 배열안에 없으면?
            if (local.length < 6){ //로컬 스토리지 0 < 로컬 < 6
                local.unshift(value);
                localStorage.setItem("name", arrToStr(local));
            }
            else { //로컬 스토리지 6 이상
                local.unshift(value);
                local.pop();
                localStorage.setItem("name", arrToStr(local));
            }
        }
        
    }
    //resetBasket();
}

// 메인 카드 페이지 생성
function setMainCard(){
    $("#main_detail_image").attr("src", mainCard.img);
    $("#card_detail_name").html(mainCard.name);
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
    $("#addBasket_img").attr("onclick", "addBasket('" + mainCard.name + "');")
    var text = '';
    for (var i in mainCard.price){
        text += `${i}`
    }
}

//임시 카드 선언
function temp_card(){
    cardList.push({
        name : "핵김치",
        code : "1541-124",
        img : "/images/cards/6.png",
        stock : true
    });
    cardList.push({
        name : "핵김치",
        code : "1541-125",
        img : "/images/cards/6.png",
        stock : true
    });
    cardList.push({
        name : "핵김치",
        code : "1541-126",
        img : "/images/cards/6.png",
        stock : true
    });
    cardList.push({
        name : "핵김치",
        code : "1541-127",
        img : "/images/cards/6.png",
        stock : true
    });
    cardList.push({
        name : "핵김치",
        code : "1541-128",
        img : "/images/cards/6.png",
        stock : true
    });
    cardList.push({
        name : "핵김치",
        code : "1541-129",
        img : "/images/cards/6.png",
        stock : true
    });
    cardList.push({
        name : "핵김치",
        code : "1541-123",
        img : "/images/cards/6.png",
        stock : true
    });
}

function same_card(){
    for (var i = 0; i < cardList.length; i++){
        $(".same_name_card:eq(" + i + ")").css("display", "block");
        $(".same_name_card:eq(" + i + ") img").attr("src", cardList[i].img);
        $(".same_name_card:eq(" + i + ") #same_name_card_name").text(cardList[i].name);
        $(".same_name_card:eq(" + i + ") #same_name_card_code").text(cardList[i].code);
        $(".same_name_card:eq(" + i + ") #same_name_card_stock").text(cardList[i].stock);
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

