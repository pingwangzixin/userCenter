app.controller('activateCtrl',['$scope','$timeout','$stateParams','$filter','loginService','$http','$state',function($scope,$timeout,$stateParams,$filter,loginService,$http,$state) {
	//切换选项卡
	$scope.switch = $stateParams.tableChange;
	$scope.tab = function(n) {
		$scope.switch = n
	}
	
}]);
