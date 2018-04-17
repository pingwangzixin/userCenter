app.controller("mUpdataParentCtrl", ['$scope', '$http', '$stateParams', '$state',function ($scope, $http, $stateParams,$state) {
    //添加授课单选默认值
    var parentId = $stateParams.parentsCard;
    //获取家长信息
    $http.post(requireIp + '/uc/ucUser/findUserInfoUserId', {
            userId: parentId
            , userType: 3
        }).success(function (res) {
            $scope.realname = res.data.parInfo.realname;
            $scope.userMobile = res.data.parInfo.userMobile;
            $scope.stuInfo = res.data.stuInfo;
            $scope.username=res.data.parInfo.loginName;
        })
        //取子女关系
    $http.get('file/family.json').success(function (res) {
            $scope.family = res.data
        })
        //提交家长信息
    $scope.xgjzxx = function () {
    	
        //姓名空验证
        if ($scope.realname == "" || $scope.realname==undefined) {
            $(".nameerro").show();
            return
        }
        
        if($scope.stuInfo[0].realname==""){
        	$(".nameerro2").show();
            return
        }
        
        if($scope.stuInfo[0].stuNo==""){
        	$(".shoujihao").show();
            $(".shoujihao .gy_con span").html("请填写学籍号");
            setTimeout(function () {
                $(".shoujihao").hide()
            }, 1500);
            return false;
        }
        
        //学籍号验证
        var regExp = /^[G|L][1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        if(regExp.test($scope.stuInfo[0].stuNo)==false){
        	$(".shibai").show();
            $(".shibai .gy_con p i").html("请输入正确的学籍号")
            setTimeout(function () {
                $(".shibai").hide();
            }, 1000)
            
            return;
        }
        
        //手机空验证
        if ($scope.userMobile == "" || $scope.userMobile == undefined) {
            $(".shoujierro").show();
            return
        }
        //手机号验证
        var reg = /^((13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8})$/
        if (reg.test($scope.userMobile) == false) {
            $(".shoujihao").show();
            $(".shoujihao .gy_con span").html("请填写正确的手机号");
            setTimeout(function () {
                $(".shoujihao").hide()
            }, 2000);
            return false;
        }
        $scope.uid = parentId
        //获取新的数据
        $scope.parInfo={
            id:$scope.uid,
            realname:$scope.realname,
            userMobile:$scope.userMobile,
        }
        
        console.log()
        console.log()
        
        $scope.jsonData={
            parInfo:$scope.parInfo,
            stuInfo:$scope.stuInfo
        }
        
        $scope.userObj = {
            jsonData:angular.toJson($scope.jsonData)
        };
        $scope.love=true;
        $http.post(requireIp + "/uc/ucUser/updateParInfoByTea", $scope.userObj).success(function (res) {
            console.log(res)
            if(res.ret==200){
                 $(".chenggong").show();
                setTimeout(function () {
                    $(".chenggong").hide();
                    $scope.love=false;
                    $state.go('teacher_index.parents_handle')
                }, 1000)
            }else{
                $(".shibai").show();
                $(".shibai .gy_con p i").html(res.message)
                setTimeout(function () {
                    console.log(res.message)
                    $scope.love=false;
                    $(".shibai").hide();
                }, 1000)
            }
        })
    }
    	$scope.wx_erro = true
    }])