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

// 드롭다운 메뉴
$(function(){
    $("#sec_category").mouseover(function(){
        $("#category").css("width", "582px");
    });
    $("#fir_category > .cate_box_li").mouseover(function(){
        $("#fir_category > .cate_box_li").removeClass("cate_box_li_selected");
        $(this).addClass("cate_box_li_selected");
        $("#sec_category > .cate_box_li").removeClass("cate_box_li_selected");
    });
    $("#sec_category > .cate_box_li").mouseover(function(){
        $("#sec_category > .cate_box_li").removeClass("cate_box_li_selected");
        $(this).addClass("cate_box_li_selected");
        $("#thr_category > .cate_box_li").removeClass("cate_box_li_selected");
    });
    $("#thr_category > .cate_box_li").mouseover(function(){
        $("#thr_category > .cate_box_li").removeClass("cate_box_li_selected");
        $(this).addClass("cate_box_li_selected");
    });
});

//장바구니
function basket(){
    if (is_basket){
        $('#basket').css('top', '820px');
        $('#curtain').css('background-color', 'rgba(255,255,255,0)');
        $('#basket_button_img').attr("src","images/option_up.png")
        //$('#curtain').css('pointer-events', 'none');
        is_basket = false;
    }
    else {
        $('#basket').css('top', '350px');
        $('#curtain').css('background-color', 'rgba(100,100,100,0.5)');
        $('#basket_button_img').attr("src","images/option_down.png")
        //$('#curtain').css('pointer-events', 'auto');
        is_basket = true;
    }
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
