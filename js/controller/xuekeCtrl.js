app.controller('xuekeCtrl',['$scope','$timeout','xuekeService','$http','$state',function($scope,$timeout,xuekeService,$http,$state) {
    //初始化数据
    $scope.state={
        "schoolshowstate":false,
        "levelList":[],
        "getSubjectList":[],
        "findSubjectListByLevelAndGrade":[],
        "levelIndex":0,
        "addClass":false,
        "saveLevelSubjectGrade":[],
        levelId:'level_1',
        gradId :'',
        officeId:'',
        getSubTypeListByOfficeId:[],
        getSubjectListByOfficeId:[],
        subjectstate : false,
        subjectgradshowstate : false,
        userId:sessionStorage.getItem('userId'),
		userType : sessionStorage.getItem('scope'),
		oid:typeof(JSON.parse(sessionStorage.getItem('userObj')).oid)=='undefined'?'':JSON.parse(sessionStorage.getItem('userObj')).oid,
		areaId:sessionStorage.getItem('areaId'),
		tkstate:false,
		subType:'',
		stateFlag : 0,
		schoolbranch:[]
    }
/*    if($scope.state.userId == 'f56e325d1034429e900227dbe7fdb691') {
    	$scope.state.areaId = 'f235e50711754f57accc4569ed12dbaa';
    }else {
    	$scope.state.areaId = '78881913d0ce4b05b4a6b6455325a392';
    }*/
    
    
    // 1.获取 levelList 集合 获取学段 schoolbranch
	xuekeService.getLevelList('',function(res){
		if(res.ret == 200){
			$scope.state.levelList = res.data
		}else{
			$scope.state.levelList = []
		}
	},function(res){
		
	})
    
    
    //切换小学、初中、高中
    $scope.changeLevel=function(m,n){
        $scope.state.levelIndex=m;
        $scope.state.levelId = n.id;
        $scope.getSubList(n.id,null,$scope.state.areaId);
    	$scope.getGradeBylevelId(n.id,null,$scope.state.areaId);
    }
    
    
    //查看学校点击事件
    $scope.showschoolaction = function(){
		$scope.state.schoolshowstate = true;
		$scope.state.subjectstate = true;
		$scope.state.subjectgradshowstate = true;
		$scope.state.subjectType = [];
		
	}
    
    
    $scope.showxueduanaction = function(){
		$scope.state.schoolshowstate = false;
		$scope.state.subjectstate = false;
		$scope.changeLevel($scope.state.levelIndex,{name:$scope.state.levelName,id:$scope.state.levelId});
	}
    
    
    /**
	 * 获取选框中的学校Id
	 */
	$scope.selettypefn = function(schoolId){
		$scope.state.officeId = schoolId;
	}
    
    // 点击确认按钮
    $scope.searchSchool = function(){
    	
    	if($scope.state.officeId == ''){
			poploading(true,'sb','请选择学校',1000)
			return;
		}
    	$scope.state.subjectstate = false;
    	$scope.state.subjectgradshowstate = false;
    	$scope.getSubTypeListByOfficeId(null,$scope.state.officeId,$scope.state.areaId);
    	$scope.getGradeSubListByOfficeId(null,$scope.state.officeId,$scope.state.areaId);
    }
    
    // 2.通过学段 获取 学科分类集合
	$scope.getSubList = function(levelId,officeId,areaId) {
		var params = {levelId:levelId,officeId:officeId,areaId:areaId}
		xuekeService.getSubjectByType(params,function(res){
			if(res.ret == 200){
				$scope.xuekelists = res.data
			}else{
				$scope.xuekelists = []
			}
		},function(res){
		
		})
	}
    
     //鼠标移入学科出现叉号
     $scope.banjiguanli = function (n) {
             $scope.delbanji = n;
         }
     
     //点击编辑学科名称
     $scope.bianjiname = function (event,id,name) {
             
             if (!$scope.state.schoolshowstate) {	// 获取当前的状态 判断是操作 学校（true） 还是学段（false）
             	 //原来的学科名称
	             $scope.oldbjmc = name;
	             angular.element(event.target).html('<input type="text" value="' + $scope.oldbjmc + '" />')
	                 //失去焦点的时候获取新的名称
	             angular.element(event.target).children().blur(function () {
	                 //获取新的学科名称
	                 $scope.newbjmc = angular.element(event.target).children().val().replace(/^\s+|\s+$/g, '');
	                 //获取学科ID
	                 $scope.bjid = angular.element(event.target).siblings("p").html()
		            if ($scope.newbjmc == "") {
			             $(".wx_erro_tc").show();
			             $(".wx_erro_tc .gy_con span").html("请输入学科名称");
			             angular.element(event.target).html('<input type="text" value="' + $scope.oldbjmc + '" />')
			             setTimeout(function () {
			                 $(".wx_erro_tc").hide();
			             }, 2000)
			        }else {
		                if($scope.oldbjmc != $scope.newbjmc) {
		                 	$http.post(requireIp + '/edu/eduSubject/updateEduSubject', {
		                     id: id
		                     , updateBy:$scope.state.userId
		                     , name: $scope.newbjmc
		                     ,areaId:$scope.state.areaId
			                 }).success(function (res) {
			                     $(".zy_warningBox").show();
			                     $(".zy_warningBox .gy_con i").html("修改成功")
			                     setTimeout(function () {
			                         $(".zy_warningBox").hide()
			                     }, 1000)
			                 })
		                } 
		            }
	             })
	             
	          }
         }
         //点击叉号出现弹窗
     $scope.deltc = function (event,id) {
             $(".zy_addClassBox").show()
                 //确认删除弹窗
             $scope.suredel = function () {
                     angular.element(event.target).parent().addClass("wx_none"); //点击确定按钮，让当前选中的班级消失
                     $(".zy_addClassBox").hide()
                 }
                 //取消删除弹窗
             $scope.caldel = function () {
                     $(".zy_addClassBox").hide()
                     $scope.delbanji = false;
                 }
                 //点击确定删除班级
             $scope.suredel = function () {
                 $scope.delbjid = angular.element(event.target).siblings("p").html();
                 $scope.flag =  $scope.state.schoolshowstate;	// 获取当前的状态 判断是操作 学校（true） 还是学段（false）
                 if ($scope.flag == false) {
                 	$http.post(requireIp + '/edu/eduSubject/deleteSubjectByType',{id:id,levelId:$scope.state.levelId,areaId:$scope.state.areaId}
	                 ).success(function (res) {
	                 	if(res.ret == '200') {
	                 		 $scope.getSubList($scope.state.levelId,null,$scope.state.areaId);
	                 		 $scope.getGradeBylevelId($scope.state.levelId,null,$scope.state.areaId);
	                 		 $(".zy_warningBox").show();
	                 		 $(".zy_warningBox .gy_con i").html("删除成功");
		                     $(".zy_addClassBox").hide()
		                     setTimeout(function () {
		                         $(".zy_warningBox").hide();
		                     }, 1000)
	                 	}
	                     angular.element(event.target).parent().addClass("wx_none");
	                 })
                 } else{
                 	$http.post(requireIp + '/edu/eduSubject/deleteSubOfficeIdByType',{id:id,officeId:$scope.state.officeId}
	                 ).success(function (res) {
	                    if(res.ret == '200') {
	                    	 $scope.getSubTypeListByOfficeId(null,$scope.state.officeId,$scope.state.areaId);
	                    	 $scope.getGradeSubListByOfficeId(null,$scope.state.officeId,$scope.state.areaId);
	                 		 $(".zy_warningBox").show();
	                 		 $(".zy_warningBox .gy_con i").html("删除成功");
		                     $(".zy_addClassBox").hide()
		                     setTimeout(function () {
		                         $(".zy_warningBox").hide();
		                     }, 1000)
	                 	}
	                     angular.element(event.target).parent().addClass("wx_none");
	                 })
                 }
                 
             }
         }
         //点击叉号，关闭弹窗
     $scope.gbtc = function () {
             $(".zy_addClassBox").hide()
             $scope.delbanji = false;
         }
         //点击+号 添加班级
     $scope.tjbanji = function (event,subType,xuekelist) {
     	$scope.state.subType = subType;
     	$scope.state.tkstate  = false;
     	// 获取当前的状态 判断是操作 学校（true） 还是学段（false）
        if(!$scope.state.schoolshowstate) {
         angular.element(event.target).addClass("wx_none").siblings("span").removeClass("wx_none");
         $scope.baocun = function (event,type) {
         	 //获取年级ID
             $scope.gradeId = angular.element(event.target).parent().find("em").html();
             //获取班级名称
             $scope.className = angular.element(event.target).siblings("span.wx_ycsrk").children("input").val().replace(/^\s+|\s+$/g, '');
		        if ($scope.className == "") {
		             $(".wx_erro_tc").show();
		             $(".wx_erro_tc .gy_con span").html("请输入学科名称");
		             setTimeout(function () {
		                 $(".wx_erro_tc").hide();
		             }, 2000)
		         } else{
		             //通过后台接口添加班级
		             	for(var i=0;i<xuekelist.length;i++){
		             		if(xuekelist[i].name == $scope.className) {
		             			poploading(true,'sb','学科名称重复！',1000);
		             			return;
		             		}
				         }
		             	if($scope.state.stateFlag == 0) {
		             		$scope.state.stateFlag = 1;
		             		$http.post(requireIp + "/edu/eduSubject/saveEduSubject", {
			                 levelId: $scope.state.levelId
			                 , areaId:$scope.state.areaId
			                 , name: $scope.className
			                 , createBy:$scope.state.userId
			                 , type: type
			              //   ,createBy:userId
			                 }).success(function (res) {
			                     if (res.ret == '200') {
			                     	$scope.getSubList($scope.state.levelId,null,$scope.state.areaId);
			                         $(".zy_warningBox").show();
			                         $(".zy_warningBox .gy_con i").html(res.message);
			                         setTimeout(function () {
			                            // window.location.reload();
			                            $(".zy_warningBox").hide()
			                         }, 1500)
			                     }
			                     else {
			                         poploading(true,'sb',res.message,1000);
			                     }
			                     $scope.state.stateFlag = 0;
			                 }).error(function (res) {
			                     console.log(res)
			                 })
		             	}
		             	
		             
		        }
         }
	         $scope.fangqi = function (event) {
	         	 angular.element(event.target).siblings("span.wx_ycsrk").children("input").val('');
	             angular.element(event.target).addClass("wx_none").siblings("span").addClass("wx_none").siblings("span.add").removeClass("wx_none");
	         }
         } else {
         	// 1. 先弹框		xuekelist
         	//$scope.state.addClass=true;
         	// 2. 获取学科集合 与 查询 对比
         	var temMap = {};
	         for(var i=0;i<xuekelist.length;i++){
	         	temMap[xuekelist[i].id]=xuekelist[i].name
	         }
         	// 3.查询 学校所属的学段 的学科
         	var params = {officeId:$scope.state.officeId,type:$scope.state.subType,areaId:$scope.state.areaId}
	        xuekeService.getSubjectListByOfficeId(params,function(res){
				if(res.ret == 200 && res.data.length>0){
					$scope.state.addClass=true;		// 1. 先弹框		xuekelist
					var temList = res.data;
					for(var i=0;i<temList.length;i++){
						if(typeof(temMap[temList[i].id])!='undefined')
							temList[i].rept=1
					}
					$scope.classes = temList;
				}else{
					 poploading(true,'sb','暂无数据！',1000)
					$scope.classes = []
				}
			},function(res){
				
			})
         			

        }
     }
     
     
     //编辑学科
     $scope.bianjiroleclick=function(n,sort,subject){
     	if(!$scope.state.schoolshowstate) {
     		var levelId = isLevelIdByGradeSort(n);
     		 $scope.state.gradId = n;
	     	 $scope.state.tkstate  = true;
	         $scope.state.addClass=true;
	         var temMap = {};
	         for(var i=0;i<subject.length;i++){
	         	temMap[subject[i].id]=subject[i].name
	         }
	      	//设置 查询 年级学科 
	      	var params = {levelId:levelId,areaId:$scope.state.areaId}
	      		xuekeService.getSubjectList(params,function(res){
					if(res.ret == 200){
						var temList = res.data;
						for(var i=0;i<temList.length;i++){
							if(typeof(temMap[temList[i].id])!='undefined')
								temList[i].active=1
						}
						$scope.classes = temList;
						console.info($scope.classes);
					}else{
						$scope.classes = []
					}
				},function(res){
					
				})
     	}else {
     		 var officeId = $scope.state.officeId;
     		 $scope.state.gradId = n;
	     	 $scope.state.tkstate  = true;
	         $scope.state.addClass=true;
	         var temMap = {};
	         for(var i=0;i<subject.length;i++){
	         	temMap[subject[i].id]=subject[i].name
	         }
	      	//设置 查询 年级学科 
	      		var params = {officeId:officeId,areaId:$scope.state.areaId}
	      		xuekeService.getOfficeSubjectList(params,function(res){
					if(res.ret == 200){
						var temList = res.data;
						for(var i=0;i<temList.length;i++){
							if(typeof(temMap[temList[i].id])!='undefined')
								temList[i].active=1
						}
						$scope.classes = temList;
						console.info($scope.classes);
					}else{
						$scope.classes = []
					}
				},function(res){
					
				})
     	}
    }

    
    
    $scope.sureadd = function(target) {
    	var sidList = "";
	    	var subList = angular.element('.wx_addclassul').find('.active');
	    	for(var i=0;i<subList.length;i++){
	    		$scope.sid = subList[i].dataset.cid;
	    		sidList += $scope.sid + ',';
	    }
	    	
    	if($scope.state.tkstate){
			if(sidList != "") {
				if (!$scope.state.schoolshowstate) {
		    		var params = {levelId:$scope.state.levelId,gradId:$scope.state.gradId,sidList,areaId:$scope.state.areaId}
		    		xuekeService.saveLevelSubjectGrade(params,function(res){
						if(res.ret == 200){
							poploading(true,'cg','修改成功！',1000);
							$scope.state.addClass = false;
							$scope.getGradeBylevelId($scope.state.levelId,null,$scope.state.areaId);
						}
					},function(res){
						
					})
		    	} else{
		    		var params = {gradId:$scope.state.gradId,sidList}
		    		xuekeService.saveSubjectGrade(params,function(res){
						if(res.ret == 200){
							poploading(true,'cg','修改成功！',1000);
							$scope.state.addClass = false;
							$scope.getGradeSubListByOfficeId(null,$scope.state.officeId,$scope.state.areaId);
						}
					},function(res){
						
					})
		    	}
	    	}else {
		    		poploading(true,'sb','请选择学科！',1000)
		    }
			
    	} else{
    		console.info('学校添加学科！');
    		// 添加学科
    		if(sidList != '') {
    			 $http.post(requireIp + "/edu/eduSubject/saveOfficeSubject", {
                 officeId:$scope.state.officeId
                 , subIds: sidList
                 , type: $scope.state.subType
                 }).success(function (res) {
                     if (res.ret == '200') {
                     	$scope.getSubTypeListByOfficeId(null,$scope.state.officeId,$scope.state.areaId);
                     	$scope.state.addClass=false;
                         $(".zy_warningBox").show();
                         $(".zy_warningBox .gy_con i").html("添加成功");
                         setTimeout(function () {
                            // window.location.reload();
                            $(".zy_warningBox").hide()
                         }, 1500)
                     }
                     else {
                         $(".wx_erro_tc").show();
                         $(".wx_erro_tc .gy_con span").html(res.message);
                         setTimeout(function () {
                             $(".wx_erro_tc").hide();
                         }, 2000)
                     }
                 }).error(function (res) {
                     console.log(res)
                 })
    		}else {
    			poploading(true,'sb','请选择数据！',1000)
    		}
		 
			
    	}
    	
    }
    // 4.获取 设置学段和年级的 学科
    $scope.getGradeBylevelId =  function(levelId,officeId,areaId){
		var params = {levelId:levelId,officeId:officeId,areaId:areaId}
			xuekeService.getGradeListByLevel(params,function(res){
				if(res.ret == 200){
					$scope.schoolbranch = res.data
				}else{
					$scope.schoolbranch = []
				}
			},function(res){
		
			})
	}   
	
    
    
    /*
     * 2.  根据 学校 查询 学科
     */
    
    // 1.通过学校的ID 获取 学科分类集合
	$scope.getSubTypeListByOfficeId = function(levelId,officeId,areaId) {
		var params = {levelId:levelId,officeId:officeId,areaId:areaId}
		xuekeService.getSubTypeListByOfficeId(params,function(res){
			if(res.ret == 200){
				$scope.xuekelists = res.data
			}else{
				$scope.xuekelists = []
			}
		},function(res){
		
		})
	}
	
	
	// 2.通过学校的ID 获取 年级学科集合
	$scope.getGradeSubListByOfficeId = function(levelId,officeId,areaId) {
		var params = {levelId:levelId,officeId:officeId,areaId:$scope.state.areaId}
		xuekeService.getGradeSubListByOfficeId(params,function(res){
			if(res.ret == 200){
				$scope.schoolbranch = res.data
			}else{
				$scope.schoolbranch = []
			}
		},function(res){
		
		})
	}
	
	//3. 通过学校 获取 学段
/*	$scope.findLevelByOfficeId = function(officeId) {
		xuekeService.findLevelByOfficeId(officeId,function(res){
			if(res.ret == 200){
				$scope.state.levelId = res.data.lid
			}
		})
	}*/
	// 4.弹框的方法
	$scope.pop = {
		loadingstate:false,
		imgurl:'./img/wonde_big.png',
		text:''
	};
	function poploading(state,imgurl,txt,timeout){
		$scope.pop.loadingstate = state;
		var time = timeout || 20000;
		if(imgurl == 'cg'){
			var imageurl = './img/chenggong.png';
		}else{
			var imageurl = './img/wonde_big.png';
		};
		$scope.pop.imgurl = imageurl;
		$scope.pop.text = txt;
		$timeout(function(){
			$scope.pop.loadingstate = false;
		},time)
	};
	// 5.判断年级段对应的 学段
	function isLevelIdByGradeSort(sort) {
		var level = '';
		sort = parseInt(sort)
		switch(sort) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
				level = 'level_1'
				break;
			case 7:
			case 8:
			case 9:
				level = 'level_2'
				break;
			case 10:
			case 11:
			case 12:
				level = 'level_3'
				break;
        }
		return level;
	}
	
	if($scope.state.userType == 4){
		$scope.state.officeId = $scope.state.oid;
		//$scope.findLevelByOfficeId($scope.state.officeId);
		//$scope.getGradeSubListByOfficeId($scope.state.officeId);
		$scope.showschoolaction();
		$scope.searchSchool();
	}else{
		//  初始化 调用 学科 年级学科
	    $scope.getSubList($scope.state.levelId,null,$scope.state.areaId);
	    $scope.getGradeBylevelId($scope.state.levelId,null,$scope.state.areaId);
	}
}])
