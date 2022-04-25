const { Builder, Key, By, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const 목록페이지이동 = async (driver, link) => {
    // 모바일기기 목록페이지로 이동
    await driver.get(link);
    await driver.sleep(10);
}

const 상세페이지스캔 = async (driver, time) => {

    // 최종 결과
    let fullResult = ""

    // 모바일기기 데이터 저장
    const mobile = await driver.executeScript(`
        asis / tobe-pc / tobe-mo
    `)

    // 모바일기기 데이터 개수 출력
    console.log("모바일기기 " + mobile.length + "개" + " 스캔 시작");
    console.log("-------------------------------------------------------");

    // 모바일기기 스캔
    for (let i = 0; i < mobile.length; i++) {

        // 모바일기기 상세페이지이동(클릭)
        const mobile = await driver.executeScript(`
            asis / tobe-pc / tobe-mo
        `)

        // 상세페이지 로딩 대기
        await driver.sleep(time);
        
        // 모바일기기 속성지정(요금제, 할인유형, 할부기간)
        const mobile = await driver.executeScript(`
            asis / tobe-pc / tobe-mo
        `)

        // 속성 지정 대기
        await driver.sleep(100);

        // 계산기 값 스캔
        const result = await driver.executeScript(`
            asis / tobe-pc / tobe-mo
        `)

        // 계산기 값 출력 및 최종 결과 중간 저장
        console.log(result);
        fullResult += result;

        // 다시 목록페이지로 이동 (뒤로가기 or 최초 link 다시 받아서 쓰기)
        const mobile = await driver.executeScript(`
            asis / tobe-pc / tobe-mo
        `)

        // 목록페이지 로딩 대기
        await driver.sleep(time);
    }

    // 최종 결과 출력
    console.log(fullResult)
}

(async function example() {
    const chromeCapabilities = Capabilities.chrome();
    let chromeOptions = new chrome.Options();
    chromeOptions.options_["debuggerAddress"] = "127.0.0.1:9222";
    chromeCapabilities.set('chromeOptions', { args: ['--headless'] });
    let driver = new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).setChromeOptions(chromeOptions).build();

    // 모바일기기 상세페이지 링크
    const mobileInfolLink = 'https://prod.uplus.co.kr/mobile/5g-phone/xiaomi/Redmi%20Note%2011%20Pro%205G/2201116SG'

    try {
        await 목록페이지이동(driver, mobileInfolLink);
        await 상세페이지스캔(driver, 2500);
    }
    finally {
        await driver.quit();
    }
})();
