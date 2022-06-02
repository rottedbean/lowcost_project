// 장바구니용 글로벌 변수
var is_basket = false;
var page2 = 0;
var category = [];

// 드롭다운 메뉴
$(function(){
    $("#category2").mouseover(function(){
        $("#category").css("width", "582px");
    });
    $("#category1 > .cate_box_li").mouseover(function(){
        $("#category1 > .cate_box_li").removeClass("cate_box_li_selected");
        $(this).addClass("cate_box_li_selected");
        $("#category2 > .cate_box_li").removeClass("cate_box_li_selected");
    });
    $("#category2 > .cate_box_li").mouseover(function(){
        $("#category2 > .cate_box_li").removeClass("cate_box_li_selected");
        $(this).addClass("cate_box_li_selected");
        $("#category3 > .cate_box_li").removeClass("cate_box_li_selected");
    });
    $("#category3 > .cate_box_li").mouseover(function(){
        $("#category3 > .cate_box_li").removeClass("cate_box_li_selected");
        $(this).addClass("cate_box_li_selected");
    });
});

function initCategory(){
    category = callCategory()
    for (var i = 0; i < 10; i++){
        var dir = "#category1 li:eq(" + i + ")";
        if (i < category[0].length){
            $(dir).html(category[0][i]);
        }
        else{
            $(dir).css("display", "none");
        };
    }
    for (var i = 0; i < 10; i++){
        var dir = "#category2 li:eq(" + i + ")";
        if (i < category[1][0].length){
            $(dir).html(category[1][0][i]);
        }
        else{
            $(dir).css("display", "none");
        };
    }
}

//카테고리 불러오기
function setCategory(a, b){
    if (a != -1){
        for (var i = 0; i < 10; i++){
            var dir = "#category2 li:eq(" + i + ")";
            if (i < category[1][a].length){
                $(dir).html(category[1][a][i]);
                $(dir).css("display", "block");
            }
            else{
                $(dir).css("display", "none");
            }
        }
        page2 = a;
    }
    if (b != -1){
        for (var i = 0; i < 10; i++){
            var dir = "#category3 li:eq(" + i + ")";
            if (i < category[2][page2][b].length){
                $(dir).html(category[2][page2][b][i]);
                $(dir).css("display", "block");
            }
            else{
                $(dir).css("display", "none");
            }
        }
    }
}

//장바구니 열고 닫기
function basket(){
    if (is_basket){
        $('#basket').css('top', '820px');
        $('#curtain').css('background-color', 'rgba(255,255,255,0)');
        $('#basket_button_img').attr("src","images/option_up.png")
        is_basket = false;
    }
    else {
        $('#basket').css('top', '350px');
        $('#curtain').css('background-color', 'rgba(100,100,100,0.5)');
        $('#basket_button_img').attr("src","images/option_down.png")
        is_basket = true;
    }
};

//장바구니
function resetBasket(){
    // 장바구니 리셋
    var idxList = JSON.parse(localStorage.getItem("basket"));
    var idx = new Array();
    var count = new Array();
    for (var i = 0; i < 100; i++){
        var dir = ".basket_card_slot:eq(" + i + ")";
        if (i < idxList.length){ // 장바구니 안
            var obj = callIdx(idxList[i]);
            $(dir).css("display", "block");
            $(dir + ' img').attr('src', obj.img_link);
            $(dir + ' .basket_card_name').html(obj.name);
            $(dir + ' .basket_card_price').html(addComma(obj.low));
            $(dir + ' .basket_card_box').attr("href", "/detail?idx=" + obj.idx);

            if (idx.includes(obj.idx)){
                count[idx.indexOf(obj.idx)] += 1;
            }
            else{
                idx.push(obj.idx);
                count.push(1);
            }
        }
        else {
            $(dir).css("display", "none");
        }
    }
    // 영수증 리셋
    var sum = 0;
    var csum = 0;
    for (var i = 0; i < idx.length; i++){
        var obj = callIdx(idx[i]);
        var dir = ".receipt_list_one:eq(" + i + ")";
        $(dir).css("display", "flex");
        $(dir + " .receipt_list_name").text(obj.name);
        $(dir + " .receipt_list_price").text(`₩ ${addComma(obj.low)}`);
        $(dir + " .receipt_list_calc").text(`${addComma(obj.low)} x ${count[i]} ea`);
        $(dir + " .receipt_list_total").text(`₩ ${addComma(obj.low * count[i])}`);
        sum += obj.low * count[i];
        csum += count[i];
    }
    $("#receipt_total_count").text(`총 ${csum}개`);
    $("#receipt_total_sum").text(`₩ ${addComma(sum)}`);
}

function addBasket(idx){
    var idxList = JSON.parse(localStorage.getItem("basket"));
    if (idxList == null){
        idxList = [];
    }
    idxList.unshift(idx);
    localStorage.setItem("basket", JSON.stringify(idxList));
    resetBasket();
}

function removeBasket(i){ //인자는 index가 아니라 몇번째인지
    var idxList = JSON.parse(localStorage.getItem("basket"));
    idxList.splice(i, 1);
    localStorage.setItem("basket", JSON.stringify(idxList));
    resetBasket();
}

//테스트 페이지용
function test(){
    var name = $("#name").val()
    var link = $("#link").val()
    var price = $("#price").val()
    var idx = $("#index").val()
    add_basket(link, "#", name, price, idx)
}

function reset(){
    $(".basket_card_slot").css("display", "none");
    basket_num = 0;
    receipt.index_list = [];
    receipt.name_list = [];
    receipt.price_list = [];
    receipt.count = [];
    receipt.total = 0;
    receipt.sum = 0;
    update_receipt_list();
}

//1000단위 콤마찍기
function addComma(value){
    temp = String(value)
    temp = temp.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return temp; 
}

// 카테고리 임시 배정
function callCategory(){
    return {
        0 : ["ㄱ", "ㄴ", "ㄷ"],
        1 : {
            0 : ["가", "갸", "거", "겨"],
            1 : ["나", "냐", "너"],
            2 : ["다", "댜", "더", "뎌", "도"]
        },
        2 : {
            0 : {
                0 : ["각", "간", "갇", "갈", "감"],
                1 : ["갹", "갼", "갿", "걀"],
                2 : ["걱", "건", "걷", "걸", "검", "겁"],
                3 : ["격", "견", "겯", "결", "겸"]
            },
            1 : {
                0 : ["낙", "난", "낟", "날"],
                1 : ["냑", "냔"],
                2 : ["넉", "넌", "넏", "널", "넘"]
            },
            2 : {
                0 : ["다1"],
                1 : ["다2"],
                2 : ["다3"],
                3 : ["다4"],
                4 : ["다5"]
            }
        } 
    }
}

// 임시 로컬 스토리지 비우는 함수
function tempFunc(){
    localStorage.clear("recSer");
}

// 서치 함수
function searchFunc(){
    var value = $("input[name=title]").val();
    var url = "/search?value=";
    var recSer = callRecSer();
    if (recSer == null){
        localStorage.setItem("recSer", value);
    }
    else {
        if (recSer.includes(value)){
            recSer.splice(recSer.indexOf(value), 1);
            recSer.unshift(value);
        }
        else{
            recSer.unshift(value);
            if (recSer.length > 4){
                recSer.pop();
            }
        }
        localStorage.setItem("recSer", recSer);
    }
    location.href = url + encodeURI(value, "utf-8");
}

// recSer 로컬 스토리지 부르기
function callRecSer(){
    try {
        var temp = localStorage.getItem("recSer").split(',');
    }
    catch {
        return null;
    }
    return temp;
}

function recentSearch(){
    var recSer = callRecSer();
    if (recSer != null){
        for (var i = 0; i < recSer.length; i++){
            dir = ".recent_history ~ a:eq(" + i + ")";
            $(dir).css("display", "inline-block");
            $(dir).html(recSer[i]);
            $(dir).attr("href", "/search?value=" + encodeURI(recSer[i], "utf-8"))
        }
    }
}


//임시 더미 함수들
function callIdx(idx){
    if (idx == 123){
        const res = {
            name : "고추참치",
            price : {
                '할머니닷컴' : 2800,
                '엄마손쇼핑' : 4700,
                '부전시장' : 2100,
                '이마트' : 2400
            },
            info : {
                "맵기" : "6단계",
                "짠 정도" : "3단계",
                "양" : "200g",
                "유통기한" : "20220623"
            },
            low : 2100,
            idx : 123,
            link : "/detail?idx=123",
            img_link : "/images/cards/123.png",
            pop : true,
            stock : false
        };
        return res
    }
    else if (idx == 456){
        const res = {
            name : "참치마요",
            price : {
                '할머니닷컴' : 2800,
                '엄마손쇼핑' : 4700,
                '부전시장' : 2700,
                '이마트' : 2900
            },
            low : 2700,
            idx : 456,
            link : "/detail?idx=456",
            img_link : "/images/cards/456.png",
            pop : true,
            stock : true
        };
        return res
    }
    else if (idx == 789){
        const res = {
            name : "동원참치",
            price : {
                '할머니닷컴' : 800,
                '엄마손쇼핑' : 1700,
                '부전시장' : 2100,
                '이마트' : 2000
            },
            low : 800,
            idx : 789,
            link : "/detail?idx=789",
            img_link : "/images/cards/789.png",
            pop : true,
            stock : true
        };
        return res
    }
    else if (idx == 1){
        const res = {
            name : "배추김치",
            price : {
                '할머니닷컴' : 6800,
                '엄마손쇼핑' : 6000,
                '부전시장' : 6500,
                '이마트' : 6600
            },
            low : 6000,
            idx : 1,
            link : "/detail?idx=1",
            img_link : "/images/cards/1.png",
            pop : true,
            stock : true
        };
        return res
    }
    else if (idx == 2){
        const res = {
            name : "파김치",
            price : {
                '할머니닷컴' : 21800,
                '엄마손쇼핑' : 24700,
                '부전시장' : 21000,
                '이마트' : 21400
            },
            low : 21000,
            idx : 2,
            link : "/detail?idx=2",
            img_link : "/images/cards/2.png",
            pop : true,
            stock : true
        };
        return res
    }
    else if (idx == 3){
        const res = {
            name : "총각김치",
            price : {
                '할머니닷컴' : 33000,
                '엄마손쇼핑' : 47000,
                '부전시장' : 37000,
                '이마트' : 34000
            },
            low : 33000,
            idx : 3,
            link : "/detail?idx=3",
            img_link : "/images/cards/3.png",
            pop : true,
            stock : true
        };
        return res
    }
    else if (idx == 4){
        const res = {
            name : "김치라면",
            price : {
                '할머니닷컴' : 5300,
                '엄마손쇼핑' : 5300,
                '부전시장' : 5500,
                '이마트' : 5400
            },
            low : 5300,
            idx : 4,
            link : "/detail?idx=4",
            img_link : "/images/cards/4.png",
            pop : true,
            stock : true
        };
        return res
    }
    else if (idx == 5){
        const res = {
            name : "김치김밥",
            price : {
                '할머니닷컴' : 2800,
                '엄마손쇼핑' : 4000,
                '부전시장' : 3500,
                '이마트' : 3800
            },
            low : 2800,
            idx : 5,
            link : "/detail?idx=5",
            img_link : "/images/cards/5.png",
            pop : true,
            stock : true
        };
        return res
    }
    else if (idx == 6){
        const res = {
            name : "핵김치",
            price : {
                '할머니닷컴' : 28000,
                '엄마손쇼핑' : 30000,
                '부전시장' : 29000,
                '이마트' : 29400
            },
            low : 28000,
            idx : 6,
            link : "/detail?idx=6",
            img_link : "/images/cards/6.png",
            pop : true,
            stock : true
        };
        return res
    }
}