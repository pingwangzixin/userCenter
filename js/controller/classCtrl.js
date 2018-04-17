 app.controller('classCtrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
 	$scope.suerdeltc = true;
 	$scope.warnsucetc = true;
 	$scope.warnworntc = true;
 	$scope.addClasshide=false;
 	//ajax获取学校信息 查出年级和班级
 	var schoolId = {
 		officeId: JSON.parse(sessionStorage.getItem('userObj')).oid
 	};
 	
 	//进入页面获取年级和班级
 	$scope.getGradclass=function(){
 		$http.post(requireIp + '/ea/eaClass/findClassAndGradeByOfficeId', schoolId).success(function(res) {
	 		$scope.xuexiao = res;
	 		$scope.addClasshide=false;
	 	});
 	}
 	$scope.getGradclass();
 	
 	//错误提示
 	$scope.ErrorTps=function(res){
 		$scope.warnworntc = false;
		$(".wx_erro_tc .gy_con span").html(res.message);
		$timeout(function() {
			$scope.warnworntc = true;
		}, 1000)
 	}
 	
 	//成功提示
 	$scope.successTips=function(res){
 		$scope.warnsucetc = false;
		$scope.suerdeltc = true;
		$(".zy_warningBox .gy_con i").html(res.message);
		$timeout(function() {
			$scope.getGradclass()
			$scope.warnsucetc = true;
		}, 1000)
 	}

 	//鼠标移入班级出现叉号
 	$scope.banjiguanli = function(n) {
 		$scope.delbanji = n;
 	};

 	//点击叉号出现确认删除班级弹窗
 	$scope.deltc = function(event,classId) {
 		$scope.suerdeltc = false;
 		//点击确定删除班级
 		$scope.suredel = function() {
 			$scope.delbjid = classId;
 			$http.post(requireIp + '/ea/eaClass/delClassById', {
 				id: $scope.delbjid
 			}).success(function(res) {
 				if(res.ret==200){
 					$scope.successTips(res);
 					$scope.suerdeltc = true;
 				}else{
 					$scope.ErrorTps(res);
 				}
 				
 			})
 		}
 	};

 	//点击+号 添加班级事件
 	$scope.tjbanji = function(event,gradeId) {
   		angular.element(event.target).siblings("span").removeClass("wx_none");
 		$scope.addClasshide=true;
 		$scope.baocun = function() {
 			//获取年级ID
 			$scope.gradeId = gradeId;
 			//获取班级名称
   			$scope.className = angular.element(event.target).siblings("span").children("input").val();
 			if($scope.className == "") {
 				var res={message:"请输入班级名称"};
 				$scope.ErrorTps(res);
 			} else {
 				var userId = sessionStorage.getItem("userId");
 				//通过后台接口添加班级
// 				 				$http.post(requireIp + "/ea/eaClass/insertClassInGrade", {
   				$http.post(requireIp + "/ea/eaClass/addClass", {
 					gradeId: $scope.gradeId,
 					className: $scope.className,
 					userId: userId
 				}).success(function(res) {
 					if(res.ret == '200') {
 						
 						$scope.successTips(res);
 					} else {
 						$scope.ErrorTps(res);
 					}
 				}).error(function(res) {
 					console.log(res)
 				})
 			}
 		}
 		$scope.fangqi = function(event) {
 			$scope.addClasshide=false;
 			angular.element(event.target).addClass("wx_none").siblings("em").removeClass("wx_none").siblings("span").addClass("wx_none");
 		}
 	}

 }])