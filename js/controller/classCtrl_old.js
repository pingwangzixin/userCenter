 app.controller('classCtrl', ['$scope', '$http', function ($scope, $http) {
     $scope.subBox = false;
     $scope.addClass=false;
     $scope.gradeId="";
     var ajaxFlag = 0;
     //ajax获取学校信息 查出年级和班级
     var schoolId = {
         officeId: JSON.parse(sessionStorage.getItem('userObj')).oid
     }
     
     //班级列表，默认50个
     /*$scope.classes=[
         {"id":"1","name":"1班"},{"id":"2","name":"2班"},{"id":"3","name":"3班","rept":"1"},{"id":"4","name":"4班","rept":"1"},{"id":"5","name":"5班"},{"id":"6","name":"6班"},{"id":"7","name":"7班"},{"id":"8","name":"8班"},{"id":"9","name":"9班","rept":"1"},{"id":"10","name":"10班"},{"id":"11","name":"11班"},{"id":"12","name":"12班"},{"id":"13","name":"13班"},{"id":"14","name":"14班"},{"id":"15","name":"15班"},{"id":"16","name":"16班"},{"id":"17","name":"17班","rept":"1"},{"id":"18","name":"18班"},{"id":"19","name":"19班"},{"id":"20","name":"20班"},{"id":"21","name":"21班"},{"id":"22","name":"22班"},{"id":"23","name":"23班"},{"id":"24","name":"24班"},{"id":"25","name":"25班"},{"id":"26","name":"26班"},{"id":"27","name":"27班"},{"id":"28","name":"28班"},{"id":"29","name":"29班"},{"id":"30","name":"30班"},{"id":"31","name":"31班"},{"id":"32","name":"32班"},{"id":"33","name":"33班"},{"id":"34","name":"34班"},{"id":"35","name":"35班"},{"id":"36","name":"36班"},{"id":"37","name":"37班"},{"id":"38","name":"38班"},{"id":"39","name":"39班"},{"id":"40","name":"40班"},{"id":"41","name":"41班"},{"id":"42","name":"42班"},{"id":"43","name":"43班"},{"id":"44","name":"44班"},{"id":"45","name":"45班"},{"id":"46","name":"46班"},{"id":"47","name":"47班"},{"id":"48","name":"48班"},{"id":"49","name":"49班"},{"id":"50","name":"50班"},
     ]*/
     
     $http.post(requireIp + '/ea/eaClass/findClassAndGradeByOfficeId', schoolId).success(function (res) {
             $scope.xuexiao = res;
     })
         //鼠标移入班级出现叉号
     $scope.banjiguanli = function (n) {
             $scope.delbanji = n;
         }
         //点击编辑班级名称
     $scope.bianjiname = function (event) {
             //原来的班级名称
             $scope.oldbjmc = angular.element(event.target).html();
             angular.element(event.target).html('<input type="text" value="' + $scope.oldbjmc + '" />')
                 //失去焦点的时候获取新的名称
             angular.element(event.target).children().blur(function () {
                 //获取新的班级名称
                 $scope.newbjmc = angular.element(event.target).children().val();
                 //获取班级ID
                 $scope.bjid = angular.element(event.target).siblings("p").html()
                 $http.post(requireIp + '/ea/eaClass/updateClassInGrade', {
                     classId: $scope.bjid
                     , className: $scope.newbjmc
                 }).success(function (res) {
                     $(".zy_warningBox").show();
                     $(".zy_warningBox .gy_con i").html("修改成功")
                     setTimeout(function () {
                         $(".zy_warningBox").hide()
                     }, 1000)
                 })
             })
         }
         //点击叉号出现弹窗
     $scope.deltc = function (event) {
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
                 console.log($scope.delbjid)
                 $http.post(requireIp + '/ea/eaClass/delClassById', {
                     id: $scope.delbjid
                 }).success(function (res) {
                 	if(res.ret == 200){
                 		$(".zy_warningBox").show();
	                     $(".zy_addClassBox").hide()
	                     $(".zy_warningBox .gy_con i").html("删除成功")
	                     setTimeout(function () {
	                         $(".zy_warningBox").hide();
	                     }, 1000)
	                     angular.element(event.target).parent().addClass("wx_none");
                 	}else{
                 		$(".zy_warningBox").show();
	                     $(".zy_addClassBox").hide()
	                     $(".zy_warningBox .gy_con i").html(res.message)
	                     setTimeout(function () {
	                         $(".zy_warningBox").hide();
	                     }, 3000)
	                     //angular.element(event.target).parent().addClass("wx_none");
                 	}
                     
                 })
             }
         }
         //点击叉号，关闭弹窗
     $scope.gbtc = function () {
             $(".zy_addClassBox").hide()
             $scope.delbanji = false;
         }
         //点击+号 添加班级
     $scope.tjbanji = function (n) {
         $scope.addClass=true;
         $scope.gradeId = n;
         $http.post(requireIp + '/ea/eaClass/findClassInfoByGid', {
             gradeId: n
         }).success(function (res) {
             var arrayObj = new Array();
             for(var i = 1;i<=50;i++){
                 var rept = "";
                 angular.forEach(res.data, function(data){
                    if(data.name == i){
                        rept = "1";
                    }
                 });
                 var obj = {
                     "id":i,
                     "name":i + "班",
                     "rept":rept
                 };
                 arrayObj.push(obj);
             }
             $scope.classes=arrayObj;
         })
     }

     $scope.sureadd = function () {
     	if(ajaxFlag == 1){
     		return;
     	}
     	ajaxFlag =1;
         var dom = $(".wx_addclassul .active");
         var className = "";
         $(".wx_addclassul .active").each(function(){
             className += $(this).data("cid") + ",";
         });
         //判断是否勾选班级
         if(className == ""){
             $(".wx_erro_tc").show();
             $(".wx_erro_tc .gy_con span").html("您没有勾选班级！");
             setTimeout(function () {
                 $(".wx_erro_tc").hide();
             }, 2000)
             return;
         }
         className = className.substring(0,className.length-1);
		 var userId = window.sessionStorage.getItem("userId");
         $http.post(requireIp + '/ea/eaClass/insertClassInGrade', {
             gradeId: $scope.gradeId,
             className:className,
			 userId:userId
         }).success(function (res) {
         	ajaxFlag = 0;
             $scope.addClass=false;
             if(res.ret == 200){
                 $(".zy_warningBox").show();
                 $(".zy_warningBox .gy_con i").html("添加成功")
                 setTimeout(function () {
                     $(".zy_warningBox").hide();
                     $(".zy_warningBox .gy_con i").html("删除成功")
                 }, 1000)
             }else{
                 $(".wx_erro_tc").show();
                 $(".wx_erro_tc .gy_con span").html(res.message);
                 setTimeout(function () {
                     $(".wx_erro_tc").hide();
                 }, 2000)
             }
             $http.post(requireIp + '/ea/eaClass/findClassAndGradeByOfficeId', schoolId).success(function (res) {
                 $scope.xuexiao = res;
             })
         })

     }
     
    }])