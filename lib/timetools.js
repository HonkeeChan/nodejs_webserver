/**
 * Created by honkee on 17/1/3.
 */

(function () {
    var common = require("./common");
    function TimeTools() {}

    TimeTools.prototype.isTime = function(timestr){
        var timeReg = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
        return timeReg.test(timestr);
    };

    /**
     * 通过Date.getYear()返回的时间判断传入的时间是不是时间，如果不是，getYear()返回NaN。
     * @param datetime
     * @returns {boolean}
     */
    TimeTools.prototype.isDateTime = function (datetime) {
        var dt = new Date(datetime);
        return dt.getYear() ? true: false;
    };

    /**
     * datetime2 - datetime1
     * @param datetime1
     * @param datetime2
     */
    TimeTools.prototype.dateTimeDistance = function(datetime1, datetime2){
        if(this.isDateTime(datetime1) && this.isDateTime(datetime2)){
            return (Date.parse(new Date(datetime2)) - Date.parse(new Date(datetime1)))/1000
        }else{
            return null;
        }
    };

    /**
     * 秒数是正整数
     * @param datetime
     * @param seconds
     */
    TimeTools.prototype.dateTimeAddSeconds = function(datetime, seconds){
        if(this.isDateTime(datetime) && seconds >= 0){
            var datetimeSecond = Date.parse(new Date(datetime));
            var dateTimeAdded =  new Date(datetimeSecond + 1000 * seconds);
            return this.dateTimeFormat(dateTimeAdded);
        }else{
            return null;
        }
    };

    TimeTools.prototype.addDays = function(date, days){
        var d=new Date(date);
        d.setDate(d.getDate()+days);
        return d;
    };
    /**
     * 输入日期和格式，返回对应的格式化字符串。
     *  格式化字符串例子： "yyyy-MM-dd hh:mm:ss"
     * @param datetime
     * @param formater
     * @constructor
     */
    TimeTools.prototype.dateTimeFormat = function(datetime, formater){
        if(common.empty(formater)){
            formater = "yyyy-MM-dd hh:mm:ss";
        }
        return new Date(datetime).Format(formater);
    };

    TimeTools.prototype.nowDateTime = function () {
        return this.dateTimeFormat(new Date());
    };

    /**
     * 将 xx:xx:xx的时间转换为今天逝去的秒数（从00:00:00开始）
     * @param timeStr
     * @returns {number}
     */
    TimeTools.prototype.time2second = function (timeStr) {
        if(this.isTime(timeStr)){
            var timeArr = timeStr.split(":");
            var sec = parseInt(timeArr[0]) * 3600 + parseInt(timeArr[1]) * 60 + parseInt(timeArr[2]);
            return sec;
        }else{
            return -1;
        }
    };


    /**
     * 将今天逝去的秒数（从00:00:00开始）转换为xx:xx:xx的时间格式
     * @param timeInt
     * @returns {*}
     */
    TimeTools.prototype.second2time = function (timeInt) {
        if(timeInt >=0 && timeInt < 86400){
            var h = parseInt(timeInt / 3600);
            timeInt = timeInt % 3600;
            var m = parseInt(timeInt / 60);
            timeInt = timeInt % 60;
            var s = parseInt(timeInt);

            h = h > 9 ? "" + h : "0" + h;
            m = m > 9 ? "" + m : "0" + m;
            s = s > 9 ? "" + s : "0" + s;
            return h + ":" + m + ":" + s;
        }else{
            return null;
        }
    };

    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };


    module.exports = new TimeTools();
})();