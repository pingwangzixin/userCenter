app.controller('pageMissingCtrl', ['$scope', '$http', function ($scope, $http) {
	//狮子返回首页
	$scope.goBack = function (){
		console.log(123456)
		window.parent.location.href = homeAddress;
	};
		
    
}])