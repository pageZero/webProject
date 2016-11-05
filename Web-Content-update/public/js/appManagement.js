var app = angular.module('appManagement', ['ngRoute']);

app.directive("navbar", function() {
    return {
        restrict: "E",
        templateUrl: 'template-management/nav',
        // controller: 'navUserController',
        replace: true
    }
});

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/index", {
            templateUrl: "template-management/indexTpl",
            controller: "indexController"
        })
        .when("/article", {
            templateUrl: "template-management/articleMngTpl",
            controller: "articleController"
        })
        .when("/system", {
            templateUrl: "template-management/systembackupsTpl",
            controller: "systembackupsController"
        })
        .when("/records", {
            templateUrl: "template-management/recordsTpl",
            controller: "recordsController"
        })

    .otherwise({ redirectTo: "/index" });

}]);

app.controller("indexController", function($scope, $http) {

    //查询到的文章列表
    $scope.classList = [];

    //网络请求，查询到文章俩表相关的数据
    $http({
        method: "GET",
        url: "classify", //查询文章列表的url地址
    }).success(function(response) {
        $scope.classList = response; //放回json字符串
        
//        $scope.classList = [{
//            classId: 0001,
//            title: '程序员',
//            discribe: '收集编程相关的文章',
//            articlenum: 15
//
//        }, {
//            classId: 0002,
//            title: '生活小技巧',
//            discribe: '收集生活小技巧的文章',
//            articlenum: 30
//        }]
        
    });

    //删除
    $scope.delete = function(item) {
        //发送请求，删除数据
        //alert("id:"+item.classId);

        $http({
            method: "post",
            url: "deleteclass", //处理删除class的url
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param({
                'class_id': item.classId,
            })
        }).success(function(response) {
            if (response == 1) {
                alert("删除成功");
                //重新加载
                window.location.reload();
            } else {
                alert("删除失败");
                window.location.reload();
            }

        });

    };

    //查看专题详情,跳转到查看专题详情页，参数classId
    $scope.queryClass = function(item) {
        alert("跳转到其他页面，id=" + item.classId);
    };

    //修改
    $scope.modifyClass = function(item) {
        alert("跳转到其他页面，id=" + item.classId);
    }

})

app.controller("articleController", function($scope, $http) {

    //查询到的文章列表
    $scope.articleList = [];

    //网络请求，查询到文章相关的数据
    $http({
        method: "get",
        url: "findarticle", //查询BelongtoKey列表的url地址
    }).success(function(response) {
        $scope.articleList = response; //放回json字符串
        /*
        $scope.articleList = [{
            articleId: 1005,
            title: '算法-链表(一)',
            classTitle: '程序员',
            classId: 100,
            creatTime: '2016-9-12',

        }, {
            articleId: 1004,
            title: '生活小智慧',
            classTitle: '生活',
            classId: 100,
            creatTime: '2016-9-7',
        }]*/

    });

    //查看文章，点击文章进入文章详情页
    $scope.queryArticle = function(article) {
        alert("跳转到文章详情页，发送网络请求，查询文章详细信息" + article.articleId);
    }

    $scope.queryClass = function(article) {
        alert("跳转到文章详情页，发送网络请求，查询专题信息" + article.classId);
    }

    //删除
    $scope.delete = function(article) {
        $http({
            method: "post",
            url: "deletearticle", //修改申请状态的utl地址
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param({
                'article_id': article.articleId,
                'class_id': article.classId
            })
        }).success(function(response) {
            //$scope.classList = JSON.stringify(response); //放回json字符串
            if (response == 1) {
                alert("删除成功！");
                //重新加载
                window.location.reload();
            } else {
                alert("删除失败，请稍后重试！");
                window.location.reload();
            }
        });
    }

    //审核通过，修改BelongtoKey表
    $scope.setState = function(article) {
        //alert("请求参数：articleId-"+article.articleId+"classId-"+article.classId);
        $http({
            method: "post",
            url: "/index", //修改申请状态的utl地址
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param({
                'articleId': article.articleId,
                'classId': article.classId
            })
        }).success(function(response) {
            //$scope.classList = JSON.stringify(response); //放回json字符串
            if (response == 1) {
                alert("处理成功！");
                //重新加载
                window.location.reload();
            } else {
                alert("处理失败，请稍后重试！");
            }
        });
    }

    //拒绝发布，对用户发送系统信息，拒绝发布
    $scope.reject = function(article) {
        //alert("请求参数：articleId-"+article.articleId+"classId-"+article.classId);
        $http({
            method: "post",
            url: "/index", //处理“拒绝发布”的utl地址
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param({
                'articleId': article.articleId,
                'classId': article.classId
            })
        }).success(function(response) {
            if (response == 1) {
                alert("处理成功！");
                //重新加载
                window.location.reload();
            } else {
                alert("处理失败，请稍后重试！");
            }
        });
    }
})

//不知道写什么
app.controller("systembackupsController", function($scope, $http) {
    //查询备份记录
    $scope.backupsRecords = [];

    //网络请求，查询到文章俩表相关的数据
    $http({
        method: "get",
        url: "/index",
    }).success(function(response) {
        //$scope.backupsRecords = JSON.stringify(response); //放回json字符串


    });
})

app.controller("recordsController", function($scope, $http) {
    $scope.userRecords = [];

    $scope.th1 = "用户ID";
    $scope.th2 = "用户名";
    $scope.th3 = "注册时间";
    $scope.th4 = "最近登录时间";

    //网络请求，查询到文章俩表相关的数据
    $http({
        method: "get",
        url: "finduser", //查询用户登录的url地址
    }).success(function(response) {
        $scope.userRecords = response; //放回json字符串

        /*
        $scope.userRecords = [{
            data1: 0001,
            data2: 'dsjifn',
            data3: '2016-4-3',
            data4: '2016-9-4',
            /*用data来接收，其实传回的数据类似于下面，用户id,username,registTime,lastLoginIn
            id: 0001,
            username: 'dsjifn',
            registTime: '2016-4-3',
            lastLoginIn: '2016-9-4'

        }, {
            data1: 2016,
            data2: '酱酱酱~',
            data3: '2016-4-3',
            data4: '2016-9-4',
        }]*/
    
    });

//    //获取登录记录
//    $scope.getLoginRecords = function() {
//        $scope.th1 = "用户ID";
//        $scope.th2 = "用户名";
//        $scope.th3 = "注册时间";
//        $scope.th4 = "最近登录时间";
//
//        $http({
//            method: "get",
//            url: "finduser", //查询用户登录的url地址
//        }).success(function(response) {
//            $scope.userRecords = JSON.stringify(response); //放回json字符串
//        /*
//            $scope.userRecords = [{
//                data1: 0001,
//                data2: 'dsjifn',
//                data3: '2016-4-3',
//                data4: '2016-9-4'
//                    /*用data来接收，其实传回的数据类似于下面，用户id,username,registTime,lastLoginIn
//                    id: 0001,
//                    username: 'dsjifn',
//                    registTime: '2016-4-3',
//                    lastLoginIn: '2016-9-4'
//                    
//            }, {
//                data1: 2016,
//                data2: '酱酱酱~',
//                data3: '2016-4-3',
//                data4: '2016-9-4'
//            }]
//        */
//        });
//    }
//
//    //获取注册记录
//    $scope.getRegistRecords = function() {
//
//        $scope.th1 = "用户ID";
//        $scope.th2 = "用户名";
//        $scope.th3 = "注册时间";
//        $scope.th4 = "最近登录时间";
//
//        $http({
//            method: "get",
//            url: "/index", //查询用户注册的url地址
//        }).success(function(response) {
//            $scope.userRecords = JSON.stringify(response); //放回json字符串
//        /*
//            $scope.userRecords = [{
//                data1: 2016,
//                data2: '酱酱酱~',
//                data3: '2016-4-3',
//                data4: '2016-9-4'
//
//                /*用data来接收，其实传回的数据类似于下面，用户id,username,registTime,lastLoginIn
//                id: 2016,
//                username: '酱酱酱~',
//                registTime: '2016-4-3',
//                lastLoginIn: '2016-9-4'
//                
//            }, {
//                data1: 0001,
//                data2: 'dsjifn',
//                data3: '2016-4-3',
//                data4: '2016-9-4'
//            }]
//        */
//        });
//    }
//
//    $scope.getPublishRecords = function() {
//
//        $scope.th1 = "用户名";
//        $scope.th2 = "文章";
//        $scope.th3 = "发布时间";
//        $scope.th4 = "最近更新时间";
//
//        $http({
//            method: "get",
//            url: "/index", //查询用户注册的url地址
//        }).success(function(response) {
//             $scope.userRecords = response; //放回json字符串
//        /*
//            $scope.userRecords = [{
//                data1: 0001,
//                data2: 'dsjifn',
//                data3: '2016-4-3',
//                data4: '2016-9-4'
//               //用data来接收，其实传回的数据应该是username,title(文章标题),publishTime,updateTime.
//            }]
//            */
//        });
//    }

})
