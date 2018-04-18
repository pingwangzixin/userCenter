app.controller('studentHandleCtrl', ['$scope', '$state', '$timeout', '$http', '$filter', 'loginService', '$stateParams', function($scope, $state, $timeout, $http, $filter, loginService, $stateParams) {
	var cityId = sessionStorage.getItem("areaId"); //拿到市级ID
	var countyId = sessionStorage.getItem("userAreaId"); //拿到区县ID
	var scope = sessionStorage.getItem("scope"); //获取登录人的权限范围
	var tableChange = sessionStorage.getItem("tableChange"); //切换的状态
	var userId = sessionStorage.getItem("userId"); //拿到用户id
	var officeId = JSON.parse(sessionStorage.getItem("userObj")).oid; //拿到学校id
	var userRole= JSON.parse(sessionStorage.getItem("userObj")).teachStatus; //拿到用户的具体角色（1班主任15学校管理员）
//	sessionStorage.setItem("tableChange", 0)
	var username = sessionStorage.getItem("userName");
	
	var pageSize = 10;
	var userType = 2;
	$scope.banzhuren=false;

	
	//页面需要的初始化
	$scope.state = {
		headTab: 0, //判断头部选项卡
		scope: scope,
		teachStatus: userRole,
		gradeState: '', //判断年级
		classState: '', //判断班级
		studentOnlineChecked: false, //在线学生-判断是否选中
		studentStopChecked: false, //停用账号-判断是否选中
		studentRecoverChecked: false, //回收站-判断是否选中
		studentOnlineCount: 0, //学生人数
		warningShow: false,
		deletStatus: false,
		imgNotice: 'img/wonde_big.png',
		sureDeletContent: '确认删除所选同学？',
		AddState: false, //新增按钮行是否显示
		addStudentNumber: '', //国网学籍号
		addStudentName: '', //新增学生姓名
		addGradeList: [], //新增年级
		addClassList: [], //新增班级
		teaGradeId: '', //新增学校id
		teaClassId: '', //新增班级id
		modelDown: requireIp,
		repeatData: [],
		repeatstate: false,
		usertypeState: 0,
		managestatus: true,
		adduser: false,
		lightHome: true,
	}
	
	$scope.choseOfficeId = officeId;
	$scope.choseGradeId = "";
	
	//路由传参
	if($stateParams.tableChange) {
		$scope.state.headTab = $stateParams.tableChange;
	}
	
	//班主任Id
	var banzhurenId = {
		teaId: userId
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
		console.log(userRole)
		if(userRole==15){	//学校管理员
			initialuserParam.officeId = officeId;
			var officeIdParam = {
				officeId: officeId
			}
			loginService.studentHandleGradeList(officeIdParam, function(res) {
				$scope.studentList.gradeList = res.data;
			})
			userParam = initialuserParam;
			//一进入页面获取的用户列表
			loginService.queryUserList(userParam, function(res) {
				$scope.state.lightHome = false;
				$scope.tabledata(res);
			})
		}else if(userRole==1){	//班主任
			$scope.banzhuren=true;
			loginService.studentMainleGradeList(banzhurenId, function(res) {	//获取班主任所带的班级
				if(res.ret == 200) {
					initialuserParam.classId = res.data.id;
					userParam = initialuserParam;
					//一进入页面获取的用户列表
					loginService.queryUserList(userParam, function(res) {
						$scope.state.lightHome = false;
						$scope.tabledata(res);
					})
				} else { 	//通过班主任ID获取班主任所带班级失败
					$scope.state.warningShow = true;
					$scope.state.imgNotice = 'img/chenggong.png';
					$scope.state.noteContent = "未获取到该班主任的班级信息";
					$timeout(function() {
						$scope.love = false;
						$scope.state.warningShow = false;
						$state.go('teacher_index.teacher_center', {
							username: username
						})
					}, 1000);
				}
			})
			
		}else{	//scope=4,但是既不是学校管理员也不是班主任
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
	$scope.changeTab = function(n) {
		$scope.state.headTab = n;
		//判断切换的是在线还是已停用或者是回收站，改变参数
	
		sessionStorage.setItem("tableChange", n);
		
		$state.go('teacher_index.student_handle', {'tableChange': n})
		
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
		//选择学校后把年级和班级以及搜索框置空
		$scope.state.gradeState = null;
		$scope.state.classState = null;
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
		
		var officeIdParam = {
			officeId: schoolId
		}
		//选择学校后立马获取该学校的年级
		loginService.studentHandleGradeList(officeIdParam, function(res) {
			$scope.studentList.gradeList = res.data;
		})
	}
	
	//选择年级后获取的用户列表
	$scope.changeGreade = function() {
		userParam.gradeId = $scope.state.gradeState;
		userParam.pageNo = 1;
		userParam.classId = null;
		userParam.keyword = null;
		
		$scope.studentList.checkboxArr = [];
				$scope.studentList.checkboxStopArr = [];
				$scope.studentList.checkboxReArr = [];
		//清空全选
		$scope.state.studentOnlineChecked=false;
		$scope.state.studentStopChecked=false;
		$scope.state.studentRecoverChecked=false;
		//选择年级后把班级和搜索框置空
		$scope.state.classState = null;
		$scope.state.parentOnlineSearch = null;
		//选择年级后把分页置为1
		$scope.studentPaginationOnline.currentPage=1;
		$scope.studentPaginationStop.currentPage=1;
		$scope.studentPaginationRecover.currentPage=1;
		//获取用户列表
		loginService.queryUserList(userParam, function(res) {
			$scope.state.lightHome = false;
			$scope.tabledata(res);
		})
		
		//选择年级后立马获取该年级的班级
		$http.post(requireIp + "/ea/eaClass/findClassInfoByGid", {
			gradeId: $scope.state.gradeState
		}).success(function(res) {
			$scope.studentList.classList = res.data;
			$scope.studentList.classList.forEach(function(v) {
				v.name = v.name + "班";
			})
		})
	}
	
	//选择班级后获取的用户列表
	$scope.changeClass = function() {
		userParam.classId = $scope.state.classState;
		//清空全选
		$scope.state.studentOnlineChecked=false;
		$scope.state.studentStopChecked=false;
		$scope.state.studentRecoverChecked=false;
		
		$scope.studentList.checkboxArr = [];
				$scope.studentList.checkboxStopArr = [];
				$scope.studentList.checkboxReArr = [];
		userParam.pageNo = 1;
		userParam.keyword = null;
		//选择班级后把搜索框置空
		$scope.state.parentOnlineSearch = null;
		//选择班级后把分页置为1
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
	
	
	//新增用户的信息
	$scope.user = {}
	//管理者角色
	if(userRole == 1) {} else {
		var scopeRole = JSON.parse(sessionStorage.getItem('scope'));
	}
	//模拟数据
	$scope.studentList = {
		checkboxArr: [],
		checkboxStopArr: [],
		checkboxReArr: [],
		gradeList: [],
		classList: [
			//          {name:'全部',id:'all'},
		],
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
		}
	};
	//封装的调用家长接口方法开始——————————————————————————————————————————————————————————————————————————————————————————————————————
	
	//确认删除开始————————————————————————————————————————

	//点击头部的确认删除按钮开始————————————————

	//新增学生事件
	$scope.addOnlineAction = function(state) {
		$scope.state.adduser = true;
	};
	
	//新增学生点击年级选择班级
	$scope.selClass = function(a) {
			$http.post(requireIp + "/ea/eaClass/findClassInfoByGid", {				
				gradeId: a
				
			}).success(function(res) {
				$scope.studentList.classList = res.data;
				
			});
	}
	//确认新增学生按钮
	$scope.sureAddStudent = function() {
		var regExp = /^[G|L][1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
		if($scope.user.username == '' || $scope.user.username == null) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请输入学生姓名!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		} else if($scope.user.sto == '' || $scope.user.sto == null) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请输入学生学籍号!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		} else if(regExp.test($scope.user.sto) == false) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请输入正确的学籍号!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		} else if($scope.user.sex == '' || $scope.user.sex == null) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请输入学生性别!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		} else if($scope.user.grade == '' || $scope.user.grade == null && $scope.state.userRole != 1) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请选择学生年级!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		} else if($scope.user.banjiData == '' || $scope.user.banjiData == null && $scope.state.userRole != 1) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请选择学生班级!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		} else {
			$scope.love = true;
			//判断年级id和班级Id（根据不同的身份拿到不同的值）
			var gradeId = ""
			var classId = ""
			if($scope.state.userRole != 1) {
				gradeId = $scope.user.grade;
				classId = $scope.user.banjiData;
			} else {
				gradeId = $scope.bzrgradeId;
				classId = $scope.bzrclassId;
			}
			loginService.addNewStudentMes({
				realname: $scope.user.username,
				stuNo: $scope.user.sto,
				sex: $scope.user.sex,
				gradeId: gradeId,
				classId: classId,
				createBy: sessionStorage.getItem('userId')
			}, function(res) {
				if(res.ret == 200) {
					$scope.state.warningShow = true;
					$scope.state.imgNotice = 'img/chenggong.png';
					$scope.state.noteContent = res.message;
					$timeout(function() {
						$scope.state.warningShow = false;
						$state.go('teacher_index.student_handle', null, {
							reload: true
						})
					}, 1000);
				} else {
					$scope.state.warningShow = true;
					$scope.state.imgNotice = 'img/wonde_big.png';
					$scope.state.noteContent = res.message;
					$timeout(function() {
						$scope.love = false;
						$scope.state.warningShow = false;
					}, 1000);
				}
			}, function(e) {
				console.log(e)
			})
		}
	}
	
	//点击在线学生全选开始——————————————————
	$scope.onlineCheckAction = function(event) {
		if($scope.state.studentOnlineChecked) {
			$scope.studentList.checkboxArr = [];
			$scope.studentList.tableMsgList.forEach(function(v) {
				$scope.studentList.checkboxArr.push(v.id)
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
				$scope.studentList.checkboxStopArr.push(v.id)
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
				$scope.studentList.checkboxReArr.push(v.id)
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
	//学生在线点击单个checkbox
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
	//点击在线学生全选结束——————————————————

	//停用、 重置密码开始————————————————————————————————————————
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
					state: 1,
					officeId: $scope.pageOfficeId || schoolId.officeId
				}
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '审核成功！';
				break;
			case 'stop': //停用
				var params = {
					ids: $scope.studentList.checkboxArr.join(','),
					delFlag: 0,
					state: 2,
				};
				$scope.state.imgNotice = 'img/chenggong.png';
				var requestState = onlineState.some(function(v, i) {
					$scope.state.noteContent = onlineName[i] + '未审核,不能停用';
					return v == 0;
				});
				if(!requestState) {
					$scope.state.noteContent = '停用成功！';
				}
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
		if(requestState) {
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.warningShow = true;
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		};
		loginService.teachHandleUpdataList(params, function(res) {
			if(res.ret == 200) {
				$scope.state.warningShow = true;
				$scope.state.studentOnlineChecked = false;
				$scope.studentList.checkboxArr = [];
				$scope.studentList.checkboxStopArr = [];
				$scope.studentList.checkboxReArr = [];
				userParam.pageNo = 1;
				$scope.studentPaginationOnline.currentPage=1;
				$scope.studentPaginationStop.currentPage=1;
				$scope.studentPaginationRecover.currentPage=1;
				$scope.studentList.checkboxArr = [];
				$scope.studentList.checkboxStopArr = [];
				$scope.studentList.checkboxReArr = [];
				var classState = $scope.state.classState == 'all' ? null : $scope.state.classState;

				loginService.queryUserList(userParam, function(res) {
					$scope.state.lightHome = false;
					$scope.tabledata(res);
				})

				$timeout(function() {
					$scope.state.warningShow = false;
				}, 1000)
			}
		})
	}
	//停用、 重置密码结束————————————————————————————————————————

	//启用按钮的事件开始————————————————————————————————
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
					state: 1,
				}
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '所选用户已成功启用！';
				break;
			case 'delet':
				var params = {
					ids: $scope.studentList.checkboxStopArr.join(','),
					delFlag: 3,
				}
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '所选用户已成功删除！';
				break;
		}

		loginService.teachHandleUpdataList(params, function(res) {
			if(res.ret == 200) {
				$scope.state.warningShow = true;
				$scope.state.studentStopChecked = false;
				$scope.studentList.checkboxArr = [];
				$scope.studentList.checkboxStopArr = [];
				$scope.studentList.checkboxReArr = [];
				
				userParam.pageNo = 1;
				$scope.studentPaginationOnline.currentPage=1;
				$scope.studentPaginationStop.currentPage=1;
				$scope.studentPaginationRecover.currentPage=1;
				
				$scope.studentList.checkboxArr = [];
				$scope.studentList.checkboxStopArr = [];
				$scope.studentList.checkboxReArr = [];
				var classState = $scope.state.classState == 'all' ? null : $scope.state.classState;
				
				loginService.queryUserList(userParam, function(res) {
					$scope.state.lightHome = false;
					$scope.tabledata(res);
				})

				$timeout(function() {
					$scope.state.warningShow = false;
				}, 1000)

			}

		}, function(e) {
			console.log(e)
		})
	}
	//启用按钮的事件结束————————————————————————————————

	$scope.changeSref = function(id) {
		$state.go('teacher_index.manager_updataStudent', {
			studentCard: id
		});
	};

	//上传文件开始————————————————————————————————————————————————————
	$scope.fileAction = function(me) {
		$scope.state.warningShow = true;
		$scope.state.imgNotice = 'img/wonde_big.png';
		$scope.state.noteContent = '上传中，请稍等!';
		$scope.state.repeatData = [];
		$scope.state.repeatstate = false;
		var fd = new FormData();
		var file = me.files[0];
		fd.append('excelFile', file);
		fd.append('userType', '2');
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
	//上传文件结束————————————————————————————————————————————————————

	//删除按钮事件开始————————————————————————————
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
				$scope.state.sureDeletContent = '确认删除所选同学？'
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
				$scope.state.sureDeletContent = '确认删除所选同学？'
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
				$scope.state.sureDeletContent = '确认彻底删除所选同学？(该操作不可恢复)'
				break;
		}
		$scope.state.deletStatus = true;
	}
	//删除按钮事件结束————————————————————————————

	//学生在线头部确认删除
	$scope.suredel = function() {
		$scope.state.deletStatus = false;
		if(sessionStorage.getItem('tableChange') == 0) {
			$scope.studentOnlineAction('delet');
		} else if(sessionStorage.getItem('tableChange') == 1) {
			$scope.studentStopRenew('delet');
		} else if(sessionStorage.getItem('tableChange') == 2) {
			$scope.studentRecoverRenew('delet');
		}
	}

	//还原按钮事件开始——————————————————————————————————————————————————————
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
					delFlag: 1,
				}
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '所选用户已彻底删除！';
				break;
		}

		//跟新学生信息
		loginService.teachHandleUpdataList(params, function(res) {
			if(res.ret == 200) {
				$scope.state.warningShow = true;
				$scope.state.studentRecoverChecked = false;
				$scope.studentList.checkboxArr = [];
				$scope.studentList.checkboxStopArr = [];
				$scope.studentList.checkboxReArr = [];
				userParam.pageNo=1;
				$scope.studentPaginationOnline.currentPage=1;
				$scope.studentPaginationStop.currentPage=1;
				$scope.studentPaginationRecover.currentPage=1;
				
				$scope.studentList.checkboxArr = [];
				$scope.studentList.checkboxStopArr = [];
				$scope.studentList.checkboxReArr = [];
				
				
				var classState = $scope.state.classState == 'all' ? null : $scope.state.classState;
				
				loginService.queryUserList(userParam, function(res) {
					$scope.state.lightHome = false;
					$scope.tabledata(res);
				})

				$timeout(function() {
					$scope.state.warningShow = false;
				}, 1000)

			}

		}, function(e) {
			console.log(e)
		})
	}

	//还原按钮事件结束——————————————————————————————————————————————————————

	//=学生在线分页组件配置开始————————————————————————————————————
	$scope.studentPaginationOnline = {
		currentPage: 1,
		totalItems: 1,
		pagesLength: 9,
		itemsPerPage: pageSize,
		perPageOptions: [15],
		onChange: function() {
			var currentpage = this.currentPage;
			$scope.state.studentOnlineChecked=false;
			$scope.studentList.checkboxArr = [];
				$scope.studentList.checkboxStopArr = [];
				$scope.studentList.checkboxReArr = [];
			
			userParam.pageNo = currentpage;
			loginService.queryUserList(userParam, function(res) {
				$scope.state.lightHome = false;
				
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
			var currentpage = this.currentPage;
			$scope.state.studentOnlineChecked=false;
			$scope.studentList.checkboxArr = [];
				$scope.studentList.checkboxStopArr = [];
				$scope.studentList.checkboxReArr = [];
			
			userParam.pageNo = currentpage;
			loginService.queryUserList(userParam, function(res) {
				$scope.state.lightHome = false;
				
				$scope.tabledata(res);
			})
			
		}
	}
	//回收分页组件配置
	$scope.studentPaginationRecover = {
		currentPage: 1,
		totalItems: 1,
		pagesLength: 9,
		itemsPerPage: pageSize,
		perPageOptions: [15],
		onChange: function() {
			var currentpage = this.currentPage;
			$scope.state.studentOnlineChecked=false;
			$scope.studentList.checkboxArr = [];
			$scope.studentList.checkboxStopArr = [];
			$scope.studentList.checkboxReArr = [];
			userParam.pageNo = currentpage;
			loginService.queryUserList(userParam, function(res) {
				$scope.state.lightHome = false;
				$scope.tabledata(res);
			})
			
		}
	};
	//=学生在线分页组件配置结束————————————————————————————————————————————————————————————————————————————————————

}])