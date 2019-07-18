var fs = require('fs'); // 引入fs模块
 
fs.readFile('./index.html', 'utf-8', function(err, data) {
    if (err) {
        throw err;
    }
    console.log(data);
});