

function showLogMessage(msg){
    console.log('--------------------------------')
    console.log(`로그 메시지는 : ${msg}`)
    console.log('--------------------------------')
}

function showLogMessage2(msg){
    console.log('================================')
    console.log(`로그 메시지2는 : ${msg}`)
    console.log('================================')
}

const precious_value =78


//  이 함수를 다른 파일에서도 사용할 수 있게 해주려면
//  -> Module 로 사용되게 하려면

module.exports.showLogMessage = showLogMessage
module.exports.showLogMessage2 = showLogMessage2
module.exports.pvalue = precious_value
