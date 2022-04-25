const { Builder, Key, By, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const 선약할인설정 = async (driver) => {
    // 모바일기기 상세페이지로 이동
    await driver.get(`https://prod.uplus.co.kr/mobile/5g-phone/xiaomi/Redmi%20Note%2011%20Pro%205G/2201116SG`);
    await driver.sleep(10);

    // 할인유형 : 선택약정할인 24개월
    // 할부기간 : 24개월
    await driver.executeScript(`
        const sunyak24 = document.getElementById('sale-select-0')
        sunyak24.click()
        
        const halbu24 = document.getElementById('month-credit_2')
        halbu24.click()
    `)

    // 설정 대기
    await driver.sleep(100);
}

const 요금제스캔 = async (driver, time) => {

    // 최종 결과
    let fullResult = ""

    const openPlanBox = async () => {
        // 더 많은 요금제 보기
        await driver.executeScript(`
            const selectPrice = document.getElementsByClassName('c-link-arr-1-s')[0]
            selectPrice.click()
        `)

        // 팝업 대기
        await driver.sleep(time);

        // 전체 요금제 보기
        await driver.executeScript(`
            const btn = document.getElementsByClassName('selecPlan-srch-field')[0].getElementsByTagName('button')[1]
            btn.click()
        `)

        // 요금제 로딩 대기
        await driver.sleep(time);
    }

    const saveResult = async () => {
        // 중간 결과 저장
        const result = await driver.executeScript(`
        const product = document.getElementsByClassName('calculation-box')[0].getElementsByClassName('name')[0].innerText
        const price = document.getElementsByClassName('month-total')[2].getElementsByTagName('span')[0].innerText.slice(0,-2)
        const planName = document.getElementsByClassName('calcu-list')[1].getElementsByTagName('strong')[1].innerText

        const result = product + '\t' + price + '\t' + planName + '\n'
        console.log(result)
        return result
        `)

        // 중간 결과 출력 및 저장
        console.log(result);
        fullResult += result;
    }

    const saveSelct = async () => {
        // 저장 버튼 클릭
        await driver.executeScript(`
            const okBtn = document.getElementsByClassName('c-btn-solid-1-m')[1]
            okBtn.click()
        `)

        // 저장 대기
        await driver.sleep(300);
    }

    await openPlanBox()

    // 요금제 저장
    const planBox = await driver.executeScript(`
        const planBox = document.getElementsByClassName('mobile-plan-box')
        return planBox
    `)

    // 요금제 개수 출력
    console.log("요금제 박스 " + planBox.length + "개" + " 스캔 시작");
    console.log("-------------------------------------------------------");

    // 요금제 스캔
    for (let i = 0; i < planBox.length; i++) {
        console.log(i + "번째 요금제 ");

        const length = await driver.executeScript(`
            const len = document.getElementsByClassName('mobile-plan-box')[${i}].getElementsByClassName('slick-slide').length
            return len
        `)

        console.log("- 슬라이드 수 : " + length + "개");

        // 슬라이드 스캔
        if (length) {
            for (let j = 0; j < length; j++) {
                console.log(i + "번째 요금제 " + j + "번째 슬라이드");

                // 슬라이드 클릭
                await driver.executeScript(`
                    const btn = document.getElementsByClassName('mobile-plan-box')[${i}].getElementsByClassName('slick-slide')[${j}].getElementsByTagName('input')
                    btn[0].click()
                `)

                // 슬라이드 선택 대기
                await driver.sleep(100);

                /*
                // 저장 버튼 클릭
                await driver.executeScript(`
                    const okBtn = document.getElementsByClassName('c-btn-solid-1-m')[1]
                    okBtn.click()
                `)

                // 저장 대기
                await driver.sleep(300);
                */
                await saveSelct()

                /*
                // 중간 결과 저장
                const result = await driver.executeScript(`
                    const product = document.getElementsByClassName('calculation-box')[0].getElementsByClassName('name')[0].innerText
                    const price = document.getElementsByClassName('month-total')[2].getElementsByTagName('span')[0].innerText.slice(0,-2)
                    const planName = document.getElementsByClassName('calcu-list')[1].getElementsByTagName('strong')[1].innerText

                    const result = product + '\t' + price + '\t' + planName + '\n'
                    console.log(result)
                    return result
                `)

                // 중간 결과 출력 및 저장
                console.log(result);
                fullResult += result;
                */
                await saveResult()

                /*
                // 더 많은 요금제 보기
                await driver.executeScript(`
                    const selectPrice = document.getElementsByClassName('c-link-arr-1-s')[0]
                    selectPrice.click()
                `)

                // 팝업 대기
                await driver.sleep(time);

                // 전체 요금제 보기
                await driver.executeScript(`
                    const btn = document.getElementsByClassName('selecPlan-srch-field')[0].getElementsByTagName('button')[1]
                    btn.click()
                `)

                // 요금제 로딩 대기
                await driver.sleep(time);
                */
                await openPlanBox()
            }
        }
        // 일반 요금제 정보 스캔
        else {
            // 요금제 클릭
            await driver.executeScript(`
                const planBox = document.getElementsByClassName('mobile-plan-box')
                planBox[${i}].click()
            `)

            // 요금제 선택 대기
            await driver.sleep(100);

             /*
            // 저장 버튼 클릭
            await driver.executeScript(`
                const okBtn = document.getElementsByClassName('c-btn-solid-1-m')[1]
                okBtn.click()
            `)

            // 저장 대기
            await driver.sleep(300);
            */
            await saveSelct()

            /*
            // 중간 결과 저장
            const result = await driver.executeScript(`
                const product = document.getElementsByClassName('calculation-box')[0].getElementsByClassName('name')[0].innerText
                const price = document.getElementsByClassName('month-total')[2].getElementsByTagName('span')[0].innerText.slice(0,-2)
                const planName = document.getElementsByClassName('calcu-list')[1].getElementsByTagName('strong')[1].innerText

                const result = product + '\t' + price + '\t' + planName + '\n'
                console.log(result)
                return result
            `)

            // 중간 결과 출력 및 저장
            console.log(result);
            fullResult += result;
            */
            await saveResult()

            /*
            // 더 많은 요금제 보기
            await driver.executeScript(`
                const selectPrice = document.getElementsByClassName('c-link-arr-1-s')[0]
                selectPrice.click()
            `)

            // 팝업 대기
            await driver.sleep(time);

            // 전체 요금제 보기
            await driver.executeScript(`
                const btn = document.getElementsByClassName('selecPlan-srch-field')[0].getElementsByTagName('button')[1]
                btn.click()
            `)

            // 요금제 로딩 대기
            await driver.sleep(time);
            */
            await openPlanBox()

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
        await 요금제스캔(driver, 2500);
    }
    finally {
        await driver.quit();
    }
})();
