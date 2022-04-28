const { Builder, Key, By, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const 선약할인설정 = async (driver) => {
    // 모바일기기 목록페이지로 이동
    await driver.get(`https://shop.uplus.co.kr/pc/mobile/phone/calc/APPLE/iphone-11-256g/model/A2221-256-N?ppCd=LPZ0000472&dvicColrCd=80&entrKdCd=1&dcntKdCd=1&nuseHphnDcntChocYn=N&prevPpCd=LPZ0000472`);
    await driver.sleep(500);
}

const 요금제스캔 = async (driver,time) => {

    // 결과값 초기화
    let fullResult = ""
    let resultArray = [];

    // 요금제 팝업 열기 함수
    const openPlanBox = async () => {
        // 다른 요금제 선택 클릭 
        await driver.executeScript(`
            const selectPrice = document.getElementById('a_otherPp')
            selectPrice.click()
        `)

        // 팝업 대기
        await driver.sleep(500);

        // 전체 버튼 클릭
        await driver.executeScript(`
            const btn = document.getElementById('btn_allListPop')
            btn.click()
        `)

        // 요금제 로딩 대기
        await driver.sleep(500);
    }

    // 결과값 저장 함수
    const saveResult = async () => {
        // 중간 결과 저장
        const result = await driver.executeScript(`
            // 모든 가격창
            const price = document.getElementsByClassName('sections total last')[0].getElementsByTagName('em')[0].innerText
            const plan = document.getElementsByClassName('sections first')[0].getElementsByClassName('box')[1].getElementsByTagName('dt')[1].innerText

            const print = "멈" + '\t' + plan + '\t' + price
            console.log(print)
            return (print)
        `)

        // 중간 결과 출력 및 저장
        console.log(result);
        fullResult += result + '\n';
        resultArray.push(result);

        await openPlanBox();
    }

    const pressOkBtn = async () => {
        await driver.executeScript(`
            const btn = document.getElementById('btn_PPSet')
            btn.click()
        `)

        await driver.sleep(1000);
    }

    await openPlanBox()

    // 요금제 정보 저장
    const planBox = await driver.executeScript(`
        const planBox = document.getElementsByClassName('item_wrap')
        return planBox
    `)

    console.log("요금제 " + planBox.length + "개" + " 스캔 시작");

    for(let i = 0; i<planBox.length; i++) {
        console.log(i + "번째 요금제");

        await driver.sleep(500);

        await driver.executeScript(`
            const planBox = document.getElementsByClassName('item_wrap')
            planBox[${i}].click()
        `)
        await driver.sleep(100);

        await pressOkBtn();

        await driver.executeScript(`
            const sunyak24 = document.getElementById('rdo_slt_disc2')
            sunyak24.click()
        `)
        await driver.sleep(500);

        await saveResult();
    }
    
    console.log(fullResult)
    // console.log(
    //     await driver.executeScript(`
    //         console.log('스캔 완료')

    //         const printResult = ""

    //         for(let data of ${resultArray}) {
    //             printResult += data + '\n'
    //         }

    //         return(printResult)
    //     `)
    // )
}

(async function example() {
    const chromeCapabilities = Capabilities.chrome();
    let chromeOptions = new chrome.Options();
    chromeOptions.options_["debuggerAddress"] = "127.0.0.1:9222";
    chromeCapabilities.set('chromeOptions', { args: ['--headless'] });
    let driver = new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).setChromeOptions(chromeOptions).build();

    try {
        await 선약할인설정(driver);
        await 요금제스캔(driver,3000);
    }
    finally {
        await driver.quit();
    }
})();
