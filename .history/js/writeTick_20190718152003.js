var fs = require('fs'); // 引入fs模块
 
// 写入文件内容（如果文件不存在会创建一个文件）
// 传递了追加参数 { 'flag': 'a' }
fs.writeFile('./ticket.html', `
<h3 align="center">永辉</h3>
<div style="float:left;">收银员: 收银员1</div>
<div style="float:right;">日期: 2018-08-08</div>
<hr style="border-top: 1px dotted #8c8b8b;" />
<table border="0" width="100%">
    <tr>
        <td>品名</td>
        <td align="right">数量</td>
        <td align="right">金额</td>
    </tr>
    <tr>
        <td>绿箭口香糖</td>
        <td align="right">1</td>
        <td align="right">1.50</td>
    </tr>
    <tr>
        <td>奥利奥</td>
        <td align="right">2</td>
        <td align="right">16.00</td>
    </tr>
    <tr>
        <td>黑人牙膏</td>
        <td align="right">1</td>
        <td align="right">10.50</td>
    </tr>
</table>
<hr style="border-top: 1px dotted #8c8b8b;" />
<div align="right"><font size="2" style="font-weight: bold;">小计: 28.00</font></div>
<p align="center"><font size="3" style="font-weight: bold;">谢谢您的光临</font></p>
`, { 'flag': 'a' }, function(err) {
    if (err) {
        throw err;
    }
 
    console.log('Hello.');
 
    // 写入成功后读取测试
    fs.readFile('./try4.txt', 'utf-8', function(err, data) {
        if (err) {
            throw err;
        }
        console.log(data);
    });
});