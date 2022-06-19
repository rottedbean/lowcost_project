var value = '';
var mainCard = {};
var cardList = [];

window.onload = function(){
    // 카테고리 초기화
    initCategory();
    // 로컬 스토리지 통해 최근 검색 목록 불러오기
    recentSearch();
    // 파라미터값 가져오기
    value = getPara();
    // 최근 방문 기록에 더하기
    addLS('cards', value);
    // 메인 카드 불러오기
    mainCard = callCardsDetail(value);
    setMainCard();
    // 이름 같은 카드 리스트 불러오기
    cardList = callSameCards(value);
    // 이름 같은 카드 설정
    setSameNameCards();
    // 장바구니 리셋
    resetBasket();
}

// 메인 카드 설정
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
        if (mainCard.low == mainCard.price[key]){
            $(dir + count + ")").addClass('low_text');
        }
        count += 1;
    }
    $("#addBasket_img").attr("onclick", "addBasket('" + mainCard.name + "');")
}

function setSameNameCards(){
    var dir = ".same_name_card:eq(";
    for(var i = 0; i < cardList.length; i++){
        $(dir + i + ")").css('display', 'block');
        $(dir + i + ")").attr("onclick", "window.open('" + cardList[i].url + "')");
        $(dir + i + ") img").attr("src", cardList[i].img);
        $(dir + i + ") #same_name_card_name").text(cardList[i].name);
        $(dir + i + ") #same_name_card_code").text(cardList[i].code);
        if (cardList[i].stock) {
            $(dir + i + ") #same_name_card_stock").text("재고 있음");
        }
        else{
            $(dir + i + ") #same_name_card_stock").text("재고 없음");
        }
    }
}

function callSameCards(v){
    var temp = [];
    temp.push({
        name : "핵김치",
        code : "1541-124",
        img : "/images/cards/6.png",
        stock : true,
        url : "https://naver.com"
    });
    temp.push({
        name : "핵김치",
        code : "1541-125",
        img : "/images/cards/6.png",
        stock : true,
        url : "https://naver.com"
    });
    temp.push({
        name : "핵김치",
        code : "1541-126",
        img : "/images/cards/6.png",
        stock : true,
        url : "https://naver.com"
    });
    temp.push({
        name : "핵김치",
        code : "1541-127",
        img : "/images/cards/6.png",
        stock : true,
        url : "https://naver.com"
    });
    temp.push({
        name : "핵김치",
        code : "1541-128",
        img : "/images/cards/6.png",
        stock : true,
        url : "https://naver.com"
    });
    temp.push({
        name : "핵김치",
        code : "1541-129",
        img : "/images/cards/6.png",
        stock : true,
        url : "https://naver.com"
    });
    temp.push({
        name : "핵김치",
        code : "1541-123",
        img : "/images/cards/6.png",
        stock : false,
        url : "https://naver.com"
    });
    return temp;
}