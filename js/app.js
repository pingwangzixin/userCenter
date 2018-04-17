 var app = angular.module('app',['ui.router','oc.lazyLoad','ngImgCrop','ui.tree']);  

 app.run(['$rootScope','$location','$state',function($rootScope,$location,$state) {
	$rootScope.$on('$locationChangeSuccess',function(a,b,fromState) {
        // if(fromState.substr(fromState.indexOf('#')+1) == '/teacher_index/student_handle'|| fromState.substr(fromState.indexOf('#')+1)=='/teacher_index/parents_handle'){
        //     sessionStorage.removeItem('tableChange')
        // }
        window.scrollTo(0,0);
	});
	
	//返回首页
	$rootScope.comeBackBtn = homeAddress;
	
	//返回按钮
	$rootScope.goBack = function(){
		$state.go('teacher_index.teacher_center',{username:sessionStorage.getItem('userName')});
	}
 }]);
app.config(["$provide", "$compileProvider", "$controllerProvider", "$filterProvider","$httpProvider","$locationProvider",
    function ($provide, $compileProvider, $controllerProvider, $filterProvider,$httpProvider,$locationProvider) {
        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
//转化post请求传参-------------------------------------------------
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
	  	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
	  	$httpProvider.defaults.transformRequest = [function(data) {
    	var param = function(obj) {
      	var query = '';
		var name, value, fullSubName, subName, subValue, innerObj, i;
		for(name in obj) {
			value = obj[name];
			if(value instanceof Array) {
				for(i = 0; i < value.length; ++i) {
					subValue = value[i];
					fullSubName = name + '[' + i + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if(value instanceof Object) {
				for(subName in value) {
					subValue = value[subName];
					fullSubName = name + '[' + subName + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if(value !== undefined && value !== null) {
				query += encodeURIComponent(name) + '=' +
					encodeURIComponent(value) + '&';
			}
		}
		return query.length ? query.substr(0, query.length - 1) : query;
		};
	    return angular.isObject(data) && String(data) !== '[object File]'
	        ? param(data)
	        : data;
	  	}];
   //转化post请求传参------------------------------------------------------
}]);
 
 app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
//  $urlRouterProvider.otherwise('/login_index/login_sub_index');
    $urlRouterProvider.otherwise('/teacher_index/teacher_center');
    $stateProvider
    .state('login_index',{//跳转到云空间首页
        url: "/login_index",
        templateUrl : 'tpl/login_index.html',
        controller:"indexCtrl",
        resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/indexCtrl.js");
            }]
        }
    })
    .state('login_index.sub_index',{//首页的内嵌二级页面
    	url:'/login_sub_index',
    	templateUrl : 'tpl/login/login_sub_index.html',
    	controller:"loginIndexCtrl",
        resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/user_login.js");
            }]
        }
    })
    .state('login_index.resource_index',{//首页的资源页面
    	url:'/login_resource_index',
    	templateUrl:'tpl/login/login_resource_index.html'
    })
    .state('register_page',{//纯注册页面
    	url:'/register_page',
        params:{
            'tableChange':0
        },
    	templateUrl:'tpl/login/register_page.html',
    	cache:true,
  		controller:'registerIndexCtrl',
        resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/user_register.js");
            }]
        }
    })
    .state('login_page',{//纯登陆页面
        url: "/login_page",
        templateUrl : 'tpl/login/login_page.html',
        controller:'loginIndexCtrl',
        resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/user_login.js");
            }]
        }
    })
    .state('teacher_index',{//教师用户中心首页
    	url:'/teacher_index',
    	templateUrl:'tpl/userCenter/teacher_index.html',
    })
    .state('teacher_index.teacher_center',{//教师用户中心的一级页面
    	url:'/teacher_center',
    	params : {'username' : ''},
    	templateUrl:'tpl/userCenter/teacher_center.html',
		controller:'teacherCenCtr',
		resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/teacher_index.js");
            }]
        }
    })
    .state('teacher_index.teacher_personal',{//教师用户中心的个人信息页
    	url:'/teacher_personal',
        params:{
            'tableChange':0,
            'teachId':null
        },
    	templateUrl:'tpl/userCenter/teacher_personal.html',
    	controller:'teacherCtrinF',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/teacher_center.js");
            }]
        }
    })
    .state('teacher_index.parent_center',{//家长用户中心的个人信息页
    	url:'/parent_center',
        params:{
            'tableChange':0
        },
    	templateUrl:'tpl/userCenter/parent_center.html',
    	controller:'parentCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/parentCtrl.js");
            }]
        }
    })
    .state('teacher_index.teach_lessons',{//教师授课管理页面
    	url:'/teach_lessons',
    	templateUrl:'tpl/userCenter/teach_lessons.html',
    	controller:'lessonCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/lessonCtrl.js");
            }]
        }
    })
    .state('teacher_index.teach_handle',{//教师管理页面
    	url:'/teach_handle',
        params:{
            'tableChange':0
        },
    	templateUrl:'tpl/userCenter/teach_handle.html',
    	controller:'teachHandleCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/teachHandleCtrl.js");
            }]
        }
    })
     .state('teacher_index.student_personal',{//学生个人中心页面
    	url:'/student_personal',
        params:{
            'tableChange':0
        },
    	templateUrl:'tpl/userCenter/student_personal.html',
    	controller:'studentCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/studentCtrl.js");
            }]
        }
    })
     .state('teacher_index.student_handle',{//学生管理页面
    	url:'/student_handle',
    	params:{
            'tableChange':0
        },
    	templateUrl:'tpl/userCenter/student_handle.html',
    	controller:'studentHandleCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/studentHandleCtrl.js");
            }]
        }
    })
    .state('teacher_index.parents_handle',{//家长管理页面
    	url:'/parents_handle',
    	params:{
            'tableChange':0
        },
    	templateUrl:'tpl/userCenter/parents_handle.html',
    	controller:'parentsHandleCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/parentsHandleCtrl.js");
            }]
        }
    })
    .state('teacher_index.manager_updataParent',{//家长信息修改 管理者
    	url:'/manager_updataParent',
        params:{
            'parentsCard':null
        },
    	templateUrl:'tpl/userCenter/manager_updataparent.html',
    	controller:'mUpdataParentCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/mUpdataParentCtrl.js");
            }]
        }
    })
    .state('teacher_index.manager_updataStudent',{//学生信息修改 管理者
    	url:'/manager_updataStudent',
        params:{
            'studentCard':null
        },
    	templateUrl:'tpl/userCenter/manager_updatastudent.html',
    	controller:'mUpdataStudentCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/mUpdataStudentCtrl.js");
            }]
        }
    })
    .state('teacher_index.teacher_updataStudent',{//学生信息修改 班主任
    	url:'/teacher_updataStudent',
        params:{
            'studentCard':null
        },
    	templateUrl:'tpl/userCenter/teacher_updatastudent.html',
    	controller:'tUpdataStudentCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/tUpdataStudentCtrl.js");
            }]
        }
    })
    .state('teacher_index.manager_school',{//学校信息修改
    	url:'/manager_school',
    	templateUrl:'tpl/userCenter/manager_school.html',
    	controller:'managerSchoolCtr',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/manager_admin.js");
            }]
        }
    })
    .state('teacher_index.manager_class',{//班级管理
    	url:'/manager_class',
    	templateUrl:'tpl/userCenter/manager_class.html',
    	controller:'classCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/classCtrl.js");
            }]
        }
    })
    .state('teacher_index.find_password',{//找回密码
    	url:'/password_zhaohui',
    	templateUrl:'tpl/userCenter/password_zhaohui.html',
    	params:{
            'status':0
        },
    	controller:'findPassword',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/findPassword.js");
            }]
        }
    })
    .state('teacher_index.reset_password',{//找回密码重置
    	url:'/reset_password',
    	templateUrl:'tpl/userCenter/reset_password.html',
    	controller:'resetPassword',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/resetPassword.js");
            }]
        }
    })
    .state('teacher_index.password_success',{//修改密码成功
    	url:'/password_success',
    	templateUrl:'tpl/userCenter/password_success.html',
    	controller:'resetPasswordSucc'
    })
    .state('teacher_index.renke_handle',{//任课
    	url:'/renke_handle',
    	templateUrl:'tpl/newadd/renke_handle.html',
    	controller:'renke_handleCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/renke_handleCtrl.js");
            }]
        }
    })
    .state('teacher_index.jiaocai_handle',{//教材
    	url:'/jiaocai_handle',
    	templateUrl:'tpl/newadd/jiaocai_handle.html',
    	controller:'jiaocai_handleCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/jiaocai_handleCtrl.js");
            }]
        }
    })
    .state('teacher_index.xueke',{//学科
    	url:'/xueke',
    	templateUrl:'tpl/newadd/xueke.html',
    	controller:'xuekeCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/xuekeCtrl.js");
            }]
        }
    })
    .state('teacher_index.jigou',{//机构管理
    	url:'/jigou',
    	templateUrl:'tpl/newadd/jigou_handle.html',
    	params:{
            'tableChange':0
        },
    	controller:'jigouHandleCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/jigouHandleCtrl.js");
            }]
        }
    })
    .state('teacher_index.editorJigou',{//编辑管理
    	url:'/editorJigou',
		params:{
			officeId:null,
			flag:0,
			state:null
		},
    	templateUrl:'tpl/newadd/editorJigou.html',
    	controller:'editorJigouCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/editorJigouCtrl.js");
            }]
        }
    })
    .state('teacher_index.managePage',{//管理者管理
    	url:'/managePage',
    	params:{
            'tableChange':0
        },
    	templateUrl:'tpl/newadd/managePage.html',
    	controller:'managePageCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/managePageCtrl.js");
            }]
        }
    })
    /*.state('teacher_index.jiaocai_direction',{//管理者管理
    	url:'/jiaocai_direction',
    	templateUrl:'tpl/newadd/jiaocai_direction.html',
    	controller:'jiaocai_directionCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/jiaocai_directionCtrl.js");
            }]
        }
    })*/
    
    .state('teacher_index.user_role',{//角色权限修改页面
    	url:'/user_role',
    	templateUrl:'tpl/userCenter/user_role.html',
    	controller:'userole',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/userole.js");
            }]
        }
    })
     
    .state('teacher_index.update_user_role',{//角色权限修改
    	url:'/update_user_role',
        params:{
            'userRoleId':null
        },
    	templateUrl:'tpl/userCenter/update_user_role.html',
    	controller:'update_user_role',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/update_user_role.js");
            }]
        }
    })
    .state('teacher_index.personal_manager',{//管理者个人
    	url:'/personal_manager',
    	templateUrl:'tpl/newadd/personal_manager.html',
        params:{
            'tableChange':0
        },
    	controller:'personalManager',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/personal_manager.js");
            }]
        }
    })
    
     .state('teacher_index.mupdatemanage',{//管理者修改管理者的信息
    	url:'/mupdatemanage',
    	params:{
            'teaId':null
        },
    	templateUrl:'tpl/newadd/mupdatemanage.html',
    	controller:'mupdatemanage',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/mupdatemanage.js");
            }]
        }
    })
     .state('page_missing',{//404
    	url:'/404',
    	templateUrl:'tpl/newadd/404.html',
    	controller:'pageMissingCtrl',
    	resolve:{
            deps:["$ocLazyLoad",function($ocLazyLoad){
                return $ocLazyLoad.load("js/controller/pageMissingCtrl.js");
            }]
        }
    })
     
}])
 
/* app.directive('header',function (){
 	return {
 		restrict : 'E',
 		template : '<div class="zy_header"><div class="zy_navBg"><div class="zy_nav clearfix"><img  class="fl zy_jetsen" src="img/logo_white.png"/><a class="zy_back fr" ui-sref="login_index.sub_index">返回云空间首页<i></i></a></div></div></div>',
 		link : function (){
 			
 		}
 	}
 });
 */
//教师用户中心一级页面的控制器
//app.controller('indexCtrl',['$scope',function($scope){}])
//图片加载失败替换
app.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});

app.directive('zjyAddressThrid',function($timeout,$filter){
	return {
		restrict: 'EA',
		template:'<span style="position:relative" id="mapwrap"><span class="wx_search"><input maxlength="30" type="text" ng-model="sckey" ng-focus="mapFocus()" class="searchSchool" placeholder="请选择省市区学校" ng-keyup="keyinput()"/><i class="select" ng-click="showselect()"></i></span><div class="ditutc" ng-if="!map.selectarea"><div class="xuanzequyu"><div class="left fl"><span class="allarea" ng-click="showaddressul()">{{map.headTxt}} ▼</span><ul ng-if="map.addressul"><li ng-repeat="a in conf.areas" ng-class="{active:changeActive==a.id}" ng-click="changeId($index)">{{a.name}}<div><span ng-repeat="sty in conf.sctypes" ng-class="{active:changeTypeid==sty.id}" ng-click="changeType($index,sty.name)">{{sty.name}}</span></div></li> </ul></div><div class="right fl"><span class="jigoutype" ng-click="showjigouul()">{{map.jigouTxt}} ▼</span><ul ng-if="map.jigouul"><li ng-repeat="item in conf.jigoulist" ng-bind="item.name" ng-class="{active:jigouActive==item.id}" ng-click="changejigoustate(item)"></li></ul></div><div class="scresult" ng-if="map.resultstate"><ul><li ng-repeat="sc in schooldata1" ng-click="resultaction(sc)"><span class="resultscool">{{sc.name}}</span><span class="rusltdiqu">{{sc.schadd}}</span></li></ul></div><div class="maploading" ng-if="map.loadingstate"><svg version="1.1" style="margin:18px" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"><path fill="#458df4" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z" transform="rotate(30 25 25)"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform></path></svg></div><div class="nonecontent" ng-if="map.noneCon">未搜索到数据</div><div class="clear"></div></div></div></span>',
		replace:true,
		scope: {
            conf: '=',
            ontrest : '='
        },
        link: function(scope, element, attrs) {
        	scope.map = {
		    	clickstate:false,
		    	headTxt:'所有区域',
		    	jigouTxt:'机构类型',
		    	addressul:true,
		    	jigouul:false,
		    	loadingstate:false,
		    	resultstate:false,
		    	noneCon:false,
		    	selectarea:true,
		    };
		    function loadingfn(state){
		    	scope.map.loadingstate = state;
		    }
		    scope.changeId=function(index){
		        scope.changeActive=scope.conf.areas[index].id;
		    };
		    scope.mapFocus=function(){
		    	 scope.changeId(0);
		        scope.map.selectarea=false;
		    };
		//  输入过程中
		    scope.keyinput=function(){
		        if(scope.sckey){
		        	scope.map.selectarea=false;
		        	scope.map.addressul = false;
		    		scope.map.jigouul = false;
		    		scope.map.resultstate = true;
		            scope.schooldata1 = $filter("filter")(scope.conf.schooldata,scope.sckey);
		            if(!scope.schooldata1.length){
		            	scope.map.resultstate = false;
		            	scope.map.noneCon = true;
		            }else{
		            	scope.map.noneCon = false;
		            }
		        }else{
		        	scope.map.selectarea=false;
		        	scope.map.addressul = true;
		    		scope.map.jigouul = false;
		    		scope.map.resultstate = false;
		    		scope.map.noneCon = false;
		        };
		        scope.map.headTxt = '所有区域';
				scope.map.jigouTxt = '机构类型';
		    };
		    scope.changeType=function(index,item){
		    	scope.map.headTxt = item;
		    	scope.map.addressul = false;
		    	scope.map.jigouul = true;
		        scope.changeTypeid=scope.conf.sctypes[index].id;
		    };
		    scope.showaddressul = function(){
		    	if(scope.map.clickstate) return false;
		    	scope.map.addressul = true;
		    	scope.map.jigouul = false;
		    	scope.map.resultstate = false;
		    	loadingfn(false);
		    };
		    scope.showjigouul = function(){
		    	if(scope.map.clickstate) return false;
		    	loadingfn(false);
		    	scope.map.addressul = false;
		    	scope.map.jigouul = true;
		    	scope.map.resultstate = false;
		    };
		    scope.changejigoustate = function(item){
		    	scope.map.jigouTxt = item.name;
		    	scope.jigouActive = item.id;
		    	scope.map.jigouul = false;
		    	loadingfn(true);
		    	scope.map.clickstate = true;
		    	$timeout(function(){
		    		scope.schooldata1 = scope.conf.schooldata;
		    		scope.map.clickstate = false;
		    		loadingfn(false);
		    		scope.map.resultstate = true;
		    	},1000)
		    };
		    scope.resultaction = function(item){
		    	scope.sckey = item.name;
		    	scope.map.headTxt = item.schadd;
		    	scope.map.jigouTxt = item.schtype;
		    	scope.map.selectarea = true;
		    };
		    document.body.addEventListener('click',function(e){
		    	$timeout(function(){
		    		scope.map.selectarea = true;
		    	})
		    });
		    document.querySelector("#mapwrap").addEventListener('click',function(e){
		    	e.stopPropagation();
		    },false);
		    scope.showselect = function(){
		    	element[0].querySelector('.searchSchool').focus();
		    }
        }
	}
});
app.directive('zjyAddress',function($timeout,$filter,$http){
	return {
		restrict: 'EA',
		template:'<span style="position:relative" id="mapwrap"><span class="wx_search"><input maxlength="30" type="text" ng-model="sckey" ng-focus="mapFocus()" class="searchSchool" placeholder="请选择省市区学校" ng-keyup="keyinput()"/><i class="select" ng-click="showselect()"></i></span><div class="ditutc" ng-if="!map.selectarea"><div class="xuanzequyu"><div class="left fl"><span class="allarea" ng-click="showaddressul()">{{map.headTxt}} ▼</span><div class="addressulwrap" id="addresswrap" ng-if="map.addressul"><ul id="addressul"><li ng-repeat="a in conf.areas" ulwrap-finish ng-class="{active:changeActive==a.id}" ng-click="changeId(a)">{{a.name}}</li></ul></div><div class="schooltypewrap" ng-if="map.addressul&&conf.areas.length"><span ng-repeat="sty in conf.jigoulist" ng-class="{active:changeTypeid==sty.id}" ng-click="changeType($index,sty)">{{sty.name}}</span></div></div><div class="right fl"><span class="jigoutype" ng-click="showjigouul()">{{map.jigouTxt}} ▼</span></div><div class="scresult" ng-if="map.resultstate" id="searchwrap"><ul id="searchul"><li ng-repeat="sc in schooldata1" search-finish ng-click="resultaction(sc)"><span class="resultscool">{{sc.name}}</span><span class="rusltdiqu">{{sc.areaName}} {{sc.gradeName}}</span></li></ul></div><div class="maploading" ng-if="map.loadingstate"><svg version="1.1" style="margin:18px" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"><path fill="#458df4" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z" transform="rotate(30 25 25)"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform></path></svg></div><div class="nonecontent" ng-if="map.noneCon" ng-bind="map.noneTxt"></div><div class="clear"></div></div></div></span>',
		replace:true,
		scope: {
//          conf: '=',
            selettypefn: '=',
            isjigou: '=',
            tabflag : '='
        },
        link: function(scope, element, attrs) {
        	var areaid = sessionStorage.getItem("areaId") || '';
        	var promiseFn;
        	scope.sckey = '';
        	scope.map = {
		    	clickstate:false,
		    	headTxt:'所有区域',
		    	jigouTxt:'机构类型',
		    	addressul:true,
		    	loadingstate:false,
		    	resultstate:false,
		    	noneCon:false,
		    	selectarea:true,
		    	noneTxt:'未获取到学校信息',
		    };
        	scope.conf = {};
        	/*scope.conf.jigoulist = [
        		{"id": "1", "name": "小学"}, 
		        {"id": "2", "name": "初级中学"}, 
		        {"id": "3","name": "高级中学"}, 
		        {"id": "4", "name": "小学教学点"}, 
		        {"id": "5","name": "九年一贯制学校"}, 
		        {"id": "6","name": "完全中学"}, 
		        {"id": "7","name": "特殊教育学校"}, 
		        {"id": "8", "name": "机构"}
        	];*/
        	//学校机构类型
        	var mechanismType = [
        		{"id": "1", "name": "小学"}, 
		        {"id": "2", "name": "初级中学"}, 
		        {"id": "3","name": "高级中学"}, 
		        {"id": "4", "name": "小学教学点"}, 
		        {"id": "5","name": "九年一贯制学校"}, 
		        {"id": "6","name": "完全中学"}, 
		        {"id": "7","name": "特殊教育学校"}, 
		        {"id": "8", "name": "机构"}
        	];
        	
        	if(sessionStorage.getItem("scope") == 2){
        		$http.post(requireIp + '/ea/eaArea/findAreaListByAreaId',{areaId:areaid}).success(function (data){
	        		if(data.ret==200){
	        			scope.conf.areas = data.data;
	        			promiseFn = new Promise(function(resolve,reject){
					    	init(resolve,reject);
					    });
	        		}else{
	        			scope.map.addressul = false;
	        			scope.map.resultstate = false;
		            	scope.map.noneCon = true;
		            	scope.map.noneTxt = '未获取到区域列表';
	        		}
				}).error(function(){
					scope.map.addressul = false;
	    			scope.map.resultstate = false;
	            	scope.map.noneCon = true;
	            	scope.map.noneTxt = '未获取到区域列表';
				});
        	}else if(sessionStorage.getItem("scope") == 3){
        		$http.post(requireIp + '/uc/ucUser/findUserInfoUserId',{userId:sessionStorage.getItem("userId"),userType:sessionStorage.getItem("userType")}).success(function (dataUser){
	        		if(dataUser.ret==200){
	        			areaid = dataUser.data.userInfo.areaId;
	        			promiseFn = new Promise(function(resolve,reject){
					    	init(resolve,reject);
					    });
	        			$http.post(requireIp + '/ea/eaArea/getAreaByAreaId',{areaId:dataUser.data.userInfo.areaId}).success(function (data){
			        		if(data.ret==200){
			        			scope.conf.areas = data.data;
			        		}else{
			        			scope.map.addressul = false;
			        			scope.map.resultstate = false;
				            	scope.map.noneCon = true;
				            	scope.map.noneTxt = '未获取到区域列表';
			        		}
						}).error(function(){
							scope.map.addressul = false;
			    			scope.map.resultstate = false;
			            	scope.map.noneCon = true;
			            	scope.map.noneTxt = '未获取到区域列表';
						});
	        		}else{
	        			scope.map.addressul = false;
	        			scope.map.resultstate = false;
		            	scope.map.noneCon = true;
		            	scope.map.noneTxt = '未获取到区域列表';
	        		}
				}).error(function(){
					scope.map.addressul = false;
	    			scope.map.resultstate = false;
	            	scope.map.noneCon = true;
	            	scope.map.noneTxt = '未获取到区域列表';
				});
        	}else{
        		scope.map.addressul = false;
    			scope.map.resultstate = false;
            	scope.map.noneCon = true;
            	scope.map.noneTxt = '未获取到区域列表';
        	}
			scope.showselect = function(){
				element.find('input')[0].focus();
			};
			
		    function loadingfn(state){
		    	scope.map.loadingstate = state;
		    }
		    //区id
//		    var previousId;
		    scope.changeId=function(item){
//		    	previousId = item.id;
		        scope.changeActive = item.id;
		        scope.map.headTxt = item.name;
		        scope.conf.jigoulist = mechanismType;
		    };
		    scope.mapFocus=function(){
		    	scope.map.selectarea=false;
		    };
		    scope.inputrue=true;
		    if(scope.isjigou){
		    	element.find('input').attr('readonly',true)
		    };
		    
		//  输入过程中
		    scope.keyinput = function(){
		    	if(scope.isjigou){
		    		return false;
		    	};
		        if(scope.sckey){
		        	scope.map.selectarea=false;
		        	scope.map.addressul = false;
		    		scope.map.jigouul = false;
		    		scope.map.resultstate = true;
					promiseFn.then(function(data){
						$timeout(function(){
						 	scope.schooldata1 = $filter("filter")(scope.conf.schooldata,scope.sckey);
						 	if(!scope.schooldata1.length){
				            	scope.map.resultstate = false;
				            	scope.map.noneCon = true;
				            	scope.map.noneTxt = '未获取到学校信息';
				            }else{
				            	scope.map.noneCon = false;
				            }
						})
				   },function(){
					   	$timeout(function(){
					   		scope.schooldata1 = [];
					   		scope.map.noneCon = true;
			            	scope.map.noneTxt = '网络错误';
		            	})
				   });
					
		        }else{
		        	scope.map.selectarea=false;
		        	scope.map.addressul = true;
		    		scope.map.jigouul = false;
		    		scope.map.resultstate = false;
		    		loadingfn(false);
		    		scope.map.noneCon = false;
		        };
		        scope.map.headTxt = '所有区域';
				scope.map.jigouTxt = '机构类型';
		    };
		    function init(resolve,reject){
		    	if(scope.tabflag==0){
		    		$http.post(requireIp + '/ea/eaOffice/findSchoolList',{flag:'0',state:'1',areaIds : areaid}).success(function (data){
		    			if(data.ret==200){
		    				scope.conf.schooldata = data.data.schoolList;
		    			}else{
		    				scope.conf.schooldata = [];
		    			}
				    	resolve();
				    })
		    		.error(function(){
		    			reject()
		    		});
		   	 	}else if(scope.tabflag==1){
		   	 		$http.post(requireIp + '/ea/eaOffice/findSchoolList',{flag:'0',state:'2',areaIds :areaid}).success(function (data){
		   	 			if(data.ret==200){
				    		scope.conf.schooldata = data.data.schoolList;
		   	 			}else{
		   	 				scope.conf.schooldata = [];
		   	 			}
				    	resolve();
				    }).error(function(){
		    			reject()
		    		});
		   	 	}else if(scope.tabflag==2){
		   	 		$http.post(requireIp + '/ea/eaOffice/findSchoolList',{flag:'3',state:'',areaIds : areaid}).success(function (data){
				    	if(data.ret==200){
				    		scope.conf.schooldata = data.data.schoolList;
		   	 			}else{
		   	 				scope.conf.schooldata = [];
		   	 			}
				    	resolve();
				    }).error(function(){
		    			reject()
		    		});
		   	 	}
		    }
		    scope.changeType=function(index,item){
//		    	if(previousId != undefined){
			    	scope.map.jigouTxt = item.name;
			    	scope.map.addressul = false;
			        scope.changeTypeid = item.id;
			        loadingfn(true);
			        scope.map.clickstate = true;
			        if(scope.isjigou){
			        	scope.map.clickstate = false;
			        	scope.map.addressul = true;
			        	scope.map.selectarea = true;
			        	loadingfn(false);
			        	scope.sckey = item.name + '('+scope.map.headTxt + ')';
			        	if(angular.isFunction(scope.selettypefn)){
			        		scope.selettypefn(scope.changeActive,item.id);
				        };
			        }else{
			        	$http.post(requireIp + '/ea/eaOffice/findSchoolInfoByAreaId',{areaId : scope.changeActive,grade:item.id}).success(function (data){
			        		scope.map.clickstate = false;
			        		scope.map.resultstate = true;
			        		loadingfn(false);
			        		if(data.ret == 200){
			        			scope.schooldata1 = data.data;
			        		}else{
			        			scope.map.resultstate = false;
			        			scope.schooldata1 = [];
			        			scope.map.noneCon = true;
			        			scope.map.noneTxt = data.message;
			        		}
					     })
			        };
//		        }
		    };
		    scope.showaddressul = function(){
		    	if(scope.map.noneTxt == '未获取到区域列表') return false;
		    	if(scope.map.clickstate) return false;
		    	scope.map.addressul = true;
		    	scope.map.resultstate = false;
		    	scope.map.noneCon = false;
		    	loadingfn(false);
		    };
		    scope.showjigouul = function(){
		    	if(scope.map.noneTxt == '未获取到区域列表') return false;
		    	if(scope.map.clickstate) return false;
		    	scope.map.addressul = true;
		    	scope.map.resultstate = false;
		    	scope.map.noneCon = false;
		    	loadingfn(false);
		    };
		    scope.resultaction = function(item){
		    	scope.sckey = item.name;
		    	scope.map.headTxt = item.areaName || '所有区域';
		    	scope.map.jigouTxt = item.gradeName || '机构类型';
		    	scope.map.selectarea = true;
		    	if(angular.isFunction(scope.selettypefn)){
	        		scope.selettypefn(item.id);
		        };
		    };
		    document.body.addEventListener('click',function(e){
		    	$timeout(function(){
		    		scope.map.selectarea = true;
		    	})
		    });
		    document.querySelector("#mapwrap").addEventListener('click',function(e){
		    	e.stopPropagation();
		    },false)
        }
	}
})
//分页组件
app.directive('zjyPagination',function(){
    return {
        restrict: 'EA',
        template: '<div class="page-list">' +
            '<ul class="handle_paging" ng-show="conf.totalItems > 0">' +
            '<li ng-class="{disabled: conf.currentPage == 1}" ng-click="prevPage()"><span class="laquoPrev"></span></li>' +
            '<li ng-repeat="item in pageList track by $index" ng-class="{active: item == conf.currentPage, separate: item == \'...\'}" ' +
            'ng-click="changeCurrentPage(item)">' +
            '<span>{{ item }}</span>' +
            '</li>' +
            '<li ng-class="{disabled: conf.currentPage == conf.numberOfPages}" ng-click="nextPage()"><span></span></li>' +
            '</ul>' +
            '<div class="no-items" ng-show="conf.totalItems <= 0">暂无数据</div>' +
            '</div>',
        replace: true,
        scope: {
            conf: '='
        },
        link: function(scope, element, attrs) {
            var conf = scope.conf;
            var defaultPagesLength = 9;
            var defaultPerPageOptions = [5, 10, 15, 20, 30, 50];
            var defaultPerPage = 5;
            if(conf.pagesLength) {
                // 判断一下分页长度
                conf.pagesLength = parseInt(conf.pagesLength, 10);
                if(!conf.pagesLength) {
                    conf.pagesLength = defaultPagesLength;
                }
                // 分页长度必须为奇数，如果传偶数时，自动处理
                if(conf.pagesLength % 2 === 0) {
                    conf.pagesLength += 1;
                }
            } else {
                conf.pagesLength = defaultPagesLength
            }
            // 分页选项可调整每页显示的条数
            if(!conf.perPageOptions){
                conf.perPageOptions = defaultPagesLength;
            }
            // pageList数组
            function getPagination(newValue, oldValue) {
                // conf.currentPage
                if(conf.currentPage) {
                    conf.currentPage = parseInt(scope.conf.currentPage, 10);
                }
                if(!conf.currentPage) {
                    conf.currentPage = 1;
                }
                // conf.totalItems
                if(conf.totalItems) {
                    conf.totalItems = parseInt(conf.totalItems, 10);
                }
                // conf.totalItems
                if(!conf.totalItems) {
                    conf.totalItems = 0;
                    return;
                }
                if(conf.itemsPerPage) {
                    conf.itemsPerPage = parseInt(conf.itemsPerPage, 10);
                }
                if(!conf.itemsPerPage) {
                    conf.itemsPerPage = defaultPerPage;
                }
                conf.numberOfPages = Math.ceil(conf.totalItems/conf.itemsPerPage);
                // 如果分页总数>0，并且当前页大于分页总数
                if(scope.conf.numberOfPages > 0 && scope.conf.currentPage > scope.conf.numberOfPages){
                    scope.conf.currentPage = scope.conf.numberOfPages;
                }
                // 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
                var perPageOptionsLength = scope.conf.perPageOptions.length;
                // 定义状态
                var perPageOptionsStatus;
                for(var i = 0; i < perPageOptionsLength; i++){
                    if(conf.perPageOptions[i] == conf.itemsPerPage){
                        perPageOptionsStatus = true;
                    }
                }
                // 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
                if(!perPageOptionsStatus){
                    conf.perPageOptions.push(conf.itemsPerPage);
                }
                // 对选项进行sort
                conf.perPageOptions.sort(function(a, b) {return a - b});
                // 页码相关
                scope.pageList = [];
                if(conf.numberOfPages <= conf.pagesLength){
                    // 判断总页数如果小于等于分页的长度，若小于则直接显示
                    for(i =1; i <= conf.numberOfPages; i++){
                        scope.pageList.push(i);
                    }
                }else{
                    // 总页数大于分页长度（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
                    // 计算中心偏移量
                    var offset = (conf.pagesLength - 1) / 2;
                    if(conf.currentPage <= offset){
                        // 左边没有...
                        for(i = 1; i <= offset + 1; i++){
                            scope.pageList.push(i);
                        }
                        scope.pageList.push('...');
                        scope.pageList.push(conf.numberOfPages);
                    }else if(conf.currentPage > conf.numberOfPages - offset){
                        scope.pageList.push(1);
                        scope.pageList.push('...');
                        for(i = offset + 1; i >= 1; i--){
                            scope.pageList.push(conf.numberOfPages - i);
                        }
                        scope.pageList.push(conf.numberOfPages);
                    }else{
                        // 最后一种情况，两边都有...
                        scope.pageList.push(1);
                        scope.pageList.push('...');

                        for(i = Math.ceil(offset / 2) ; i >= 1; i--){
                            scope.pageList.push(conf.currentPage - i);
                        }
                        scope.pageList.push(conf.currentPage);
                        for(i = 1; i <= offset / 2; i++){
                            scope.pageList.push(conf.currentPage + i);
                        }

                        scope.pageList.push('...');
                        scope.pageList.push(conf.numberOfPages);
                    }
                }
                scope.$parent.conf = conf;
            }
            scope.prevPage = function() {
                if(conf.currentPage==1){
                    return false;
                }
                if(conf.currentPage > 1){
                    conf.currentPage -= 1;
                }
                getPagination();
                if(conf.onChange) {
                    conf.onChange();
                }
            };
            // nextPage
            scope.nextPage = function() {
                if(conf.currentPage==conf.numberOfPages){
                    return false;
                }
                if(conf.currentPage < conf.numberOfPages){
                    conf.currentPage += 1;
                }
                getPagination();
                if(conf.onChange) {
                    conf.onChange();
                }
            };
            // 变更当前页
            scope.changeCurrentPage = function(item) {
                if(item == '...'){
                    return;
                }else{
                    if(conf.currentPage==item){
                        return;
                    }
                    conf.currentPage = item;
                    getPagination();
                    // conf.onChange()函数
                    if(conf.onChange) {    
                        conf.onChange(item);
                    }
                }
            };
            // 修改每页展示的条数
            scope.changeItemsPerPage = function() {
                // 一发展示条数变更，当前页将重置为1
                conf.currentPage = 1;
                getPagination();
                // conf.onChange()函数
                if(conf.onChange) {    
                    conf.onChange();
                }
            };
            // 跳转页
            scope.jumpToPage = function() {
                num = scope.jumpPageNum;
                if(num.match(/\d+/)) {
                    num = parseInt(num, 10);
                    if(num && num != conf.currentPage) {
                        if(num > conf.numberOfPages) {
                            num = conf.numberOfPages;
                        }
                        // 跳转
                        conf.currentPage = num;
                        getPagination();
                        // conf.onChange()函数
                        if(conf.onChange) {    
                            conf.onChange();
                        }
                        scope.jumpPageNum = '';
                    }
                }
            };
            scope.jumpPageKeyUp = function(e) {
                var keycode = window.event ? e.keyCode :e.which;
                if(keycode == 13) {
                    scope.jumpToPage();
                }
            }
            scope.$watch('conf.totalItems', function(value, oldValue) {
                // 在无值或值相等的时候，去执行onChange事件
                if(!value || value == oldValue) {
                    if(conf.onChange) {    
                        // conf.onChange();
                    }
                }
                getPagination();
            })
        }
    }
});
app.directive('ulwrapFinish',function(scrollbar){
    return {
        link: function(scope,element,attr){
            if(scope.$last == true){
            	if(element.parent().parent()[0].offsetHeight < element.parent()[0].offsetHeight){
                	scrollbar.scroollAction('addresswrap', 'addressul', 'scrollDiv');
                }
            }
        }
    }
})
app.directive('searchFinish',function(scrollbar){
    return {
        link: function(scope,element,attr){
            if(scope.$last == true){
            	if(element.parent().parent()[0].offsetHeight < element.parent()[0].offsetHeight){
            		scrollbar.scroollAction('searchwrap', 'searchul', 'scrollDiv');
            	}
            }
        }
    }
})
app.constant('levelGradeMap', {
								'level_1':[{id:'1',name:'一年级',versionId:''},{id:'2',name:'二年级',versionId:''},{id:'3',name:'三年级',versionId:''},{id:'4',name:'四年级',versionId:''},{id:'5',name:'五年级',versionId:''},{id:'6',name:'六年级',versionId:''}],
								'level_2':[{id:'7',name:'初一年级',versionId:''},{id:'8',name:'初二年级',versionId:''},{id:'9',name:'初三年级',versionId:''}],
								'level_3':[{id:'10',name:'高一年级',versionId:''},{id:'11',name:'高二年级',versionId:''},{id:'12',name:'高三年级',versionId:''}]
							  });
							  /////////////////////////////////////////////////////////////////////////////////////////
							  

app.directive('zjyAddresstwo',function($timeout,$filter,$http){
	return {
		restrict: 'EA',
		template:'<span style="position:relative" id="mapwrap2"><span class="wx_search"><input maxlength="30" type="text" ng-model="sckey" ng-focus="mapFocus()" class="searchSchool" placeholder="请选择省市区学校" ng-keyup="keyinput()"/><i class="select" ng-click="showselect()"></i></span><div class="ditutc" ng-if="!map.selectarea"><div class="xuanzequyu"><div class="left fl"><span class="allarea" ng-click="showaddressul()">{{map.headTxt}} ▼</span><div class="addressulwrap" id="addresswrap" ng-if="map.addressul"><ul id="addressul"><li ng-repeat="a in conf.areas" ulwrap-finish ng-class="{active:changeActive==a.id}" ng-click="changeId(a)">{{a.name}}</li></ul></div><div class="schooltypewrap" ng-if="map.addressul&&conf.areas.length"><span ng-repeat="sty in conf.jigoulist" ng-class="{active:changeTypeid==sty.id}" ng-click="changeType($index,sty)">{{sty.name}}</span></div></div><div class="right fl"><span class="jigoutype" ng-click="showjigouul()">{{map.jigouTxt}} ▼</span></div><div class="scresult" ng-if="map.resultstate" id="searchwrap"><ul id="searchul"><li ng-repeat="sc in schooldata1" search-finish ng-click="resultaction(sc)"><span class="resultscool">{{sc.name}}</span><span class="rusltdiqu">{{sc.areaName}} {{sc.gradeName}}</span></li></ul></div><div class="maploading" ng-if="map.loadingstate"><svg version="1.1" style="margin:18px" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"><path fill="#458df4" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z" transform="rotate(30 25 25)"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform></path></svg></div><div class="nonecontent" ng-if="map.noneCon" ng-bind="map.noneTxt"></div><div class="clear"></div></div></div></span>',
		replace:true,
		scope: {
//          conf: '=',
            selettypefn: '=',
            isjigou: '=',
            tabflag : '='
        },
        link: function(scope, element, attrs) {
        	var areaid = sessionStorage.getItem("areaId") || '';
        	var promiseFn;
        	scope.sckey = '';
        	scope.map = {
		    	clickstate:false,
		    	headTxt:'所有区域',
		    	jigouTxt:'机构类型',
		    	addressul:true,
		    	loadingstate:false,
		    	resultstate:false,
		    	noneCon:false,
		    	selectarea:true,
		    	noneTxt:'未获取到学校信息',
		    };
        	scope.conf = {};
        	/*scope.conf.jigoulist = [
        		{"id": "1", "name": "小学"}, 
		        {"id": "2", "name": "初级中学"}, 
		        {"id": "3","name": "高级中学"}, 
		        {"id": "4", "name": "小学教学点"}, 
		        {"id": "5","name": "九年一贯制学校"}, 
		        {"id": "6","name": "完全中学"}, 
		        {"id": "7","name": "特殊教育学校"}, 
		        {"id": "8", "name": "机构"}
        	];*/
        	//学校机构类型
        	var mechanismType = [
        		{"id": "1", "name": "小学"}, 
		        {"id": "2", "name": "初级中学"}, 
		        {"id": "3","name": "高级中学"}, 
		        {"id": "4", "name": "小学教学点"}, 
		        {"id": "5","name": "九年一贯制学校"}, 
		        {"id": "6","name": "完全中学"}, 
		        {"id": "7","name": "特殊教育学校"}, 
		        {"id": "8", "name": "机构"}
        	];
        	
        	if(sessionStorage.getItem("scope") == 2){
        		$http.post(requireIp + '/ea/eaArea/findAreaListByAreaId',{areaId:areaid}).success(function (data){
	        		if(data.ret==200){
	        			scope.conf.areas = data.data;
	        			promiseFn = new Promise(function(resolve,reject){
					    	init(resolve,reject);
					    });
	        		}else{
	        			scope.map.addressul = false;
	        			scope.map.resultstate = false;
		            	scope.map.noneCon = true;
		            	scope.map.noneTxt = '未获取到区域列表';
	        		}
				}).error(function(){
					scope.map.addressul = false;
	    			scope.map.resultstate = false;
	            	scope.map.noneCon = true;
	            	scope.map.noneTxt = '未获取到区域列表';
				});
        	}else if(sessionStorage.getItem("scope") == 3){
        		$http.post(requireIp + '/uc/ucUser/findUserInfoUserId',{userId:sessionStorage.getItem("userId"),userType:sessionStorage.getItem("userType")}).success(function (dataUser){
	        		if(dataUser.ret==200){
	        			areaid = dataUser.data.userInfo.areaId;
	        			promiseFn = new Promise(function(resolve,reject){
					    	init(resolve,reject);
					    });
	        			$http.post(requireIp + '/ea/eaArea/getAreaByAreaId',{areaId:dataUser.data.userInfo.areaId}).success(function (data){
			        		if(data.ret==200){
			        			scope.conf.areas = data.data;
			        		}else{
			        			scope.map.addressul = false;
			        			scope.map.resultstate = false;
				            	scope.map.noneCon = true;
				            	scope.map.noneTxt = '未获取到区域列表';
			        		}
						}).error(function(){
							scope.map.addressul = false;
			    			scope.map.resultstate = false;
			            	scope.map.noneCon = true;
			            	scope.map.noneTxt = '未获取到区域列表';
						});
	        		}else{
	        			scope.map.addressul = false;
	        			scope.map.resultstate = false;
		            	scope.map.noneCon = true;
		            	scope.map.noneTxt = '未获取到区域列表';
	        		}
				}).error(function(){
					scope.map.addressul = false;
	    			scope.map.resultstate = false;
	            	scope.map.noneCon = true;
	            	scope.map.noneTxt = '未获取到区域列表';
				});
        	}else{
        		scope.map.addressul = false;
    			scope.map.resultstate = false;
            	scope.map.noneCon = true;
            	scope.map.noneTxt = '未获取到区域列表';
        	}
			scope.showselect = function(){
				element.find('input')[0].focus();
			};
			
		    function loadingfn(state){
		    	scope.map.loadingstate = state;
		    }
		    //区id
//		    var previousId;
		    scope.changeId=function(item){
//		    	previousId = item.id;
		        scope.changeActive = item.id;
		        scope.map.headTxt = item.name;
		        scope.conf.jigoulist = mechanismType;
		    };
		    scope.mapFocus=function(){
		    	scope.map.selectarea=false;
		    };
		    scope.inputrue=true;
		    if(scope.isjigou){
		    	element.find('input').attr('readonly',true)
		    };
		    
		//  输入过程中
		    scope.keyinput = function(){
		    	if(scope.isjigou){
		    		return false;
		    	};
		        if(scope.sckey){
		        	scope.map.selectarea=false;
		        	scope.map.addressul = false;
		    		scope.map.jigouul = false;
		    		scope.map.resultstate = true;
					promiseFn.then(function(data){
						$timeout(function(){
						 	scope.schooldata1 = $filter("filter")(scope.conf.schooldata,scope.sckey);
						 	if(!scope.schooldata1.length){
				            	scope.map.resultstate = false;
				            	scope.map.noneCon = true;
				            	scope.map.noneTxt = '未获取到学校信息';
				            }else{
				            	scope.map.noneCon = false;
				            }
						})
				   },function(){
					   	$timeout(function(){
					   		scope.schooldata1 = [];
					   		scope.map.noneCon = true;
			            	scope.map.noneTxt = '网络错误';
		            	})
				   });
					
		        }else{
		        	scope.map.selectarea=false;
		        	scope.map.addressul = true;
		    		scope.map.jigouul = false;
		    		scope.map.resultstate = false;
		    		loadingfn(false);
		    		scope.map.noneCon = false;
		        };
		        scope.map.headTxt = '所有区域';
				scope.map.jigouTxt = '机构类型';
		    };
		    function init(resolve,reject){
		    	if(scope.tabflag==0){
		    		$http.post(requireIp + '/ea/eaOffice/findSchoolList',{flag:'0',state:'1',areaIds : areaid}).success(function (data){
		    			if(data.ret==200){
		    				scope.conf.schooldata = data.data.schoolList;
		    			}else{
		    				scope.conf.schooldata = [];
		    			}
				    	resolve();
				    })
		    		.error(function(){
		    			reject()
		    		});
		   	 	}else if(scope.tabflag==1){
		   	 		$http.post(requireIp + '/ea/eaOffice/findSchoolList',{flag:'0',state:'2',areaIds :areaid}).success(function (data){
		   	 			if(data.ret==200){
				    		scope.conf.schooldata = data.data.schoolList;
		   	 			}else{
		   	 				scope.conf.schooldata = [];
		   	 			}
				    	resolve();
				    }).error(function(){
		    			reject()
		    		});
		   	 	}else if(scope.tabflag==2){
		   	 		$http.post(requireIp + '/ea/eaOffice/findSchoolList',{flag:'3',state:'',areaIds : areaid}).success(function (data){
				    	if(data.ret==200){
				    		scope.conf.schooldata = data.data.schoolList;
		   	 			}else{
		   	 				scope.conf.schooldata = [];
		   	 			}
				    	resolve();
				    }).error(function(){
		    			reject()
		    		});
		   	 	}
		    }
		    scope.changeType=function(index,item){
//		    	if(previousId != undefined){
			    	scope.map.jigouTxt = item.name;
			    	scope.map.addressul = false;
			        scope.changeTypeid = item.id;
			        loadingfn(true);
			        scope.map.clickstate = true;
			        if(scope.isjigou){
			        	scope.map.clickstate = false;
			        	scope.map.addressul = true;
			        	scope.map.selectarea = true;
			        	loadingfn(false);
			        	scope.sckey = item.name + '('+scope.map.headTxt + ')';
			        	if(angular.isFunction(scope.selettypefn)){
			        		scope.selettypefn(scope.changeActive,item.id);
				        };
			        }else{
			        	$http.post(requireIp + '/ea/eaOffice/findSchoolInfoByAreaId',{areaId : scope.changeActive,grade:item.id}).success(function (data){
			        		scope.map.clickstate = false;
			        		scope.map.resultstate = true;
			        		loadingfn(false);
			        		if(data.ret == 200){
			        			scope.schooldata1 = data.data;
			        		}else{
			        			scope.map.resultstate = false;
			        			scope.schooldata1 = [];
			        			scope.map.noneCon = true;
			        			scope.map.noneTxt = data.message;
			        		}
					     })
			        };
//		        }
		    };
		    scope.showaddressul = function(){
		    	if(scope.map.noneTxt == '未获取到区域列表') return false;
		    	if(scope.map.clickstate) return false;
		    	scope.map.addressul = true;
		    	scope.map.resultstate = false;
		    	scope.map.noneCon = false;
		    	loadingfn(false);
		    };
		    scope.showjigouul = function(){
		    	if(scope.map.noneTxt == '未获取到区域列表') return false;
		    	if(scope.map.clickstate) return false;
		    	scope.map.addressul = true;
		    	scope.map.resultstate = false;
		    	scope.map.noneCon = false;
		    	loadingfn(false);
		    };
		    scope.resultaction = function(item){
		    	scope.sckey = item.name;
		    	scope.map.headTxt = item.areaName || '所有区域';
		    	scope.map.jigouTxt = item.gradeName || '机构类型';
		    	scope.map.selectarea = true;
		    	if(angular.isFunction(scope.selettypefn)){
	        		scope.selettypefn(item.id);
		        };
		    };
		    document.body.addEventListener('click',function(e){
		    	$timeout(function(){
		    		scope.map.selectarea = true;
		    	})
		    });
		    document.querySelector("#mapwrap2").addEventListener('click',function(e){
		    	e.stopPropagation();
		    },false)
        }
	}
})