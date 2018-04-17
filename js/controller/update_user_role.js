 app.controller('update_user_role', ['$scope', '$http', '$stateParams', '$state', function ($scope, $http, $stateParams, $state) {
     //从session中取用户id
     $scope.userid = $stateParams.userRoleId; //用户id
    //获取权限列表
     $http.get(requireIp + '/uc/ucMenu').success(function (res) {
         $scope.quanxians = res.data.list;
         //根据用户ID获取当前用户的信息和权限列表
         $http.post(requireIp + '/uc/ucRole/selectOneById', {
             id: $scope.userid
         }).success(function (res) {
             $scope.roleName = res.data.ucRole.name;
             $scope.gxfw = res.data.ucRole.scope;
             $scope.qx = res.data.midList;
             for (var i = 0; i < $scope.qx.length; i++) {
                 angular.forEach($scope.quanxians, function (data, index, arry) {
                     if ($scope.qx[i] == data.id) {
                         data.check = true;
                     }
                 })
             }
             $scope.remarkName = res.data.ucRole.remark;
         })
     })
     
     
     
     //点击选中权限，添加样式；
     $scope.addqx = function (e, i) {
         i.check = !i.check;
     }
     
     //确认修改
     $scope.wx_sureupdate_btn = function () {
         var xz = []
         for (var i = 0; i < $scope.quanxians.length; i++) {
             var liactive = $(".wx_ul li").eq(i).hasClass("active");
             if ($(".wx_ul li").eq(i).hasClass("active") == true) {
                 xz.push($(".wx_ul li").eq(i).children("em").html())
             }
         };
         console.log(xz)
         idsarr = xz.toString();
         if($scope.roleName == null || $scope.roleName == "") {
             
 			$(".tijiaosbtc").show();
 			$(".tijiaosbtc .gy_con i").html("角色名不能为空");
 			setTimeout(function() {
 				$(".tijiaosbtc").hide();
 			}, 1500)
 			return;
 		}
         $http.post(requireIp + '/uc/ucRole/updateOneRole', {
			 id:$scope.userid,
             name: $scope.roleName
             , scope: $scope.gxfw
             , mid: idsarr
             , remark: $scope.remarkName
         }).success(function (res) {
             if (res.ret == 200) {
                 $(".tijiaocgtc").show();
                 $(".tijiaocgtc .gy_con p i").html(res.message);
                 setTimeout(function () {
                     $(".tijiaocgtc").hide();
                     $state.go("teacher_index.user_role")
                 }, 1500)
             }
             else {
                 $(".tijiaosbtc").show();
                 $(".tijiaosbtc .gy_con i").html("添加失败");
                 setTimeout(function () {
                     $(".tijiaosbtc").hide();
                 }, 1500)
             }
         })
     }
     
     //管辖范围
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
     //初始化管辖范围
     $scope.gxfw = "";
     
    }])