app.controller('teacherCenCtr',['$scope','$state','$rootScope','$location','$http',function($scope,$state,$rootScope,$location,$http){
	/*$scope.toGo = function (state){
		// $rootScope.indexState = false;
        
   	};*/
// 	console.log($location)
	
	sessionStorage.setItem("tableChange", 0) //每次把选项卡置为0即第一页
	sessionStorage.setItem("tableChangeP", 0) //每次把选项卡置为0即第一页

	console.log($location.search())
   	
   	if($location.search().username){
   		var username = $location.search().username;	
   		sessionStorage.setItem('userName',username);
		$http.get(requireIp + '/uc/ucUser/getUserInfo?username=' + username).success(function(res){
			if(res.ret==200){
				sessionStorage.setItem('userId',res.data.userId);
				sessionStorage.setItem('userType',res.data.userType);
				sessionStorage.setItem('scope',res.data.scope);
				sessionStorage.setItem('userAreaId',res.data.userAreaId);
				sessionStorage.setItem('areaId',res.data.cityId);	//市级ID改由用户中获取
				var userObj = {
					userStatus:res.data.userStatus,
					oid:res.data.oid,
					teachStatus:res.data.teachStatus
				}
				userObj = JSON.stringify(userObj)
				sessionStorage.setItem('userObj',userObj);
				//定义菜单权限
			   	$scope.menu = {};
			   	$scope.user = {};
			   	//在sessio中取值
			 	$scope.user.id = sessionStorage.getItem('userId') ;
			   	$scope.user.userType = sessionStorage.getItem('userType') ;
			   	var userSubObj = JSON.parse(sessionStorage.getItem('userObj')) || new Object();
			   	//一进页面通过uid获取菜单权限
			   	$http.post(requireIp+"/uc/ucMenu/getMenuByUid",{uid:$scope.user.id}).success(function(data) {
			   		$scope.menu = data;
			   		switch(dataStatus){
			   			case 5:
			   				userSubObj.teachStatus = 1;
							userSubObj = JSON.stringify(userSubObj);
							sessionStorage.setItem('userObj',userSubObj);
			   			break;
			   			case 3:
			   				userSubObj.teachStatus = 14;
							userSubObj = JSON.stringify(userSubObj);
							sessionStorage.setItem('userObj',userSubObj);
			   			break;
			   			default:
			   				userSubObj.teachStatus = 15;
							userSubObj = JSON.stringify(userSubObj);
							sessionStorage.setItem('userObj',userSubObj);
			   			break;
			   		}
			   		
					
			   		console.log($scope.menu);
				});
			}else{
				sessionStorage.removeItem('userId')
				sessionStorage.removeItem('userObj')
				sessionStorage.removeItem('userType')
				$state.go('page_missing')
			}
			
   		})
   	}else{
// 		alert()
// 		$state.go('page_missing')
// 		sessionStorage.removeItem('userId')
//		sessionStorage.removeItem('userObj')
//		sessionStorage.removeItem('userType')
// 		$state.go('login_index.sub_index')
   	}
   	
}]);


//自定义截取图片的过滤器
app.filter('filterMenesrc',function(){
    return function(str){
        return str.substring(str.indexOf('icon-')+5);
    }
})


//自定义指令
/*app.directive('menuPublic', function () {
        return {
            restrict: 'ECAM',
//          controller: function ($scope) {
//              $scope.books = [
//                  {
//                      name: 'php'
//                  },
//                  {
//                      name: 'javascript'
//                  },
//                  {
//                      name: 'java'
//                  }
//              ];
//              $scope.addBook = function(){
//
//              }
//              this.addBook = function(){
//                  // ...
//              }
//          },
//          controllerAs:'bookListController',
            template: '<ul class="zy_perList clearfix"><li class="fl" ui-sref="teacher_index.teacher_personal({tableChange:0})" ng-repeat="menu in menu.data.publicMenuList" ng-click="toGo(0)"><img src="img/{{menu.icon|filterMenesrc}}.png"/>{{menu.name}}</li></ul>',
            replace:true,
            link:function(scope,iEelement,iAttrs,bookListController){
                //iEelement.on('click',bookListController.addBook)
            }
        }

})

//自定义指令
.directive('menuPerson', function () {
        return {
            restrict: 'ECAM',
            template: '<ul class="zy_perList clearfix"><li class="fl" ng-repeat="menu in menu.data.persionMenuList"><img src="img/{{menu.icon|filterMenesrc}}.png"/>{{menu.name}}</li></ul>',
            replace:true,
        }
})*/
