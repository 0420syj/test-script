const { Builder, Key, By, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// 할인유형 : 선택약정할인 24개월
// 할부기간 : 24개월
const 선약할인설정 = async (driver) => {

    await driver.get(`https://prod.uplus.co.kr/mobile/5g-phone/xiaomi/Redmi%20Note%2011%20Pro%205G/2201116SG`);
    await driver.sleep(10);

    await driver.executeScript(`
        const sunyak24 = document.getElementById('sale-select-0')
        sunyak24.click()

        const halbu24 = document.getElementById('month-credit_2')
        halbu24.click()
    `)
}

const 요금제스캔 = async (driver,time) => {

    const openPlanBox = async () => {
        await driver.executeScript(`
            const selectPrice = document.getElementsByClassName('c-link-arr-1-s')[0]
            selectPrice.click()
        `)

        await driver.sleep(time);

        await driver.executeScript(`
            const btn = document.getElementsByClassName('selecPlan-srch-field')[0].getElementsByTagName('button')[1]
            btn.click()
        `)

        await driver.sleep(time);
    }

    await openPlanBox()

    // 요금제 저장
    const planBox = await driver.executeScript(`
        const planBox = document.getElementsByClassName('mobile-plan-box')
        return planBox
    `)
    // console.log(planBox);

    console.log("요금제 박스 " + planBox.length + "개" + " 스캔 시작");

    let fullResult = ""

    for(let i = 0; i<planBox.length; i++) {
        console.log(i + "번째 요금제 ");

        const length = await driver.executeScript(`
            const btn = document.getElementsByClassName('mobile-plan-box')[${i}].getElementsByClassName('slick-slide').length
            return btn
        `)

        console.log("/ 슬라이드 수 : " + length);

        if(length) {
            for(let j = 0; j<length; j++) {
                console.log(i + "번째 요금제 " + j + "번째 슬라이드\n");

                await driver.executeScript(`
                    const btn = document.getElementsByClassName('mobile-plan-box')[${i}].getElementsByClassName('slick-slide')[${j}].getElementsByTagName('input')
                    btn[0].click()
                `)

                await driver.sleep(100);

                await driver.executeScript(`
                    const okBtn = document.getElementsByClassName('c-btn-solid-1-m')[1]
                    okBtn.click()
                `)

                await driver.sleep(100);
                const result = await driver.executeScript(`
                    const product = document.getElementsByClassName('calculation-box')[0].getElementsByClassName('name')[0].innerText
                    const price = document.getElementsByClassName('month-total')[2].getElementsByTagName('span')[0].innerText.slice(0,-2)
                    const planName = document.getElementsByClassName('calcu-list')[1].getElementsByTagName('strong')[1].innerText

                    const selectPrice = document.getElementsByClassName('c-link-arr-1-s')[0]
                    selectPrice.click()

                    console.log(product + '\t' + price + '\t' + planName)
                    return (product + '\t' + price + '\t' + planName)


                `)

                console.log(result);
                fullResult += result + "\n"

                await driver.sleep(100);

                await driver.executeScript(`
                    const btn = document.getElementsByClassName('selecPlan-srch-field')[0].getElementsByTagName('button')[1]
                    btn.click()
                `)

                await driver.sleep(time);
                
            }
        }
        else {
            await driver.executeScript(`
                const planBox = document.getElementsByClassName('mobile-plan-box')
                planBox[${i}].click()
            `)

            await driver.sleep(100);

            await driver.executeScript(`
                const okBtn = document.getElementsByClassName('c-btn-solid-1-m')[1]
                okBtn.click()
            `)

            await driver.sleep(100);
            const result = await driver.executeScript(`
                const product = document.getElementsByClassName('calculation-box')[0].getElementsByClassName('name')[0].innerText
                const price = document.getElementsByClassName('month-total')[2].getElementsByTagName('span')[0].innerText.slice(0,-2)
                const planName = document.getElementsByClassName('calcu-list')[1].getElementsByTagName('strong')[1].innerText

                const selectPrice = document.getElementsByClassName('c-link-arr-1-s')[0]
                selectPrice.click()

                console.log(product + '\t' + price + '\t' + planName)
                return (product + '\t' + price + '\t' + planName)
            `)
            console.log(result);
            fullResult += result + "\n"

            await driver.sleep(100);

            await driver.executeScript(`
                const btn = document.getElementsByClassName('selecPlan-srch-field')[0].getElementsByTagName('button')[1]
                btn.click()
            `)

            await driver.sleep(time);
            
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
        await 요금제스캔(driver,2500);
    }
    finally {
        await driver.quit();
    }
})();
