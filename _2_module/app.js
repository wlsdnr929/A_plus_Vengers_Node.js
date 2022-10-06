
// Module
// : 함수들의 집합 (라이브러리)
// -> logger.js 에 있는 showLogMessage 함수를 이용
// -> 원래는 같은 파일 내에서만 함수를 사용할 수 있지만
//    Module 시스템을 사용하면 다른 파일에서도 사용 가능

// Node.js로 웹서버를 아주 쉽게 짤 수 있는데
// 아주 유명한 'express'모듈을 사용하면 됨

// Module. logger.js  --> showLogMessage
// logger.js 모듈 불러오기
const logger = require('./logger')

logger.showLogMessage('1 모듈에 대한 테스트 중입니다.')
logger.showLogMessage2('2 모듈에 대한 테스트 중입니다')
console.log('Logger 모듈에 들어있는 소중한 값은 : ' + logger.pvalue)







// 그냥 JavaScript 연습

// 함수
function sayHello(name){
    console.log('Hello '+name)
}

sayHello('John')

// 3초에 한 번씩 실행
setInterval(() => {
    console.log('Node js 연습중')
}, 3000);

// 3초후 한 번만 실행
setTimeout(() => {
    console.log('타임아웃')
}, 3000);