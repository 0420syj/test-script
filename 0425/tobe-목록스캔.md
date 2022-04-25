### tobe-pc 목록 가격스캔

```javascript
const products = document.getElementsByClassName('product-li')
let output = ""

for(let data of products) {
    const name = data.getElementsByClassName('tit')[0].innerText
    const price = data.getElementsByTagName('em')[1].innerText.substr(2).slice(0,-2)
    output += (name + '\t' + price + '\n')
}

console.log(output)
```

### tobe-mo 목록 가격스캔

```javascript
const products = document.getElementsByClassName('prod-info')
let output = ""

for(let data of products) {
    const name = data.getElementsByTagName('strong')[0].innerText
    const price = data.getElementsByTagName('strong')[3].innerText
    output += (name + '\t' + price + '\n')
}

console.log(output)
```

### asis 목록 가격스캔(상품명+가격)

```javascript
const products = document.getElementsByClassName('item_area_list')[0].getElementsByClassName('info')
let output = ""

for(let data of products) {
    const name = data.getElementsByClassName('model')[0].getElementsByTagName('dt')[0].innerText
    const price = data.getElementsByClassName('plan')[0].getElementsByTagName('strong')[0].innerText.substr(2).slice(0,-1)
    output += (name + '\t' + price + '\n')
}

console.log(output)

```

### asis 목록 가격스캔(상품명만)

```javascript
const products = document.getElementsByClassName('info')
let output = ""

for(let data of products) {
    const name = data.getElementsByClassName('model')[0].getElementsByTagName('dt')[0].innerText
    output += (name + '\n')
}

console.log(output)
```

