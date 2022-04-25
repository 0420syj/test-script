const {Builder, Key, By, Capabilities} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const 상세 = async(driver, id) =>{
    await driver.get(`https://mprod.uplus.co.kr/mobile/accessory/category/product-view?urcAcceProdNo=${id}`);
    await driver.sleep(10);
    const list =  await driver.findElements(By.css(".top-img-area img"));

    for(let data of list) {
     let width = await data.getAttribute("width");
     //console.log(width);
     if(width < 100) {console.log(id +" " + data.width); break;}
    }

    if(!list.length)
    console.log(id +" 이미지 없음");

   // await driver.findElements(By.className("button"))[0].click();
}

// 할인유형 : 선택약정할인 24개월
// 할부기간 : 24개월
const 선약할인설정 = async(driver) => {
    // const sunyak24 = document.getElementById('sale-select-0')
    // sunyak24.click()
    // await driver.findElement(By.id("sale-select-0")).click();

    // const halbu24 = document.getElementById('month-credit_2')
    // halbu24.click()
    // await driver.findElement(By.id("month-credit_2")).click();
}

const 요금제스캔 = async(driver) => {
    
}

(async function example() {
    const chromeCapabilities = Capabilities.chrome();
    let chromeOptions = new chrome.Options();
    chromeOptions.options_["debuggerAddress"] = "127.0.0.1:9222";
    chromeCapabilities.set('chromeOptions', {args: ['--headless']});
    let driver = new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).setChromeOptions(chromeOptions).build();

    try {
        await driver.get(`https://www.naver.com/`);
        await driver.sleep(10);

        // 선약할인설정(driver);

        // const phoneLink = await driver.findElements(By.css("img-pro"));

        // const selectBox = await driver.findElements(By.className("c-link-arr-1-s"))[0];
        
        
        // let idx = 1
        // for(let id of ids.split(",")) {
        //     console.log(idx++ + " : " + id)
        //     await 상세(driver, id);
        // }
            
    }
    finally{
       await driver.quit();
    }
})();
