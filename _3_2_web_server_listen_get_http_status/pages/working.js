const cp_h1 = document.querySelector('#_h1')
let num = 1

setInterval(() => {
    cp_h1.textContent = num
    num ++
}, 1000);
