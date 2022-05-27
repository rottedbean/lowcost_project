// 장바구니용 글로벌 변수
var is_basket = false;
var receipt = {
    index_list : new Array(),
    name_list : new Array(),
    price_list : new Array(),
    count : new Array(),
    total : 0,
    sum : 0
};
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
function basket_add(){
    console.log("!");
};
//장바구니 추가
var basket_num = 0;
function add_basket(link, img_link, name, price, idx){
    //장바구니
    $(".basket_card_slot:eq(" + basket_num + ")").css("display", "block");
    $(".basket_card_slot:eq(" + basket_num + ")").attr("href", link);
    $(".basket_card_slot:eq(" + basket_num + ") img").attr("src", img_link);
    $(".basket_card_slot:eq(" + basket_num + ") .basket_card_name").html(name);
    $(".basket_card_slot:eq(" + basket_num + ") .basket_card_price").html(addComma(price));
    //영수증
    $(".receipt_list_one:eq(" + basket_num + ")").css("display", "flex");
    //idx가 리스트 안에 있을 때
    if (receipt.index_list.includes(idx)){
        var temp = receipt.index_list.indexOf(idx);
        receipt.count[temp] += 1;
    }
    //idx가 리스트 안에 없을 때
    else {
        receipt.index_list.push(idx);
        receipt.name_list.push(name);
        receipt.price_list.push(price);
        receipt.count.push(1);
    }
    receipt.sum += 1;
    receipt.total += Number(price);
    basket_num += 1;
    update_receipt_list();
};

//장바구니 제거
function remove_basket(i){
    // 이름값 추출
    var temp = $(".basket_card_slot:eq(" + i + ") .basket_card_name").text();
    for (var x = i; x <= basket_num - 1; x++){
        $(".basket_card_slot:eq(" + x + ") a").attr("href", $(".basket_card_slot:eq(" + (x + 1) + ")").attr("href"));
        $(".basket_card_slot:eq(" + x + ") img").attr("src", $(".basket_card_slot:eq(" + (x + 1) + ") img").attr("src"));
        $(".basket_card_slot:eq(" + x + ") .basket_card_name").html($(".basket_card_slot:eq(" + (x + 1) + ") .basket_card_name").html());
        $(".basket_card_slot:eq(" + x + ") .basket_card_price").html($(".basket_card_slot:eq(" + (x + 1) + ") .basket_card_price").html());
    }
    $(".basket_card_slot:eq(" + (basket_num - 1) + ")").css("display", "none");
    basket_num -= 1;
    //이름값으로 인덱스 찾기
    var temp_num = receipt.name_list.indexOf(temp);
    receipt.sum -= 1;
    receipt.total -= receipt.price_list[temp_num];
    if (receipt.count[temp_num] != 1){
        receipt.count[temp_num] -= 1;
    }
    else {
        receipt.index_list.splice(temp_num, 1);
        receipt.name_list.splice(temp_num, 1);
        receipt.price_list.splice(temp_num, 1);
        receipt.count.splice(temp_num, 1);
    }
    update_receipt_list();
};

// 영수증 업데이트 해버리기
function update_receipt_list(){
    $(".receipt_list_one").css("display","none");
    for (var i = 0; i < receipt.index_list.length; i++){
        $(".receipt_list_one:eq(" + i + ")").css("display", "flex");
        $(".receipt_list_one:eq(" + i + ") .receipt_list_name").text(receipt.name_list[i]);
        $(".receipt_list_one:eq(" + i + ") .receipt_list_price").text(`₩ ${addComma(receipt.price_list[i])}`);
        $(".receipt_list_one:eq(" + i + ") .receipt_list_calc").text(`${addComma(receipt.price_list[i])} x ${receipt.count[i]} ea`);
        $(".receipt_list_one:eq(" + i + ") .receipt_list_total").text(`₩ ${addComma(receipt.price_list[i] * receipt.count[i])}`);
    };
    $("#receipt_total_count").text(`총 ${receipt.sum}개`);
    $("#receipt_total_sum").text(`₩ ${addComma(receipt.total)}`);
};

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

// 서치 함수
function searchFunc(){
    var value = $("input[name=title]").val();
    var url = "/search?value=";
    location.href = url + encodeURI(value, "utf-8");
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