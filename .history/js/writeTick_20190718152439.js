var fs = require('fs'); // 引入fs模块
 
fs.readFile('./try4.txt', 'utf-8', function(err, data) {
    if (err) {
        throw err;
    }
    console.log(data);
});