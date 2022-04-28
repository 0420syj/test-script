const { Builder, Key, By, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const 선약할인설정 = async (driver) => {
    // 모바일기기 목록페이지로 이동
    await driver.get(`https://mprod.uplus.co.kr/mobile/4g-phone`);
    await driver.sleep(500);

    // 필터 버튼 클릭
    await driver.executeScript(`
        const filterBtn = document.getElementById('_uid_1')
        filterBtn.click()
    `)

    // 설정 대기
    await driver.sleep(500);

    // 할인유형 : 선택약정할인 24개월
    await driver.executeScript(`
        const sunyak24 = document.getElementById('_uid_16_2')
        sunyak24.click()
    `)

    // 설정 대기
    await driver.sleep(500);

    // 적용 버튼 클릭
    await driver.executeScript(`
        const okbtn = document.getElementsByClassName('c-btn-solidbox-2')[0]
        okbtn.click()
    `)
}

const 요금제스캔 = async (driver,time) => {

    // 결과값 초기화
    let fullResult = ""
    let resultArray = [];
    let resultString = "";

    // 요금제 팝업 열기 함수
    const openPlanBox = async () => {
        // 필터 버튼 클릭
        await driver.executeScript(`
            const filterBtn = document.getElementById('_uid_1')
            filterBtn.click()
        `)

        // 전체보기 버튼 클릭 
        await driver.executeScript(`
            const selectPrice = document.getElementsByClassName('more-view')[0].getElementsByTagName('a')[0]
            selectPrice.click()
        `)

        // 팝업 대기
        await driver.sleep(500);

        // 전체 버튼 클릭
        await driver.executeScript(`
            const btn = document.getElementsByClassName('swiper-wrapper')[1].getElementsByTagName('a')[1]
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
            const name = document.getElementsByClassName('prod-title')

            let idx = 0;
            
            for(let i=0; i<name.length; i++) {
                if(name[i].getElementsByTagName('strong')[0].innerText === "iPhone 11 256G") {
                    idx=i; break;
                }
            }
            
            const plan = document.getElementsByClassName('info-area')[0].getElementsByTagName('span')[0].innerText
            const planValidCheck = document.getElementsByClassName('total-price')[idx]
            let price;
            if(planValidCheck !== undefined) {
                price = document.getElementsByClassName('total-price')[idx].getElementsByTagName('strong')[0].innerText
            }
            else price = 0
            

            const print = "iPhone 11 256G" + '\t' + plan + '\t' + price

            console.log(print)
            return (print)
        `)

        // 중간 결과 출력 및 저장
        console.log(result);
        fullResult += result + '\n';
        resultArray.push(result);
        resultString += result + '+';

        await openPlanBox();
    }

    const pressOkBtn = async () => {
        await driver.executeScript(`
            const okBtn = document.getElementsByClassName('c-btn-solidbox-2')[1]
            okBtn.click()
            const okBtn2 = document.getElementsByClassName('c-btn-solidbox-2')[0]
            okBtn2.click()
        `)

        await driver.sleep(1500);
    }

    await openPlanBox()

    // 요금제 정보 저장
    const planBox = await driver.executeScript(`
        const planBox = document.getElementsByClassName('c-card-plan-1')
        return planBox
    `)

    console.log("요금제 " + planBox.length + "개" + " 스캔 시작");

    for(let i = 0; i<planBox.length; i++) {

        const length = await driver.executeScript(`
            const btn = document.getElementsByClassName('c-card-plan-1')[${i}].getElementsByTagName('input').length
            return btn
        `)
        console.log(i + "번째 요금제 / 슬라이드 수 : " + length);

        if(length) {
            for(let j = 0; j<length; j++) {

                console.log(i + "번째 요금제 / " + j + "번째 슬라이드");

                await driver.executeScript(`
                    const btn = document.getElementsByClassName('c-card-plan-1')[${i}].getElementsByTagName('input')[${j}]
                    btn.click()
                `)
                await driver.sleep(100);

                await pressOkBtn();
                await saveResult();
            }
        }
        else {
            await driver.executeScript(`
                const planBox = document.getElementsByClassName('c-card-plan-1')[${i}].getElementsByTagName('input')[0]
                planBox.click()
            `)
            await driver.sleep(100);

            await pressOkBtn();
            // 할인유형 풀려있는 경우를 대비하여 처리
            // await driver.executeScript(`
            //     const sunyak24 = document.getElementById('_uid_12_2')
            //     sunyak24.click()
            // `)
            await saveResult();
        }
    }
    
    console.log(fullResult)
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
