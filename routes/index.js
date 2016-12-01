var express = require('express');
var router = express.Router();

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



module.exports = router;
