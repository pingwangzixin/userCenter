
//导入也得改
var requireIp = 'http://111.207.13.88:8881/jeuc/api';
var token = '29B5DF07F7FC514807CE5FBC12EA1506';
//修改手机号 密码 跳转地址
var homeAddress = 'http://111.207.13.88:8883/#/wrap/index?state=1';
//返回云空间
var backSpace = 'http://111.207.13.88:8883/#/wrap/index';

app.service('loginService',['$http','$timeout',function($http,$timeout) {
	console.log('service');
	//进入页面后获取id请求用户信息
	this.getUserIdMes = function(uid,succ,error) {
		$http.get(requireIp+'/uc/ucUser/'+uid.uid+'/'+uid.userType)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	//注册请求
	this.registerRequire = function(data,succ,error) {
		$http.post(requireIp+'/uc/ucUserWeb/registerTeacher',data)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			alert("error");
			error(e)
		})
	}
	//登陆请求
	this.loginRequire = function(data,succ,error) {
		$http.post(requireIp+'/uc/login/login',data)
		.success(function(res) {
			succ(res)
			
		})
		.error(function(e) {
			error(e)
		})
	}
	
	//
	//获取菜单权限
	this.loginMenuRequire = function(id,succ,error) {
		$http.post(requireIp+'/uc/ucMenu/getMenuByUid',id)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	//退出登录
	this.userLoginOut = function(succ,error) {
		$http.get(requireIp+'/uc/login/logout')
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}

	//请求教师管理-审核、删除、回收、停用等接口
	this.teachHandleUpdataList = function(parames,succ,error) {
		$http.post(requireIp+'/uc/ucUser/updateUser',parames)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	//学生管理
	//通过学校id获取年级
	this.studentHandleGradeList = function(parames,succ,error) {
		$http.post(requireIp+'/ea/eaGrade/findGradeInfoByOid',parames)
		.success(function(res){
			succ(res)
		})
		.error(function(e){
			error(e)
		})
	}
	//通过班主任id取年级
	this.studentMainleGradeList = function(parames,succ,error) {
		$http.post(requireIp+'/ea/eaClass/findClassInfoByTeaId',parames)
		.success(function(res){
			succ(res)
		})
		.error(function(e){
			error(e)
		})
	}
	//通过年级id获取班级
	this.studentHandleClassList = function(parames,succ,error){
		$http.post(requireIp+'/ea/eaClass/findClassInfoByGid',parames)
		.success(function(res){
			succ(res)
		})
		.error(function(e){
			error(e)
		})
	}

    //通过学生id获取学生信息
    this.studentMsg = function(uid,succ,error){
        $http.post(requireIp+'/uc/ucUser/findUserInfoUserId',uid)
		.success(function(res) {
           succ(res)
		})
		.error(function(e) {
			console.log(uid)
		})
    };
    //学生管理上传excel文件
    this.uploadExcel = function(fd,succ,error){
    	$http({
    		url:requireIp+'/uc/ucUser/importUser',
    		method:'POST',
    		data:fd,
    		headers: {'Content-Type':undefined},
            transformRequest: angular.identity 
    	})
		.success(function(res) {
           succ(res)
		})
		.error(function(e) {
			error(e)
		})
    };
    //教师管理上传excel文件
    this.uploadExcelTea = function(fd,succ,error){
    	$http({
    		url:requireIp+'/uc/ucUser/importUser',
    		method:'POST',
    		data:fd,
    		headers: {'Content-Type':undefined},
            transformRequest: angular.identity 
    	})
		.success(function(res) {
           succ(res)
		})
		.error(function(e) {
			error(e)
		})
    };
    //新需求导入教师信息
    this.importExcelTeacher = function(fd,succ,error){
    	$http({
    		url:requireIp+'/uc/ucUser/importUserExcel',
    		method:'POST',
    		data:fd,
    		headers: {'Content-Type':undefined},
            transformRequest: angular.identity 
    	})
    	.success(function(res){
    		succ(res)
    	})
    	.error(function(e) {
			error(e)
		})
    };
    //家长管理上传excel文件
    this.uploadExcelParent = function(fd,succ,error){
    	$http({
    		url:requireIp+'/uc/ucUser/importUser',
    		method:'POST',
    		data:fd,
    		headers: {'Content-Type':undefined},
            transformRequest: angular.identity 
    	})
		.success(function(res) {
           succ(res)
		})
		.error(function(e) {
			error(e)
		})
    };
    //学生管理新增接口
    this.addNewStudentMes = function(param,succ,error){
    	$http.post(requireIp+'/uc/ucUser/saveStu',param)
    	.success(function(res){
    		succ(res)
    	})
    	.error(function(e){
    		error(e)
    	})
    }
    //家长获取信息
    this.getParentList = function(parames,succ,error){
    	$http.get(requireIp+'/uc/ucUser',{params : parames})
    	.success(function(res){
    		succ(res)
    	})
    	.error(function(e){
    		error(e)
    	})
    }
    //家长新增信息
    this.getAddParentList = function(param,succ,error){
    	$http.post(requireIp+'/uc/ucUser/addParent',param)
    	.success(function(res){
    		succ(res)
    	})
    	.error(function(e){
    		error(e)
    	})
    }
	//查询用户列表
	this.queryUserList = function(parames,succ,error) {
		$http.get(requireIp+'/uc/ucUser',{params:parames})
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	//批量更新用户状态 （审核、删除、回收、停用等接口）
	this.batchUpdataUserState = function(parames,succ,error) {
		$http.post(requireIp+'/uc/ucUser/updateUser',parames)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	//彻底删除用户
	this.batchDeleteUserState = function(parames,succ,error) {
		$http.post(requireIp+'/uc/ucUser/updateUser',parames)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
     //新增用户接口
    this.addUser = function(param,succ,error){
    	$http.post(requireIp+'/uc/ucUser/addUser',param)
    	.success(function(res){
    		succ(res)
    	})
    	.error(function(e){
    		error(e)
    	})
    }
}]);
app.service('scrollbar',function(){
	function bind(obj, type, handler) {
		var node = typeof obj == "string" ? $(obj) : obj;
		if(node.addEventListener) {
			node.addEventListener(type, handler, false);
		} else if(node.attachEvent) {
			node.attachEvent('on' + type, handler);
		} else {
			node['on' + type] = handler;
		}
	}

	function mouseWheel(obj, handler) {
		var node = typeof obj == "string" ? $(obj) : obj;
		bind(node, 'mousewheel', function(event) {
			var data = -getWheelData(event);
			handler(data);
			if(document.all) {
				window.event.returnValue = false;
			} else {
				event.preventDefault();
			}
		});
		//火狐
		bind(node, 'DOMMouseScroll', function(event) {
			var data = getWheelData(event);
			handler(data);
			event.preventDefault();
		});

		function getWheelData(event) {
			var e = event || window.event;
			return e.wheelDelta ? e.wheelDelta : e.detail * 40;
		}
	}

	function addScroll() {
		this.init.apply(this, arguments);
	}
	addScroll.prototype = {
		init: function(mainBox, contentBox, className) {
			var mainBox = document.getElementById(mainBox);
			var contentBox = document.getElementById(contentBox);
			var scrollDiv = this._createScroll(mainBox, className);
			this._resizeScorll(scrollDiv, mainBox, contentBox);
			this._tragScroll(scrollDiv, mainBox, contentBox);
			this._wheelChange(scrollDiv, mainBox, contentBox);
			this._clickScroll(scrollDiv, mainBox, contentBox);
		},
		//创建滚动条
		_createScroll: function(mainBox, className) {
			var _scrollBox = document.createElement('div')
			var _scroll = document.createElement('div');
			var span = document.createElement('span');
			_scrollBox.appendChild(_scroll);
			_scroll.appendChild(span);
			_scroll.className = className;
			mainBox.appendChild(_scrollBox);
			_scroll.ondragstart = function() {
				return false;
			}
			return _scroll;
		},
		//调整滚动条
		_resizeScorll: function(element, mainBox, contentBox) {
			var p = element.parentNode;
			var conHeight = contentBox.offsetHeight;
			var _width = mainBox.clientWidth;
			var _height = mainBox.clientHeight;
			var _scrollWidth = element.offsetWidth;
			var _left = _width - _scrollWidth;
			p.style.width = _scrollWidth + "px";
			p.style.height = _height + "px";
			p.style.left = _left + "px";
			p.style.position = "absolute";
			p.style.background = "#ccc";
			p.className = 'scrollwrap';
			contentBox.style.width = (mainBox.offsetWidth - _scrollWidth) + "px";
			var _scrollHeight = parseInt(_height * (_height / conHeight));
			if(_scrollHeight >= mainBox.clientHeight) {
				element.parentNode.style.display = "none";
			}
			element.style.height = _scrollHeight + "px";
		},
		//拖动滚动条
		_tragScroll: function(element, mainBox, contentBox) {
			var mainHeight = mainBox.clientHeight;
			element.onmousedown = function(event) {
				var _this = this;
				var _scrollTop = element.offsetTop;
				var e = event || window.event;
				var top = e.clientY;
				document.onmousemove = scrollGo;
				document.onmouseup = function(event) {
					this.onmousemove = null;
				}

				function scrollGo(event) {
					var e = event || window.event;
					var _top = e.clientY;
					var _t = _top - top + _scrollTop;
					if(_t > (mainHeight - element.offsetHeight)) {
						_t = mainHeight - element.offsetHeight;
					}
					if(_t <= 0) {
						_t = 0;
					}
					element.style.top = _t + "px";
					contentBox.style.top = -_t * (contentBox.offsetHeight / mainBox.offsetHeight) + "px";
					_this._wheelData = _t;
				}
			}
			element.onmouseover = function() {
				this.style.background = "#444";
			}
			element.onmouseout = function() {
				this.style.background = "#666";
			}
		},
		//鼠标滚轮滚动，滚动条滚动
		_wheelChange: function(element, mainBox, contentBox) {
			var node = typeof mainBox == "string" ? $(mainBox) : mainBox;
			var flag = 0,
				rate = 0,
				wheelFlag = 0,
				_this = this;
			if(node) {
				mouseWheel(node, function(data) {
					wheelFlag += data;
					if(_this._wheelData >= 0) {
						flag = _this._wheelData;
						element.style.top = flag + "px";
						wheelFlag = _this._wheelData * 12;
						_this._wheelData = -1;
					} else {
						flag = wheelFlag / 12;
					}
					if(flag <= 0) {
						flag = 0;
						wheelFlag = 0;
					}
					if(flag >= (mainBox.offsetHeight - element.offsetHeight)) {
						flag = (mainBox.clientHeight - element.offsetHeight);
						wheelFlag = (mainBox.clientHeight - element.offsetHeight) * 12;
					}
					element.style.top = flag + "px";
					contentBox.style.top = -flag * (contentBox.offsetHeight / mainBox.offsetHeight) + "px";
				});
			}
		},
		_clickScroll: function(element, mainBox, contentBox) {
			var p = element.parentNode;
			var _this = this;
			p.onclick = function(event) {
				var e = event || window.event;
				var t = e.target || e.srcElement;
				var sTop = document.documentElement.scrollTop > 0 ? document.documentElement.scrollTop : document.body.scrollTop;
				var top = mainBox.offsetTop;
				var _top = e.clientY + sTop - top - element.offsetHeight / 2;
				if(_top <= 0) {
					_top = 0;
				}
				if(_top >= (mainBox.clientHeight - element.offsetHeight)) {
					_top = mainBox.clientHeight - element.offsetHeight;
				}
				if(t != element) {
					element.style.top = _top + "px";
					contentBox.style.top = -_top * (contentBox.offsetHeight / mainBox.offsetHeight) + "px";
					_this._wheelData = _top;
				}
			}
		}
	};
	this.scroollAction = function(mainBox, contentBox, className){
		new addScroll(mainBox, contentBox, className);
	}
})

