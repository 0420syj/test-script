// 숫자 앞자리 0 붙이는 함수
const leftPad = (val) => {
    return val < 10 ? `0${val}` : val;
}

// 날짜 포맷 변경 함수
const toStringByFormatting = (src, delimiter = '-') => {
    const year = src.getFullYear()
    const month = leftPad(src.getMonth() + 1)
    const date = leftPad(src.getDate())

    return [year, month, date].join(delimiter)
}

// 최종결과 초기화
let result = ""

// 날짜별 주문 스캔
const itemList = document.getElementsByClassName('sc-fimazj-0 dXMjMM')

// 주문 스캔 시작
for (let item of itemList) {
    // 출력값 초기화
    let output = ""

    // 주문 날짜
    const date = item.getElementsByClassName('sc-abukv2-1 cRCSWJ')[0].innerText.slice(0, -3)
    const dateArray = date.split('.')
    const printDate = toStringByFormatting(new Date(dateArray[0], dateArray[1] - 1, dateArray[2]))

    const productName = item.getElementsByClassName('sc-755zt3-1 sc-8q24ha-1 fZLyLY gcWFxB')
    const priceAndAmount = item.getElementsByClassName('sc-uaa4l4-0 KaKJy')
    for (let i = 0; i < productName.length; i++) {
        const price = priceAndAmount[i].getElementsByTagName('span')[0].innerText.slice(0, -2).replace(',', '')
        const amount = priceAndAmount[i].getElementsByTagName('span')[3].innerText.slice(0, -2)

        output += printDate + '\t'
        output += productName[i].innerText + '\t'
        output += (price * amount) + '\t🏠 생활' + '\t💳 신용카드' + '\t쿠팡\n'
    }

    // console.log(output)
    result += output
}

console.log(result)