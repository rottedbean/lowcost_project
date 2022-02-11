const crawlingProcess = require("./Crawling.js");

//gethtml 테스트
describe("getHtml", () => {
  it("정상적으로 html요청되었을 경우 반환확인", () => {
    expect(
      crawlingProcess.GetHtml(
        "http://www.tcgshop.co.kr/card_list.php?searchstring=BODE-KR&sortStr=card_no&sort=asc&s_window=on#card_list"
      )
    ).toBeDefined();
  });

  it("에러의 경우 처리 확인", () => {
    expect(
      crawlingProcess.GetHtml(
        "http://www.tcgshop.co.kr/card_list.php?searchstring=wtffw-KR&sortStr=card_no&sort=asc&s_window=on#card_list"
      )
    ).toBeDefined();
  });
});

//crawling 테스트
it("원하는 형태의 데이터가 반환되었는지", () => {
  expect(
    crawlingProcess.CrawlingHtml(
      "http://www.tcgshop.co.kr/card_list.php?searchstring=BODE-KR&sortStr=card_no&sort=asc&s_window=on#card_list"
    )
  ).toBeDefined();
});
