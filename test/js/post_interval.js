/**
 * Created by honkee on 17-2-16.
 */

var http = require('http');
var timeTools = require("../../lib/timetools");

function postMethod(){
    var qs = require('querystring');
    var nowDateTime = timeTools.nowDateTime();
    var post_data = {
        a: 123,
        time: nowDateTime
    };//这是需要提交的数据

    var content = qs.stringify(post_data);


    var options = {
        hostname: 'honkeechan.cn',
        port: 3008,
        path: '/write_data',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };

    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

// write data to request body
    req.write(content);
    req.end();
}



setInterval(function(){
    postMethod();
}, 1000);