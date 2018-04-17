app.controller('mupdatemanage',['$scope','$timeout','$stateParams','$filter','loginService','$http','$state',function($scope,$timeout,$stateParams,$filter,loginService,$http,$state) {
	$scope.mobileTest = true;
	$http.post(requireIp+'/uc/ucRole/findRoleList',
		{type:'4'}
	)
	.success(function(data){
		$scope.roleList = data.data.findList;
	})
	$scope.userid = $stateParams.teaId; //用户id
	//获取当前用户信息 用于回填修改页面
	$http.get(requireIp+'/uc/ucUser/'+$scope.userid+'/'+sessionStorage.getItem("userType"))
	.success(function(data){
		$scope.userInfo = data.data.userInfo;
		var roleArray = [];
		angular.forEach(data.data.userRole,function(roleData){
			if(roleData.id!='18'){
				roleArray.push(roleData.id);
			}
		})
		$scope.selected = roleArray;
		$scope.realname = data.data.userInfo.realname;
		$scope.sex = data.data.userInfo.sex;
		$scope.userNation = data.data.userInfo.userNation;
		$scope.idCard = data.data.userInfo.idCard;
		$scope.userMobile = data.data.userInfo.userMobile;
		$scope.userEmail = data.data.userInfo.userEmail;
		$scope.areaId = data.data.userInfo.areaId;
		$scope.officeId = data.data.userInfo.officeId;
		
		//获取单位区域列表数据
	    $http.post(requireIp + "/ea/eaArea/findAreaListByAreaId", {
	        areaId: sessionStorage.getItem('areaId')
	    }).success(function (data) {
	        $scope.areaList = data.data;
	         //回填机构加载机构列表
		    $http.post(requireIp + '/ea/eaOffice/findSchoolInfoByAreaId',
		        {
		            areaId:$scope.areaId
		        }
			).success(function(data){
				$scope.schools = data.data;
			})
	    });
	})
	/**
     * 管理角色选择
     */
	var updateSelected = function(action,id){
		console.log("id="+id);
	  	if(action == 'add' && $scope.selected.indexOf(id) == -1){
		   $scope.selected.push(id);
	  	}
		if(action == 'remove' && $scope.selected.indexOf(id)!=-1){
		   var idx = $scope.selected.indexOf(id);
		   $scope.selected.splice(idx,1);
		}
		console.log($scope.selected);
	}
   	$scope.updateSelection = function($event, id){
		var checkbox = $event.target;
		var action = (checkbox.checked?'add':'remove');
		updateSelected(action,id);
   	}
   	$scope.isSelected = function(id){
   		if($scope.selected!=undefined){
   			return $scope.selected.indexOf(id)>=0;
   		}else{
   			return false;
   		}
 	}
	//获取民族下拉列表数据
	$http.get("file/nation.json").success(function(data) {
		$scope.nationData = data.data;
	});
	
	//用户名
	$scope.username = sessionStorage.getItem('userName');
   
    // 点击区域事件 查询学校(区域请选择)
    $scope.selSchoolArea = function (areaid) {
            if (areaid == undefined) {

            }
	        $http.post(requireIp + '/ea/eaOffice/findSchoolInfoByAreaId',
		        {
		            areaId:areaid
		        }
	        )
	        .success(function (data) {
	           $scope.schools = data.data;
	        });
    }
    /**
     * 修改信息
     */
    $scope.submitManagerMsg = function(){
    	//真实姓名校验
   		if($scope.realname==null||$scope.realname==''){
   			$(".tijiaosbtc").show();
			$(".tijiaosbtc .gy_con p i").html("请输入姓名！");
			setTimeout(function() {
				$(".tijiaosbtc").hide();
			}, 1500)
			return;
   		}
   		//性别校验
   		if($scope.sex==null||$scope.sex==''){
   			$(".tijiaosbtc").show();
			$(".tijiaosbtc .gy_con p i").html("请选择性别！");
			setTimeout(function() {
				$(".tijiaosbtc").hide();
			}, 1500)
			return;
   		}
   		//民族校验
   		if($scope.userNation==null||$scope.userNation==''){
   			$(".tijiaosbtc").show();
			$(".tijiaosbtc .gy_con p i").html("请选择民族！");
			setTimeout(function() {
				$(".tijiaosbtc").hide();
			}, 1500)
			return;
   		}
   		if($scope.userNation==null||$scope.userNation==''){
   			$(".tijiaosbtc").show();
			$(".tijiaosbtc .gy_con p i").html("请选择民族！");
			setTimeout(function() {
				$(".tijiaosbtc").hide();
			}, 1500)
			return;
   		}
   		//身份证校验
   		if($scope.idCard==null||$scope.idCard==''){
   			$(".tijiaosbtc").show();
			$(".tijiaosbtc .gy_con p i").html("请填写身份证号码！");
			setTimeout(function() {
				$(".tijiaosbtc").hide();
			}, 1500)
			return;
   		}else{
   			//身份证号验证
			var regExp = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			if(!regExp.test($scope.idCard)){
				$(".tijiaosbtc").show();
				$(".tijiaosbtc .gy_con p i").html("请填写正确的身份证号码！");
				setTimeout(function() {
					$(".tijiaosbtc").hide();
				}, 1500)
				return;
			}
   		}
   		
   		//邮箱校验
   		if($scope.userEmail==null || $scope.userEmail==''){
   			$(".tijiaosbtc").show();
			$(".tijiaosbtc .gy_con p i").html("请填写邮箱！");
			setTimeout(function() {
				$(".tijiaosbtc").hide();
			}, 1500)
			return;
   		}else{
   			var regExp=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
   			if(!regExp.test($scope.userEmail)){
   				$(".tijiaosbtc").show();
				$(".tijiaosbtc .gy_con p i").html("请填写正确的邮箱！");
				setTimeout(function() {
					$(".tijiaosbtc").hide();
				}, 1500)
				return;
   			}
   		}
    	var userInfo = {
    		id:$scope.userid,
    		realname:$scope.realname,
    		sex:$scope.sex,
    		userNation:$scope.userNation,
    		idCard:$scope.idCard,
			userMobile:$scope.userMobile,
			userEmail:$scope.userEmail,
			officeId:$scope.officeId,
    	}
    	
    	var ridArray = $scope.selected;
    	//校验是否选择角色
    	if(ridArray.length==0){
    		$(".tijiaosbtc").show();
			$(".tijiaosbtc .gy_con p i").html("请填给管理者选择一个角色！");
			setTimeout(function() {
				$(".tijiaosbtc").hide();
			}, 1500)
			return;
    	}
    	var userRole = [];
    	angular.forEach(ridArray,function(id){
    		var role = {};
    		role.rid = id;
    		userRole.push(role);
    	})
    	var jsonData = angular.toJson({userInfo:userInfo,roleInfo:userRole})
    	console.log(jsonData+"--------------------------")
    	$scope.love=true;
    	$http.post(requireIp+'/uc/ucUser/updateUserInfo1',
	    	{
	    		userType:4,
	    		jsonData:jsonData
	    	}
    	)
    	.success(function(data){
    		if(data.ret == '200') {
				$(".tijiaocgtc").show();
				$(".tijiaocgtc .gy_con p i").html("提交成功");
				setTimeout(function() {
					$(".tijiaocgtc").hide();
					$scope.love=false;
					$state.go('teacher_index.managePage');
				}, 1500)
			}else if(data.ret == '400'){
				$(".tijiaosbtc").show();
				$(".tijiaosbtc .gy_con p i").html(data.message);
				setTimeout(function() {
					$scope.love=false;
					$(".tijiaosbtc").hide();
				}, 1500)
			}
    	})
    	.error(function(e){})
    }
   	$scope.mobileReg=function(){
        var reg = /^((13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8})$/
        if (reg.test($scope.userMobile) == false) {
          $scope.mobileTest = false;
        }else{
          $scope.mobileTest = true;
        }
   	}
}]);
