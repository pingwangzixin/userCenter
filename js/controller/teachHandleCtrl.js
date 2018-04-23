app.controller('teachHandleCtrl', ['$scope', 'loginService', '$state', '$stateParams', '$timeout', '$http', function($scope, loginService, $state, $stateParams, $timeout, $http) {
	
	var cityId = sessionStorage.getItem("areaId"); //拿到市级ID
	var countyId = sessionStorage.getItem("userAreaId"); //拿到区县ID
	var scope = sessionStorage.getItem("scope"); //获取登录人的权限范围
	var tableChange = sessionStorage.getItem("tableChange"); //切换的状态
	var userId = sessionStorage.getItem("userId"); //拿到用户id
	var officeId = JSON.parse(sessionStorage.getItem("userObj")).oid; //拿到学校id
	var userRole= JSON.parse(sessionStorage.getItem("userObj")).teachStatus; //拿到用户的具体角色（1班主任15学校管理员）
	var username = sessionStorage.getItem("userName");
	
	var loadingtimout = 1000;
//	var userObjId = sessionStorage.getItem('userId');
//	$scope.newschoolId = '';
//	$scope.love = false;
//	var teachStatus = JSON.parse(sessionStorage.getItem("userObj")).teachStatus; //拿到用户的具体身份
//	var oid = JSON.parse(sessionStorage.getItem("userObj")).oid; //拿到学校id

//	$scope.officenewid = oid
	
	
	var pageSize = 10;
	var userType = 1;
	
	//各种状态判断
	$scope.state = {
		headTab: 0, //判断头部选项卡
		teachOnlineChecked: false, //在线教师-判断是否选中
		teachStopChecked: false, //停用账号-判断是否选中
		teachRecoverChecked: false, //回收站-判断是否选中
		userOnlineCount: 0,
		userStopCount: 0,
		userRecoverCount: 0,
		warningShow: false,
		noteContent: '',
		testShow: 1,
		deletStatus: false,
		imgNotice: 'img/wonde_big.png',
		sureDeletContent: '确认删除所选教师？',
		AddState: false, //新增是否显示
		addTeaName: '', //新添加教师姓名
		addTeaTel: '', //添加教师手机号
		modelDown: requireIp,
		searchOfficeId: '',
		usertypestate: '',
		promptMessage: false
	};
	$scope.state.usertypestate = sessionStorage.getItem('userType') || 0
	$scope.state.scopestate = sessionStorage.getItem('scope') || 0;

	if($stateParams.tableChange) {
		$scope.state.headTab = $stateParams.tableChange;
	}

	//定义列表数据模型
	$scope.userList = {
		teachOnlineArr: [],
		teachStopArr: [],
		teachRecoverArr: [],
		tableMsgList: [],
		tableMsgListStop: [],
		tableMsgListRecover: []
	}


	var initialuserParam = {
		userType:userType,
		delFlag:0,
		state:1,
		pageNo:1,
		pageSize:pageSize,
		
	}
	
	var userParam = initialuserParam;
	
	if(scope==2){	//市领导
		initialuserParam.areaId = cityId;
		userParam = initialuserParam;
		//一进入页面获取的用户列表
		loginService.queryUserList(userParam, function(res) {
			$scope.state.lightHome = false;
			$scope.tabledata(res);
		})
	}else if(scope==3){	//区领导
		initialuserParam.areaId = countyId;
		userParam = initialuserParam;
		//一进入页面获取的用户列表
		loginService.queryUserList(userParam, function(res) {
			$scope.state.lightHome = false;
			$scope.tabledata(res);
		})
	}else if(scope==4){	//校级领导（学校管理员或者班主任）
		if(userRole==15){	//学校管理员
			initialuserParam.officeId = officeId;
			userParam = initialuserParam;
			//一进入页面获取的用户列表
			loginService.queryUserList(userParam, function(res) {
				$scope.state.lightHome = false;
				$scope.tabledata(res);
			})
		}else{	//scope=4,但不是学校管理员
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.warningShow = true;
			$scope.state.noteContent = "获取校级用户角色错误";
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		}
	}else{	//用户权限范围出现错误
		$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.warningShow = true;
			$scope.state.noteContent = "获取用户权限错误";
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
	}
	
	//切换选项卡
	$scope.changeHeadTab = function(tebState) {
		$scope.state.headTab = tebState;
		sessionStorage.setItem("tableChange", tebState)
		$state.go('teacher_index.teach_handle', {
			'tableChange': tebState
		})
	}
	
	//切换选项卡后给userParam参数赋值
	if($scope.state.headTab == 0) {
		
		} else if($scope.state.headTab == 1) {
			userParam.state = 2;
		} else if($scope.state.headTab == 2) {
			userParam.state = null;
			userParam.delFlag = 3;
	}
		
	
	//选择学校后获取的用户列表
	$scope.selettypefn = function(schoolId) {
		userParam.officeId = schoolId;
		userParam.pageNo = 1;
		userParam.keyword = null;
		//清空全选
		$scope.state.teachOnlineChecked=false;
		$scope.state.teachStopChecked=false;
		$scope.state.teachRecoverChecked=false;
		
		$scope.userList.tableMsgList = [];
		$scope.userList.tableMsgListStop = [];
		$scope.userList.tableMsgListRecover = [];
		//选择学校后把搜索框置空
		$scope.state.parentOnlineSearch = null;
		//选择学校后把分页置为1
		$scope.userPaginationRecover.currentPage=1;
		$scope.userPaginationStop.currentPage=1;
		$scope.userPaginationOnline.currentPage=1;
		//获取用户列表
		loginService.queryUserList(userParam, function(res) {
			$scope.state.lightHome = false;
			$scope.tabledata(res);
		})
		
	}
	
	
//表格数据填充公用方法
	$scope.tabledata = function(res) {
		if(res.ret == 200) {
			//在线的表格数据
			$scope.state.lightHome = true;
			$scope.userList.tableMsgList = res.data.list;
			$scope.userPaginationOnline.totalItems = res.data.count;
			$scope.state.userOnlineCount = res.data.count;
			//已停用的表格数据

			$scope.userList.tableMsgListStop = res.data.list;
			$scope.userPaginationStop.totalItems = res.data.count;
			$scope.state.userStopCount = res.data.count;

			//回收站的表格数据
			$scope.userList.tableMsgListRecover = res.data.list;
			$scope.userPaginationRecover.totalItems = res.data.count;
			$scope.state.userRecoverCount = res.data.count;
			
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000)
		} else if(res.ret == 400) {
			//在线的表格数据
			$scope.userList.tableMsgList = [];
			$scope.state.userOnlineCount = 0;
			$scope.userPaginationOnline.totalItems = 0;
			//已停用的表格数据
			$scope.userList.tableMsgListStop = [];
			$scope.state.userStopCount = 0;
			$scope.userPaginationStop.totalItems = 0;
			//回收站的表格数据
			$scope.userList.tableMsgListRecover = [];
			$scope.state.userRecoverCount = 0;
			$scope.userPaginationRecover.totalItems = 0;
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000)
		}
	};

	//点击搜索框获取的用户列表
	$scope.studentOnlineSearch = function() {
		userParam.keyword = $scope.state.parentOnlineSearch;
		userParam.pageNo = 1;
		//清空全选
		$scope.state.teachOnlineChecked=false;
		$scope.state.teachStopChecked=false;
		$scope.state.teachRecoverChecked=false;

		
		$scope.userList.tableMsgList = [];
		$scope.userList.tableMsgListStop = [];
		$scope.userList.tableMsgListRecover = [];
		
		$scope.userPaginationRecover.currentPage=1;
		$scope.userPaginationStop.currentPage=1;
		$scope.userPaginationOnline.currentPage=1;
		loginService.queryUserList(userParam, function(res) {
			$scope.state.lightHome = false;
			$scope.tabledata(res);
		})
	}
	//搜索框回车事件
	$scope.onlineKeyup = function() {
		if(event.keyCode == 13) {
			$scope.studentOnlineSearch();
		}
	}
	
	//点击hide删除弹窗
	$scope.gbtc = function() {
		$scope.state.deletStatus = false;
	};
	//新增
	$scope.addOnlineActionTea = function(state) {
		switch(state) {
			case 'add':
				$scope.state.AddState = true;
				
				//新增教师弹出页面获取学校列表
				var oid = JSON.parse(sessionStorage.getItem('userObj')).oid
				$http.get(requireIp + '/ea/eaOffice/findSchoolInfoByOid?officeId=' + oid).success(function(data) {
					$scope.school = data.data.school;
			
				})
				//新增教师弹出页面获取角色权限列表
				$scope.officeId = "";
				$http.post(requireIp + '/uc/ucRole/findRoleList', {
					type: '4'
				}).success(function(res) {
					$scope.userroles = res.data.findList;
				})
				
				
				break;
			case 'cancel':
				$scope.state.AddState = false;
				break;
		}
	}
	//在线教师头部确认删除
	$scope.suredel = function() {
		$scope.state.deletStatus = false;
		if($scope.state.headTab == 0) {
			$scope.teachEventHandle('delet');
		} else if($scope.state.headTab == 1) {
			$scope.teachStopHandle('finishDele');
		} else if($scope.state.headTab == 2) {
			$scope.teachRecoverHandle('finishDele');
		}
	}
	//点击头部的确认删除按钮
	$scope.teachDelet = function(status) {
		switch(status) {
			case 'online':
				if(!$scope.userList.teachOnlineArr.length) {
					$scope.state.noteContent = '请选择选项';
					$scope.state.imgNotice = 'img/wonde_big.png';
					$scope.state.warningShow = true;
					$timeout(function() {
						$scope.state.warningShow = false;
					}, 1000)
					return false
				}
				$scope.state.sureDeletContent = '确认删除所选教师？'
				break;
			case 'stop':
				if(!$scope.userList.teachStopArr.length) {
					$scope.state.warningShow = true;
					$scope.state.imgNotice = 'img/wonde_big.png';
					$scope.state.noteContent = '请至少选择一项!';
					$timeout(function() {
						$scope.state.warningShow = false;
					}, 1000)
					return false
				}
				$scope.state.sureDeletContent = '确认删除所选教师？'
				break;
			case 'recover':
				if(!$scope.userList.teachRecoverArr.length) {
					$scope.state.warningShow = true;
					$scope.state.imgNotice = 'img/wonde_big.png';
					$scope.state.noteContent = '请至少选择一项!';
					$timeout(function() {
						$scope.state.warningShow = false;
					}, 1000)
					return false
				}
				$scope.state.sureDeletContent = '确认彻底删除所选教师？(该操作不可恢复)'
				break;
		}
		$scope.state.deletStatus = true;
	}

	//在线教师分页
	$scope.userPaginationOnline = {
		currentPage: 1,
		pagesLength: 9,
		itemsPerPage: pageSize,
		perPageOptions: [15],
		onChange: function() {
			var currentPage = this.currentPage;
			$scope.userList.tableMsgList = [];
			$scope.userList.tableMsgListStop = [];
			$scope.userList.tableMsgListRecover = [];
			$scope.state.teachOnlineChecked = false;
			$scope.state.teachStopChecked = false;
			$scope.state.teachRecoverChecked = false;
			userParam.pageNo=currentPage;
			//获取用户列表
			loginService.queryUserList(userParam, function(res) {
				$scope.state.lightHome = false;
				$scope.tabledata(res);
			})
		}
	}
	//停用账号分页
	$scope.userPaginationStop = {
		currentPage: 1,
		// totalItems: 10,
		pagesLength: 9,
		itemsPerPage: pageSize,
		perPageOptions: [15],
		onChange: function() {
			var currentPage = this.currentPage;
			$scope.state.teachOnlineChecked = false;
			$scope.state.teachStopChecked = false;
			$scope.state.teachRecoverChecked = false;
			userParam.pageNo=currentPage;
			//获取用户列表
			loginService.queryUserList(userParam, function(res) {
				$scope.state.lightHome = false;
				$scope.tabledata(res);
			})
		}
	}
	//回收分页
	$scope.userPaginationRecover = {
		currentPage: 1,
		totalItems: 10,
		pagesLength: 9,
		itemsPerPage: pageSize,
		perPageOptions: [15],
		onChange: function() {
			var currentPage = this.currentPage;
			$scope.state.teachOnlineChecked = false;
			$scope.state.teachStopChecked = false;
			$scope.state.teachRecoverChecked = false;
			userParam.pageNo=currentPage;
			//获取用户列表
			loginService.queryUserList(userParam, function(res) {
				$scope.state.lightHome = false;
				$scope.tabledata(res);
			})
		}
	};

	//文件上传
	$scope.fileAction = function(me) {
		$scope.state.warningShow = true;
		$scope.state.imgNotice = 'img/wonde_big.png';
		$scope.state.noteContent = '上传中，请稍等!';
		var fd = new FormData();
		var file = me.files[0];
		fd.append('excelFile', file);
		fd.append("userId", sessionStorage.getItem('userId'));
		fd.append("userType", '1');
		loginService.uploadExcelTea(fd, function(res) {
			if(res.ret == 200) {
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '上传成功';
				$timeout(function() {
					$scope.state.warningShow = false;
					$state.go('teacher_index.teach_handle', {
						tableChange: 0
					}, {
						reload: true
					})
				}, 1500)
			} else if(res.ret == 400) {
				$scope.state.noteContent = res.message + '请重新上传!';
				$timeout(function() {
					$scope.state.warningShow = false;
				}, 1500)
			} else if(res.ret == 402) {
				$scope.content = res.data;
				$scope.state.noteContent = res.message;
				$scope.state.promptMessage = true;
				$timeout(function() {
					$scope.state.warningShow = false;
					$scope.state.promptMessage = false;
				}, 1500)
			}
		}, function(e) {
			$scope.state.noteContent = '服务器错误，请稍候再试!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1500)
		});
		me.value = '';
	}
	//新需求文件上传
	$scope.fileUpload = function(me) {
		$scope.state.warningShow = true;
		$scope.state.imgNotice = 'img/wonde_big.png';
		$scope.state.noteContent = '上传中，请稍等!';
		var fd = new FormData();
		var file = me.files[0];
		fd.append('excelFile', file);
		fd.append("type", '1');
		loginService.importExcelTeacher(fd, function(res) {
			if(res.ret == 200) {
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '上传成功';
				$timeout(function() {
					$scope.state.warningShow = false;
					$state.go('teacher_index.teach_handle', {
						tableChange: 0
					}, {
						reload: true
					})
				}, 1500)
			} else if(res.ret == 400) {
				$scope.state.noteContent = res.message + '请重新上传!';
				$timeout(function() {
					$scope.state.warningShow = false;
				}, 1500)
			}
		}, function(e) {
			$scope.state.noteContent = '服务器错误，请稍候再试!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1500)
		});
		me.value = '';
	}

	

	//添加教师弹窗页面添加教师操作
	$scope.addNewTeacher = function() {
		var regExp = /^1[34578]\d{9}$/;
		if($scope.teachName == '' || $scope.teachName == null) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请输入教师姓名!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		} else if($scope.sex == '' || $scope.sex == null) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请选择性别!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		} else if($scope.teachNobel == '' || $scope.teachNobel == null) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请输入身份证号!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		} else if($scope.teachMobel == '' || !regExp.test($scope.teachMobel)) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请输入正确手机号!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		} else {
			var userInfo = {
				realname: $scope.teachName,
				sex: $scope.sex,
				idCard: $scope.teachNobel,
				userMobile: $scope.teachMobel,
				createBy: sessionStorage.getItem('userId'),
				officeId: officeId,
				remark: $scope.remarkName
			}
			var jsonData = angular.toJson({
				userInfo: userInfo
			})
			$scope.love = true
			loginService.addUser({
				userType: 1,
				jsonData: jsonData
			}, function(res) {
				if(res.ret == 200) {
					$scope.state.warningShow = true;
					$scope.state.imgNotice = 'img/chenggong.png';
					$scope.state.noteContent = res.message;
					$scope.state.addTeaName = '';
					$scope.state.addTeaTel = '';
					$timeout(function() {
						$scope.state.warningShow = false;
						$state.go('teacher_index.teach_handle', null, {
							reload: true
						})
					}, 1000);
				} else {

					$scope.state.warningShow = true;
					$scope.state.imgNotice = 'img/wonde_big.png';
					$scope.state.noteContent = res.message;
					$timeout(function() {
						$scope.love = false
						$scope.state.warningShow = false;
					}, 1000);
				}
			}, function(e) {
				console.log(e)
			})
		}
	}

	var onlineState = [];
	var onlineName = [];
	//点击在线全选事件
	$scope.teachOnlineAction = function(event) {
		var state = $scope.state.teachOnlineChecked,
			arrList = $scope.userList.tableMsgList;
		if(state) {
			$scope.userList.teachOnlineArr = [];
			arrList.forEach(function(v) {
				$scope.userList.teachOnlineArr.push(v.teaInfo.id)
				onlineState.push(v.teaInfo.state);
				onlineName.push(v.teaInfo.realname);
			})
		} else {
			$scope.userList.teachOnlineArr = [];
			onlineState = [];
			onlineName = [];
		}
	}
	//点击账号停用全选事件
	$scope.teachStopAction = function(event) {
		var state = $scope.state.teachStopChecked,
			arrList = $scope.userList.tableMsgListStop;
		if(state) {
			$scope.userList.teachStopArr = [];
			arrList.forEach(function(v) {
				$scope.userList.teachStopArr.push(v.teaInfo.id);
			})
		} else {
			$scope.userList.teachStopArr = [];
		}
	};
	//点击回收全选事件
	$scope.teachRecoverAction = function(event) {
		var state = $scope.state.teachRecoverChecked,
			arrList = $scope.userList.tableMsgListRecover;
		if(state) {
			$scope.userList.teachRecoverArr = [];
			arrList.forEach(function(v) {
				$scope.userList.teachRecoverArr.push(v.teaInfo.id);
			})
		} else {
			$scope.userList.teachRecoverArr = [];
		}
	}
	//在线教师单选的选中状态
	$scope.isOnlineChecked = function(id) {
		return $scope.userList.teachOnlineArr.indexOf(id) >= 0
	}
	//停用账号单选的选中状态
	$scope.isStopChecked = function(id) {
		return $scope.userList.teachStopArr.indexOf(id) >= 0
	} //回收单选的选中状态
	$scope.isRecovereChecked = function(id) {
		return $scope.userList.teachRecoverArr.indexOf(id) >= 0
	};
	//在线教师点击单个checkbox
	$scope.changeOnlineChecked = function(event, item) {
		var action = event.target.checked ? 'add' : 'remove';
		if(action == 'add' && $scope.userList.teachOnlineArr.indexOf(item.id) == -1) {
			$scope.userList.teachOnlineArr.push(item.id);
			onlineState.push(item.state);
			onlineName.push(item.realname);
			if($scope.userList.teachOnlineArr.length == $scope.userList.tableMsgList.length) {
				$scope.state.teachOnlineChecked = true
			}
		}
		if(action == 'remove' && $scope.userList.teachOnlineArr.indexOf(item.id) != -1) {
			var inx = $scope.userList.teachOnlineArr.indexOf(item.id);
			var sta = onlineState.indexOf(item.state);
			var real = onlineName.indexOf(item.realname)
			$scope.userList.teachOnlineArr.splice(inx, 1);
			onlineState.splice(sta, 1);
			onlineName.splice(real, 1);
			$scope.state.teachOnlineChecked = false
		}
	}
	//停用账号点击单个checkbox
	$scope.changeStopChecked = function(event, id) {
		var action = event.target.checked ? 'add' : 'remove';
		if(action == 'add' && $scope.userList.teachStopArr.indexOf(id) == -1) {
			$scope.userList.teachStopArr.push(id);
			if($scope.userList.teachStopArr.length == $scope.userList.tableMsgListStop.length) {
				$scope.state.teachStopChecked = true
			}
		}
		if(action == 'remove' && $scope.userList.teachStopArr.indexOf(id) != -1) {
			var inx = $scope.userList.teachStopArr.indexOf(id);
			$scope.userList.teachStopArr.splice(inx, 1);
			$scope.state.teachStopChecked = false
		}
	};
	//回收点击单个checkbox
	$scope.changeRecoverChecked = function(event, id) {
		var action = event.target.checked ? 'add' : 'remove';
		if(action == 'add' && $scope.userList.teachRecoverArr.indexOf(id) == -1) {
			$scope.userList.teachRecoverArr.push(id);
			if($scope.userList.teachRecoverArr.length == $scope.userList.tableMsgListRecover.length) {
				$scope.state.teachRecoverChecked = true
			}
		}
		if(action == 'remove' && $scope.userList.teachRecoverArr.indexOf(id) != -1) {
			var inx = $scope.userList.teachRecoverArr.indexOf(id);
			$scope.userList.teachRecoverArr.splice(inx, 1);
			$scope.state.teachRecoverChecked = false
		}
	}
	//在线教师点击
	$scope.teachEventHandle = function(changeState) {
		if(!$scope.userList.teachOnlineArr.length) {
			$scope.state.noteContent = '请选择选项';
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.warningShow = true;
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000)
			return false
		}
		switch(changeState) {
			case 'stop':
				var objParames = {
					ids: $scope.userList.teachOnlineArr.join(','),
					state: 2,
					delFlag: 0,
					updateBy: userId
				};
				var requestState = onlineState.some(function(v, i) {
					$scope.state.noteContent = onlineName[i] + '未审核,不能停用';
					return v == 0
				});
				if(requestState) {
					$scope.state.imgNotice = 'img/wonde_big.png';
					$scope.state.warningShow = true;
					$timeout(function() {
						$scope.state.warningShow = false;
					}, 1000);
					return false;
				};
				loginService.batchUpdataUserState(objParames, function(res) {
					if(res.ret == 200) {
						$scope.state.noteContent = '停用成功';
						$scope.state.imgNotice = 'img/chenggong.png';
						$scope.state.warningShow = true;
//						$scope.TeacherQueryList();
						$timeout(function() {
							$scope.state.warningShow = false;
							$state.go('teacher_index.teach_handle', null, {
								reload: true
							})
						}, 1000)

					} else if(res.ret == 500) {
						$scope.state.noteContent = '服务器异常';
						$scope.state.imgNotice = 'img/wonde_big.png';
						$scope.state.warningShow = true;
					}
				}, function(e) {
					console.log(e)
				});
				break;
				//密码重置
			case 'passReset':
				var objParames = {
					ids: $scope.userList.teachOnlineArr.join(','),
					state: '',
					delFlag: '',
					updateBy: userId
				}
				//              objParames.pageNo=1;
				loginService.batchUpdataUserState(objParames, function(res) {
					if(res.ret == 200) {
						$scope.userPaginationRecover.currentPage = 1;
						$scope.userPaginationStop.currentPage = 1;
						$scope.userPaginationOnline.currentPage = 1;

						$scope.userList.tableMsgList = [];
						$scope.userList.tableMsgListStop = [];
						$scope.userList.tableMsgListRecover = [];

						$scope.state.teachOnlineChecked = false;
						$scope.state.teachStopChecked = false;
						$scope.state.teachRecoverChecked = false;

						$scope.state.noteContent = '密码重置成功';
						$scope.state.imgNotice = 'img/chenggong.png';
						$scope.state.warningShow = true;
						$timeout(function() {
							$scope.state.warningShow = false;
							$state.go('teacher_index.teach_handle', null, {
								reload: true
							})
						}, 1000)
					} else if(res.ret == 500) {
						$scope.state.noteContent = '服务器异常';
						$scope.state.imgNotice = 'img/wonde_big.png';
						$scope.state.warningShow = true;
						$timeout(function() {
							$scope.state.warningShow = false;
							$state.go('teacher_index.teach_handle', null, {
								reload: true
							})
						}, 1000)
					}
				}, function(e) {
					console.log(e)
				});
				break;
			case 'delet':
				var objParames = {
					ids: $scope.userList.teachOnlineArr.join(','),
					delFlag: 3,
					updateBy: userId
				}
				loginService.batchUpdataUserState(objParames, function(res) {
					if(res.ret == 200) {

						$scope.userPaginationRecover.currentPage = 1;
						$scope.userPaginationStop.currentPage = 1;
						$scope.userPaginationOnline.currentPage = 1;

						$scope.userList.tableMsgList = [];
						$scope.userList.tableMsgListStop = [];
						$scope.userList.tableMsgListRecover = [];

						$scope.state.teachOnlineChecked = false;
						$scope.state.teachStopChecked = false;
						$scope.state.teachRecoverChecked = false;
						$scope.state.noteContent = '用户已成功删除';
						$scope.state.imgNotice = 'img/chenggong.png';
						$scope.state.warningShow = true;
//						$scope.TeacherQueryList();
						$timeout(function() {
							$scope.state.warningShow = false;
							$state.go('teacher_index.teach_handle', null, {
								reload: true
							})
						}, 1000)
					} else if(res.ret == 500) {
						$scope.state.noteContent = '服务器异常';
						$scope.state.imgNotice = 'img/wonde_big.png';
						$scope.state.warningShow = true;
						$timeout(function() {
							$scope.state.warningShow = false;
						}, 1000)
					}
				}, function(e) {
					console.log(e)
				});
				break;

		}

	};

	//教师账号停用事件
	$scope.teachStopHandle = function(changeState) {
		if(!$scope.userList.teachStopArr.length) {
			$scope.state.noteContent = '请选择选项';
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.warningShow = true;
			$timeout(function() {
				$scope.state.warningShow = false;
				$state.go('teacher_index.teach_handle', null, {
					reload: true
				})
			}, 1000)
			return false
		}
		switch(changeState) {
			case 'renew':
				var objParames = {
					ids: $scope.userList.teachStopArr.join(','),
					state: 1,
					delFlag: 0,
					updateBy: userId
				}
				loginService.batchUpdataUserState(objParames, function(res) {
					if(res.ret == 200) {
						$scope.state.noteContent = '所选用户已启用';
						$scope.state.imgNotice = 'img/chenggong.png';
						$scope.state.warningShow = true;
//						$scope.TeacherQueryList();
						$timeout(function() {
							$scope.state.warningShow = false;
							$state.go('teacher_index.teach_handle', null, {
								reload: true
							})
						}, 1000)
					} else if(res.ret == 500) {
						$scope.state.noteContent = '服务器异常';
						$scope.state.imgNotice = 'img/wonde_big.png';
						$scope.state.warningShow = true;
						$timeout(function() {
							$scope.state.warningShow = false;
						}, 1000)
					}
				}, function(e) {
					console.log(e)
				});
				break;
			case 'finishDele':
				var objParames = {
					ids: $scope.userList.teachStopArr.join(','),
					delFlag: 3,
					updateBy: userId
				}
				loginService.batchUpdataUserState(objParames, function(res) {
					if(res.ret == 200) {
						
						$scope.userPaginationRecover.currentPage = 1;
						$scope.userPaginationStop.currentPage = 1;
						$scope.userPaginationOnline.currentPage = 1;
						$scope.userList.tableMsgList = [];
						$scope.userList.tableMsgListStop = [];
						$scope.userList.tableMsgListRecover = [];

						$scope.state.teachOnlineChecked = false;
						$scope.state.teachStopChecked = false;
						$scope.state.teachRecoverChecked = false;

						$scope.state.noteContent = '用户已成功删除';
						$scope.state.imgNotice = 'img/chenggong.png';
						$scope.state.warningShow = true;
//						$scope.TeacherQueryList();
						$timeout(function() {
							$scope.state.warningShow = false;
							$state.go('teacher_index.teach_handle', null, {
								reload: true
							})
						}, 1000)
					} else if(res.ret == 500) {
						$scope.state.noteContent = '服务器异常';
						$scope.state.imgNotice = 'img/wonde_big.png';
						$scope.state.warningShow = true;
						$timeout(function() {
							$scope.state.warningShow = false;
						}, 1000)
					}
				}, function(e) {
					console.log(e)
				});
				break;
		}

	}
	//教师回收事件
	$scope.teachRecoverHandle = function(changeState) {
		if(!$scope.userList.teachRecoverArr.length) {
			$scope.state.noteContent = '请选择选项';
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.warningShow = true;
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000)
			return false
		}
		switch(changeState) {
			case 'startUser':
				var objParames = {
					ids: $scope.userList.teachRecoverArr.join(','),
					state: '',
					delFlag: 0,
					updateBy: userId
				}
				loginService.batchUpdataUserState(objParames, function(res) {
					if(res.ret == 200) {

						$scope.userPaginationRecover.currentPage = 1;
						$scope.userPaginationStop.currentPage = 1;
						$scope.userPaginationOnline.currentPage = 1;

						$scope.userList.tableMsgList = [];
						$scope.userList.tableMsgListStop = [];
						$scope.userList.tableMsgListRecover = [];

						$scope.state.teachOnlineChecked = false;
						$scope.state.teachStopChecked = false;
						$scope.state.teachRecoverChecked = false;
						$scope.state.noteContent = '账号已还原成功';
						$scope.state.imgNotice = 'img/chenggong.png';
						$scope.state.warningShow = true;
//						$scope.TeacherQueryList();
						$timeout(function() {
							$scope.state.warningShow = false;
							$state.go('teacher_index.teach_handle', null, {
								reload: true
							})
						}, 1000)
					} else if(res.ret == 500) {
						$scope.state.noteContent = '服务器异常';
						$scope.state.imgNotice = 'img/wonde_big.png';
						$scope.state.warningShow = true;
						$timeout(function() {
							$scope.state.warningShow = false;
						}, 1000)
					}
				}, function(e) {
					console.log(e)
				});
				break;
			case 'finishDele':
				var objParames = {
					ids: $scope.userList.teachRecoverArr.join(','),
					state: '',
					delFlag: 1,
					userType: '1',
					updateBy: userId
				}
				loginService.batchDeleteUserState(objParames, function(res) {
					if(res.ret == 200) {
						$scope.userPaginationRecover.currentPage = 1;
						$scope.userPaginationStop.currentPage = 1;
						$scope.userPaginationOnline.currentPage = 1;

						$scope.userList.tableMsgList = [];
						$scope.userList.tableMsgListStop = [];
						$scope.userList.tableMsgListRecover = [];

						$scope.state.teachOnlineChecked = false;
						$scope.state.teachStopChecked = false;
						$scope.state.teachRecoverChecked = false;

						$scope.state.noteContent = '用户已彻底删除';
						$scope.state.imgNotice = 'img/chenggong.png';
						$scope.state.warningShow = true;
						$timeout(function() {
							$scope.state.warningShow = false;
							$state.go('teacher_index.teach_handle', null, {
								reload: true
							})
						}, 1000)
					} else if(res.ret == 500) {
						$scope.state.noteContent = '服务器异常';
						$scope.state.imgNotice = 'img/wonde_big.png';
						$scope.state.warningShow = true;
						$timeout(function() {
							$scope.state.warningShow = false;
						}, 1000)
					}
				}, function(e) {
					console.log(e)
				});
				break;
		}
	}

}])