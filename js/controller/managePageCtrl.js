app.controller('managePageCtrl', ['$scope', '$state', '$timeout', '$stateParams', '$http', '$filter', 'loginService', function($scope, $state, $timeout, $stateParams, $http, $filter, loginService) {
	
	var cityId = sessionStorage.getItem("areaId"); //拿到市级ID
	var countyId = sessionStorage.getItem("userAreaId"); //拿到区县ID
	var scope = sessionStorage.getItem("scope"); //获取登录人的权限范围
	
	var lodingtimout = 1000;
	$scope.newschoolId = "";
	$scope.offid = '';
	$scope.love = false;
	
	$scope.state = {
		headTab: 0, //判断头部选项卡
		gradeState: 0, //判断年级
		classState: 0, //判断班级
		studentOnlineChecked: false, //在线学生-判断是否选中
		studentStopChecked: false, //停用账号-判断是否选中
		studentRecoverChecked: false, //回收站-判断是否选中
		studentOnlineCount: 0, //学生人数
		warningShow: false,
		deletStatus: false,
		imgNotice: 'img/wonde_big.png',
		sureDeletContent: '确认删除所选管理者？',
		AddState: false, //新增按钮行是否显示
		modelDown: requireIp,
		repeatData: [],
		searchOfficeId: '',
		repeatstate: false,
	}

	var pageSize = 10;
	var userType = 4;
	
	if($stateParams.tableChange) {
		$scope.state.headTab = $stateParams.tableChange;
	}

	//模拟数据
	$scope.studentList = {
		checkboxArr: [],
		checkboxStopArr: [],
		checkboxReArr: [],
		gradeList: [],
		classList: [{
			name: '全部',
			id: 'all'
		}, ],
		tableMsgList: [],
		tableMsgListStop: [],
		tableMsgListRecover: []
	}
	
		//表格数据填充公用方法
	$scope.tabledata = function(res) {
		if(res.ret == 200) {
			//在线的表格数据
			$scope.state.lightHome = true;
			$scope.studentList.tableMsgList = res.data.list;
			$scope.studentPaginationOnline.totalItems = res.data.count;
			$scope.state.studentOnlineCount = res.data.count;
			//已停用的表格数据

			$scope.studentList.tableMsgListStop = res.data.list;
			$scope.studentPaginationStop.totalItems = res.data.count;
			$scope.state.studentStopCount = res.data.count;

			//回收站的表格数据
			$scope.studentList.tableMsgListRecover = res.data.list;
			$scope.studentPaginationRecover.totalItems = res.data.count;
			$scope.state.studentRecoverCount = res.data.count;
			
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000)
		} else if(res.ret == 400) {
			//在线的表格数据
			$scope.studentList.tableMsgList = [];
			$scope.state.studentOnlineCount = 0;
			$scope.studentPaginationOnline.totalItems = 0;
			//已停用的表格数据
			$scope.studentList.tableMsgListStop = [];
			$scope.state.studentStopCount = 0;
			$scope.studentPaginationStop.totalItems = 0;
			//回收站的表格数据
			$scope.studentList.tableMsgListRecover = [];
			$scope.state.studentRecoverCount = 0;
			$scope.studentPaginationRecover.totalItems = 0;
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000)
		}
	};
	
	
	
	
	//初始化参数
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
			$scope.tabledata(res);
		})
	}else if(scope==3){	//区领导
		initialuserParam.areaId = countyId;
		userParam = initialuserParam;
		//一进入页面获取的用户列表
		loginService.queryUserList(userParam, function(res) {
			$scope.tabledata(res);
		})
	}else{
		$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.warningShow = true;
			$scope.state.noteContent = "获取用户权限错误";
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
	}
	
	
	//切换选项卡
	$scope.changeTab = function(state) {
		sessionStorage.setItem('tableChange', state);
		$scope.state.headTab = state;
		$state.go('teacher_index.managePage', {'tableChange': state})
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
		userParam.gradeId = null;
		userParam.classId = null;
		userParam.keyword = null;
		//清空全选
		$scope.state.studentOnlineChecked=false;
		$scope.state.studentStopChecked=false;
		$scope.state.studentRecoverChecked=false;
		$scope.studentList.checkboxArr = [];
		$scope.studentList.checkboxStopArr = [];
		$scope.studentList.checkboxReArr = [];
		//选择学校后把搜索框置空
		$scope.state.parentOnlineSearch = null;
		//选择学校后把分页置为1
		$scope.studentPaginationOnline.currentPage=1;
		$scope.studentPaginationStop.currentPage=1;
		$scope.studentPaginationRecover.currentPage=1;
		//获取用户列表
		loginService.queryUserList(userParam, function(res) {
			$scope.state.lightHome = false;
			$scope.tabledata(res);
		})
	}
	
	
	//点击搜索框获取的用户列表
	$scope.studentOnlineSearch = function() {
		userParam.keyword = $scope.state.parentOnlineSearch;
		userParam.pageNo = 1;
		//清空全选
		$scope.state.studentOnlineChecked=false;
		$scope.state.studentStopChecked=false;
		$scope.state.studentRecoverChecked=false;
		
		$scope.studentList.checkboxArr = [];
		$scope.studentList.checkboxStopArr = [];
		$scope.studentList.checkboxReArr = [];
		
		$scope.studentPaginationOnline.currentPage=1;
		$scope.studentPaginationStop.currentPage=1;
		$scope.studentPaginationRecover.currentPage=1;
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
	}
	//学生在线头部确认删除
	$scope.suredel = function() {
		$scope.state.deletStatus = false;
		if($scope.state.headTab == 0) {
			$scope.studentOnlineAction('delet');
		} else if($scope.state.headTab == 1) {
			$scope.studentStopRenew('delet');
		} else if($scope.state.headTab == 2) {
			$scope.studentRecoverRenew('delet');
		}
	}
	//点击头部的确认删除按钮
	$scope.studentDelet = function(status) {
		switch(status) {
			case 'online':
				if(!$scope.studentList.checkboxArr.length) {
					$scope.state.warningShow = true;
					$scope.state.imgNotice = 'img/wonde_big.png';
					$scope.state.noteContent = '请至少选择一项!';
					$timeout(function() {
						$scope.state.warningShow = false;
					}, 1000);
					return false;
				}
				$scope.state.sureDeletContent = '确认删除所选管理者？'
				break;
			case 'stop':
				if(!$scope.studentList.checkboxStopArr.length) {
					$scope.state.warningShow = true;
					$scope.state.imgNotice = 'img/wonde_big.png';
					$scope.state.noteContent = '请至少选择一项!';
					$timeout(function() {
						$scope.state.warningShow = false;
					}, 1000)
					return false
				}
				$scope.state.sureDeletContent = '确认删除所选用户？'
				break;
			case 'recover':
				if(!$scope.studentList.checkboxReArr.length) {
					$scope.state.warningShow = true;
					$scope.state.imgNotice = 'img/wonde_big.png';
					$scope.state.noteContent = '请至少选择一项!';
					$timeout(function() {
						$scope.state.warningShow = false;
					}, 1000)
					return false
				}
				$scope.state.sureDeletContent = '确认彻底删除所选用户？(该操作不可恢复)'
				break;
		}
		$scope.state.deletStatus = true;
	}

	//点击在线学生全选
	$scope.onlineCheckAction = function(event) {
		if($scope.state.studentOnlineChecked) {
			$scope.studentList.checkboxArr = [];
			$scope.studentList.tableMsgList.forEach(function(v) {
				$scope.studentList.checkboxArr.push(v.teaInfo.id)
			})
		} else {
			$scope.studentList.checkboxArr = [];
		}
	}
	//点击停用学生全选
	$scope.stopCheckAction = function(event) {
		if($scope.state.studentStopChecked) {
			$scope.studentList.checkboxStopArr = [];
			$scope.studentList.tableMsgListStop.forEach(function(v) {
				$scope.studentList.checkboxStopArr.push(v.teaInfo.id)
			})
		} else {
			$scope.studentList.checkboxStopArr = [];
		}
	}
	//点击回收站全选
	$scope.recoverCheckAction = function(event) {
		if($scope.state.studentRecoverChecked) {
			$scope.studentList.checkboxReArr = [];
			$scope.studentList.tableMsgListRecover.forEach(function(v) {
				$scope.studentList.checkboxReArr.push(v.teaInfo.id)
			})
		} else {
			$scope.studentList.checkboxReArr = [];
		}
	}
	//学生在线单选的选中状态
	$scope.isChecked = function(id) {
		return $scope.studentList.checkboxArr.indexOf(id) >= 0
	}
	//停用账号单选的选中状态
	$scope.isCheckedStop = function(id) {
		return $scope.studentList.checkboxStopArr.indexOf(id) >= 0
	}
	//回收站单选的选中状态
	$scope.isCheckedRe = function(id) {
		return $scope.studentList.checkboxReArr.indexOf(id) >= 0
	};
	var onlineState = [];
	var onlineName = [];
	//在线点击单个checkbox
	$scope.changeOnlineCheck = function(event, item) {
		var action = event.target.checked ? 'add' : 'remove';
		if(action == 'add' && $scope.studentList.checkboxArr.indexOf(item.id) == -1) {
			$scope.studentList.checkboxArr.push(item.id);
			onlineState.push(item.state);
			onlineName.push(item.stuName);
			if($scope.studentList.checkboxArr.length == $scope.studentList.tableMsgList.length) {
				$scope.state.studentOnlineChecked = true
			}
		}
		if(action == 'remove' && $scope.studentList.checkboxArr.indexOf(item.id) != -1) {
			var inx = $scope.studentList.checkboxArr.indexOf(item.id);
			var sta = onlineState.indexOf(item.state);
			var real = onlineName.indexOf(item.stuName);
			$scope.studentList.checkboxArr.splice(inx, 1);
			onlineState.splice(sta, 1);
			onlineName.splice(real, 1);
			$scope.state.studentOnlineChecked = false
		}
	}
	//帐号停用点击单个checkbox
	$scope.changeStopCheck = function(event, id) {
		var action = event.target.checked ? 'add' : 'remove';
		if(action == 'add' && $scope.studentList.checkboxStopArr.indexOf(id) == -1) {
			$scope.studentList.checkboxStopArr.push(id);
			if($scope.studentList.checkboxStopArr.length == $scope.studentList.tableMsgListStop.length) {
				$scope.state.studentStopChecked = true
			}
		}
		if(action == 'remove' && $scope.studentList.checkboxStopArr.indexOf(id) != -1) {
			var inx = $scope.studentList.checkboxStopArr.indexOf(id);
			$scope.studentList.checkboxStopArr.splice(inx, 1);
			$scope.state.studentStopChecked = false
		}
	}
	//回收站点击单个checkbox 
	$scope.changeRecoverCheck = function(event, id) {
		var action = event.target.checked ? 'add' : 'remove';
		if(action == 'add' && $scope.studentList.checkboxReArr.indexOf(id) == -1) {
			$scope.studentList.checkboxReArr.push(id);
			if($scope.studentList.checkboxReArr.length == $scope.studentList.tableMsgListRecover.length) {
				$scope.state.studentRecoverChecked = true
			}
		}
		if(action == 'remove' && $scope.studentList.checkboxReArr.indexOf(id) != -1) {
			var inx = $scope.studentList.checkboxReArr.indexOf(id);
			$scope.studentList.checkboxReArr.splice(inx, 1);
			$scope.state.studentRecoverChecked = false
		}
	}

	//新增管理者事件
	$scope.addOnlineAction = function(state) {
		switch(state) {
			case 'add':
				$scope.state.AddState = true;
				
				/**
				 * 管理角色选择
				 */
				$scope.selected = [];
				$scope.selectedTags = [];
				var updateSelected = function(action, id, name) {
					if(action == 'add' && $scope.selected.indexOf(id) == -1) {
						$scope.selected.push(id);
						//		   $scope.selectedTags.push(name);
					}
					if(action == 'remove' && $scope.selected.indexOf(id) != -1) {
						var idx = $scope.selected.indexOf(id);
						$scope.selected.splice(idx, 1);
						$scope.selectedTags.splice(idx, 1);
					}
				}
				$scope.updateSelection = function($event, id) {
					var checkbox = $event.target;
					var action = (checkbox.checked ? 'add' : 'remove');
					updateSelected(action, id, checkbox.name);
				}
				$scope.isSelected = function(id) {
					return $scope.selected.indexOf(id) >= 0;
				}
				//新增管理者弹出页面获取机构列表
				var areaId = sessionStorage.getItem("areaId");
				$http.get(requireIp + '/ea/eaOffice?flag=0&&state=1&areaIds=' + areaId).success(function(data) {
					$scope.sctypes = data.data.schoolList
			
				})
				//新增管理者弹出页面获取角色权限列表
				$scope.officeId = "";
				$http.post(requireIp + '/uc/ucRole/findRoleList', {
					type: '4'
				}).success(function(res) {
					$scope.userroles = res.data.findList;
				})
				
				
				//	//区域搜索查询
				$scope.selettypefn1 = function(offid) {
					$scope.offid = offid;
				}
				
				break;
			case 'cancel':
				$scope.state.AddState = false;
				break;
		}
	};
	
	//新增管理者弹出页面管理者新增管理提交操作
	$scope.addNewManaager = function() {
		var regExp = /^1[34578]\d{9}$/;
		if($scope.teachName == '' || $scope.teachName == null) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请输入教师姓名!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		} else if($scope.offid == '' || $scope.offid == null) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请选择机构!';
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
		} else if($scope.selected == '' || $scope.selected == null) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请选择角色权限!';
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
				officeId: $scope.offid,
				remark: $scope.remarkName
			}
			var ridArray = $scope.selected;
			var userRole = [];
			angular.forEach(ridArray, function(data, index, arry) {
				var ridObj = {};
				if(data != undefined && data != '') {
					ridObj.rid = data;
					userRole.push(ridObj)
				}
			})
			var jsonData = angular.toJson({
				userInfo: userInfo,
				roleInfo: userRole
			})
			console.log(jsonData);
			$scope.love = true
			loginService.addUser({
				userType: 4,
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
						$state.go('teacher_index.managePage', null, {
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

	//上传文件
	$scope.fileAction = function(me) {
		$scope.state.warningShow = true;
		$scope.state.imgNotice = 'img/wonde_big.png';
		$scope.state.noteContent = '上传中，请稍等!';
		$scope.state.repeatData = [];
		$scope.state.repeatstate = false;
		var fd = new FormData();
		var file = me.files[0];
		fd.append('excelFile', file);
		fd.append('type', '2');
		fd.append("userId", sessionStorage.getItem('userId'));
		loginService.uploadExcel(fd, function(res) {
			if(res.ret == 200) {
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '上传成功';
				$timeout(function() {
					$scope.state.warningShow = false;
					$state.go('teacher_index.student_handle', null, {
						reload: true
					})
				}, 1500)
			} else if(res.ret == 400) {
				$scope.state.noteContent = res.message + '请重新上传!';
				$timeout(function() {
					$scope.state.warningShow = false;
				}, 1500)
			} else if(res.ret == 500) {
				$scope.state.noteContent = res.message + '请重新上传!';
				$timeout(function() {
					$scope.state.warningShow = false;
				}, 1500)
			} else if(res.ret == 402) {
				$scope.state.noteContent = res.message + '请重新上传!';
				$scope.state.repeatData = res.data;
				$scope.state.repeatstate = true;
				$timeout(function() {
					$scope.state.warningShow = false;
				}, 2500)
			}
		}, function(e) {
			console.log(123 + ',' + e)
		});
		me.value = '';
	}
	//学生在线的头部按钮事件
	$scope.studentOnlineAction = function(stateAction) {
		if(!$scope.studentList.checkboxArr.length) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请至少选择一项!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000)
			return false
		}
		switch(stateAction) {
			case 'checked':
				var params = {
					ids: $scope.studentList.checkboxArr.join(','),
					delFlag: 0,
					state: 1
				}
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '审核成功！';
				break;
			case 'stop':
				var params = {
					ids: $scope.studentList.checkboxArr.join(','),
					delFlag: 0,
					state: 2
				};
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '停用成功！';
				break;
			case 'reset':
				var params = {
					ids: $scope.studentList.checkboxArr.join(',')
				}
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '密码重置成功！';
				break;
			case 'delet':
				var params = {
					ids: $scope.studentList.checkboxArr.join(','),
					delFlag: 3
				}
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '所选用户已成功删除！';
				break;
		};
		params.pageNo = 1;
		loginService.batchUpdataUserState(params, function(res) {
			if(res.ret == 200) {
				$scope.state.warningShow = true;
				$scope.state.studentOnlineChecked = false;
				$scope.studentList.checkboxArr = [];
				$scope.studentList.checkboxStopArr = [];
				$scope.studentList.checkboxReArr = [];
				
				$scope.studentPaginationOnline.currentPage=1;
				$scope.studentPaginationStop.currentPage=1;
				$scope.studentPaginationRecover.currentPage=1;


				$scope.newschoolId = $scope.state.searchOfficeId;
//				$scope.currentpage = '1';
				userParam.pageNo=1;
				loginService.queryUserList(userParam, function(res) {
					$scope.tabledata(res);
				})


			}
		}, function(e) {
			console.log(e)
		})
	}
	//学生停用的头部按钮事件
	$scope.studentStopRenew = function(stateAction) {
		if(!$scope.studentList.checkboxStopArr.length) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请至少选择一项!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000)
			return false
		}
		switch(stateAction) {
			case 'renew':
				var params = {
					ids: $scope.studentList.checkboxStopArr.join(','),
					delFlag: 0,
					state: 1
				}
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '所选用户已成功启用！';
				break;
			case 'delet':
				var params = {
					ids: $scope.studentList.checkboxStopArr.join(','),
					delFlag: 3
				}
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '所选用户已成功删除！';
				break;
		}
		params.pageNo=1;
		loginService.batchUpdataUserState(params, function(res) {
			if(res.ret == 200) {
				$scope.state.warningShow = true;
				$scope.state.studentStopChecked = false;
				$scope.studentList.checkboxArr = [];
				$scope.studentList.checkboxStopArr = [];
				$scope.studentList.checkboxReArr = [];
				$scope.currentpage = this.currentpage;
				
				$scope.studentPaginationOnline.currentPage=1;
				$scope.studentPaginationStop.currentPage=1;
				$scope.studentPaginationRecover.currentPage=1;
				$scope.currentpage = '1';
//				$scope.ManagerQueryList();
				userParam.pageNo=1;
				loginService.queryUserList(userParam, function(res) {
					$scope.tabledata(res);
				})


			}

		}, function(e) {
			console.log(e)
		})
	}
	//回收头部按钮事件
	$scope.studentRecoverRenew = function(stateAction) {
		if(!$scope.studentList.checkboxReArr.length) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请至少选择一项!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000)
			return false
		}
		switch(stateAction) {
			case 'renew':
				var params = {
					ids: $scope.studentList.checkboxReArr.join(','),
					delFlag: 0,
				}
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '所选用户已还原成功！';
				break;
			case 'delet':
				var params = {
					ids: $scope.studentList.checkboxReArr.join(','),
					delFlag: 1
				}
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '所选用户已彻底删除！';
				break;
		}
		//更新列表信息
		loginService.batchUpdataUserState(params, function(res) {
			if(res.ret == 200) {
				$scope.state.warningShow = true;
				$scope.state.studentRecoverChecked = false;
				$scope.studentList.checkboxArr = [];
				$scope.studentList.checkboxStopArr = [];
				$scope.studentList.checkboxReArr = [];
				$scope.newschoolId = $scope.state.searchOfficeId;
				$scope.currentpage = '1';
				userParam.pageNo=1;
				loginService.queryUserList(userParam, function(res) {
					$scope.tabledata(res);
				})
			}

		}, function(e) {
			console.log(e)
		})
	}


	//管理者在线分页组件配置
	$scope.studentPaginationOnline = {
		currentPage: 1,
		totalItems: 1,
		pagesLength: 9,
		itemsPerPage: pageSize,
		perPageOptions: [15],
		onChange: function() {
			var currentPage = this.currentPage;
			$scope.studentList.checkboxReArr = [];
			$scope.studentList.checkboxStopArr = [];
			$scope.studentList.checkboxArr = [];
			$scope.state.studentOnlineChecked = false;
			$scope.state.studentStopChecked = false;
			$scope.state.studentRecoverChecked = false;
			
			userParam.pageNo = currentPage;
			loginService.queryUserList(userParam, function(res) {
				$scope.tabledata(res);
			})
			
		}
	}
	//账号停用分页组件配置
	$scope.studentPaginationStop = {
		currentPage: 1,
		totalItems: 1,
		pagesLength: 9,
		itemsPerPage: pageSize,
		perPageOptions: [15],
		onChange: function() {
			var currentPage = this.currentPage;
			$scope.studentList.checkboxReArr = [];
			$scope.studentList.checkboxStopArr = [];
			$scope.studentList.checkboxArr = [];
			$scope.state.studentOnlineChecked = false;
			$scope.state.studentStopChecked = false;
			$scope.state.studentRecoverChecked = false;
			
			userParam.pageNo = currentPage;
			loginService.queryUserList(userParam, function(res) {
				$scope.tabledata(res);
			})
		}
	}
	//回收分页组件配置
	$scope.studentPaginationRecover = {
		currentPage: 1,
		pagesLength: 9,
		itemsPerPage: pageSize,
		perPageOptions: [15],
		onChange: function() {
			if($scope.state.searchOfficeId != null) {
				areaIds = null;
			}
			var currentPage = this.currentPage;
			$scope.studentList.checkboxReArr = [];
			$scope.studentList.checkboxStopArr = [];
			$scope.studentList.checkboxArr = [];
			$scope.state.studentOnlineChecked = false;
			$scope.state.studentStopChecked = false;
			$scope.state.studentRecoverChecked = false;
			
			userParam.pageNo = currentPage;
			loginService.queryUserList(userParam, function(res) {
				$scope.tabledata(res);
			})
			
		}
	};


}])