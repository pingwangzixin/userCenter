app.controller('editorJigouCtrl',['$scope','$timeout','$stateParams','$filter','loginService','$http','$state',function($scope,$timeout,$stateParams,$filter,loginService,$http,$state) {
	console.log("当前资源id："+$stateParams.officeId+",flag状态"+$stateParams.flag+"，state状态"+$stateParams.state)
	$scope.state = {
        warningShow:false
    }
	$scope.parentsList = {
		areaIds:''
    };
	
	// 区域列表
	$http.post(requireIp + '/ea/eaArea/findAreaListByAreaId',{areaId:sessionStorage.getItem("areaId")}).success(function (data){
			console.log(data);
			$scope.areaa = data.data;
	})
	
	// 查询学校名字类型
	$http.post(requireIp + '/ea/eaOffice/findSchoolByOid',{officeId:$stateParams.officeId,flag:$stateParams.flag,state:$stateParams.state}).success(function (officeMag){
    	console.log(officeMag);
		//机构类型
		$scope.officeType = officeMag.data.school.grade;
		// 机构名字
		$scope.officeName = officeMag.data.school.name;
		// 查询区域信息
		$http.post(requireIp + '/ea/eaArea/getAreaByAreaId',{areaId:officeMag.data.school.areaId}).success(function (areaMsg){
			console.log(officeMag.data.school.areaId);
			$scope.areaIds = officeMag.data.school.areaId;
		})
    })
	
	
	
	
	// 修改机构，提交按钮
	$scope.updateOfficeMsg = function(){
		console.log("当前机构id"+$stateParams.officeId);
		console.log("机构名字："+$scope.officeName);
		console.log("区域id"+$scope.areaIds);
		console.log("机构类型"+$scope.officeType);
		if($scope.officeName == undefined || $scope.officeName == "" || $scope.areaIds == undefined || $scope.areaIds == "" ||$scope.officeType == undefined || $scope.officeType == ""){
			$scope.state.warningShow = true;
            $scope.state.imgNotice = 'img/wonde_big.png';
            $scope.state.noteContent = '输入异常，重新输入!';
            $timeout(function(){
                $scope.state.warningShow = false;
             },1000);
            return false;
        }
		$http.post(requireIp + '/ea/eaOffice/updateOfficeAndGrade',{id:$stateParams.officeId,name:$scope.officeName,areaId:$scope.areaIds,grade:$scope.officeType,createBy:sessionStorage.getItem('userId')}).success(function (data){
			console.log(data);
			if(data.ret == "200"){
				console.log(13216)
				$scope.state.warningShow = true;
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '修改成功!';
				$timeout(function(){
					$scope.state.warningShow = false;
					$timeout(function (){
						$state.go('teacher_index.jigou');
					},1000);
				},1000);
				return false;
				
			}else{
				$scope.state.warningShow = true;
	            $scope.state.imgNotice = 'img/wonde_big.png';
	            $scope.state.noteContent = data.message;
	            $timeout(function(){
	                $scope.state.warningShow = false;
	             },1000);
	            return false;
			}
		})
	}
	
	
	
	
//	点击返回上一步，返回上一个页面，不返回首页
	$scope.goBackUp = function(){
		$state.go('teacher_index.jigou');
	}
	
	$scope.state.jigouType = false;
	$scope.tishi = function(){
		$scope.state.jigouType = true;
	}
	$scope.suredel = function(){
		$scope.state.jigouType = false;
	}
	
	$scope.gbtc = function(){
		$scope.officeType=$scope.parentsList.officeType;
		$scope.state.jigouType = false;
	}
	
}]);
