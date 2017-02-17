/**
 * Created by honkee on 17-2-16.
 */

var page = require('webpage').create();
// video url must have http:// suffix
//var videoUrl = phantom.args[0];
var videoUrl = "http://127.0.0.1:3008/write_data";
page.open(videoUrl , function () {
    window.setInterval(function(){
        page.reload();
    }, 10000);
});


