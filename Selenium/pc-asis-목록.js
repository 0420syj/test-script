const { Builder, Key, By, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const 선약할인설정 = async (driver) => {
    // 모바일기기 목록페이지로 이동
    await driver.get(`https://shop.uplus.co.kr/pc/mobile/4gPhoneList`);
    await driver.sleep(500);

    // 할인유형 : 선택약정할인 24개월
    await driver.executeScript(`
        const sunyak24 = document.getElementById('fn_rd_type1')
        sunyak24.click()
    `)

    // 설정 대기
    await driver.sleep(500);
}

const 요금제스캔 = async (driver,time) => {

    // 결과값 초기화
    let fullResult = ""
    let resultArray = [];

    // 요금제 팝업 열기 함수
    const openPlanBox = async () => {
        // 전체보기 버튼 클릭 
        await driver.executeScript(`
            const selectPrice = document.getElementById('btn_ppLayer')
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
            const data = document.getElementsByClassName('item_area ui_compare_area')[0].getElementsByClassName('info')
            const name = data[0].getElementsByClassName('model')[0].getElementsByTagName('dt')[0].innerText
            let idx = 0;
            
            for(let i=0; i<data.length; i++) {
                if(data[i].getElementsByClassName('model')[0].getElementsByTagName('dt')[0].innerText === "iPhone 11 256G") {
                    idx=i; break;
                }
            }
            
            const plan = document.getElementsByClassName('btn_sel txt')[0].innerText
            const price = document.getElementsByClassName('plan')[idx].getElementsByTagName('strong')[0].innerText.substr(2).slice(0,-1)     
            const checked = document.getElementById('fn_rd_type1').checked

            const print = plan + '\t' + price + '\t' + checked

            console.log(print)
            return (print)
        `)

        // 중간 결과 출력 및 저장
        console.log(result);
        fullResult += result + '\n';
        resultArray.push(result);

        // 전체보기 버튼 클릭 
        await driver.executeScript(`
            const selectPrice = document.getElementById('btn_ppLayer')
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
        await driver.sleep(time);
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
            const sunyak24 = document.getElementById('fn_rd_type1')
            sunyak24.click()
        `)
        await driver.sleep(500);

        await saveResult();
    }
    
    console.log(fullResult)
    // await driver.executeScript(`
    //     console.log('스캔 완료')

    //     const printResult = ""

    //     for(let data of ${resultArray}) {
    //         printResult += data + '\n'
    //     }

    //     console.log(printResult)
    // `)
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
