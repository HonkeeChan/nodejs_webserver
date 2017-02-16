/**
 * Created by honkee on 17-2-16.
 */

var page = require('webpage').create();
// video url must have http:// suffix
//var videoUrl = phantom.args[0];
var videoUrl = "http://honkeechan.cn:3008/write_data";
var videoTitle = null;
var playVideo = null;
window.setTimeout(function(){
    phantom.exit();
},  3* 60 * 60 * 1000);

//it is a timer for the same page.
//if it redirect to other video page because this video has finish
// we will kill the browser.
window.setInterval(function(){
    if(videoTitle != null && videoTitle != page.title){
        //console.log(videoTitle);
        phantom.exit();
    }
}, 1000);