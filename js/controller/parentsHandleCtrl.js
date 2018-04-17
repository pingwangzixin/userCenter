app.controller('parentsHandleCtrl', ['$scope', '$timeout', '$http', 'loginService', '$state','$stateParams', function($scope, $timeout, $http, loginService, $state,$stateParams) {
	var areaId = sessionStorage.getItem("areaId"); //拿到大区域id（市级）
	var userAreaId = sessionStorage.getItem("userAreaId"); //拿到区域id（区级）
	var tableChange = sessionStorage.getItem("tableChange"); //切换的状态
	var onlineState = [];
	var onlineName = [];
	$scope.user={}
	$scope.state = {
		headTab: 0, //判断头部选项卡
		scope:  sessionStorage.getItem("scope"),
		teachStatus: JSON.parse(sessionStorage.getItem("userObj")).teachStatus,
		gradeState: "", //判断年级
		allchecked: false, //家长注册-判断是否选中
		allStopchecked: false, //家长注册-判断是否选中
		allcheckedRecover: false, //回收-判断是否选中
		warningShow: false,
		parentsOnlineCount: 0,
		deletStatus: false,
		imgNotice: 'img/wonde_big.png',
		sureDeletContent: '确认删除所选家长？',
		amendState: JSON.parse(sessionStorage.getItem("userObj")).teachStatus,
		AddState: false,
		addParetName: '', //家长姓名
		addParentNumber: '', //家长手机
		addStudentName: '', //学生姓名
		addStudentNumber: '', //学生学籍号
		modelDown: requireIp,
		usertypeState: 0,
		manageStatus: false,
		adduser:false,
		lightHome:true,
		oid:JSON.parse(sessionStorage.getItem("userObj")).oid,
		parentStopSearch:'',
		parentRecoverSearch:'',
		userId:sessionStorage.getItem("userId")
	}
	$scope.params = {
		areaId: '',
		gradeId: '',
		classId: '',
		keyword: '',
		pageNo: 1,
		delFlag: '0',
		state: '1',
		pageSize: '10',
		userType: 3,
		officeId:''
	}
	//初始化查询
	$scope.init = function(){
		$scope.initParams();
		if($scope.state.teachStatus!=1)
		$scope.getParentList();
	}
	//路由传参
	if($stateParams.tableChange){
        $scope.state.headTab = $stateParams.tableChange;
    }
	
	//初始化参数
	$scope.initParams = function(){
		switch(sessionStorage.getItem("scope")){
			case '2':
				$scope.params.areaId = sessionStorage.getItem("areaId");
				break;
			case '3':
				$scope.params.areaId = sessionStorage.getItem("userAreaId");
				break;
			default :
				$scope.params.areaId = '';
				break;
		}
		switch($scope.state.teachStatus){
			case "15":
				$scope.params.officeId = $scope.state.oid;
				loginService.studentHandleGradeList({officeId: $scope.params.officeId}, function(res) {
					if(res.ret == "200") {
						$scope.parentsList.gradeList = res.data;
					}
				})
				break;
			case "1":
				$scope.banzhuren=true;
				loginService.studentMainleGradeList({teaId: $scope.state.userId}, function(res) {
					if(res.ret == 200){
						$scope.params.gradeId= res.data.gradeId
						$scope.params.classId= res.data.id
						$scope.getParentList();
					}
				});
				break;
			default :
				$scope.params.officeId = '';
				$scope.params.gradeId= '';
				$scope.params.classId= '';
				break;
		}
		switch($scope.state.headTab){
			case "0":
				$scope.params.delFlag = '0';
				$scope.params.state = '1';
				break;
			case "1":
				$scope.params.delFlag = '0';
				$scope.params.state = '2';
				break;
			case "2":
				$scope.params.delFlag = '3';
				$scope.params.state = '';
				break;
		}
	}
	//关键字查询
	$scope.parentSearch = function(searchWord) {
		$scope.state.allchecked = false;
		$scope.parentsList.checkboxArr = [];
		$scope.state.allStopchecked = false;
		$scope.state.allcheckedRecover=false;
		$scope.state.allStopchecked=false;
		$scope.state.allchecked=false;
		$scope.parentsList.checkboxStopArr = [];
		$scope.state.allcheckedRecover = false;
		$scope.parentsList.checkboxReArr = [];
		$scope.params.keyword = searchWord;
		$scope.params.pageNo=1;
		$scope.parentPaginationOnline.currentPage=1;
		$scope.parentPaginationStop.currentPage=1;
		$scope.parentPaginationRecover.currentPage=1;
		$scope.getParentList();
	}
	//按键搜索
	$scope.keyUpSearch = function(event, key) {
		if(event.keyCode == 13) {
			$scope.parentSearch(key)
		}
	}
	
	//区域选项查询
	$scope.selettypefn = function(schoolId){
		$scope.params.officeId = schoolId;
		$scope.params.gradeId = $scope.state.gradeState = '';
		$scope.params.classId = '';
		$scope.params.pageNo=1;
		$scope.params.keyword=null;
		$scope.state.allcheckedRecover=false;
		$scope.state.parentStopSearch=null;
		$scope.state.parentRecoverSearch=null;
		$scope.state.allStopchecked=null;
		$scope.state.allchecked=false;
		$scope.parentsList.checkboxArr = [];
		$scope.parentsList.checkboxStopArr = [];
		$scope.parentsList.checkboxReArr = [];
		$scope.parentPaginationOnline.currentPage=1;
		$scope.parentPaginationStop.currentPage=1;
		$scope.parentPaginationRecover.currentPage=1;
		$scope.state.classState=null;
		$scope.state.parentOnlineSearch = null;
		$scope.getParentList();
		loginService.studentHandleGradeList({officeId: schoolId}, function(res) {
			if(res.ret == "200") {
				$scope.parentsList.gradeList = res.data;
			}
		})
	}
	//选择年级
	$scope.changeGreade = function(){
			$scope.params.gradeId = $scope.state.gradeState;
			$scope.params.classId = $scope.state.classState = '';
			$scope.state.parentOnlineSearch = null;
			$scope.params.pageNo=1;
			$scope.params.keyword=null;
			$scope.state.parentStopSearch=null;
			$scope.state.parentRecoverSearch=null;
			$scope.state.allcheckedRecover=false;
			$scope.state.allStopchecked=false;
			$scope.state.allchecked=false;
			$scope.parentsList.checkboxArr = [];
			$scope.parentsList.checkboxStopArr = [];
			$scope.parentsList.checkboxReArr = [];
			$scope.parentPaginationOnline.currentPage=1;
			$scope.parentPaginationStop.currentPage=1;
			$scope.parentPaginationRecover.currentPage=1;
			$scope.state.parentOnlineSearch = null;
			$scope.getParentList();
			loginService.studentHandleClassList({officeId:$scope.params.officeId,gradeId:$scope.state.gradeState}, function(res) {
			if(res.ret == "200") {
				$scope.parentsList.classList = res.data;
				$scope.parentsList.classList.forEach(function(v) {
					v.name = v.name + '班'
				});
			}
		})
		
	}
	$scope.changeClass = function(){
		$scope.params.classId = $scope.state.classState;
		$scope.params.pageNo=1;
		$scope.params.keyword=null;
		$scope.state.parentStopSearch=null;
		$scope.state.parentRecoverSearch=null;
		$scope.state.allcheckedRecover=false;
		$scope.state.allStopchecked=false;
		$scope.state.allchecked=false;
		$scope.parentsList.checkboxArr = [];
		$scope.parentsList.checkboxStopArr = [];
		$scope.parentsList.checkboxReArr = [];
		$scope.parentPaginationOnline.currentPage=1;
		$scope.parentPaginationStop.currentPage=1;
		$scope.parentPaginationRecover.currentPage=1;
		$scope.state.parentOnlineSearch = null;
		$scope.getParentList();
	}
	
	//切换选项卡（回收站）
	$scope.changeTable = function(n) {
		sessionStorage.setItem("tableChange", n)
		$state.go('teacher_index.parents_handle',{'tableChange':n})
	}
	
	$scope.getParentList = function(){
		loginService.getParentList($scope.params, function(res) {
			//添加表格数据
			console.info(res)
			$scope.tabledata(res);
		});
	}
	
	
	//点击新增显示
	$scope.addParentInfo = function(status) {
		$scope.state.adduser=true;
	}
	
	//确认新增
	$scope.addParents = function() {
		var regExpStu = /^[G|L][1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
		var regExpPhone = /^1[34578]\d{9}$/;
		if($scope.user.realname == '' || $scope.user.realname==null) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请输入家长姓名!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		} else if($scope.user.userMobile == '' || !regExpPhone.test($scope.user.userMobile)) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请输入符合规则的手机号!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		} else if($scope.user.stuName == '') {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请输入学生姓名!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		} else if($scope.user.stuNo == '' || !regExpStu.test($scope.user.stuNo)) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请输入符合规则的国网学籍号!';
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		}else{
			$scope.love=true;
			loginService.getAddParentList({
	    		 realname:$scope.user.realname,
	    		 userMobile:$scope.user.userMobile,
				 stuName:$scope.user.stuName,
	    		 stuNo:$scope.user.stuNo,
				 createBy:sessionStorage.getItem('userId')	
	    	},function(res){
    			if(res.ret==200){
    				
    				$scope.state.warningShow = true;
		            $scope.state.imgNotice = 'img/chenggong.png';
		            $scope.state.noteContent = res.message;
		            $timeout(function(){
		                $scope.state.warningShow = false;
		                $state.go('teacher_index.parents_handle',null,{reload:true})
		            },1000);
    			}else{
    				$scope.state.warningShow = true;
		            $scope.state.imgNotice = 'img/wonde_big.png';
		            $scope.state.noteContent = res.message;
		            $timeout(function(){
		            	$scope.love=false
		                $scope.state.warningShow = false;
		            },1000);
    			}
    		},function(e){
    			console.log(e)
    		}
		)
		}
	};
	
	
	$scope.suredel = function() {
		$scope.state.deletStatus = false;
		if($scope.state.headTab == 0) {
			var params = {
				ids: $scope.parentsList.checkboxArr.join(','),
				delFlag: 3,
				updateBy: $scope.state.userId
			}
			loginService.teachHandleUpdataList(params, function(res) {
				if(res.ret == 200) {
					$scope.state.warningShow = true;
					$scope.state.imgNotice = 'img/chenggong.png';
					$scope.state.noteContent = '所选用户已成功删除！!';
					$scope.state.allchecked = false;
					
					//分页回到第一页
					$scope.params.pageNo=1;
					$scope.parentPaginationOnline.currentPage=1;
					$scope.parentPaginationStop.currentPage=1;
					$scope.parentPaginationRecover.currentPage=1;
					
					
					$scope.parentsList.checkboxArr = [];
					$scope.parentsList.checkboxReArr = [];
					var classState = $scope.state.classState == 'all' ? null : $scope.state.classState;
					$scope.getParentList();
					$scope.msgTip();
				}
			})
			
		}else if($scope.state.headTab == 1) {
			$scope.parentStopAction('deletStop');
		} else if($scope.state.headTab == 2) {
			$scope.parentRecoverAction('delet');
		}
	}
	
	$scope.parentRecoverAction = function(change) {
		if(!$scope.parentsList.checkboxReArr.length) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请至少选择一项!';
			$scope.msgTip();
			return false
		}
		var params = {
					ids: $scope.parentsList.checkboxReArr.join(','),
					delFlag: 0,
					updateBy: $scope.state.userId
				}
		switch(change) {
			case 'renew':
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '所选用户已还原！';
				break;
			case 'delet':
				params.delFlag = 1
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '所选用户已彻底删除！';
				break;
		}
		loginService.teachHandleUpdataList(params, function(res) {
			if(res.ret == 200) {
				$scope.state.warningShow = true;
				$scope.state.allcheckedRecover = false;
				$scope.parentsList.checkboxArr = [];
				$scope.parentsList.checkboxReArr = [];
				//分页回到第一页
				$scope.params.pageNo=1;
				$scope.parentPaginationOnline.currentPage=1;
				$scope.parentPaginationStop.currentPage=1;
				$scope.parentPaginationRecover.currentPage=1;
				
				var classState = $scope.state.classState == 'all' ? null : $scope.state.classState;
				$scope.getParentList();
				$scope.msgTip();
				
			}
		}, function(e) {
			console.log(e)
		})
	}
	
	//文件上传
	$scope.fileAction = function(me) {
		$scope.state.warningShow = true;
		$scope.state.imgNotice = 'img/wonde_big.png';
		$scope.state.noteContent = '上传中，请稍等!';
		var fd = new FormData();
		var file = me.files[0];
		fd.append('excelFile', file);
		fd.append('userType', '3');
		fd.append("userId", sessionStorage.getItem('userId'));
		loginService.uploadExcelParent(fd, function(res) {
			if(res.ret == 200) {
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '上传成功';
				$timeout(function() {
					$scope.state.warningShow = false;
					$scope.parentSearch('');
				}, 1500)
			} else if(res.ret == 400) {
				$scope.state.noteContent = res.message + '请重新上传!';
				$scope.msgTip();
			} else if(res.ret == 402) {
				$scope.state.noteContent = res.message + '请重新上传!';
				$scope.msgTip();
			}
		}, function(e) {
			$scope.state.noteContent = '服务器错误,请稍候上传!';
			$scope.msgTip();
		});
		me.value = '';
	};
	$scope.msgTip = function(){
		$timeout(function() {
			$scope.state.warningShow = false;
		}, 1000);
	}
	//审核、停用 重置密码
	$scope.parentonlineAction = function(state) {
		if(!$scope.parentsList.checkboxArr.length) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请至少选择一项!';
			$scope.msgTip();
			return false;
		};
		var params = {
					ids: $scope.parentsList.checkboxArr.join(','),
					delFlag: 0,
					state: 1,
					updateBy: $scope.state.userId
		};
		switch(state) {
			case 'checked':
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '所选用户已审核成功！';
				break;
			case 'stop':
					params.state= 2;
					$scope.state.imgNotice = 'img/chenggong.png';
					$scope.state.noteContent = '所选用户已成功停用！';
					var requestState = onlineState.some(function(v, i) {
						$scope.state.noteContent ='所选用户已成功停用！';
						return v == 0;
					});
				break;
			case 'reset':
				params.state='';
				params.delFlag='';
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '所选用户密码已成功重置！';
				break;
		};
		
		if(requestState) {
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.warningShow = true;
			$scope.msgTip();
			return false;
		};
		
		loginService.teachHandleUpdataList(params, function(res) {
			if(res.ret == 200){
				$scope.state.warningShow = true;
				$scope.state.allchecked = false;
				$scope.parentsList.checkboxArr = [];
				
				$scope.params.pageNo=1;
				$scope.parentPaginationOnline.currentPage=1;
				$scope.parentPaginationStop.currentPage=1;
				$scope.parentPaginationRecover.currentPage=1;
				
				var classState = $scope.state.classState == 'all' ? null : $scope.state.classState;
				$scope.getParentList();
				$scope.msgTip();
			}
			
		})
		
	};
	
	//家长停用内的 启用 删除
	$scope.parentStopAction = function(state) {
		if(!$scope.parentsList.checkboxStopArr.length) {
			$scope.state.warningShow = true;
			$scope.state.imgNotice = 'img/wonde_big.png';
			$scope.state.noteContent = '请至少选择一项!';
			
			$timeout(function() {
				$scope.state.warningShow = false;
			}, 1000);
			return false;
		};
		var params = {
						ids: $scope.parentsList.checkboxStopArr.join(','),
						delFlag: 0,
						state: 1,
						updateBy: $scope.state.userId
					}
		switch(state) {
			case 'qiyong':
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '所选用户已成功启用！';
				break;
			case 'deletStop':
				params.delFlag=3;
				params.state='';
				$scope.state.imgNotice = 'img/chenggong.png';
				$scope.state.noteContent = '所选用户已成功删除！';
				break;
		};
		loginService.teachHandleUpdataList(params, function(res) {
			if(res.ret == 200) {
				$scope.state.warningShow = true;
				$scope.state.allchecked = false;
				$scope.parentsList.checkboxArr = [];
				$scope.state.allStopchecked =false;
				
				
				$scope.params.pageNo=1;
				$scope.parentPaginationOnline.currentPage=1;
				$scope.parentPaginationStop.currentPage=1;
				$scope.parentPaginationRecover.currentPage=1;
				
				var classState = $scope.state.classState == 'all' ? null : $scope.state.classState;
				
				$scope.getParentList();
				$scope.msgTip();
			}
		})
	}
	
	//点击头部的确认删除按钮
	$scope.parentDeleAction = function(status) {
		switch(status) {
			case 'online':
				if(!$scope.parentsList.checkboxArr.length) {
					$scope.state.warningShow = true;
					$scope.state.imgNotice = 'img/wonde_big.png';
					$scope.state.noteContent = '请至少选择一项!';
					$scope.msgTip();
					return false;
				}
				$scope.state.sureDeletContent = '确认删除所选家长？'
				break;
			case 'stop':
				if(!$scope.parentsList.checkboxStopArr.length) {
					$scope.state.warningShow = true;
					$scope.state.imgNotice = 'img/wonde_big.png';
					$scope.state.noteContent = '请至少选择一项!';
					$scope.msgTip();
					return false;
				}
				$scope.state.sureDeletContent = '确认删除所选家长？'
				break;
			case 'recover':
				if(!$scope.parentsList.checkboxReArr.length) {
					$scope.state.warningShow = true;
					$scope.state.imgNotice = 'img/wonde_big.png';
					$scope.state.noteContent = '请至少选择一项!';
					$scope.msgTip();					
					return false
				}
				$scope.state.sureDeletContent = '确认彻底删除所选家长？(该操作不可恢复)'
				break;
		}
		$scope.state.deletStatus = true;
	}
		//模拟数据
	$scope.parentsList = {
		checkboxArr: [],
		checkboxStopArr: [],
		checkboxReArr: [],
		gradeList: [],
		classList: [],
		tableMsgList: [],
		tableMsgStop: [],
		tableMsgListRecover: [],
	}
		//表格数据填充公用方法
	$scope.tabledata = function(res) {
		if(res.ret == 200) {
			$scope.state.lightHome=true;
			//在线的表格数据
			$scope.parentsList.tableMsgList = res.data.list;
			$scope.parentPaginationOnline.totalItems = res.data.count;
			$scope.state.parentsOnlineCount = res.data.count;
			//已停用的表格数据
			$scope.parentsList.tableMsgStop = res.data.list;
			$scope.parentPaginationStop.totalItems = res.data.count;
			$scope.state.parentsStopCount = res.data.count;
			//回收站的表格数据
			$scope.parentsList.tableMsgListRecover = res.data.list;
			$scope.parentPaginationRecover.totalItems = res.data.count;
			$scope.state.parentsRecoverCount = res.data.count;
		} else if(res.ret == 400) {
			//在线的表格数据
			$scope.parentsList.tableMsgList = [];
			$scope.state.parentsOnlineCount = 0;
			$scope.parentPaginationOnline.totalItems = 0;
			//已停用的表格数据
			$scope.parentsList.tableMsgStop = [];
			$scope.state.parentsStopCount = 0;
			$scope.parentPaginationStop.totalItems = 0;
			//回收站的表格数据
			$scope.parentsList.tableMsgListRecover = [];
			$scope.state.parentsRecoverCount = 0;
			$scope.parentPaginationRecover.totalItems = 0;
		}
	};
	$scope.parentPaginationOnline = {
		currentPage: 1,
		// totalItems: 100  ,
		pagesLength: 9,
		itemsPerPage: $scope.params.pageSize,
		perPageOptions: [15],
		onChange: function() {
			$scope.params.pageNo =  this.currentPage;
			$scope.state.allcheckedRecover=false;
			$scope.state.allStopchecked=false;
			$scope.state.allchecked=false;
			$scope.parentsList.checkboxArr = [];
			$scope.parentsList.checkboxStopArr = [];
			$scope.parentsList.checkboxReArr = [];
			$scope.getParentList();
		}
	}
	//停用组件配置
	$scope.parentPaginationStop = {
		currentPage: 1,
		// totalItems: 100  ,
		pagesLength: 9,
		itemsPerPage: $scope.params.pageSize,
		perPageOptions: [15],
		onChange: function() {
			$scope.params.pageNo =  this.currentPage;
			$scope.state.allcheckedRecover=false;
			$scope.state.allStopchecked=false;
			$scope.state.allchecked=false;
			$scope.parentsList.checkboxArr = [];
			$scope.parentsList.checkboxStopArr = [];
			$scope.parentsList.checkboxReArr = [];
			$scope.getParentList();
		}
	}
		//回收站分页
	$scope.parentPaginationRecover = {
		currentPage: 1,
		totalItems: 10,
		pagesLength: 9,
		itemsPerPage: $scope.params.pageSize,
		perPageOptions: [15],
		onChange: function() {
			$scope.params.pageNo =  this.currentPage;
			$scope.state.allcheckedRecover=false;
			$scope.state.allStopchecked=false;
			$scope.state.allchecked=false;
			$scope.parentsList.checkboxArr = [];
			$scope.parentsList.checkboxStopArr = [];
			$scope.parentsList.checkboxReArr = [];
			$scope.getParentList();
		}
	};
	$scope.init();
	
	//点击注册家长全选
	$scope.clickallCheck = function(event) {
		if($scope.state.allchecked) {
			$scope.parentsList.checkboxArr = [];
			$scope.parentsList.tableMsgList.forEach(function(v) {
				$scope.parentsList.checkboxArr.push(v.id);
				onlineState.push(v.state);
				onlineName.push(v.prarentsName);
			})
		} else {
			$scope.parentsList.checkboxArr = [];
			onlineState = [];
			onlineName = [];
		}
	}
	//点击停用全选
	$scope.clickStopCheck = function(event) {
		if($scope.state.allStopchecked) {
			$scope.parentsList.checkboxStopArr = [];
			$scope.parentsList.tableMsgStop.forEach(function(v) {
				$scope.parentsList.checkboxStopArr.push(v.id);
			})
		} else {
			$scope.parentsList.checkboxStopArr = [];
		}
	}
	//点击回收站全选
	$scope.clickRecoverCheck = function(event) {
		if($scope.state.allcheckedRecover) {
			$scope.parentsList.checkboxReArr = [];
			$scope.parentsList.tableMsgListRecover.forEach(function(v) {
				$scope.parentsList.checkboxReArr.push(v.id)
			})
		} else {
			$scope.parentsList.checkboxReArr = [];
		}
	}
	//家长注册单选的选中状态
	$scope.isChecked = function(id) {
		return $scope.parentsList.checkboxArr.indexOf(id) >= 0
	}
	//家长停用单选的选中状态
	$scope.isStopChecked = function(id) {
		return $scope.parentsList.checkboxStopArr.indexOf(id) >= 0
	}
	//回收站单选的选中状态
	$scope.isCheckedRecover = function(id) {
		return $scope.parentsList.checkboxReArr.indexOf(id) >= 0
	}
	//家长注册点击单个checkbox
	$scope.changeCheckbox = function(event, item) {
		var action = event.target.checked ? 'add' : 'remove';
		if(action == 'add' && $scope.parentsList.checkboxArr.indexOf(item.id) == -1) {
			$scope.parentsList.checkboxArr.push(item.id);
			//      	onlineState.push(v.state);
			//          onlineName.push(v.prarentsName);
			if($scope.parentsList.checkboxArr.length == $scope.parentsList.tableMsgList.length) {
				$scope.state.allchecked = true;
			}
		};
		if(action == 'remove' && $scope.parentsList.checkboxArr.indexOf(item.id) != -1) {
			var inx = $scope.parentsList.checkboxArr.indexOf(item.id);
			var sta = onlineState.indexOf(item.state);
			var rea = onlineName.indexOf(item.prarentsName);
			$scope.parentsList.checkboxArr.splice(inx, 1);
			onlineState.splice(sta, 1);
			onlineName.splice(rea, 1);
			$scope.state.allchecked = false;
		}
	}
	//家长停用点击单个checkbox
	$scope.changeStopCheckbox = function(event, id) {
		var action = event.target.checked ? 'add' : 'remove';
		if(action == 'add' && $scope.parentsList.checkboxStopArr.indexOf(id) == -1) {
			$scope.parentsList.checkboxStopArr.push(id);
			if($scope.parentsList.checkboxStopArr.length == $scope.parentsList.tableMsgStop.length) {
				$scope.state.allStopchecked = true;
			}
		}
		if(action == 'remove' && $scope.parentsList.checkboxStopArr.indexOf(id) != -1) {
			var inx = $scope.parentsList.checkboxStopArr.indexOf(id);
			$scope.parentsList.checkboxStopArr.splice(inx, 1);
			$scope.state.allStopchecked = false;
		}
	}
	//回收站点击单个checkbox
	$scope.changeRecoverCheckbox = function(event, id) {
		var action = event.target.checked ? 'add' : 'remove';
		if(action == 'add' && $scope.parentsList.checkboxReArr.indexOf(id) == -1) {
			$scope.parentsList.checkboxReArr.push(id);
			if($scope.parentsList.checkboxReArr.length == $scope.parentsList.tableMsgListRecover.length) {
				$scope.state.allcheckedRecover = true
			}
		}
		if(action == 'remove' && $scope.parentsList.checkboxReArr.indexOf(id) != -1) {
			var inx = $scope.parentsList.checkboxReArr.indexOf(id);
			$scope.parentsList.checkboxReArr.splice(inx, 1);
			$scope.state.allcheckedRecover = false;
		}
	}
}]);