var app = angular.module('myApp', ['ngRoute']);

app.directive("navbar", function() {
    return {
        restrict: "E",
        templateUrl: 'template/nav.html',
        controller: 'navUserController',
        replace: true
    }
});

app.directive("list", function() {
    return {
        restrict: "E",
        templateUrl: 'template/indexList.html',
        controller: 'indexListController',
        replace: true
    };
});

app.directive("comment", function() {
    return {
        restrict: "E",
        templateUrl: 'template/commentTpl.html',
        controller: 'commentController',
        replace: true
    };
});

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/index", {
            templateUrl: "template/indexTpl.html",
            controller: "indexController"
        })
        .when("/login", {
            templateUrl: "template/loginTpl.html",
            controller: "loginController"
        })
        .when("/register", {
            templateUrl: "template/registerTpl.html",
            controller: "registerController"
        })
        .when("/setting", {
            templateUrl: "template/settingTpl.html",
            controller: "settingController"
        })
        .when("/loginout", {
            templateUrl: "template/indexTpl.html",
            controller: "loginoutController"
        })
        .when("/writeDown", {
            templateUrl: "template/writeDown.html",
            controller: "writeDownController"
        })
        .when("/selectClass", {
            templateUrl: "template/selectClassTpl.html",
            controller: "selectClassController"
        })
        .when("/articleDetail", {
            templateUrl: "template/articleDetail.html",
            controller: "articleDetailController"
        })
        .when("/userIndex", {
            templateUrl: "template/userIndex.html",
            controller: "userIndexController"
        })
        .when("/classInfo", {
            templateUrl: "template/classInfoTpl.html",
            controller: "classInfoController"
        })

    .when("/search", {
            templateUrl: "template/indexTpl.html",
            controller: "searchController"
        })
        .when("/sortHot", {
            templateUrl: "template/indexTpl.html",
            controller: "sortHotController"
        })
        .when("/sortTime", {
            templateUrl: "template/indexTpl.html",
            controller: "sortTimeController"
        })
        .when("/timeline", {
            templateUrl: "template/timelineTpl.html",
            controller: "timeLineController"
        })

    .otherwise({ redirectTo: "/index" });

}]);


//定义工厂，用于在页面中传值
app.factory('myFactory', function() {
    var putArticle = {};
    var authorId = "";
    var articleIdAndTitle = {};
    var class_id = "";
    var articleId = "";

    //传题文章信息
    var _putArticle = function(article) {
        //alert("文章："+JSON.stringify(article));
        putArticle = article;
    };

    //获取文章信息
    var _getArticle = function() {
        return putArticle;
    };

    //传题文章信息
    var _putArticleId = function(id) {
        //alert("文章："+JSON.stringify(article));
        articleId = id;
    };

    //获取文章信息
    var _getArticleId = function() {
        return articleId;
    };

    //保存查看的作者的id信息
    var _putAuthorId = function(id) {
        authorId = id;
    };

    var _getAuthorId = function() {
        return authorId;
    };

    //页面间传文章id，title
    var _putArticleIdAndTitle = function(article) {
        articleIdAndTitle = article;
    };

    var _getArticleIdAndTitle = function() {
        return articleIdAndTitle;
    };

    var _putClassId = function(classId) {
        class_id = classId;
    };
    var _getClassId = function() {
        return class_id;
    }

    //对外暴露的接口
    return {
        putArticle: _putArticle,
        getArticle: _getArticle,
        putArticleId: _putArticleId,
        getArticleId: _getArticleId,
        putAuthorId: _putAuthorId,
        getAuthorId: _getAuthorId,
        putArticleIdAndTitle: _putArticleIdAndTitle,
        getArticleIdAndTitle: _getArticleIdAndTitle,
        putClassId: _putClassId,
        getClassId: _getClassId,
    };
});

app.controller("indexController", function($scope, $rootScope, $http, myFactory) {
    //alert("id:"+$rootScope.id);
    $scope.articleList = [];
    $http({
        method: "get",
        url: "showArticle",
    }).success(function(response) {
        $scope.articleList = response;

    })
})

//导航栏的控制器
app.controller('navUserController', function($scope, $rootScope, $http, myFactory) {
    //显示默认的用户信息，等待登录
    $rootScope.id = "";
    $rootScope.icon = "../images/icon.jpg";
    $rootScope.isLogin = sessionStorage.getItem('id') != null ? true : false;

    $scope.classList = [];
    //加载全部分类信息
    $http({
        method: "get",
        url: "queryAllClass",
    }).success(function(response) {
        $scope.classList = response;
    })

    $scope.logout = function() {
        $rootScope.id = "";
        $rootScope.icon = "../images/icon.jpg";
        $rootScope.isLogin = sessionStorage.getItem('id') != null ? true : false;
    }

    $scope.toClassInfo = function(clazz) {
        myFactory.putClassId(clazz.class_Id)
        window.location.href = "#/classInfo";
    }

    $scope.toTimeline = function() {
        if ($rootScope.isLogin) {
            window.location.href = "#/timeline";
        } else {
            window.location.href = "#/login";
        }
    }

    //全局的方法
    //查看文章详情
    $rootScope.queryArticleInfo = function(articleId) {
        //带着文章的参数跳到文章详情页
        myFactory.putArticleId(articleId);
        window.location.href = "#/articleDetail";
        //alert("获取："+JSON.stringify(myFactory.getArticle()));
    }

    //查看作者详情
    $rootScope.queryAuthorInfo = function(userId) {
        //      myFactory.putAuthor();
        myFactory.putAuthorId(userId);
        window.location.href = "#/userIndex";
    }
})

//文章列表的控制器
app.controller('indexListController', function($scope, $http) {
    $scope.clazz_id = myFactory.getClassId();
    $scope.articleList = [];
    $http({
        method: "post",
        url: "getArticleInClass",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: $.param({
            'class_Id': $scope.clazz_id,
        })
    }).success(function(response) {
        console.log(response);
        $scope.articleList = response;
    })
})

//分类的控制器
app.controller('classInfoController', function($scope, $rootScope, $http, myFactory) {
    $scope.clazz_id = myFactory.getClassId();
    $scope.clazz = {};

    //根据classid获取class 信息
    $http({
        method: "post",
        url: "loginCheck",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: $.param({ 'class_Id': $scope.clazz_id, }),
    }).success(function(response) {
        $scope.clazz = response;

        $scope.clazz = {
            id: "cc123",
            title: "连载小说",
            discribe: "balabalabala.............balabalabalabalabala.............balabalabalabalabala.............balabalabalabalabala.............balabalabalabalabala.............balabalabalabalabala.............balabala",
            num: 1234,
        }
    })
})

//朋友圈控制器
app.controller("timeLineController", function($scope, $rootScope, $http) {

    $scope.publishArticles = [];
    $scope.publishComment = [];
    $scope.state = true;

    $http({
        method: "get",
        url: "queryClass",
    }).success(function(response) {
        $scope.publishArticles = response;
        $scope.publishArticles = [{
            articleId: "aaa1",
            title: "AngularJS教程",
            creatTime: "2016-9-8",
            updateTime: "2016-9-9",
            user: {
                id: "u111",
                username: "ssssss",
            },
        }, {
            articleId: "aaa1",
            title: "AngularJS教程",
            creatTime: "2016-9-8",
            updateTime: "2016-9-9",
            user: {
                id: "u111",
                username: "ssssss",
            },
        }, {
            articleId: "aaa1",
            title: "AngularJS教程",
            creatTime: "2016-9-8",
            updateTime: "2016-9-9",
            user: {
                id: "u111",
                username: "ssssss",
            },
        }];
    })

    //加载关注的用户发布的文章
    $scope.getArticlesWithUserId = function() {
        $scope.state = true;
        if ($scope.publishArticles.length == 0) {
            $http({
                method: "get",
                url: "queryClass",
            }).success(function(response) {
                $scope.publishArticles = response;
            })
        }
    }

    //加载关注的用户发表的评论
    $scope.getCommentsWithUserId = function() {
        $scope.state = false;
        $http({
            method: "get",
            url: "queryClass",
        }).success(function(response) {
            $scope.publishComment = response;
            $scope.publishComment = [{
                commentId: "ccc123",
                articleId: "aaa456987",
                title:"杂谈1",
                commentTime: "2016-9-9",
                content: "是锤子科技吗？",
                user: {
                    id: "u33333",
                    username: "qqqqqqq",
                },
            }, {
                commentId: "ccc123",
                articleId: "aaa456987",
                title:"杂谈2",
                commentTime: "2016-9-9",
                content: "是锤子科技吗？",
                user: {
                    id: "u33333",
                    username: "qqqqqqq",
                },
            }, {
                commentId: "ccc123",
                articleId: "aaa456987",
                commentTime: "2016-9-9",
                content: "是锤子科技吗？",
                user: {
                    id: "u33333",
                    username: "qqqqqqq",
                },
            }]
        })
    }
})

app.controller("loginController", function($scope, $rootScope, $http) {
    $scope.user = {
        id: "",
        password: "",
        loginCheck: function() {
            $http({
                method: "POST",
                url: "userlogin",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $.param({ 'id': $scope.user.id.toString(), 'password': $scope.user.password.toString() }),
            }).success(function(response) {
                if (response === "1") {
                    sessionStorage.setItem('id', $scope.user.id.toString());
                    $rootScope.isLogin = true;
                    alert("登陆成功！");
                    window.location.href = "#/index";
                }
                if (response === "-1") {
                    alert("欢迎管理员！")
                    window.location.href = "../ArticleClass/indexManagement#/index";
                }
                if (response === "0") alert("密码错误！");
                if (response === "2") alert("用户不存在！");
            });

        }
    }
})
app.controller("registerController", function($scope, $http) {
    $scope.user = {
        id: "",
        password: "",
        passwordagain: "",
        username: "",
        registerCheck: function() {
            $http({
                method: "POST",
                url: "loginCheck",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $.param({
                    'id': $scope.user.id,
                    'password': $scope.user.password,
                    'username': $scope.user.username
                })
            }).success(function(response) {
                if (response === "1") {
                    alert("注册成功！");
                    window.location.href = "#/index";
                }
                if (response === "-1") alert("该昵称已被使用");
                if (response === "2") alert("邮箱已注册！");
            });
        },
        //验证两次输入的密码是否相同
        passwordCheck: function() {
            return ($scope.user.passwordagain != "") && !($scope.user.password == $scope.user.passwordagain);
        },

    }
})

app.controller("settingController", function($scope, $rootScope, $http) {
    $scope.state = 1;
    $scope.manIsSelected = true;
    $scope.womanIsSelected = false;

    $scope.user = {
            //默认显示的数据
            id: "",
            icon: "",
            username: "",
            gender: "1",
            age: "年龄",
            name: "姓名",
            passowrd: "",
            newPassword: "",
            newPasswordAgain: "",
            passwordCheck: function() {
                return ($scope.user.newPasswordAgain != "") &&
                    !($scope.user.newPassword == $scope.user.newPasswordAgain);
            },
        }
        //进入这个页面就会加载的方法
    $http({
        method: "get",
        url: "settingInfo", //查询用户信息的url
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: $.param({
                'id': $scope.user.id,
            }) //从session中获取
    }).success(function(response) {
        if (!response.noLogin) {
            $scope.user.id = response.id;
            $scope.user.icon = response.icon;
            $scope.user.username = response.username;
            $scope.user.gender = response.gender;
            $scope.user.age = response.age;
            $scope.user.name = response.name;
        } else {
            window.location.href = '#login';
        }
    })

    $scope.setState = function(state) {
        $scope.state = state;
    }

    $scope.getState = function() {
        if ($scope.state == 1)
            return true;
        else
            return false;
    }

    $scope.getGender = function() {
        //man
        if ($scope.user.gender === 1)
            return true;
        else
            return false; //woman
    }

    $scope.setGender = function(gender) {
        alert("输出：" + gender);
        $scope.user.gender = gender;
    }

    //修改资料
    $scope.modifyInfo = function() {

        //      $scope.getFile = function () {
        //            fileReader.readAsDataUrl($scope.file, $scope)
        //                          .then(function(result) {
        //                              $scope.imageSrc = result;
        //                          });
        //        };
        $http({
            method: "POST",
            url: "updateInfo", //修改个人信息
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param({
                'id': $scope.user.id,
                'icon': $scope.user.icon,
                'username': $scope.user.username,
                'gender': $scope.user.gender,
                'age': $scope.user.age,
                'name': $scope.user.name,
            })
        }).success(function(response) {
            if (response === "1") {
                alert("修改成功！");
                //        window.location.reload();

            }
        });
    }

    //设置密码
    $scope.setPassword = function() {
        //alert("password:" + $scope.user.password + ",newPassword:" + $scope.user.newPassword + 
        //    ",newPasswordAgain:" + $scope.user.newPasswordAgain);
        $http({
            method: "POST",
            url: "modifyPassWord", //修改个人信息
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param({
                'password': $scope.user.password,
                'newPassword': $scope.user.newPassword,
            })
        }).success(function(response) {
            if (response === "1") {
                alert("修改成功！");
            }
        });
    }

})


app.controller("loginoutController", function($scope, $rootScope, $http) {
    $scope.user = {
        id: "",
        password: "",
        loginOut: function() {

        },
    }
    $http({
        method: "POST",
        url: "loginout",
        // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).success(function(response) {
        sessionStorage.removeItem('id');
        $rootScope.isLogin = false;
        window.location.href = "#/index";
    });
})

app.controller("userIndexController", function($scope, $rootScope, $http, myFactory) {
    $scope.user = {
        id: "",
        username: "",
        fans: 0,
        articleNum: 0,
        age: 0,
    };
    $scope.articleList = [];
    $scope.classList = [];

    $http({
        method: "post",
        url: "getUserArticle",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: $.param({
            'userId': myFactory.getAuthorId(),
        })
    }).success(function(response) {
        console.log(response);
        $scope.user.id = response.id;
        $scope.user.username = response.username;
        $scope.user.fans = response.fans;
        $scope.user.articleNum = response.articleNum;
        $scope.user.age = response.age;

        $scope.classList = response.clazzs;
        $scope.articleList = response.articles;
    })

    //查看文集下的文章
    $scope.queryArticleInClass = function(clazz) {
        $http({
            method: "post",
            url: "getArticleInClass",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param({
                'class_Id': clazz.class_Id,
            })
        }).success(function(response) {
            console.log(response);
            $scope.articleList = response;
            /*
            [{
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
            }]
            */
        })
    }

})

app.controller("articleDetailController", function($scope, $rootScope, $http, myFactory) {

    $scope.collectState = false; //标记用户是否收藏了文章
    $scope.focusState = false; //标记用户是否关注了作者
    $scope.articleId = myFactory.getArticleId();
    $scope.article = {};
    $scope.author = {};
    console.log(myFactory.getArticleId());

    //加载Article数据
    $http({
        method: "post",
        url: "getArticle",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: $.param({
            'articleId': $scope.articleId,
        })
    }).success(function(response) {
        console.log(response);
        $scope.article = response;
        $('section').append($.parseHTML($scope.article.content)[0]);
        $scope.focusState = response.focusState; //当前登录的用户是否关注了这个作者
        $scope.collectState = response.collectState;

    })

    //添加用户收藏文章
    $scope.setCollecteState = function() {
        $scope.collectState = !$scope.collectState;

        $http({
            method: "post",
            url: "addCollection",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param({
                'articleId': $scope.articleId,
            })
        }).success(function(response) {
            if (response)
                $scope.collectState = true;
        })

    }

    //关注
    $scope.setFocusState = function() {
        $scope.focusState = !$scope.focusState;
        $http({
            method: "post",
            url: "loginCheck",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param({
                'articleId': $scope.articleId,
                'focusState': $scope.focusState,
            })
        }).success(function(response) {

        })
    }
})

app.controller("commentController", function($scope, $rootScope, $http) {
    $scope.commentList = [];
    $scope.articleId = myFactory.getArticle().articleId;
    //加载评论列表
    $http({
        method: "post",
        url: "getUserArticle", //"getCommentWithArticle",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: $.param({
            'articleId': $scope.articleId,
        })
    }).success(function(response) {

        $scope.commentList = response;
        /*$scope.commentList = [{
            commentId: "com123",
            useId: "uu123",
            username: "aisjdnaijsd",
            commentTime: "2016-9-10",
            content: "现在转行来得及吗？",
            sonList: [{
                commentId: "com1234",
                useId: "uu333",
                username: "zzzzzz",
                commentTime: "2016-9-12",
                content: "l来不及了",
            }, {
                commentId: "com777",
                useId: "uu999",
                username: "zzz111",
                commentTime: "2016-9-12",
                content: "你可以试试",
            }],
        }, {
            commentId: "com123",
            useId: "uu123",
            username: "aisjdnaijsd",
            commentTime: "2016-9-10",
            content: "现在转行来得及吗？xxx",
            sonList: [{
                commentId: "com1234",
                useId: "uu333",
                username: "zzzzzz",
                commentTime: "2016-9-12",
                content: "l来不及了",
            }, {
                commentId: "com777",
                useId: "uu999",
                username: "zzz111",
                commentTime: "2016-9-12",
                content: "你可以试试",
            }]
        }];*/
        for (var i = 0; i < $scope.commentList.length; i++) {
            $scope.commentList[i].commented = false;
        }
    })

    $scope.setShow = function(comment) {
        comment.commented = !comment.commented;
    }

    //回复评论
    $scope.replyComment = function(comment) {
        if (comment.sonComment) {
            $http({
                method: "post",
                url: "loginCheck", //"replyComment",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $.param({
                    'articleId': $scope.articleId,
                    'content': $scope.content,
                    'parentId:': comment.commentId,
                })
            }).success(function(response) {
                var sonComment = response; //评论成功，返回评论对象，在页面上显示
                /*var sonComment = {
                    commentId: "tttttt",
                    useId: "uu123",
                    username: "test",
                    commentTime: "2016-9-10",
                    content: comment.sonComment,
                    sonList: [],
                    commented: false,
                };*/
                comment.sonList.push(sonComment);
            })
        }
    }

    $scope.content = ""; //对文章的评论
    $scope.commentForArticle = function() {
        alert($scope.content);
        $http({
            method: "post",
            url: "loginCheck", //"commentForArticle",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param({
                'articleId': $scope.articleId,
                'content': $scope.content,
            })
        }).success(function(response) {
            var comment = response; //评论成功，返回评论对象，在页面上显示
            /*var comment = {
                commentId: "tttttt",
                useId: "uu123",
                username: "aisjdnaijsd",
                commentTime: "2016-9-10",
                content: $scope.content,
                sonList: [],
                commented: false,
            };*/
            $scope.commentList.push(comment);
        })
    }
})

app.controller("searchController", function($scope, $rootScope, $http, myFactory) {
    $scope.articleList = [];
    $scope.search = {
        word: '',
        submit: function() {
            console.log("post!");
            sessionStorage.setItem('word', $scope.search.word);
            window.location.href = '#/search';
        }
    };

    $http({
        method: "post",
        url: "searchArticle",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: $.param({
            'word': sessionStorage.getItem('word'),
        })
    }).success(function(response) {
        $scope.articleList = response;

    })
})

app.controller("sortHotController", function($scope, $rootScope, $http, myFactory) {
    $scope.articleList = [];


    $http({
        method: "post",
        url: "sortByHot",

    }).success(function(response) {
        $scope.articleList = response;

    })
})

app.controller("sortTimeController", function($scope, $rootScope, $http, myFactory) {
    $scope.articleList = [];


    $http({
        method: "post",
        url: "sortByTime",

    }).success(function(response) {
        $scope.articleList = response;

    })
})

app.controller("writeDownController", function($scope, $rootScope, $http, myFactory) {
    $scope.article = {
        id: "",
        title: "",
    }
    $scope.submitArticl = function() {
        var html = testEditor.getHTML();
        $http({
            method: "post",
            url: "createArticle",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param({
                'title': myFactory.getArticle().articleId,
                'content': html,
            })
        }).success(function(response) {
            //返回文章id
            $scope.article.id = response;
            myFactory.putArticleIdAndTitle($scope.article);
            alert("发布成功！！" + html);
            window.location.href = "#/selectClass";
        })
    }
})

app.controller("selectClassController", function($scope, $rootScope, $http, myFactory) {
    $scope.classList = [];
    //获取
    $scope.article = myFactory.getArticleIdAndTitle();

    $http({
        method: "get",
        url: "queryClass", //查询所有分类的id和title

    }).success(function(response) {
        //返回class列表
        $scope.classList = response;

        for (var i = 0; i < response.length; i++) {
            $scope.classList[i].selected = false;
        }

    })

    $scope.select = function(_class) {
        _class.selected = !_class.selected;
    }

    //提交加入加入专题的申请
    $scope.submitClass = function() {
        var list = $scope.classList.filter(function(item) {
            return item.selected; //如果item已经被选中，就返回true
        });
        var selectedClassList = [];
        for (var i = 0; i < list.length; i++)
            selectedClassList[i] = list[i].class_Id;
        //alert(JSON.stringify(selectedClassList)+"articleId:"+$scope.article.id);
        $http({
            method: "post",
            url: "searchArticle",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param({
                'articleId': $scope.article.id,
                'class_Ids': JSON.stringify(selectedClassList),
            })
        }).success(function(response) {
            if (response == 1)
                alert("申请成功，等待审核!");
        })
    }
})
