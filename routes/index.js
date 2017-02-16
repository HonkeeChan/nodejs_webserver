var express = require('express');
var router = express.Router();
formidable = require('formidable');
fs = require('fs');
var logger = require("../lib/log").logger;
var timeTools = require("../lib/timetools");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//测试了一下post请求中ContentType对我们服务器的影响，结果是只有ContentType为
// application/x-www-form-urlencoded形式的ContentType才能正常的Parse成json
// 的结果。

router.get('/post_test', function (req, res) {
  res.render("post_test");
});

router.post('/post_json', function (req, res) {
  console.log('json', req.body);
  console.log('json', req.query);
  console.log('json', req.params);
  res.json({});
});

router.post('/urlencoded', function (req, res) {
  console.log('urlencoded', req.body);
  console.log('urlencoded', req.query);
  console.log('urlencoded', req.params);
  res.json({});
});

router.post('/formurlencoded', function (req, res) {
  console.log('formurlencoded', req.body);
  console.log('formurlencoded', req.query);
  console.log('formurlencoded', req.params);
  res.json({});
});

router.post('/multipart', function (req, res) {
  console.log('multipart', req.body);
  console.log('multipart', req.query);
  console.log('multipart', req.params);
  res.json({});
});

router.post('/html', function (req, res) {
  console.log('html', req.body);
  console.log('html', req.query);
  console.log('html', req.params);
  res.json({});
});

router.post('/default', function (req, res) {
  console.log('detault', req.body);
  console.log('detault', req.query);
  console.log('detault', req.params);
  res.json({});
});


router.post('/multiNameForm',function (req, res) {
  console.log('formurlencoded, body', req.body);
  console.log('formurlencoded, params', req.params);
  res.json({});
});

router.post("/cordovaPhoto", function (req, res) {
  console.log("cordova photo, ",req.body);
  res.header("Access-Control-Allow-Origin", "*");
  res.json({});
});

router.post("/fileUpload", function (req, res) {
  var UPLOAD_FOLDER = 'upload';
  console.log("fileUpload body, ",req.body);
  console.log("fileUpload params, ",req.params);
  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';		//设置编辑
  form.uploadDir = 'public/' + UPLOAD_FOLDER;	 //设置上传目录
  form.keepExtensions = true;	 //保留后缀
  form.maxFieldsSize = 5 * 1024 * 1024;   //文件大小

  form.parse(req, function(err, fields, files) {

    if (err) {
      res.locals.error = err;
      res.json({code: -1, err: JSON.stringify(err)});
      return;
    }

    var avatarName = Math.random() + '.' + files.file.name;
    var newPath = form.uploadDir + avatarName;

    console.log(newPath);
    fs.renameSync(files.file.path, newPath);  //重命名
  });

  res.locals.success = '上传成功';
  res.json({code: 0});
});

router.get('/write_data', function (req, res) {
  var nowDateTime = timeTools.nowDateTime();
  logger.info("post write data, " + nowDateTime);
  res.render("post_test");
});
router.post('/write_data', function (req, res) {
  var nowDateTime = timeTools.nowDateTime();
  logger.info("post write data, " + nowDateTime);
  res.json({
    time: nowDateTime
  });
});

module.exports = router;
