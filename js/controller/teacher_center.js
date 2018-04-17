app.controller('teacherCtrinF', ['$scope', '$http', '$stateParams', '$state', '$timeout', function ($scope, $http, $stateParams, $state, $timeout) {
    //定义ngshow请先选择学校
    $scope.showTip = true;
    $scope.teachdisabed=true;

    //定义一个flag
    $scope.same = 0;
    //教师二级个人信息、账号设置切换
    $scope.switch = $stateParams.tableChange;
    var teachId = $stateParams.teachId == null ? sessionStorage.getItem('userId') : $stateParams.teachId;
    if ($stateParams.teachId == null) {
        $scope.loginState = 1;
    }
    else {
        $scope.loginState = 0;
    }
    $scope.groptzy = {};
    $scope.groptzy6 = {};
    $scope.groptzy7 = {};
    $scope.reg = {
        'disInp': true
        , 'btn': '注册'
    };
    if ($stateParams.teachId != 'undefined') {
        $scope.reg = {
            'disInp': false
            , 'btn': '提交'
        };
    }
    
    
    console.log($scope.userType)
	
    $scope.tab = function (status) {
        $scope.switch = status;
        //  $state.go('teacher_index.teacher_personal',{tableChange:status},{reload:false})
    };
    //定义用于修改提交的用户信息
    $scope.userUpdate = {
            "id": ""
            , "password": ""
            , "orgPassword": ""
            , "realname": ""
            , "idCard": ""
            , "img": ""
            , "renewpassword": ""
        }
        //区域id session里取
    var areaId = sessionStorage.getItem('areaId');
    //定义班级
    $scope.classes = {};
    //定义授课班级
    $scope.teachClasses = {};
    //定义授课学科
    $scope.teachSubject = {};
    //定义授课版本
    $scope.teachVersion = {};
    //定义学科
    $scope.subjects = {};
    $scope.iftzy = {};
    //添加授课单选默认值
    $scope.iftzy.ifRadio = true;
    $scope.distzy = {};
    $scope.distzy.dis = false;
    //设置成功图片
    $scope.chenggong = true;
    //学科组长默认值
    $scope.ifChecked = false;
    //班主任默认值
    $scope.bsd = false;
    //班主任默认值
    $scope.asd = false;
    //定义用户
    $scope.user = {};
    //定义民族
    $scope.nationData = {};
    //定义区域
    $scope.areaa = {};
    //定义学校类型信息
    $scope.schoolInfo = {};
    //定义所有学校
    $scope.schools = {};
    //定义所有角色
    $scope.roles = {};
    //定义年级
    $scope.grades = {};
    //所有角色
    $scope.roletzy = {};
    $scope.subBox = false;
    $scope.subBox5 = false;
    //定义授课
    $scope.userCourseList = {};
    //定义切换年级选项卡
    $scope.gradeTab;
    //装年级组长角色的对象
    $scope.YsubGroup = {};
    //装学科组长角色的对象5
    $scope.YsubGroup5 = {};
    
    //切换年级选项卡
    $scope.changeGrade = function (index, grade) {
    		$scope.subj = {};
            $scope.gradeTab = index;
			
            $scope.subj.gradeName = grade.name;
            $scope.subj.gradeId = grade.id;
            $scope.subj.subjectName = "";
            $scope.subj.subjectId = "";
            //根据年级查询学科
            $http.post(requireIp + "/edu/eduSubject/findSubjectByGradeId", {
                gradeId: grade.id
            }).success(function (data) {
                $scope.subjects = data;
                $scope.subjectList = data.data;
                angular.forEach($scope.subjectLeaderInfoNew,function(data,index){
                	angular.forEach($scope.subjectList,function(dataObj,i){
                		var subjectObj = {};
                		subjectObj.rid = '13';
                		subjectObj.gid= grade.id;
                		subjectObj.gradeName = grade.name;
                		subjectObj.sid= dataObj.id;
                		subjectObj.subjectName = dataObj.name;
                		if(JSON.stringify(subjectObj)== JSON.stringify(data)){
                			dataObj.check = true; 
                		}
                	})
                })
                
                angular.forEach($scope.tempSubs,function(data,index){
                	angular.forEach($scope.subjectList,function(dataObj,i){
                		var subjectObj = {};
                		subjectObj.rid = '13';
                		subjectObj.gid= grade.id;
                		subjectObj.gradeName = grade.name;
                		subjectObj.sid= dataObj.id;
                		subjectObj.subjectName = dataObj.name;
                		if(JSON.stringify(subjectObj)== JSON.stringify(data)){
                			dataObj.check = true; 
                		}
                	})
                })
            });
        }
        //切换年级选项卡5
    $scope.changeGrade5 = function (index, grade) {
        $scope.subj = {};
        $scope.gradeTab = index;
        $scope.subj.gradeName = grade.name;
        $scope.subj.gradeId = grade.id;
        $scope.subj.subjectName = "";
        $scope.subj.subjectId = "";
        //根据年级查询学科
        $http.post(requireIp + "/edu/eduSubject/findSubjectByGradeId", {
            gradeId: grade.id
        }).success(function (data) {
            $scope.subjects5 = data;
            $scope.subjectList = data.data;
           angular.forEach($scope.subjectLeaderInfoNew5,function(data,index){
                	angular.forEach($scope.subjectList,function(dataObj,i){
                		var subjectObj = {};
                		subjectObj.rid = '11';
                		subjectObj.gid= grade.id;
                		subjectObj.gradeName = grade.name;
                		subjectObj.sid= dataObj.id;
                		subjectObj.subjectName = dataObj.name;
                		if(JSON.stringify(subjectObj)== JSON.stringify(data)){
                			dataObj.check = true; 
                		}
                	})
           })
            angular.forEach($scope.tempSubs5,function(data,index){
                	angular.forEach($scope.subjectList,function(dataObj,i){
                		var subjectObj = {};
                		subjectObj.rid = '13';
                		subjectObj.gid= grade.id;
                		subjectObj.gradeName = grade.name;
                		subjectObj.sid= dataObj.id;
                		subjectObj.subjectName = dataObj.name;
                		if(JSON.stringify(subjectObj)== JSON.stringify(data)){
                			dataObj.check = true; 
                		}
                	})
            })
        });
    }
    $scope.Yteach = {
        rid: "1",
        gradeId: "",
        classId: ""
    }
    $scope.subj = {};
    //学科组长点击选择学科
    $scope.tempSubs = [];
    //学科组长取消学科装载集合
    $scope.unactive =[];
    //教研员点击选择学科
    $scope.tempSubs5 = [];
    //教研员取消学科装载集合
    $scope.unactive5 =[];
     //点击选中学科组长学科，添加样式；
    $scope.xkzzadd = function (e, i) {
    		$scope.xuekesubj = {};
    		$scope.xuekesubj.rid = '13';
    		$scope.xuekesubj.gid = $scope.subj.gradeId;
    		$scope.xuekesubj.gradeName = $scope.subj.gradeName;
        	$scope.xuekesubj.sid=i.id;
        	$scope.xuekesubj.subjectName=i.name;
    		if(i.check = !i.check){
            	$scope.tempSubs.push($scope.xuekesubj)
    		}else{
    			$scope.unactive.push($scope.xuekesubj);
    			angular.forEach($scope.tempSubs,function(data,index){
	    			if(JSON.stringify(data)==JSON.stringify($scope.xuekesubj)){
	    				$scope.tempSubs.splice(index,1);
	    			}
    			})
    		}
    }
    
     //点击选教研员学科，添加样式；
    $scope.jyyadd = function (e, i) {
    		$scope.xuekesubj = {};
    		$scope.xuekesubj.rid = '11';
    		$scope.xuekesubj.gid = $scope.subj.gradeId;
    		$scope.xuekesubj.gradeName = $scope.subj.gradeName;
        	$scope.xuekesubj.sid=i.id;
        	$scope.xuekesubj.subjectName=i.name;
          	if(i.check = !i.check){
            	$scope.tempSubs5.push($scope.xuekesubj)
    		}else{
    			$scope.unactive5.push($scope.xuekesubj);
    			angular.forEach($scope.tempSubs5,function(data,index){
	    			if(JSON.stringify(data)==JSON.stringify($scope.xuekesubj)){
	    				$scope.tempSubs5.splice(index,1);
	    			}
    			})
    		}
    }
    //确认学科组长的学科选择信息
    $scope.tijiaoLeader = function () {
    		angular.forEach($scope.tempSubs,function(data,index){
    			tempSubjectLeader = data;
    			var flag =JSON.stringify($scope.subjectLeaderInfoNew).indexOf(JSON.stringify(tempSubjectLeader))==-1
    			if(flag){
    				$scope.subjectLeaderInfoNew.push(tempSubjectLeader);
    			}
    		})
    		angular.forEach($scope.unactive,function(data,index){
    			var temp = {};
    			temp.rid = data.rid;
    			temp.gid = data.gid;
    			temp.gradeName= data.gradeName;
    			temp.sid = data.sid;
    			temp.subjectName = data.subjectName;
    			var i = JSON.stringify($scope.subjectLeaderInfoNew).indexOf(JSON.stringify(temp));
    			if(i!=-1){
    				angular.forEach($scope.subjectLeaderInfoNew,function(e,i){
    					if(JSON.stringify(e)==JSON.stringify(temp)){
    						$scope.subjectLeaderInfoNew.splice(i,1);
    					}
    				})
    			}
    		})
    		$scope.unactive =[];
    		$scope.subBox=false;
            $scope.subBox5=false;
            $scope.gradeTab="-1";
            $scope.subjects.data=[]
            
        }
     //确认教研员的学科选择信息
    $scope.tijiaoLeader5 = function () {
    		angular.forEach($scope.tempSubs5,function(data,index){
    			tempSubjectLeader = data;
    			var flag =JSON.stringify($scope.subjectLeaderInfoNew5).indexOf(JSON.stringify(tempSubjectLeader))==-1
    			if(flag){
    				$scope.subjectLeaderInfoNew5.push(tempSubjectLeader);
    			}
    		})
    		angular.forEach($scope.unactive5,function(data,index){
    			var temp = {};
    			temp.rid = data.rid;
    			temp.gid = data.gid;
    			temp.gradeName= data.gradeName;
    			temp.sid = data.sid;
    			temp.subjectName = data.subjectName;
    			var i = JSON.stringify($scope.subjectLeaderInfoNew5).indexOf(JSON.stringify(temp));
    			if(i!=-1){
    				angular.forEach($scope.subjectLeaderInfoNew5,function(e,i){
    					if(JSON.stringify(e)==JSON.stringify(temp)){
    						$scope.subjectLeaderInfoNew5.splice(i,1);
    					}
    				})
    			}
    		})
    		
			$scope.unactive5 =[];
    		$scope.subBox=false;
            $scope.subBox5=false;
            $scope.gradeTab="-1";
            $scope.subjects5.data=[]
    }
    $scope.changeminzu = function (a) {
            console.log(a);
            if (a == undefined) {
                $scope.userInfo.userNation = null;
            }
        }
        //民族下拉列表,访问静态文件
    $http.get("file/nation.json").success(function (data) {
        $scope.nationData = data.data;
    });
    //查询学校类型
    $http.get("file/schoolType.json").success(function (data) {
        $scope.schoolInfo = data.data;
    });
    //查询区域信息
    $http.post(requireIp + "/ea/eaArea/findAreaListByAreaId", {
        areaId: areaId
    }).success(function (data) {
        $scope.areaa = data.data;
        console.log($scope.areaa)
    });
    if (teachId !== 'undefined') {
        //用于验证是否修改了手机号
        var oldLogiName = '';
        //一进页面在session取值然后调后台信息
        $http.get(requireIp + "/uc/ucUser/"+teachId+"/1").success(function (data) {
            console.log(data);
            oldLogiName = data.data.userInfo.userMobile;
            console.log(oldLogiName)
                //账号设置 用于修改用户
            $scope.userUpdate.id = $scope.user.id;
            $scope.userUpdate.realname = data.data.realname;
            $scope.userUpdate.idCard = data.data.id_card;
            $scope.userUpdate.userFace = data.data.userFace;
            $scope.myCroppedImage=data.data.userInfo.userFace;
            //授课信息
            $scope.userCourse = data.data.userCourse;
            //教师信息
            $scope.userInfo = data.data.userInfo;
            //角色信息      三息合一
            $scope.userRole = data.data.userRole;
            if ($scope.userInfo.officeId == null || "" == $scope.userInfo.officeId) {
                // 			alert("让班主任的年级班级禁用");
                $scope.showTip = true;
            }
            else {
                $scope.showTip = false;
            }
            //授课单选框
            if ($scope.userCourse.length > 0) {
                $scope.iftzy.ifRadio = true;
                $scope.distzy.dis = false;
            }
            else {
                $scope.iftzy.ifRadio = false;
                $scope.distzy.dis = true;
            }
            //查询所有角色+角色回显
            $http.post(requireIp + "/uc/ucRole/findAllRole").success(function (data) {
                $scope.roles = data;
                angular.forEach($scope.roles.data.role1, function (role1) {
                    role1.state = true;
                });
                $scope.roles.data.role2.state = true;
                $scope.roles.data.role3.state = true;
                $scope.roles.data.role4.state = true;
                $scope.roles.data.role5.state = true;
                $scope.roles.data.role6.state = true;
                $scope.roles.data.role7.state = true;
                console.log(data)
                $scope.checkBoxArray = '';
                
                //用户名类型
                var userType = sessionStorage.getItem('userType');
                var test=window.location.href;
                if(test.indexOf("teachId")!=-1){
                    $scope.teachdisabed=false;
//                    $scope.roles.data.role3.state = false;
                }
                
                
                //角色id拼成字符串 用于回显 
                angular.forEach($scope.userRole, function (data) {
                    $scope.checkBoxArray += ',' + data.rid;
                    if (data.rid == "1") {
                        //班主任回显
                        $scope.Yteach = {
                                rid: "1", 
                                gradeId: data.gid, 
                                gradeName:data.gradeName,
                                classId: data.cid,
                                className:data.className+'班'
                            }
                            //用于班主任一进页面如果有所教的年级。查询班级
                        $http.post(requireIp + "/ea/eaClass/findClassInfoByGid", {
                            gradeId: data.gid
                        }).success(function (data) {
                            $scope.classes = data;
                            console.log(data)
                        });
                    }
                });
                //角色复选框回显
                $scope.checkBoxArray = $scope.checkBoxArray.substring(1).split(',');
                console.log($scope.checkBoxArray)
                angular.forEach($scope.roles.data.role1, function (v, i) {
                    if ($scope.checkBoxArray.indexOf(v.id) >= 0) {
                        v.state = false;
                    }
                });
                if ($scope.checkBoxArray.indexOf($scope.roles.data.role2.id) >= 0) {
                    $scope.roles.data.role2.state = false;
                }
                if ($scope.checkBoxArray.indexOf($scope.roles.data.role3.id) >= 0) {
                    $scope.roles.data.role3.state = false;
                }
                if ($scope.checkBoxArray.indexOf($scope.roles.data.role6.id) >= 0) {
                    $scope.roles.data.role6.state = false;
                }
                if ($scope.checkBoxArray.indexOf($scope.roles.data.role7.id) >= 0) {
                    $scope.roles.data.role7.state = false;
                }
                //学科组长信息
                $scope.subjectLeaderInfoNew = [];
                $scope.subjhuixian = {};
                if ($scope.checkBoxArray.indexOf($scope.roles.data.role4.id) >= 0) {
                    //回显学科组长的学科信息
                    angular.forEach($scope.userRole, function (  data,index) {
                        if (data.rid == "13") {
                        	$scope.subjhuixian.rid = '13';
                        	$scope.subjhuixian.gid = data.gid;
                            $scope.subjhuixian.gradeName = data.gradeName;
                            $scope.subjhuixian.sid = data.sid;
                            $scope.subjhuixian.subjectName = data.subjectName;
                            $scope.subjectLeaderInfoNew.push($scope.subjhuixian);
                            $scope.subjhuixian = {};
                        }
                    });
                    $scope.roles.data.role4.state = false;
                }
                //5教研员
                $scope.subjectLeaderInfoNew5 = [];
                $scope.subjhuixian5 = {};
                if ($scope.checkBoxArray.indexOf($scope.roles.data.role5.id) >= 0) {
                    //回显学科组长的学科信息
                    angular.forEach($scope.userRole, function (  data,index) {
                        if (data.rid == "11") {
                        	$scope.subjhuixian5.rid = '11';
                        	$scope.subjhuixian5.gid = data.gid;
                            $scope.subjhuixian5.gradeName = data.gradeName;
                            $scope.subjhuixian5.sid = data.sid;
                            $scope.subjhuixian5.subjectName = data.subjectName;
                            $scope.subjectLeaderInfoNew5.push($scope.subjhuixian5);
                            $scope.subjhuixian5 = {};
                        }
                    });
                    console.log($scope.subjectLeaderInfoNew5)
                    $scope.roles.data.role5.state = false;
                }
            });
            //根据区域id学校类型查询所有学校
            if ($scope.userInfo.areaId != "" && $scope.userInfo.officeGrade != "") {
                $http.post(requireIp + "/ea/eaOffice/findSchoolInfoByAreaId", {
                    areaId: $scope.userInfo.areaId
                    , grade: $scope.userInfo.officeGrade
                }).success(function (data) {
                    $scope.schools = data.data;
                    console.log(data.data)
                });
                //通过学校id查询年级
                $http.post(requireIp + "/ea/eaGrade/findGradeInfoByOid", {
                    officeId: $scope.userInfo.officeId
                }).success(function (data) {
                    $scope.grades = data;
                    $scope.YsubGroup.rid = "13";
                    $scope.YsubGroup.gid = data.data[0].id;
                    $scope.YsubGroup5.rid = "11";
                    $scope.YsubGroup5.gid = data.data[0].id;
                    $scope.subj.gradeId = data.data[0].id;
                    $scope.subj.gradeName = data.data[0].name;
                    console.log($scope.subj)
                        //年级组长回显 6 7 回显
                    angular.forEach($scope.userRole, function (v, i) {
                        if (v.rid == "12") {
                            $scope.groptzy.YgradeGrop = v.gid;
                            $scope.gradeName = v.gradeName;
                        }
                        if (v.rid == "20") {
                            $scope.groptzy6.YgradeGrop = v.schoolType;
                            $scope.groptzy6.YgradeGropName = v.schoolTypeName;
                            console.log($scope.groptzy6.YgradeGropName)
                        }
                        if (v.rid == "19") {
                            $scope.groptzy7.YgradeGrop = v.schoolType;
                            $scope.groptzy7.YgradeGropName =v.schoolTypeName;
                        }
                    });
//                  //根据年级查询学科
//                  $http.post(requireIp + "/edu/eduSubject/findSubjectByGradeId", {
//                      gradeId: $scope.grades.data[0].id
//                  }).success(function (data) {
//                      $scope.subjects = data;
//                      console.log($scope.subjects);
//                  });
                });
            }
        });
    }
    else {
        $scope.userInfo = {};
        //注册，创建用户
        $scope.userRole = [];
        $scope.userCourse = [];
        //注册页姓名、身份证、性别
        $scope.userInfo.realname = sessionStorage.getItem('userName') || '';
        $scope.userInfo.idCard = sessionStorage.getItem('userCarId') || '';
        Number($scope.userInfo.idCard.substring(16, 17)) % 2 == 0 ? $scope.userInfo.sex = '女' : 		$scope.userInfo.sex = '男';
        //查询所有角色+角色回显
        $http.post(requireIp + "/uc/ucRole/findAllRole").success(function (data) {
            $scope.roles = data;
            angular.forEach($scope.roles.data.role1, function (role1) {
                role1.state = true;
            });
            $scope.roles.data.role2.state = true;
            $scope.roles.data.role3.state = true;
            $scope.roles.data.role4.state = true;
            $scope.roles.data.role5.state = true;
            $scope.roles.data.role6.state = true;
            $scope.roles.data.role7.state = true;
            console.log(data)
                //学科组长信息
            $scope.subjectLeaderInfoNew = [];
            $scope.subj = {};
            $scope.subjectLeaderInfoNew5 = [];
            $scope.subj5 = {};
        });
        //注册页面上一步
        $scope.Yprev = function () {
            $state.go('register_page', {
                'tableChange': 1
            });
            sessionStorage.clear();
        };
    }
    //方法
    //角色点击触发事件，增加删除角色
    $scope.checkedAction1 = function (event, role) {
    	 angular.forEach($scope.roles.data.role1, function (v, i) {
            if (role.id == v.id) {
                if (v.state == false) {
                    //复选框不选中  删除 
                    var newRole =[];
                    angular.forEach($scope.userRole, function (data, index) {
                        if (data.rid != v.id) {
                        	newRole.push(data);
                        }
                    });
                    $scope.userRole =newRole;
                    v.state = true;
                }
                else {
                    //增加
                    $scope.roletzy = {};
                    $scope.roletzy.rid = role.id;
                    $scope.userRole.push($scope.roletzy);
                    $scope.roletzy = {};
                    v.state = false;
                }
            }
        });
    }
    $scope.checkedAction2 = function (event, role) {
        if ($scope.roles.data.role2.state == false) {
            $scope.roles.data.role2.state = true;
        }
        else {
            $scope.roles.data.role2.state = false;
        }
    }
    $scope.checkedAction3 = function (event, role) {
        if ($scope.roles.data.role3.state == false) {
            $scope.roles.data.role3.state = true;
        }
        else {
            $scope.roles.data.role3.state = false;
        }
    }
    $scope.checkedAction4 = function (event, role) {
        if ($scope.roles.data.role4.state == false) {
            $scope.roles.data.role4.state = true;
        }
        else {
            $scope.roles.data.role4.state = false;
        }
    }
    $scope.checkedAction5 = function (event, role) {
        if ($scope.roles.data.role5.state == false) {
            $scope.roles.data.role5.state = true;
        }
        else {
            $scope.roles.data.role5.state = false;
        }
    }
    $scope.checkedAction6 = function (event, role) {
        if ($scope.roles.data.role6.state == false) {
            $scope.roles.data.role6.state = true;
        }
        else {
            $scope.roles.data.role6.state = false;
        }
    }
    $scope.checkedAction7 = function (event, role) {
        if ($scope.roles.data.role7.state == false) {
            $scope.roles.data.role7.state = true;
        }
        else {
            $scope.roles.data.role7.state = false;
        }
    }
        //根据授课年级查询授课班级
    var gradeNo = 0;
	$scope.selTeachClass = function (a) {
        gradeNo = a.sort;
        if (a == undefined) {
            $scope.teachClasses = null;
            $scope.teachSubject = null;
            $scope.teachVersion = null;
            $scope.userCourseList = {};
        }
        else {
            $scope.teachClasses = null;
            $scope.teachSubject = null;
            $scope.teachVersion = null;
            $scope.userCourseList = {};
            $scope.userCourseList.gid = a.id;
            $scope.userCourseList.gradeName = a.name;
            $http.post(requireIp + "/ea/eaClass/findClassInfoByGid", {
                gradeId: $scope.userCourseList.gid
            }).success(function (data) {
                $scope.teachClasses = data;
                console.log(data)
            });
        }
    }
	 $scope.closebox = function () {
    		$scope.subBox=false;
            $scope.subBox5=false;
            $scope.gradeTab="-1";
            $scope.subjects.data=[]
            $scope.subjects5.data=[]
    }

        //点击选择学科按钮的时候判断，先选择学校类型和学校
    $scope.subselsel = function () {
        if ($scope.userInfo.officeId == null || "" == $scope.userInfo.officeId) {
            $scope.chenggong = false;
            $scope.warnshow = true;
            $scope.tishi = "请选择学校";
            $timeout(function () {$scope.warnshow = false}, 1500);
            return;
        }
        $scope.gradeTab;
        $scope.subBox = true;
    }
    //点击选择学科按钮的时候判断，先选择学校类型和学校
    $scope.subselsel5 = function () {
        if ($scope.userInfo.officeId == null || "" == $scope.userInfo.officeId) {
            $scope.chenggong = false;
            $scope.warnshow = true;
            $scope.tishi = "请选择学校";
            $timeout(function () {$scope.warnshow = false}, 1500);
            return;
        }
        $scope.gradeTab;
        $scope.subBox5 = true;
    }
    //删除授课
    $scope.deleteTeach = function (a) {
        $scope.userCourse.splice(a, 1);
    }
    //根据授课班级查询授课学科
    $scope.selTeachSub = function (a) {
        console.log(a)
        if (a == undefined) {
            $scope.userCourseList.cid = "";
            $scope.userCourseList.sid = "";
            $scope.userCourseList.vid = "";
            $scope.userCourseList.className = "";
            $scope.userCourseList.subjectName = "";
            $scope.userCourseList.versionName = "";
            $scope.teachSubject = null;
            $scope.teachVersion = null;
        }
        else {
            $scope.teachSubject = null;
            $scope.teachVersion = null;
            $scope.userCourseList.vid = "";
            $scope.userCourseList.sid = "";
            $scope.userCourseList.subjectName = "";
            $scope.userCourseList.versionName = "";
            $scope.userCourseList.className = a.name;
            $http.post(requireIp + "/edu/eduSubject/findSubjectByGradeId", {
                gradeId: $scope.userCourseList.gid
            }).success(function (data) {
                $scope.teachSubject = data;
                console.log(data)
            });
        }
    }
    //根据授课学科查询授课版本
    $scope.selTeachVersion = function (a) {
        if (a == undefined) {
            $scope.teachVersion = null;
            $scope.userCourseList.vid = "";
            $scope.userCourseList.sid = "";
            $scope.userCourseList.subjectName = "";
            $scope.userCourseList.versionName = "";
        }
        else {
            $scope.teachVersion = null;
            $scope.userCourseList.vid = "";
            $scope.userCourseList.versionName = "";
            $scope.userCourseList.subjectName = a.name;
            $http.get(requireIp + "/edu/eduVersion", {
            	params:{
                    subjectId: $scope.userCourseList.sid
                    , gradeNo: gradeNo,
                    areaId:sessionStorage.getItem('areaId')
                }
            }).success(function (data) {
                $scope.teachVersion = data;
                console.log(data)
            });
        }
    }
    //添加授课最后的选项 点击选择版本
    $scope.selTeachLast = function (a) {
        if (a == undefined) {
            $scope.userCourseList.vid = "";
            $scope.userCourseList.versionName = "";
        }
        else {
            $scope.userCourseList.versionName = a.name;
        }
    }
    $scope.teachtzy = {};
    $scope.teachtzy.teachBox = false;
    $scope.cleargrade = function () {
            $scope.teachtzy.teachBox = false;
            $scope.userCourseList = {};
        }
        //点击添加授课按钮判断 需要先选择学校和学校类型
    $scope.ifOpenAddTeach = function () {
        if ($scope.userInfo.officeId == null || "" == $scope.userInfo.officeId) {
            $scope.chenggong = false;
            $scope.warnshow = true;
            $scope.tishi = "请选择学校";
            $timeout(function () {$scope.warnshow = false}, 1500);
            return;
        }
        $scope.teachtzy.teachBox = true;
     }
    //添加授课
    $scope.addTeach = function () {
        //判断要添加的对象是否有空值用户没选
        var countList = 0;
        /*
        angular.forEach(Object.getOwnPropertyNames($scope.userCourseList), function(data){
   			if($scope.userCourseList[data]==""||$scope.userCourseList[data]==null){
   				countList += 1;
   				return;
   			}
		}); 
		*/
        if ($scope.userCourseList.vid == "" || $scope.userCourseList.vid == null) {
            countList += 1;
        }
        var countTeach = 0;
        angular.forEach($scope.userCourse, function (data) {
            if ($scope.userCourseList.gid == data.gid && 
            	$scope.userCourseList.cid == data.cid && 
            	$scope.userCourseList.vid == data.vid && 
            	$scope.userCourseList.sid == data.sid) {
                countTeach += 1;
            }
        });
        if (countList > 0) {
            $scope.chenggong = false;
            $scope.warnshow = true;
            $scope.tishi = "请选择完整";
            $timeout(function () {$scope.warnshow = false}, 1500);
        }
        else if (countTeach > 0) {
            $scope.chenggong = false;
            $scope.warnshow = true;
            $scope.tishi = "您已经添加过这个课程";
            $timeout(function () {$scope.warnshow = false}, 1500);
        }
        else {
            $scope.userCourse.push($scope.userCourseList);
            $scope.teachtzy.teachBox = false;
            $scope.userCourseList = {};
        }
    }
    // 点击区域事件 查询学校(区域请选择)
    $scope.selSchoolArea = function (a) {
        if (a == undefined) {
            $scope.schools = null;
            $scope.userInfo.officeId = null;
            $scope.grades = {};
            $scope.classes = {};
            $scope.subjects = {};
            //让班主任的年级班级禁用
            $scope.showTip = true;
        }else {
            $scope.schools = null;
            $scope.userInfo.officeId = null;
            $scope.grades = {};
            $scope.classes = {};
            $scope.subjects = {};
            $http.post(requireIp + "/ea/eaOffice/findSchoolInfoByAreaId", {
                areaId: $scope.userInfo.areaId, 
                grade: $scope.userInfo.officeGrade
            }).success(function (data) {
                $scope.schools = data.data;
            });
        }
    }
    //点击学校类型事件  查询学校(学校类型请选择)
    $scope.selSchoolLevel = function (a) {
        if (a == undefined) {
            $scope.groptzy6.YgradeGrop = null;
            $scope.groptzy7.YgradeGrop = null;
            $scope.userInfo.officeGrade = null;
            $scope.schools = null;
            $scope.userInfo.officeId = null;
            $scope.grades = {};
            $scope.classes = {};
            $scope.subjects = {};
            //让班主任的年级班级禁用
            $scope.showTip = true;
        }
        else {
            // 			$scope.userInfo.officeGrade = null;
            $scope.grades = {};
            $scope.classes = {};
            $scope.subjects = {};
            $http.post(requireIp + "/ea/eaOffice/findSchoolInfoByAreaId", {
                areaId: $scope.userInfo.areaId, 
                grade: $scope.userInfo.officeGrade
            }).success(function (data) {
                $scope.schools = data.data;
                console.log(data)
            });
        }
    }
    //根据学校查询年级(班主任、年级组长)
    $scope.selGrade = function (a) {
        console.log(a);
        if (a == undefined) {
            $scope.user.schoolId = null;
            $scope.grades = {};
            $scope.classes = {};
            $scope.subjects = {};
            //让班主任的年级班级禁用
            $scope.showTip = true;
        }else {
            $scope.grades = {};
            $scope.classes = {};
            $scope.subjects = {};
            //更换学校 清空之前的年级组长班主任信息
            $scope.Yteach.gradeId = '';
            $scope.Yteach.classId = '';
            $scope.groptzy.YgradeGrop = ""
            $http.post(requireIp + "/ea/eaGrade/findGradeInfoByOid", {
                officeId: $scope.userInfo.officeId
            }).success(function (data) {
                $scope.grades = data;
                console.log(data);
                $scope.classes = null;
            });
        }
    }
        //年级查询班级（班主任） 		提交的时候在增加这个班主任角色 
    $scope.selClass = function (a) {
        if (a == undefined) {
            $scope.Yteach.gradeId = '';
            $scope.Yteach.classId = '';
        }
        else {
            $scope.Yteach.classId = '';
            $http.post(requireIp + "/ea/eaClass/findClassInfoByGid", {
                gradeId: a.id
            }).success(function (data) {
                $scope.classes = data;
                console.log(data);
            });
        }
        }
    //身份证号码验证
    $scope.userIdTips = false;
    $scope.checkID = function (ID) {
        if (typeof ID !== 'string') return '非法字符串';
        var city = {
              11: "北京"
            , 12: "天津"
            , 13: "河北"
            , 14: "山西"
            , 15: "内蒙古"
            , 21: "辽宁"
            , 22: "吉林"
            , 23: "黑龙江 "
            , 31: "上海"
            , 32: "江苏"
            , 33: "浙江"
            , 34: "安徽"
            , 35: "福建"
            , 36: "江西"
            , 37: "山东"
            , 41: "河南"
            , 42: "湖北 "
            , 43: "湖南"
            , 44: "广东"
            , 45: "广西"
            , 46: "海南"
            , 50: "重庆"
            , 51: "四川"
            , 52: "贵州"
            , 53: "云南"
            , 54: "西藏 "
            , 61: "陕西"
            , 62: "甘肃"
            , 63: "青海"
            , 64: "宁夏"
            , 65: "新疆"
            , 71: "台湾"
            , 81: "香港"
            , 82: "澳门"
            , 91: "国外"
        };
        var birthday = ID.substr(6, 4) + '/' + Number(ID.substr(10, 2)) + '/' + Number(ID.substr(12, 2));
        var d = new Date(birthday);
        var newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate());
        var currentTime = new Date().getTime();
        var time = d.getTime();
        var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
        var sum = 0, i, residue;
        //if(!/^\d{17}(\d|x)$/i.test(ID)) return '非法身份证';
        if (!/^\d{17}(\d|x)$/i.test(ID)) $scope.userIdTips = true;
        //	    else $scope.userIdTips = false;
        //if(city[ID.substr(0,2)] === undefined) return "非法地区";
        if (city[ID.substr(0, 2)] === undefined) $scope.userIdTips = true;
        //	    else $scope.userIdTips = false;
        //if(time >= currentTime || birthday !== newBirthday) return '非法生日';
        if (time >= currentTime || birthday !== newBirthday) $scope.userIdTips = true;
        //	    else $scope.userIdTips = true;
        for (i = 0; i < 17; i++) {
            sum += ID.substr(i, 1) * arrInt[i];
        }
        residue = arrCh[sum % 11];
        //if (residue !== ID.substr(17, 1)) return '非法身份证哦';
       
       if(!isNaN(ID.substr(17, 1))){
       	 if (residue !== ID.substr(17, 1)) {
        	  $scope.userIdTips = true;
         }else{
        	$scope.userIdTips = false;
         }
       }else{
       	 if (residue !== ID.substr(17, 1).toLocaleUpperCase()) {
        	  $scope.userIdTips = true;
         }else{
        	$scope.userIdTips = false;
         }
       }
        //return city[ID.substr(0,2)]+","+birthday+","+(ID.substr(16,1)%2?" 男":"女");
        $scope.userInfo.sex = ID.substr(16, 1) % 2 ? " 男" : "女";
        console.log(city[ID.substr(0, 2)] + "," + birthday + "," + (ID.substr(16, 1) % 2 ? " 男" : "女"));
        //      return true;
    }
    
    
    //定义警告弹窗初始为false隐藏
    $scope.warnshow = false;
    $scope.tishi = null;
    //手机有误提示
    $scope.mobileTip = '';
    $scope.phone_wrong = false;
    function verify(ht, tip) {
    	
        if ($scope.userInfo.realname == '' || $scope.userInfo.realname == null) {
            $scope.chenggong = false;
            $scope.warnshow = true;
            $scope.tishi = "请填写真实姓名";
            $timeout(function () {$scope.warnshow = false}, 1500);
            return;
        }
        //身份证
        if($scope.userInfo.idCard==null||""==$scope.userInfo.idCard){
     		$scope.userIdTips = true;
     		return;
     	}
        //手机号等验证
        if ($scope.userInfo.userNation == null || "" == $scope.userInfo.userNation) {
            console.log('minzu')
            $scope.chenggong = false;
            $scope.warnshow = true;
            $scope.tishi = "请选择民族";
            $timeout(function () {$scope.warnshow = false}, 1500);
            return;
        }
        if ($scope.userInfo.userMobile == null || "" == $scope.userInfo.userMobile) {
            console.log('shouj')
            $scope.phone_wrong = true;
            $scope.mobileTip = '手机号码格式不正确';
            console.log($scope.phone_wrong);
            return;
        }
        if ($scope.userInfo.userEmail == null || "" == $scope.userInfo.userEmail) {
            console.log('youxiang');
            $scope.mail_wrong = true;
            return;
        }
        //是否选择单位
        if ($scope.userInfo.areaId == null || "" == $scope.userInfo.areaId) {
            $scope.chenggong = false;
            $scope.warnshow = true;
            $scope.tishi = "请选择区域";
            $timeout(function () {$scope.warnshow = false}, 1500);
            return;
        }
        if ($scope.userInfo.officeGrade == null || "" == $scope.userInfo.officeGrade) {
            $scope.chenggong = false;
            $scope.warnshow = true;
            $scope.tishi = "请选择学校类型";
            $timeout(function () {$scope.warnshow = false}, 1500);
            return;
        }
        if ($scope.userInfo.officeId == null || "" == $scope.userInfo.officeId) {
            $scope.chenggong = false;
            $scope.warnshow = true;
            $scope.tishi = "请选择学校";
            $timeout(function () {$scope.warnshow = false}, 1500);
            return;
        }
        //班主任
        if ($scope.roles.data.role2.state == false) {
            if ($scope.Yteach.gradeId == "" || $scope.Yteach.gradeId == null) {
                $scope.chenggong = false;
                $scope.warnshow = true;
                $scope.tishi = "请选择班主任教的年级";
                $timeout(function () {$scope.warnshow = false}, 1500);
                return;
            }
            else if ($scope.Yteach.classId == "" || $scope.Yteach.classId == null) {
                $scope.chenggong = false;
                $scope.warnshow = true;
                $scope.tishi = "请选择班主任教的班级";
                $timeout(function () {$scope.warnshow = false}, 1500);
                return;
            }
            else {
                //如果有 先删除
                var countban = 0;
                angular.forEach($scope.userRole, function ( data,index) {
                	console.log(data);
                    if (data.rid == "1") {
                        countban += 1;
                    }
                })
                if (countban > 0) {
                    angular.forEach($scope.userRole, function ( data,index) {
                        if (data.rid == "1") {
                            $scope.userRole.splice(index, 1);
                        }
                    })
                    $scope.roletzy2 = {
                        rid: "1",
                        cid: $scope.Yteach.classId, 
                        gid: $scope.Yteach.gradeId
                    }
                    $scope.userRole.push($scope.roletzy2);
                    $scope.roletzy2 = {};
                }
                else {
                    $scope.roletzy2 = {
                        rid: "1"
                        , cid: $scope.Yteach.classId
                        , gid: $scope.Yteach.gradeId
                    }
                    $scope.userRole.push($scope.roletzy2);
                    $scope.roletzy2 = {};
                }
            }
        }
        else {
            angular.forEach($scope.userRole, function ( data,index) {
            	if (data.rid == "1") {
                   		$scope.userRole.splice(index, 1);
                }
            })
        }
        //是否有年级组长角色
        if ($scope.roles.data.role3.state == false) {
            if ($scope.groptzy.YgradeGrop == "" | $scope.groptzy.YgradeGrop == null) {
                $scope.chenggong = false;
                $scope.warnshow = true;
                $scope.tishi = "请选择年级组长管理的年级";
                $timeout(function () {$scope.warnshow = false}, 1500);
                return;
            }
            else {
                //如果有 先删除
                var countban = 0;
                angular.forEach($scope.userRole, function ( data,index) {
                    if (data.rid == "12") {
                        countban += 1;
                    }
                })
                if (countban > 0) {
                    angular.forEach($scope.userRole, function ( data,index) {
                        if (data.rid == "12") {
                            $scope.userRole.splice(index, 1);
                        }
                    })
                    $scope.roletzy3 = {
                        rid: "12",
                        gid: $scope.groptzy.YgradeGrop
                    }
                    console.log($scope.roletzy3)
                    $scope.userRole.push($scope.roletzy3);
                    $scope.roletzy3 = {};
                }
                else {
                    $scope.roletzy3 = {
                        rid: "12", 
                        gid: $scope.groptzy.YgradeGrop
                    }
                    console.log($scope.roletzy3)
                    $scope.userRole.push($scope.roletzy3);
                    $scope.roletzy3 = {};
                }
            }
        }
        else {
            angular.forEach($scope.userRole, function ( data,index) {
                if (data.rid == "12") {
                    $scope.userRole.splice(index, 1);
                }
            })
        }
         console.log($scope.roles.data.role4.state == false)
        //是否有学科组长的角色
        if ($scope.roles.data.role4.state == false) {
        	if($scope.subjectLeaderInfoNew.length == 0){
        		$scope.chenggong = false;
	            $scope.warnshow = true;
	            $scope.tishi = "请选择学科组长管理的学科";
	            $timeout(function () {$scope.warnshow = false}, 1500);
	            return;
        	}
        	var newUserRole = [];
        	angular.forEach($scope.userRole,function(data,index){
        		if(data.rid!='13'){
        			newUserRole.push(data);
        		}
        	});
        	angular.forEach($scope.subjectLeaderInfoNew,function(data,index){
        		if(data.rid=='13'){
        			newUserRole.push(data);
        		}
        	})
        	$scope.userRole = newUserRole;
        }else{
        	$scope.subjectLeaderInfoNew =[];
        	var newUserRole = [];
        	angular.forEach( $scope.userRole,function(data,index){
        		if(data.rid!='13'){
        			newUserRole.push(data);
        		}
        	})
        	$scope.userRole = newUserRole;
        }
        
        //是否有6教研主任角色
        if ($scope.roles.data.role6.state == false) {
            if ($scope.groptzy6.YgradeGrop == "" | $scope.groptzy6.YgradeGrop == null) {
                $scope.chenggong = false;
                $scope.warnshow = true;
                $scope.tishi = "请选择教研主任管理的年级";
                $timeout(function () {$scope.warnshow = false}, 1500);
                return;
            }
            else {
                //如果有 先删除
                var countban = 0;
                angular.forEach($scope.userRole, function ( data,index) {
                    if (data.rid == "20") {
                        countban += 1;
                    }
                })
                if (countban > 0) {
                    angular.forEach($scope.userRole, function ( data,index) {
                        if (data.rid == "20") {
                            $scope.userRole.splice(index, 1);
                        }
                    })
                    $scope.roletzy6 = {
                        rid: "20", 
                        schoolType: $scope.groptzy6.YgradeGrop
                    }
                    console.log($scope.roletzy6)
                    $scope.userRole.push($scope.roletzy6);
                    $scope.roletzy6 = {};
                }
                else {
                    $scope.roletzy6 = {
                        rid: "20", 
                        schoolType: $scope.groptzy6.YgradeGrop
                    }
                    console.log($scope.roletzy6)
                    $scope.userRole.push($scope.roletzy6);
                    $scope.roletzy6 = {};
                }
            }
        }
        else {
            angular.forEach($scope.userRole, function (  data,index) {
                if (data.rid == "20") {
                    $scope.userRole.splice(index, 1);
                }
            })
        }
        //是否有7考试管理员角色
        if ($scope.roles.data.role7.state == false) {
            if ($scope.groptzy7.YgradeGrop == "" | $scope.groptzy7.YgradeGrop == null) {
                $scope.chenggong = false;
                $scope.warnshow = true;
                $scope.tishi = "请选择考试管理员的年级";
                $timeout(function () {$scope.warnshow = false}, 1500);
                return;
            }
            else {
                //如果有 先删除
                var countban = 0;
                angular.forEach($scope.userRole, function (  data,index) {
                    if (data.rid == "19") {
                        countban += 1;
                    }
                })
                if (countban > 0) {
                    angular.forEach($scope.userRole, function (  data,index) {
                        if (data.rid == "19") {
                            $scope.userRole.splice(index, 1);
                        }
                    })
                    $scope.roletzy7 = {
                        rid: "19", 
                        schoolType: $scope.groptzy7.YgradeGrop
                    }
                    console.log($scope.roletzy7)
                    $scope.userRole.push($scope.roletzy7);
                    $scope.roletzy7 = {};
                }
                else {
                    $scope.roletzy7 = {
                        rid: "19",
                        schoolType: $scope.groptzy7.YgradeGrop
                    }
                    console.log($scope.roletzy7)
                    $scope.userRole.push($scope.roletzy7);
                    $scope.roletzy7 = {};
                }
            }
        }else {
            angular.forEach($scope.userRole, function (  data,index) {
                if (data.rid == "19") {
                    $scope.userRole.splice(index, 1);
                }
            })
        }
       
        //是否有5教研员的角色
        if($scope.roles.data.role5.state == false){
        	if($scope.subjectLeaderInfoNew5.length == 0){
        		$scope.chenggong = false;
	            $scope.warnshow = true;
	            $scope.tishi = "请选择教研员管理的学科";
	            $timeout(function () {$scope.warnshow = false}, 1500);
	            return;
        	}
        	var newUserRole = [];
        	angular.forEach($scope.userRole,function(data,index){
        		if(data.rid!='11'){
        			newUserRole.push(data);
        		}
        	});
        	angular.forEach($scope.subjectLeaderInfoNew5,function(data,index){
        		if(data.rid=='11'){
        			newUserRole.push(data);
        		}
        	})
        	$scope.userRole = newUserRole;
        }else{
        	$scope.subjectLeaderInfoNew5 =[];
        	var newUserRole = [];
        	angular.forEach( $scope.userRole,function(data,index){
        		if(data.rid!='11'){
        			newUserRole.push(data);
        		}
        	})
        	$scope.userRole = newUserRole;
        }
        var countrole = 0;
        angular.forEach($scope.roles.data.role1, function (role1) {
            if (role1.state == false) {
                countrole += 1;
            }
        });
        if ($scope.roles.data.role2.state == false ||$scope.roles.data.role3.state == false || 
        	$scope.roles.data.role4.state == false ||$scope.roles.data.role5.state == false || 
        	$scope.roles.data.role6.state == false ||$scope.roles.data.role7.state == false) 
        {
            countrole += 1;
        }
        if (countrole == 0) {
            $scope.chenggong = false;
            $scope.warnshow = true;
            $scope.tishi = "请至少选择一个角色";
            $timeout(function () {
                $scope.warnshow = false;
            }, 1500);
            return;
        }
        //是否有授课
        if ($scope.iftzy.ifRadio == true) {
            if ($scope.userCourse.length == 0) {
                $scope.chenggong = false;
                $scope.warnshow = true;
                $scope.tishi = "请添加授课";
                $timeout(function () {$scope.warnshow = false}, 1500);
                return;
            }else{
            	var sum = 0
            	angular.forEach($scope.userRole,function(data){
	       			if(data.rid=='14'){
	       				sum++;
	       			}
       			})
            	if(sum==0){
            		$scope.chenggong = false;
	                $scope.warnshow = true;
	                $scope.tishi = "请选择任课教师";
	                $timeout(function () {
	                    $scope.warnshow = false;
	                }, 1500);
	                return;
            	}
            }
        }
        else {
            $scope.userCourse = [];
        }
        $scope.user.userCourse = $scope.userCourse;
        $scope.userInfo.updateBy = sessionStorage.getItem("userId");
        $scope.user.userInfo = $scope.userInfo;
        $scope.user.userRole = $scope.userRole;
        console.log($scope.user)
        var iscommit = true;
       	angular.forEach($scope.user.userRole,function(data){
       		if(data.rid=='14'){
       			if($scope.iftzy.ifRadio == false){
       				$scope.chenggong = false;
	                $scope.warnshow = true;
	                $scope.tishi = "请添加授课";
	                $timeout(function () {
	                    $scope.warnshow = false;
	                }, 1500);
	                iscommit = false;
	                return;
       			}else{
       				if($scope.userCourse.length == 0) {
		                $scope.chenggong = false;
		                $scope.warnshow = true;
		                $scope.tishi = "请添加授课";
		                $timeout(function () {
		                    $scope.warnshow = false;
		                }, 1500);
		                iscommit = false;
		                return;
            		}
       			}
       		}
       	})
       	
       	if(iscommit==false){
       		return false;
       	}
       	console.log($scope.user.userRole)
//return false;

		$scope.love=true;
        $http.post(requireIp + ht, {
            jsonData: angular.toJson($scope.user),
            userType:'1'
        }).success(function (data) {
        
          console.log(oldLogiName)
          console.log($scope.user)
          console.log($scope.user.userInfo.userMobile)
          console.log($scope.user);
            if (data.ret == "200") {
                $scope.chenggong = true;
                $scope.warnshow = true;
                $scope.tishi = tip + "成功";
                $timeout(function () {
                	$scope.love=false;
                    $scope.warnshow = false;
                    if (oldLogiName == $scope.user.userInfo.userMobile) {
                      	console.log('没修改手机号');
                      	if($scope.loginState==1){//管理员
                      		$state.go('teacher_index.teacher_center',{username:sessionStorage.getItem('userName')});
                      	}else{
                      		$state.go('teacher_index.teach_handle', {username: sessionStorage.getItem('userName')});
                      	}
                    }
                    else {
                        console.log('已修改手机号');
//                      window.location.href = "http://jdzedu.jetsen.cn:6062";
						sessionStorage.clear();
	 					window.parent.location.href = homeAddress;
                    }
                }, 1500);
            }
            else if (data.ret == '40006') {
                $scope.mobileTip = data.message;
                $scope.phone_wrong = true;
                $timeout(function () {$scope.love=false;}, 1500);
            }
            else if (data.ret == '40105') {
                $scope.chenggong = false;
                $scope.warnshow = true;
                $scope.tishi = data.message;;
                $timeout(function () {$scope.warnshow = false;$scope.love=false;}, 1500);
                return;
            }
            else {
                $scope.chenggong = false;
                $scope.warnshow = true;
                $scope.tishi = data.message;
                $timeout(function () {$scope.warnshow = false;$scope.love=false;}, 1500);
            }
        });
    }
    //提交表单
    $scope.submitInfo = function () {
        if ($scope.reg.btn == '注册') {
            $scope.userInfo.id = '';
            verify('/uc/ucUser/updateTeaInfo', '注册');
        }
        else {
            console.log("提交");
            verify("/uc/ucUser/updateUserInfo1", '提交');
        }
    }
    //头像截取上传功能
    $scope.myImage = '';
    $scope.myCroppedImage = '';
    var handleFileSelect = function (evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
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
        if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);
        else byteString = unescape(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {
            type: mimeString
        });
    }
    //图片上传
    $scope.upload = function () {
            var fd = new FormData();
            fd.append("filename", convertBase64UrlToBlob($scope.myCroppedImage), "image.jpg");
            $scope.user.id = sessionStorage.getItem('userId')
            fd.append("id", $scope.user.id);
            $.ajax({
                url: requireIp + "/uc/ucUser/uploadUserFace"
                , type: "POST"
                , data: fd
                , dataType: "text"
                , processData: false
                , contentType: false
                , success: function (data) {}
                , xhr: function () {
                    if ($scope.myImage == "" || $scope.myImage == null) {
                        $scope.warnshow = true;
                        $scope.chenggong = false;
                        $scope.tishi = "请先上传图片！";
                        $timeout(function () {
                            $scope.warnshow = false;
                        }, 1500);
                    }
                    else {
                        var xhr = new XMLHttpRequest();
                        $scope.warnshow = true;
                        $scope.tishi = "提交成功";
                        $timeout(function () {
                            $scope.warnshow = false;
                            $state.go('teacher_index.teacher_center', {
	                            username: sessionStorage.getItem('userName')
	                        });
                        }, 1500);
                        xhr.upload.addEventListener("progress", function (evt) {
                            if (evt.lengthComputable) {
                                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                                $scope.warnshow = true;
                                console.log("正在提交." + percentComplete.toString() + '%');
                            }
                        }, false);
                        return xhr;
                    }
                }
            });
        }
        //修改密码
    $scope.updateStudentMsg = function () {
        if ($scope.userUpdate.password == "" || $scope.userUpdate.password == null) {
            $scope.same = 3;
        }
        else if ($scope.userUpdate.password.length < 6) {
            $scope.same = 3;
        }
        else if ($scope.userUpdate.password != $scope.userUpdate.renewpassword) {
            $scope.same = 1;
        }
        else {
            $scope.same = 0
                //提交
            var fd = new FormData();
            fd.append("id", sessionStorage.getItem('userId'));
            fd.append("password", $scope.userUpdate.password);
            $http({
                method: 'POST'
                , url: requireIp + "/uc/ucUser/updatePassword"
                , data: fd
                , headers: {
                    'Content-Type': undefined
                }
                , transformRequest: angular.identity
            }).success(function (res) {
                if (res.ret == "200") {
                    $scope.warnshow = true;
                    $scope.tishi = "提交成功";
                    $timeout(function () {
                        $scope.warnshow = false;
//                      $state.go('teacher_index.teacher_personal');
						sessionStorage.clear();
	 					window.parent.location.href = homeAddress;
                    }, 1500);
                }
                else if (res.message == "原始密码校验失败!") {
                    $scope.same = 4
                }
                else {
                    $scope.warnshow = true;
                    $scope.chenggong = false;
                    $scope.tishi = res.message;
                    $timeout(function () {
                        $scope.warnshow = false;
                    }, 1500);
                }
            })
        }
    }
}]);
//自定义学科组长展示过滤器
app.filter('subjectLeaderInfoFilter', function () {
        return function (obj) {
            return obj.gradeName + obj.subjectName;
        }
    })
    //自定义班级过滤器
app.filter("classfilter", function () {
    return function (name) {
        return name + "班";
    }
});