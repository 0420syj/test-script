const { Builder, Key, By, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const 선약할인설정 = async (driver) => {
    // 모바일기기 상세페이지로 이동
    await driver.get(`https://mprod.uplus.co.kr/mobile/4g-phone/apple/iphone-11-256g/A2221-256-N`);
    await driver.sleep(10);

    // 할인유형 풀려있는 경우를 대비하여 처리
    // 할인유형 : 선택약정할인 24개월
    const halinLength = await driver.executeScript(`
        const sunyak24 = document.getElementById('rad-3-2')
        return sunyak24
    `)
    if(halinLength !== null)
        await driver.executeScript(`
            const sunyak24 = document.getElementById('rad-3-2')
            sunyak24.click()
        `)
    // 설정 대기
    await driver.sleep(500);

    // 할부기간 : 24개월
    await driver.executeScript(`
        const halbu24 = document.getElementById('plan-24')
        halbu24.click()
    `)

    // 설정 대기
    await driver.sleep(500);

    // 토글 버튼 펼침
    await driver.executeScript(`
        const toggleBtn = document.getElementsByClassName('toggle-btn')
        toggleBtn[0].click()
    `)

    // 토글 대기
    await driver.sleep(500);
}

const 요금제스캔 = async (driver,time) => {

    // 결과값 초기화
    let fullResult = ""
    let resultArray = [];

    // 요금제 팝업 열기 함수
    const openPlanBox = async () => {
        // 다른 요금제 선택 버튼 클릭 
        await driver.executeScript(`
            const selectPrice = document.getElementsByClassName('c-link-arr-1-s')[0]
            selectPrice.click()
        `)

        // 팝업 대기
        await driver.sleep(time);

        // 전체 버튼 클릭
        await driver.executeScript(`
            const btn = document.getElementsByClassName('m-tabs')[1].getElementsByTagName('a')[1]
            btn.click()
        `)

        // 요금제 로딩 대기
        await driver.sleep(time);
    }

    // 결과값 저장 함수
    const saveResult = async () => {
        // 중간 결과 저장
        const result = await driver.executeScript(`
            let product = document.getElementsByClassName('prod-title')[0].innerText.slice(0,document.getElementsByClassName('prod-title')[0].innerText.lastIndexOf('(')-1)
            product = product.trimStart()

            const price = document.getElementsByClassName('price-total')[0].getElementsByTagName('dd')[0].innerText.slice(0,-2)
            const planName = document.getElementsByClassName('month-commu-price')[0].getElementsByTagName('dt')[1].innerText

            const data = product + '\t' + price + '\t' + planName

            console.log(data)
            return (data)
        `)

        // 중간 결과 출력 및 저장
        console.log(result);
        fullResult += result + '\n';
        resultArray.push(result);

        await openPlanBox();
    }

    const pressOkBtn = async () => {
        await driver.executeScript(`
            const okBtn = document.getElementsByClassName('c-btn-solidbox-2')[1]
            okBtn.click()
        `)

        await driver.sleep(time);
    }

    await openPlanBox()

    // 요금제 정보 저장
    const planBox = await driver.executeScript(`
        const planBox = document.getElementsByClassName('plan-info-box')[0].getElementsByClassName('c-card-plan-1')
        return planBox
    `)

    console.log("요금제 " + planBox.length + "개" + " 스캔 시작");

    for(let i = 0; i<planBox.length; i++) {

        const length = await driver.executeScript(`
            const btn = document.getElementsByClassName('plan-info-box')[0].getElementsByClassName('c-card-plan-1')[${i}].getElementsByTagName('input').length
            return btn
        `)
        console.log(i + "번째 요금제 / 슬라이드 수 : " + length);

        if(length > 1) {
            for(let j = 0; j<length; j++) {

                console.log(i + "번째 요금제 / " + j + "번째 슬라이드");

                await driver.executeScript(`
                    const btn = document.getElementsByClassName('plan-info-box')[0].getElementsByClassName('c-card-plan-1')[${i}].getElementsByTagName('input')[${j}]
                    btn.click()
                `)
                await driver.sleep(100);

                await pressOkBtn();
                await saveResult();
            }
        }
        else {
            await driver.executeScript(`
                const planBox = document.getElementsByClassName('plan-info-box')[0].getElementsByClassName('c-card-plan-1')[${i}]
                planBox.getElementsByTagName('input')[0].click()
            `)
            await driver.sleep(100);

            await pressOkBtn();
            // 할인유형 풀려있는 경우를 대비하여 처리
            const halinLength = await driver.executeScript(`
                const sunyak24 = document.getElementById('rad-3-2')
                return sunyak24
            `)
            if(halinLength !== null)
                await driver.executeScript(`
                    const sunyak24 = document.getElementById('rad-3-2')
                    sunyak24.click()
                `)
            await driver.sleep(500);

            await driver.executeScript(`
                const halbu24 = document.getElementById('plan-24')
                halbu24.click()
            `)
            await saveResult();
        }


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
