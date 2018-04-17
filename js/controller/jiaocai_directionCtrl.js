app.controller('jiaocai_directionCtrl',['$scope','$timeout','loginService',function($scope,$timeout,loginService) {
	$scope.data = {
		schooldata:[
	        {"id":"1","name":"1牡丹江附属小学牡丹江附属小学","schadd":"双井街道","schtype":"小学"},
	        {"id":"2","name":"2牡丹江附属中学","schadd":"劲松街道","schtype":"中学"},
	        {"id":"3","name":"3哈尔滨附属小学","schadd":"见外街道","schtype":"小学"},
	        {"id":"4","name":"4重庆市附属小学1","schadd":"香河园街道","schtype":"初级中学"},
	        {"id":"4","name":"5重庆市附属小学2","schadd":"亚运村街道","schtype":"终极中学"},
	        {"id":"4","name":"7重庆市附属小学3","schadd":"望京街道","schtype":"究极中学"},
	        {"id":"4","name":"8重庆市附属小学4","schadd":"安镇街道","schtype":"大学"},
	        {"id":"4","name":"9重庆市附属小学5","schadd":"小红门街道","schtype":"特殊教育学校"},
	        {"id":"4","name":"0重庆市附属小学6","schadd":"小红门街道","schtype":"九年一贯制学校"},
	        {"id":"4","name":"-重庆市附属小学7","schadd":"亚运村街道","schtype":"幼儿园"},
	        {"id":"4","name":"11重庆市附属小学8","schadd":"见外街道","schtype":"机构"},
	        {"id":"4","name":"112重庆市附属小学9","schadd":"见外街道","schtype":"机构"},
	        {"id":"4","name":"13重庆市附属小学0","schadd":"重庆市城九区","schtype":"机构"},
	        {"id":"4","name":"14重庆市附属小学11","schadd":"劲松街道","schtype":"特殊教育学校"},
	        {"id":"4","name":"15重庆市附属小学12","schadd":"望京街道","schtype":"特殊教育学校"},
	        {"id":"4","name":"16重庆市附属小学123","schadd":"香河园街道","schtype":"九年一贯制学校"},
	        {"id":"4","name":"16重庆市附属小学14","schadd":"双井街道","schtype":"九年一贯制学校"},
	        {"id":"4","name":"重庆市附属小学15","schadd":"香河园街道","schtype":"初级中学"},
	    ],
	   	areas:[
	        {id:"1","name":"1朝阳区"},
	        {id:"2","name":"2海淀区"},
	        {id:"3","name":"3丰台区"},
	        {id:"4","name":"4西城区"},
	        {id:"5","name":"5东城区"},
	        {id:"6","name":"6昌平区"},
	        {id:"7","name":"7密云县"},
	        {id:"8","name":"8石景山区"},
	        {id:"9","name":"9通州区"},
	        {id:"10","name":"0顺义区"},
	        {id:"11","name":"-顺义区"},
	        {id:"12","name":"11顺义区"},
	    ],
	    sctypes:[
	        {"id":"1","name":"1双井街道"},
	        {"id":"2","name":"2劲松街道"},
	        {"id":"3","name":"3建外街道"},
	        {"id":"4","name":"45香河园街道"},
	        {"id":"5","name":"6亚运村街道"},
	        {"id":"6","name":"7望京街道"},
	        {"id":"7","name":"8安贞街道1"},
	        {"id":"8","name":"9安贞街道2"},
	        {"id":"9","name":"0安贞街道3"},
	        {"id":"0","name":"-安贞街道4"},
	        {"id":"11","name":"11安贞街道5"},
	        {"id":"12","name":"121安贞街道6"},
	        {"id":"13","name":"13安贞街道7"},
	        {"id":"14","name":"141安贞街道8"},
	        {"id":"15","name":"15安贞街道9"},
	        {"id":"16","name":"16小红门地区"}
	    ],
	    jigoulist:[
	        {"id":"1","name":"1幼儿园"},
	        {"id":"2","name":"2小学"},
	        {"id":"3","name":"3中学"},
	        {"id":"4","name":"1九年一贯制学校"},
	        {"id":"5","name":"4特殊教育学校"},
	        {"id":"6","name":"1小学教育学点"},
	        {"id":"7","name":"2机构"},
	        {"id":"8","name":"3初级中学"},
	        {"id":"9","name":"4高级中学"},
	        {"id":"0","name":"5究极中学"},
	    ]
	}
}])