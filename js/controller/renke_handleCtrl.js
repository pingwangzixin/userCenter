app.controller('renke_handleCtrl',['$scope','$timeout','loginService','$http',function($scope,$timeout,loginService,$http) {
	$scope.state = {
		teacherList:[
		],
		teacherListId:'',
		teacherListLength:0,
		teacherAlert:false,
        teacherAlert1:false,
		importAlert:false,
		fileshow:false,
		filename:'',
		filesize:'',
		filetype:'',
		allteatype:false,
		subjteatype:false,
		gid:'',
		cid:'',
		sid:'',
		rid:'',
		modelDown:requireIp,
		teaIdStr:''
	};
	$scope.state.teacherListLength = new Array(Math.ceil($scope.state.teacherList.length/8));
    $scope.changeteachList = function(itemid,e){
		var className = $(e.target).attr("class");
		$(".tealist_main td").removeClass("active");
        $(e.target).addClass("active");
        if(className.indexOf("active") >= 0){
            $(e.target).removeClass("active");
		}else{
            $(e.target).addClass("active");
		}
    }
	$scope.changeteachList1 = function(itemid,e){
        var className = $(e.target).attr("class");
		console.log(className)
        if(className.indexOf("active") >= 0){
            $(e.target).removeClass("active");
		}else{
            $(e.target).addClass("active");
		}
	}
	var oLabel = document.getElementById("renkeLabel");
	oLabel.addEventListener('dragenter',function(e){
		e.stopPropagation();
		e.preventDefault();
	},false);
	oLabel.addEventListener("dragleave", function(e) {
		e.stopPropagation();
		e.preventDefault();
		this.style.borderColor="#d9d9d9";
	}, false);
	oLabel.addEventListener("dragover", function(e) {
		e.stopPropagation();
		e.preventDefault();
		this.style.borderColor="#f97046";
	}, false);
	oLabel.addEventListener("drop", function(e) {
		e.stopPropagation();
		e.preventDefault();
		$scope.fileAction(e.dataTransfer)
	}, false);
	$scope.fileAction = function(event){
		var files = event.files[0];
		$scope.$apply(function(){
			$scope.state.fileshow = true;
			$scope.state.filename = files.name;
			$scope.state.filesize = (files.size / 1024).toFixed(2) +'KB';
			$scope.state.filetype = files.type || '文件夹';
		})
	};
	$scope.closeimport = function(){
		$scope.state.importAlert = false;
		document.querySelector("#importrenke").value = '';
	};
	$scope.importshow = function(){
		$scope.state.fileshow = false;
		$scope.state.importAlert = true;
	};
	$scope.showTealist = function(subject,rid,cid,event){
		$scope.state.teacherAlert = true;
		if(cid !== ''){
			$scope.state.cid = $scope.page.eaClassList[cid].id;
		}
		if(event !== ''){
			$scope.state.sid = $(event.target).data("sid");
		}
		var teaIdStr = "";
        if(event !== ''){
            teaIdStr = $(event.target).data("teaid");
        }
        console.log(teaIdStr)
        $scope.state.teaIdStr = teaIdStr;
		$scope.state.rid = rid;
		var oid = JSON.parse(sessionStorage.getItem('userObj')).oid;
		var id = "";
		if(typeof(subject)!="undefined"&&subject != ''){
			id = subject.id;
			$scope.subject = subject;
			$scope.state.subjteatype = false;
			$scope.state.allteatype = true;
		}else{
			$scope.subject = {name:"全校"};
			$scope.state.subjteatype = false;
			$scope.state.allteatype = false;
		}
		$http.get(requireIp + '/uc/ucUser/findTeaListBySidAndOid?sortType=2&officeId='+oid +"&subjectId="+id).success(function (res) {

					var arr = teaIdStr.split(",");
            var arrayObjResult = new Array();
            var i = 0;
            var arrayObj = new Array();
            angular.forEach(res.data, function(data){
            	
                var flag = 0;
                angular.forEach(arr, function(e){
                    if(e==data.id){
                        flag = 1;
                    }
                });
                var active = 0;
                if(flag == 0){
                    active = 0;
                }else{
                    active = 1;
                }
                var obj = {
                    "id":data.id,
                    "realname":data.realname,
                    "active":active
                };
                arrayObj.push(obj);
                if(i==7){
                	arrayObjResult.push(arrayObj);
                	arrayObj = new Array();
                	i=0;
                }else{
                	i++;	
                }
                
            });
            if(i!=0){
            	arrayObjResult.push(arrayObj);
            }
            $scope.state.teacherList = arrayObjResult;
            console.log(arrayObjResult);
		             $scope.state.teacherListLength = new Array(Math.ceil($scope.state.teacherList.length/8));
    	});
	};


    $scope.showTealist1 = function(subject,rid,cid,event){
        $scope.state.teacherAlert1 = true;
        if(cid !== ''){
            $scope.state.cid = $scope.page.eaClassList[cid].id;
        }
        if(event !== ''){
            $scope.state.sid = $(event.target).data("sid");
        }
        var teaIdStr = "";
        if(event !== ''){
            teaIdStr = $(event.target).data("teaid");
        }
        $scope.state.teaIdStr = teaIdStr;
        $scope.state.rid = rid;
        var oid = JSON.parse(sessionStorage.getItem('userObj')).oid;
        var id = "";
        if(typeof(subject)!="undefined"&&subject != ''){
            id = subject.id;
            $scope.subject = subject;
            $scope.state.subjteatype = false;
            $scope.state.allteatype = true;
        }else{
        	$scope.subject = {name:"全校"};
            $scope.state.subjteatype = false;
            $scope.state.allteatype = false;
        }
        $http.get(requireIp + '/uc/ucUser/findTeaListBySidAndOid?sortType=2&officeId='+oid +"&subjectId="+id).success(function (res) {

            var arr = teaIdStr.split(",");
            var arrayObjResult = new Array();
            var i = 0;
            var arrayObj = new Array();

            angular.forEach(res.data, function(data){
            	
                var flag = 0;
                angular.forEach(arr, function(e){
                    if(e==data.id){
                        flag = 1;
                    }
                });

                var active = 0;
                if(flag == 0){
                    active = 0;
                }else{
                    active = 1;
                }
                var obj = {
                    "id":data.id,
                    "realname":data.realname,
                    "active":active
                };

                arrayObj.push(obj);
                if(i==7){
                	arrayObjResult.push(arrayObj);
                	arrayObj = new Array();
                	i=0;
                }else{
                	i++;	
                }
                
            });
            if(i!=0){
            	arrayObjResult.push(arrayObj);
            }
            $scope.state.teacherList = arrayObjResult;

		             $scope.state.teacherListLength = new Array(Math.ceil($scope.state.teacherList.length/8));
        });
    };
	
	$scope.getTeaData = function(subjectId){
		var oid = JSON.parse(sessionStorage.getItem('userObj')).oid;
		var id = "";
		if(subjectId != ''){
			id = subjectId;
			$scope.state.allteatype = true;
			$scope.state.subjteatype = false;
		}else{
			$scope.state.allteatype = false;
			$scope.state.subjteatype = true;
		}
		console.log($scope.state.teaIdStr)
		$http.get(requireIp + '/uc/ucUser/findTeaListBySidAndOid?sortType=2&officeId='+oid +"&subjectId="+id).success(function (res) {
		             var arr = $scope.state.teaIdStr.split(",");
			console.log(arr)
            var arrayObjResult = new Array();
            var i = 0;
            var arrayObj = new Array();
            angular.forEach(res.data, function(data){
            	
                var flag = 0;
                angular.forEach(arr, function(e){
                    if(e==data.id){
                        flag = 1;
                    }
                });
                var active = 0;
                if(flag == 0){
                    active = 0;
                }else{
                    active = 1;
                }
                var obj = {
                    "id":data.id,
                    "realname":data.realname,
                    "active":active
                };
                arrayObj.push(obj);
                if(i==7){
                	arrayObjResult.push(arrayObj);
                	arrayObj = new Array();
                	i=0;
                }else{
                	i++;	
                }
                
            });
            if(i!=0){
            	arrayObjResult.push(arrayObj);
            }
            $scope.state.teacherList = arrayObjResult;
            console.log(arrayObjResult);
		             $scope.state.teacherListLength = new Array(Math.ceil($scope.state.teacherList.length/8));
    	});
	}
	
	$scope.closeTea = function(){
		$scope.state.teacherAlert = false;
        $scope.state.teacherAlert1 = false;
		$(".tealist_main td").removeClass("active");
		$scope.state.teacherListId = "";
	}
	//获取学校id
	var schoolId = {
         officeId: JSON.parse(sessionStorage.getItem('userObj')).oid
     }
	
	
	
	//获取页面数据
	$http.post(requireIp + '/ea/eaGrade/findGradeInfoByOid', schoolId).success(function (res) {
             $scope.nianjiList = res;
             getPageData(res.data[0].id);
     })
	
	
	
	
	$scope.switchGrade = function($event,index){
		$($event.target).siblings().removeClass("active");
	 	$($event.target).addClass("active");
	 	var grade = $scope.nianjiList.data[index];
	 	
	 	//获取页面数据
		getPageData(grade.id);
	}
	
	
	function getPageData(gid){
		$scope.state.gid = gid;
		$http.get(requireIp + '/ea/eaUserCourse?gid='+gid).success(function (res) {
	             $scope.page = res.data;
	             
	             /*table表格超出有滚动条*/
	             setTimeout(function(){
					function tableScoll(config){
						var boxW=$(config.boxName).width();
						var lengths=$(config.lengthsNmae).length;
						var boxNmae_table=$(config.boxNmae_table);
						if(lengths>config.num && boxW>config.scw){
							lengths-=config.num;
							boxNmae_table.css({"width":config.min_w+lengths*config.tdW});
						}
					}
					tableScoll({
						"boxName":".renke_taber",//外盒子宽度
						"lengthsNmae":".renke_taber table tbody tr th",//具体的需要增加的数据
						"boxNmae_table":".renke_taber table",//当前table表
						"num":0,//设定不能超过的个数
						"scw":1100,//设定不能超过的宽度
						"min_w":600,//表格最小宽度
						"tdW":100//超过部分每一个表格的宽度
					});
				},50)
	             
	    });
	}
	
	var ajaxFlag = 0;
	
	// 1 年级组长   2 班主任    3任课教师
	$scope.addCourse = function(num){
		if(ajaxFlag == 1){
			return;
		}
		var teaStr = "";
        $(".teacherList"+num+" .active").each(function(){
			console.log($(this).data("tid"))
            teaStr += $(this).data("tid") + ",";
        });
        console.log(teaStr)
		ajaxFlag = 1;
		var oid = JSON.parse(sessionStorage.getItem('userObj')).oid;
		var rid = $scope.state.rid;
		var gid = $scope.state.gid;
		var cid = "";
		var sid = "";
		var state = "0";
		var userId = window.sessionStorage.getItem("userId");
		if(rid==1||rid==14){
			cid = $scope.state.cid;
		}
		if(rid==14){
			state = "1";
			sid = $scope.state.sid;
		}
		var data = {
		  "uid": teaStr,
		  "rid": rid,
		  "oid": oid,
		  "gid": $scope.state.gid,
		  "cid": cid,
		  "sid": sid,
		  "vid": "",
		  "tid": "",
		  "state": state,
		  "createBy":userId,
		  "updateBy":userId
		}
		 
		console.log(data)
		$.ajax({
		   type: "POST",
		   url: requireIp + '/ea/eaUserCourse',
		   data: JSON.stringify(data),
		   processData:false,  
		   dataType: "json",
		   headers:{  
                        Accept:"application/json",  
                        "Content-Type":"application/json"  
                   },
		   success: function(msg){
		   	ajaxFlag = 0;
		   	if(msg.ret == 400){
		   		$(".wx_erro_tc .gy_con span").html(msg.message)
	   			$(".wx_erro_tc").show();
		   		setTimeout(function () {
	                 $(".wx_erro_tc").hide()
	             }, 3000)
		   	}
			
			if(msg.ret == 500){
		   		$(".wx_erro_tc .gy_con span").html(msg.message)
	   			$(".wx_erro_tc").show();
		   		setTimeout(function () {
	                 $(".wx_erro_tc").hide()
	             }, 3000)
		   	}
	   		
		   	getPageData(gid);
		   	$scope.state.teacherAlert = false;
		    $scope.state.teacherAlert1 = false;
			$(".tealist_main td").removeClass("active");
			$scope.state.teacherListId = "";
		   }
		});
		
	}
	
	
	
	$scope.uplaodfile = function(subjectId){
		var formData = new FormData();
		var oid = JSON.parse(sessionStorage.getItem('userObj')).oid;
		formData.append("filename",$("#importrenke")[0].files[0]);
		formData.append("versionId","1");
		formData.append("oid",oid);
		$.ajax({ 
		url : requireIp+"/ea/eaUserCourse/uploadDoc", 
		type : 'POST', 
		data : formData, 
		// 告诉jQuery不要去处理发送的数据
		processData : false, 
		// 告诉jQuery不要去设置Content-Type请求头
		contentType : false,
		beforeSend:function(){
		console.log("正在进行，请稍候");
		},
		success : function(responseStr) { 
			
			if(responseStr.ret==200){
				getPageData($scope.state.gid);
				console.log("成功"+responseStr.message);
				$scope.state.importAlert = false;
				$(".zy_warningBox").show();
	             $(".zy_warningBox .gy_con i").html("导入成功")
	             setTimeout(function () {
	                 $(".zy_warningBox").hide()
	             }, 1000)
			}else{
				
				$(".wx_erro_tc").show();
	            if(responseStr.hasOwnProperty("data")){
	            	 $(".wx_erro_tc .gy_con span").html("导入失败"+responseStr.data[0])
	            }else{
	            	 $(".wx_erro_tc .gy_con span").html("导入失败")
	            }
	             setTimeout(function () {
	                 $(".wx_erro_tc").hide()
	             }, 3000)
				console.log("失败"+responseStr.message+"==="+responseStr.data[0]);
			}
		}, 
		error : function(responseStr) { 
			console.log("error");
		} 
		});
		document.querySelector("#importrenke").value = '';
		$scope.state.fileshow = false;
		$scope.state.importAlert = true;
	}
	
}])
