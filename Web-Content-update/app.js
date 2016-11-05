var express = require("express");
var app = express();

app.use("/", express.static(__dirname + "/public"));

app.get("/index", function(req, res) {
    var article = {
        title: "卡苏可钉趾蛙 Plectrohyla dasypus",
        content: "在过去几十年里，两栖动物已经饱受壶菌的入侵。这种恶性流行病似乎会干扰蛙类皮肤里的角蛋白，使得它们呼吸困难，无法调节电解质，从而引发心脏病。",
        img_src: "images/1.jpg"
    }
    res.end(JSON.stringify(article));
});

app.post("/registerCheck", function(req, res) {
    //从req.body中取出用户名和密码   与数据库中数据校验
    res.end("1");

})
app.post("/loginCheck", function(req, res) {
    //从req.body中取出用户名和密码   与数据库中数据校验
    res.end("1");

})
app.post("/getUserArticle", function(req, res) {
    //用户主页的数据
    var userInfo = {
        id: "1234",
        username: "zero",
        fans: 120,
        articleNum: 30,
        age: 21,
        clazzs: [
            { class_Id: "2223", title: "Android开发" },
            { class_Id: "2224", title: "算法" }
        ],
        articles: [{
            articleId: "aaa331",
            publishTime: '2016-9-3',
            title: 'AngularJS教程',
            looknum: 348,
            commentnum: 23,
            collections: 36,
        }, {
            articleId:"aaa332",
            publishTime:'2016-9-3',
            title:'AngularJS教程',
            looknum:348,
            commentnum:23,
            collections:36,
        }, {
            articleId:"aaa332",
            publishTime:'2016-9-3',
            title:'AngularJS教程',
            looknum:348,
            commentnum:23,
            collections:36,
        }, {
            articleId:"aaa332",
            publishTime:'2016-9-3',
            title:'AngularJS教程',
            looknum:348,
            commentnum:23,
            collections:36,
        }, {
            articleId:"aaa332",
            publishTime:'2016-9-3',
            title:'AngularJS教程',
            looknum:348,
            commentnum:23,
            collections:36,
        }, {
            articleId:"aaa332",
            publishTime:'2016-9-3',
            title:'AngularJS教程',
            looknum:348,
            commentnum:23,
            collections:36,
        }, {
            articleId:"aaa332",
            publishTime:'2016-9-3',
            title:'AngularJS教程',
            looknum:348,
            commentnum:23,
            collections:36,
        }]
    };
    res.end(JSON.stringify(userInfo));

})
app.get("/queryClass", function(req, res) {
    //从req.body中取出用户名和密码   与数据库中数据校验
    var classList = [{
            class_Id: "1001",
            title: "程序员",
            num: 12,
        }, {
            class_Id: "1002",
            title: "数据库设计",
            num: 120,
        }

    ]
    res.end(JSON.stringify(classList));
})


app.listen(3000);
