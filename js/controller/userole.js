app.controller('userole', ['$scope', '$state', '$timeout', '$http', 'loginService', '$timeout', function ($scope, $state, $timeout, $http, loginService, $timeout) {
    var currentPage = 1
    var pageSize = 10;
    $scope.state = {
        warningShow: true
        , addroleTc: true
        , wx_del: true
        , addrole: true
        , bianjirole: true
        , totleuser: 0
    }
    $scope.userroles = []
        //批量删除和全选操作
        //创建变量用来保存选中结果，作为你选取的checkbox的存储器
    $scope.selected = [];
    var updateSelected = function (action, id) {
        if (action == 'add' && $scope.selected.indexOf(id) == -1) $scope.selected.push(id);
        if (action == 'remove' && $scope.selected.indexOf(id) != -1) $scope.selected.splice($scope.selected.indexOf(id), 1);
    };
    $scope.updateSelection = function ($event, id) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    };
    //全选操作 
    $scope.selectAll = function ($event) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        for (var i = 0; i < $scope.userroles.length; i++) {
            var contact = $scope.userroles[i];
            updateSelected(action, contact.id);
        }
    };
    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };
    $scope.isSelectedAll = function () {
        // 判断当前内容是否全部被选中，
        return $scope.selected.length === $scope.userroles.length;
    };
    $http.post(requireIp + '/uc/ucRole/findRoleList', {
        pageNo: currentPage
        , pageSize: pageSize
    }).success(function (res) {
        if (res.ret == 200) {
            $scope.userroles = res.data.findList;
            $scope.state.totleuser = res.data.count;
            $scope.contentpageConfig.totalItems = res.data.count;
        }else{
            $scope.userroles=0;
            $scope.state.totleuser=0
        }
    })
    $http.get(requireIp + '/uc/ucMenu').success(function (res) {
        $scope.quanxians = res.data.list;
    })
    $scope.sctypes = [
        {
            "id": 2
            , "name": "市级"
        }
        , {
            "id": 3
            , "name": "区县级"
        }
        , {
            "id": 4
            , "name": "学校"
        }
    , ]
    $scope.gxfw = "";
    //分页初始化配置
    $scope.contentpageConfig = {
            currentPage: 1
            , pagesLength: 10
            , totalItems: 11
            , itemsPerPage: pageSize
            , perPageOptions: [10]
            , onChange: function () {
                var currentPage = this.currentPage;
                $http.post(requireIp + '/uc/ucRole/findRoleList', {
                    pageNo: currentPage
                    , pageSize: pageSize
                }).success(function (res) {
                    if (res.ret == 200) {
                        $scope.userroles = res.data.findList;
                        $scope.state.totleuser = res.data.count;
                        $scope.contentpageConfig.totalItems = res.data.count;
                    }
                })
            }
        }
        //删除用户
    $scope.deluserrole = function () {
            console.log($scope.selected)
            console.log($scope.userroles.length)
            $scope.state.wx_del = false;
            $scope.state.sureDeletContent = "您确定要删除吗？";
            $scope.suredel = function () {
                if ($scope.selected == "") {
                    $scope.state.wx_del = false;
                    $scope.state.sureDeletContent = "请先勾选要删除的角色";
                    $timeout(function () {
                        $scope.state.wx_del = true;
                    }, 1500)
                    return false;
                }
                var idsarr = $scope.selected.toString();
                $http.post(requireIp + '/uc/ucRole/updateManyRole', {
                    ids: idsarr
                }).success(function (res) {
                    if (res.ret == 200) {
                        $scope.state.wx_del = true;
                        $(".tijiaocgtc").show();
                        $(".tijiaocgtc .gy_con p i").html(res.message);
                        setTimeout(function () {
                            $(".tijiaocgtc").hide();
                            $http.post(requireIp + '/uc/ucRole/findRoleList', {
                                pageNo: currentPage
                                , pageSize: pageSize
                            }).success(function (res) {
                                if (res.ret == 200) {
                                    $scope.selected = [];
                                    $scope.userroles = res.data.findList;
                                    $scope.state.totleuser = res.data.count;
                                    $scope.contentpageConfig.totalItems = res.data.count;
                                    $scope.state.wx_del = true;
                                }else{
                                    $scope.userroles=0;
                                    $scope.state.totleuser=0
                                }
                            })
                        }, 1500)
                    }
                    else {
                        $(".tijiaosbtc").show();
                        $(".tijiaosbtc .gy_con i").html(res.message);
                        setTimeout(function () {
                            $(".tijiaosbtc").hide();
                        }, 1500)
                    }
                })
            }
        }
        //新增角色弹窗
    $scope.newuserrole = function () {
        $scope.state.addroleTc = false;
        $scope.tianjia_btn = false;
    }
    $scope.guanbi = function () {
            $scope.state.addroleTc = true;
            $scope.roleName = "";
            $scope.gxfw = "";
            $scope.remarkName = "";
        }
        //点击选中权限，添加样式；
    $scope.addqx = function (e, i) {
            i.check = !i.check;
            $scope.guanbi = function () {
                var objs = $scope.quanxians;
                angular.forEach(objs, function (data, index, array) {
                    data.check = false
                });
                $scope.state.addroleTc = true;
                $scope.roleName = "";
                $scope.gxfw = "";
                $scope.remarkName = "";
                $scope.state.addroleTc = true;
            }
        }
        //确认添加角色
    $scope.wx_sure_btn = function () {
        //非空验证
        if ($scope.roleName == "" || $scope.roleName == undefined) {
            $(".tijiaosbtc").show();
            $(".tijiaosbtc .gy_con i").html("请输入角色名称!");
            setTimeout(function () {
                $(".tijiaosbtc").hide();
            }, 1500)
            return;
        }
        if ($scope.gxfw == "") {
            $(".tijiaosbtc").show();
            $(".tijiaosbtc .gy_con i").html("请选择管辖范围!");
            setTimeout(function () {
                $(".tijiaosbtc").hide();
            }, 1500)
            return;
        }
        var xz = []
        for (var i = 0; i < $scope.quanxians.length; i++) {
            var liactive = $(".wx_ul li").eq(i).hasClass("active");
            if ($(".wx_ul li").eq(i).hasClass("active") == true) {
                xz.push($(".wx_ul li").eq(i).children("em").html())
            }
        };
        idsarr = xz.toString();
        $http.post(requireIp + '/uc/ucRole/', {
            name: $scope.roleName
            , scope: $scope.gxfw
            , mid: idsarr
            , remark: $scope.remarkName
        }).success(function (res) {
            if (res.ret == 200) {
                $scope.state.wx_del = true;
                $(".tijiaocgtc").show();
                $(".tijiaocgtc .gy_con p i").html(res.message);
                setTimeout(function () {
                    $(".tijiaocgtc").hide();
                    $http.post(requireIp + '/uc/ucRole/findRoleList', {
                        pageNo: currentPage
                        , pageSize: pageSize
                    }).success(function (res) {
                        if (res.ret == 200) {
                            $scope.userroles = res.data.findList;
                            $scope.state.totleuser = res.data.count;
                            $scope.contentpageConfig.totalItems = res.data.count;
                            $scope.state.addroleTc = true;
                            //添加成功后清空弹窗内容
                            $scope.roleName = "";
                            $scope.gxfw = "";
                            $scope.remarkName = "";
							var objs = $scope.quanxians;
							angular.forEach(objs, function (data, index, array) {
								data.check = false;
							});
							
                        }else{
                            $scope.userroles=0;
                            $scope.state.totleuser=0
                        }
                    })
                }, 1500)
            }
            else {
                $(".tijiaosbtc").show();
                $(".tijiaosbtc .gy_con i").html(res.message);
                setTimeout(function () {
                    $(".tijiaosbtc").hide();
                }, 1500)
            }
        })
    }
}])
app.filter("sctypesFilter", function () {
    return function (val) {
        var res = "";
        if (val == 2) {
            res = "市级"
        }
        if (val == 3) {
            res = "区县级"
        }
        if (val == 4) {
            res = "学校"
        }
        return res;
    }
});