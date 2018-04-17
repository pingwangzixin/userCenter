app.controller("mUpdataStudentCtrl", ['$scope', '$http', '$stateParams', 'loginService', '$state', function($scope, $http, $stateParams, loginService, $state) {
	$scope.user = {}
	$scope.adduser = false;
	$scope.state = {};
	$scope.newClassId = "";
	$scope.fez = [];
	$scope.state.schoolshowstate = true;
	//从session中取用户id和用户类型和学校id
	$scope.user.uid = $stateParams.studentCard; //用户id

	$scope.user.userType = 2; //用户类型
	/*var schoolId = {
		id: JSON.parse(sessionStorage.getItem('userObj')).oid
	}*/

	var schoolId = '';

	//查询学生信息
	loginService.studentMsg({
		userId: $scope.user.uid,
		userType: $scope.user.userType
	}, function(res) {
		//		console.log(res.data.stuInfo.officeId)
		schoolId = res.data.stuInfo.officeId;

		$scope.user = res.data.stuInfo;
		$scope.user.nianjiData = res.data.stuInfo.gradeId;
		$scope.user.banjiData = res.data.stuInfo.classId;
		$scope.scoolName = res.data.stuInfo.officeName;
		$scope.realname = res.data.stuInfo.realname;
		$scope.stuNo = res.data.stuInfo.stuNo;
		$scope.sex = res.data.stuInfo.sex;
		$scope.userNation = res.data.stuInfo.userNation;
		$scope.birthday = res.data.stuInfo.birthday;
		$scope.classId = res.data.stuInfo.classId;
		$scope.deviceName = res.data.stuInfo.deviceName;
		$scope.groupName =res.data.stuInfo.group;
		$scope.grouping = res.data.stuInfo.group.id;
		$scope.username=res.data.stuInfo.loginName;
		
		//把日期字符串截取成数字格式
		if($scope.birthday || $scope.birthday == '0000-00-00') {
			var year = parseInt($scope.birthday.substr(0, 4)) + '年';
			var month = parseInt($scope.birthday.substr(5, 7)) + '月';
			var fulldate = parseInt($scope.birthday.substr(8, 10)) + '日';
		}
		$scope.selected = (function() {
			if(year) {
				for(var i = 0; i < listArr.length; i++) {
					if(year == listArr[i].name) {
						return listArr[i]
					}
				}
			}
		})();
		$scope.selected2 = (function() {
			if($scope.selected && month) {
				for(var i = 0; i < $scope.selected.month.length; i++) {
					if(month == $scope.selected.month[i].name) {
						return $scope.selected.month[i]
					}
				}
			}
		})();
		$scope.selected3 = (function() {
			if($scope.selected2 && fulldate) {
				for(var i = 0; i < $scope.selected2.fullDate.length; i++) {
					if(fulldate == $scope.selected2.fullDate[i].name) {
						return $scope.selected2.fullDate[i]
					}
				}
			}
		})();

		//根据学校id查询学校年级
		$http.post(requireIp + '/ea/eaGrade/findGradeInfoByOid', {
			officeId: schoolId
		}).success(function(res) {
			$scope.nianjiData = res.data;
		})

		$scope.selClass = function() {
			$http.post(requireIp + "/ea/eaClass/findClassInfoByGid", {
				gradeId: $scope.user.nianjiData
			}).success(function(res) {
				$scope.banjiData = res.data;
				console.log($scope.banjiData)
			});
		}

		//根据年级id查询学校年级
		$http.post(requireIp + "/ea/eaClass/findClassInfoByGid", {
			gradeId: $scope.user.nianjiData
		}).success(function(res) {
			$scope.banjiData = res.data;
		});

		//通过班级ID获取分组
		$http.post(requireIp + "/uc/ucGroup/findGroupByClassId", {
			classId: $scope.classId
		}).success(function(res) {
			$scope.state.subjectList = res.data;
			for(var i=0;i<$scope.groupName.length;i++){
				angular.forEach($scope.state.subjectList,function(data,index){
					if ($scope.groupName[i].id == data.id) {
	                         data.check = true;
	                 }
				})
			}
		})
	}, function(e) {});

	//获取民族
	$http.get("file/nation.json").success(function(data) {
		$scope.nationData = data.data;
	});

	//修改班级的点击事件
	$scope.selClassid = function(n) {
		$scope.newClassId = n;
		//通过班级ID获取分组
		$http.post(requireIp + "/uc/ucGroup/findGroupByClassId", {
			classId: n
		}).success(function(res) {
			$scope.state.subjectList = res.data;
			console.log($scope.state.subjectList)
		})
	}

	//点击添加分组
	$scope.addFenzu = function() {
		$scope.adduser = true;
	}

	//分组
	$scope.editsubject = function(self, verName) {
		angular.element(self.target).parent().parent().next().attr('contenteditable', true)
		self.target.parentNode.parentNode.nextElementSibling.focus();
	};

	/**
	 * 删除分组
	 */
	$scope.deleteVerLevelSub = function(versionId) {
		var id = versionId
		$http.post(requireIp + "/uc/ucGroup/deleteOneGroup", {
			id: id
		}).success(function(res) {
			if(res.ret == '200') {
				$(".tijiaocgtc").show();
				$(".tijiaocgtc .gy_con i").html("删除成功");
				$http.post(requireIp + "/uc/ucGroup/findGroupByClassId", {
					classId: $scope.classId
				}).success(function(res) {
					$scope.state.subjectList = res.data;
				})
				setTimeout(function() {
					$(".tijiaocgtc").hide();

				}, 1500)

			} else {
				$(".tijiaosbtc").show();
				$(".tijiaosbtc .gy_con i").html(res.message);
				setTimeout(function() {
					$(".tijiaosbtc").hide();
				}, 2000)
			}
		})

	}

	$scope.bluraction = function(self) {
		var groupName = self.innerText.trim()
		var groupId = self.getAttribute("data-id");
		if(groupName==null || groupName==''){
			$(".tijiaosbtc").show();
			$(".tijiaosbtc .gy_con i").html("组名不能为空");
			setTimeout(function() {
				$(".tijiaosbtc").hide();
			}, 1500)
			return;
		}
		$http.post(requireIp + "/uc/ucGroup/updateOneGroup", {
				name: groupName,
				id: groupId
			}

		).success(function(res) {
			if(res.ret == '200') {
				$(".tijiaocgtc").show();
				$(".tijiaocgtc .gy_con i").html("修改成功");
				setTimeout(function() {

					$(".tijiaocgtc").hide();

				}, 1500)
			} else {
				$(".tijiaosbtc").show();
				$(".tijiaosbtc .gy_con i").html(res.message);
				setTimeout(function() {
					$(".tijiaosbtc").hide();
				}, 2000)
			}
		})
	};

	//添加分组
	$scope.tjfenzu = function(event) {
		angular.element(event.target).addClass("wx_none").siblings("span").removeClass("wx_none");

		//保存分组
		$scope.baocun = function(event) {
			//获取组名
			$scope.groupName1 = angular.element(event.target).siblings("span.wx_ycsrk").children("input").val();
			$scope.creatuser = sessionStorage.getItem("userId")
			//非空验证
			var reg = /^\s+$/;
			if(reg.test($scope.groupName1) == true) {
				$(".wx_erro_tc").show();
				$(".wx_erro_tc .gy_con span").html("组名不能为空");
				setTimeout(function() {
					$(".wx_erro_tc").hide();
				}, 2000)
				return;
			}
			if($scope.groupName1 == "") {
				$(".wx_erro_tc").show();
				$(".wx_erro_tc .gy_con span").html("请输入分组名称");
				setTimeout(function() {
					$(".wx_erro_tc").hide();
				}, 2000)
			} else {
				//通过后台接口添加分组
				$http.post(requireIp + "/uc/ucGroup/addClassGroup", {
					groupName: $scope.groupName1,
					createBy: $scope.creatuser,
					classId: $scope.classId
				}).success(function(res) {
					if(res.ret == '200') {
						$(".tijiaocgtc").show();
						$(".tijiaocgtc .gy_con i").html("添加成功");
						setTimeout(function() {
							console.log(angular.element(event.target))
							angular.element(event.target).addClass("wx_none").siblings("span").addClass("wx_none").siblings("span.wx_add_fz").removeClass("wx_none");
							$(".tijiaocgtc").hide();
							//通过班级ID获取分组
							$http.post(requireIp + "/uc/ucGroup/findGroupByClassId", {
								classId: $scope.classId
							}).success(function(res) {
								//添加分组后 加到li
								$scope.state.subjectList = res.data;
							})
						}, 1500)
					} else {
						$(".tijiaosbtc").show();
						$(".tijiaosbtc .gy_con i").html(res.message);
						setTimeout(function() {
							$(".tijiaosbtc").hide();
						}, 2000)
					}
				}).error(function(res) {
					console.log(res)
				})
			}
		}
		//取消分组
		$scope.fangqi = function(event) {
			angular.element(event.target).addClass("wx_none").siblings("span").addClass("wx_none").siblings("span.wx_add_fz").removeClass("wx_none");
		}
	}

	//点击选中权限，添加样式；
	$scope.addfz = function(e, i) {
		console.log(i)
		i.check = !i.check;
	}

	//确认添加
	$scope.wx_sure_add_btn = function() {

		var xz = [];
		var xzname = [];
		
		for(var i = 0; i < $scope.state.subjectList.length; i++) {
			var liactive = $(".wx_fl li").eq(i).hasClass("active");
			if($(".wx_fl li").eq(i).hasClass("active") == true) {
				xz.push($(".wx_fl li").eq(i).children("span").attr("data-id"));
				var newlist={}
				newlist.name=$(".wx_fl li").eq(i).children("span").html();
				console.log(newlist)
				xzname.push(newlist);
			}
		};
		$scope.groupName = xzname
		console.log($scope.groupName)
		$scope.fez = xz.toString();
		$scope.adduser = false;
	}

	//日期下拉change
	$scope.selectedChange = function() {
		$scope.selected3 = null;
		$scope.selected2 = null;
	}
	$scope.list = [];
	var currentYear = new Date().getFullYear();
	var ayn = 0;
	var byn = 25;
	for(i = (currentYear + ayn); i > (currentYear - byn); i--) {
		var objYear = {
			"name": i + '年',
			month: []
		};
		for(var j = 1; j <= 12; j++) {
			var objMonth = {
				"name": j + '月',
				fullDate: []
			};
			var dPrevDate = new Date(i, j, 0);
			var daysInMonth = dPrevDate.getDate();
			for(var k = 1; k <= parseInt(daysInMonth); k++) {
				var objDate = {
					"name": k + '日'
				};
				objMonth.fullDate.push(objDate)
			}
			objYear.month.push(objMonth)
		}
		$scope.list.push(objYear)
	};
	var listArr = $scope.list;

	//修改学生信息
	$scope.xgxsxx = function() {
		console.log($scope.fez)
		console.log($scope.groupName)
		
		if($scope.user.banjiData == null || $scope.user.nianjiData == null) {
			$(".tijiaosbtc").show();
			$(".tijiaosbtc .gy_con i").html("请选择年级和班级");
			setTimeout(function() {
				$(".tijiaosbtc").hide();
			}, 1500)
			return;
		}
		var reg = /^[0-9]*$/
		if(reg.test($scope.deviceName) == false) {
			$(".tijiaosbtc").show();
			$(".tijiaosbtc .gy_con i").html("设备名称只能为数字")
			setTimeout(function() {
				$(".tijiaosbtc").hide();
			}, 1500);
			return;
		}
		console.log($scope.fez)
		var newfenzulist=[];
		var fanalfz;
		if(JSON.stringify($scope.fez)=="[]"){
			angular.forEach($scope.groupName,function(data,index){
				newfenzulist.push(data.id)
				fanalfz=newfenzulist.toString();
			})
		}else{
			fanalfz=$scope.fez;
		}


		if($scope.realname == "" || $scope.sex == "" || $scope.user.nianjiData == "" || $scope.stuNo == "") {
			$(".tijiaosbtc").show();
			$(".tijiaosbtc .gy_con i").html("提交失败，请输入必填信息")
			setTimeout(function() {
				$(".tijiaosbtc").hide();
			}, 1500);
			return;
		} else {
			if(!$scope.selected) {
				var yearSub = 0000;
				var monthSub = 00;
				var fulldateSub = 00;
				$scope.birthday = yearSub + '-' + monthSub + '-' + fulldateSub;
			} else if(!$scope.selected2) {
				$(".tijiaosbtc").show();
				$(".tijiaosbtc .gy_con i").html("请选择月份");
				setTimeout(function() {
					$(".tijiaosbtc").hide();
				}, 1500)
				return;
			} else if(!$scope.selected3) {
				$(".tijiaosbtc").show();
				$(".tijiaosbtc .gy_con i").html("请选择日期");
				setTimeout(function() {
					$(".tijiaosbtc").hide();
				}, 1500)
				return;
			} else {
				var yearSub = $scope.selected.name;
				var monthSub = $scope.selected2.name;
				var fulldateSub = $scope.selected3.name;
				yearSub = yearSub.replace('年', '')
				monthSub = monthSub.replace('月', '')
				fulldateSub = fulldateSub.replace('日', '')
				$scope.birthday = yearSub + '-' + monthSub + '-' + fulldateSub;
			}
			$scope.creatuser = sessionStorage.getItem("userId")
			
			console.log(newfenzulist)
			console.log($scope.fez)
			$scope.love=true;
			$http.post(requireIp + '/uc/ucUser/updateStuInfoByTea', {
				id: $scope.user.id,
				stuNo: $scope.stuNo,
				realname: $scope.realname,
				sex: $scope.sex,
				classId: $scope.user.banjiData,
				gradeId: $scope.user.nianjiData,
				userNation: $scope.userNation,
				birthday: $scope.birthday,
				deviceName: $scope.deviceName,
				groupId: fanalfz,
				createBy: $scope.creatuser
			}).success(function(res) {
				console.log(res)
				if(res.ret == 200) {
					$(".tijiaocgtc").show();
					$(".tijiaocgtc .gy_con i").html("提交成功")
					setTimeout(function() {
						$(".tijiaocgtc").hide();
						$scope.love=false;
						$state.go('teacher_index.student_handle')
					}, 1000)
				} else {
					$(".tijiaosbtc").show();
					$(".tijiaosbtc .gy_con i").html(res.message)
					setTimeout(function() {
						$scope.love=false;
						$(".tijiaosbtc").hide();
					}, 1000)
				}
			}).error(function(e) {
				$(".tijiaosbtc").show();
				$(".tijiaosbtc .gy_con i").html("提交失败")
				setTimeout(function() {
					$(".tijiaosbtc").hide();
				}, 1000)
			})

		}
	}
}])