app.controller('personalManager', ['$scope', 'loginService', '$http', '$stateParams','$state', function($scope, loginService, $http, $stateParams,$state) {
	//判断是否为未注册用户，进入注册页面
	if(sessionStorage.getItem('userId') == null) {
		$scope.reg = true;
	}
	
	//从session中获取信息
	$scope.userId = sessionStorage.getItem('userId');
	$scope.userType = sessionStorage.getItem('userType');
	$scope.areaId = sessionStorage.getItem('areaId');
	
	//定义区域
	$scope.areaa = {};
	//定义学校类型信息
	$scope.schoolInfo = {};
	//定义所有学校
	$scope.schools = {};
	
	//获取区域
	$http.get(requireIp + '/ea/eaArea', {
		
	}).success(function(data) {
		sessionStorage.setItem('areaId',data.data.areaId);
	}).error(function(e) {});
	//获取区域列表
	$http.post(requireIp + '/ea/eaArea/findAreaListByAreaId', {
		areaId: $scope.areaId
	}).success(function(data) {
		$scope.areaa = data.data;
	}).error(function(e) {});
	//获取学校类型
	$http.get('./file/schoolType.json').success(function(res) {
		$scope.schoolInfo = res.data
	})
	
	//用户名
	$scope.username = sessionStorage.getItem('userName');
	
	//获取个人信息
	$http.post(requireIp + '/uc/ucUser/findUserInfoUserId', {
		userId:$scope.userId,
		userType:$scope.userType
	}).success(function(data) {
		$scope.userInfo = data.data.userInfo;
		$scope.myCroppedImage =data.data.userInfo.userFace
		$http.post(requireIp + '/ea/eaOffice/findSchoolInfoByAreaId', {
			areaId: $scope.userInfo.areaId
//			,grade: "8"
		}).success(function(data) {
			$scope.schools = data.data;
		}).error(function(e) {});
	}).error(function(e) {});
	
	//根据区域获取机构
	$scope.selSchoolArea = function(areaId) {
		console.log(areaId)
		$http.post(requireIp + '/ea/eaOffice/findSchoolInfoByAreaId', {
			areaId: areaId.id,
			delFlag:"0"
		}).success(function(res) {
//			if(res.ret == 200) {
				$scope.schools = res.data;
//			}
		})
	}
	
	

	//切换选项卡
	$scope.switch = $stateParams.tableChange;
	$scope.same = 0;
	$scope.tab = function(n) {
		$scope.switch = n
	}
	//定义用户对象
	$scope.user = {};
	$scope.user.data = {};
	
	//学生注册提交
	$scope.submitzhuceStudentMsg = function() {
		if($scope.userInfo.userNation == null) {
			$(".tijiaosbtc").show();
			$(".tijiaosbtc .gy_con i").html("请选择民族");
			setTimeout(function() {
				$(".tijiaosbtc").hide();
			}, 1500)
			return;
		}

		$http.post(requireIp + '/uc/ucUser/registerUser', {
			realname: $scope.userInfo.realname,
			sex: $scope.userInfo.sex,
			userNation: $scope.userInfo.userNation,
			idCard: $scope.userInfo.idCard,
			userMobile: $scope.userInfo.userMobile,
			userEmail: $scope.userInfo.userEmail,
			officeId: $scope.userInfo.officeId,
			userType:"4"
		}).success(function(res) {
			if(res.ret == 200) {
				$(".tijiaocgtc").show();
				$(".tijiaocgtc .gy_con p i").html(res.message);
				setTimeout(function() {
					$(".tijiaocgtc").hide();
				}, 1500)
			}
		})

	}

//	//获取学生信息
//	loginService.studentMsg({
//		userId: $scope.userId,
//		userType: $scope.userType
//	}, function(res) {
//
//		$scope.user.id = res.data.stuInfo.id; //学生id
//		$scope.user.realname = res.data.stuInfo.realname; //学生姓名
//	}, function(e) {})
	//获取民族
	$http.get("file/nation.json").success(function(data) {
		$scope.nationData = data.data;
	});
	//提交信息
	$scope.submitStudentMsg = function() {
		
		if($scope.userInfo.userNation == null || $scope.userInfo.userNation=="") {
			$(".tijiaosbtc").show();
			$(".tijiaosbtc .gy_con p i").html("请选择民族再提交！");
			setTimeout(function() {
				$(".tijiaosbtc").hide();
			}, 1500)
		}
		
		var userInfo = {id: $scope.userInfo.id,
			sex: $scope.userInfo.sex,
			userNation: $scope.userInfo.userNation,
			realname: $scope.userInfo.realname,
			idCard:$scope.userInfo.idCard,
			userMobile:$scope.userInfo.userMobile,
			userEmail:$scope.userInfo.userEmail,
			officeId:$scope.userInfo.officeId}
		
		var jsonData = angular.toJson({userInfo:userInfo})
		
		console.log(jsonData)
		$http.post(requireIp + '/uc/ucUser/updateUserInfo1', {
			jsonData:jsonData,
			userType:$scope.userInfo.userType
		}).success(function(data) {
			if(data.ret == '200') {
				$(".tijiaocgtc").show();
				$(".tijiaocgtc .gy_con p i").html("提交成功");
				setTimeout(function() {
					$(".tijiaocgtc").hide();
					$state.go('teacher_index.teacher_center', {
                        username: sessionStorage.getItem('userName')
                    });
				}, 1500)
			}else if(data.ret == '400'){
				$(".tijiaocgtc").show();
				$(".tijiaocgtc .gy_con p i").html(data.message);
				setTimeout(function() {
					$(".tijiaocgtc").hide();
				}, 1500)
			}
		}).error(function(e) {});
	}

	//头像截取上传功能
	$scope.myImage = '';
	$scope.myCroppedImage = '';
	var handleFileSelect = function(evt) {
		var file = evt.currentTarget.files[0];
		var reader = new FileReader();
		reader.onload = function(evt) {
			$scope.$apply(function($scope) {
				$scope.myImage = evt.target.result;
			});
		};
		reader.readAsDataURL(file);
	};
	angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
	//base64转换图片
	/**
	 * 将以base64的图片url数据转换为Blob
	 * @param urlData
	 * 用url方式表示的base64图片数据
	 */
	function convertBase64UrlToBlob(dataURI) {
		var byteString;
		if(dataURI.split(',')[0].indexOf('base64') >= 0)
			byteString = atob(dataURI.split(',')[1]);
		else
			byteString = unescape(dataURI.split(',')[1]);
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
		var ia = new Uint8Array(byteString.length);
		for(var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ia], {
			type: mimeString
		});
	}
	//图片上传
	$scope.upload = function() {
		var fd = new FormData();
		fd.append("filename", convertBase64UrlToBlob($scope.myCroppedImage), "image.jpg");
		fd.append("id", $scope.userId);
		$.ajax({
			url: requireIp + "/uc/ucUser/uploadUserFace",
			type: "POST",
			data: fd,
			dataType: "text",
			processData: false,
			contentType: false,
			success: function(data) {},
			xhr: function() {
				if ($scope.myImage == "" || $scope.myImage == null) {
                        $(".tijiaosbtc").show();
                        $(".tijiaosbtc .gy_con p i").html("请先上传图片");
                        setTimeout(function() {
                            $(".tijiaosbtc").hide();
                        }, 1500)
                    }
                    else {
                        var xhr = new XMLHttpRequest();
                        
                        xhr.upload.addEventListener("progress", function (evt) {
                            if (evt.lengthComputable) {
                                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                                $scope.warnshow = true;
                                console.log("正在提交." + percentComplete.toString() + '%');
                                $(".tijiaocgtc").show();
                                $(".tijiaocgtc .gy_con p i").html("提交成功");
                                setTimeout(function() {
                                    $(".tijiaocgtc").hide();
                                    
                                    //获取个人信息
									$http.post(requireIp + '/uc/ucUser/findUserInfoUserId', {
										userId:$scope.userId,
										userType:$scope.userType
									}).success(function(data) {
										$scope.userInfo = data.data.userInfo;
										$scope.myCroppedImage =data.data.userInfo.userFace;

									
									}).error(function(e) {});
                                    
                                    $state.go('teacher_index.teacher_center', {
                                        username: sessionStorage.getItem('userName')
                                    },{reload: true});
                                }, 3000);
                                
                            }else{
                                $(".tijiaosbtc").show();
                                $(".tijiaosbtc .gy_con p i").html("上传失败");
                                setTimeout(function() {
                                    $(".tijiaosbtc").hide();
                                }, 1500)
                            }
                        }, false);
                        return xhr;
                    }
			}
		});
	}
	//修改密码
	$scope.updateStudentMsg = function(user) {
		if($scope.user.newpassword == "" || $scope.user.newpassword == null) {
			$scope.same = 3;
		} else if($scope.user.newpassword.length < 6) {
			$scope.same = 3;
		} else if($scope.user.newpassword != $scope.user.renewpassword) {
			$scope.same = 1;
		} else {
			$scope.same = 0
			//提交
			var fd = new FormData();
			fd.append("id", $scope.userId);
			fd.append("password", $scope.user.newpassword);
			$http({
				method: 'POST',
				url: requireIp + "/uc/ucUser/updatePassword",
				data: fd,
				headers: {
					'Content-Type': undefined
				},
				transformRequest: angular.identity
			}).success(function(res) {
				if(res.ret == 200) {
					$(".tijiaocgtc").show();
					$(".tijiaocgtc .gy_con p i").html("提交成功");
					sessionStorage.clear();
					setTimeout(function() {
						$(".tijiaocgtc").hide();
						sessionStorage.clear();
	 					window.parent.location.href = homeAddress;
					}, 1500);
				} else if(res.message == "原始密码校验失败!") {
					$scope.same = 4
				} else {
					$(".tijiaosbtc").show();
					$(".tijiaosbtc .gy_con p i").html(res.message);
					setTimeout(function() {
						$(".tijiaosbtc").hide();
					}, 1500)
				}
			})
		}
	}
}])
