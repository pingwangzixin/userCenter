
// var requireIp1 = 'http://192.168.9.60:8080/jeuc/api';
// var requireIp1 = 'http://198.9.6.61:8080/';
//导入也得改
//var requireIp1 = 'http://192.168.9.98:80/JEUC/api';
//var requireIp1 = 'http://192.168.9.98:8080/jeuc/api'; 
//var requireIp1 = 'http://192.168.9.98/jdz-jeuc/api'  //ceshi
//var requireIp = 'http://localhost:8084/jeuc/api'  //ceshi

app.service('xuekeService',['$http','$timeout',function($http,$timeout) {
	
	// 1.获取 levelList 集合
    this.getLevelList = function(params,succ,error) {
    	$http.post(requireIp+'/edu/eduLevel/findList')
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
    }
	
	// 2.通过学段获取学科分类
	this.getSubjectByType = function(params,succ,error) {
    	//$http.post(requireIp+'/edu/eduSubject/findSubjectByType',{levelId:levelId})
    	$http.post(requireIp+'/edu/eduSubject/findSubjectTypeByLevelOrOfficeId',params)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
    }
	
	// 3.获取学科 根据学段ID
	this.getSubjectList = function(params,succ,error) {
		$http.post(requireIp+'/edu/eduSubject/getSubListByLevelId',params)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	
	// 4. 通过 配置文件 查询年级 getGradeListByLevel
	this.getGradeListByLevel = function (params,succ,error) {
		$http.post(requireIp+'/edu/eduSubject/getGradeListByLevelOrOfficeId',params)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	
	// 5.添加设置的学科
	this.saveLevelSubjectGrade = function (params,succ,error) {
		$http.post(requireIp+'/edu/eduSubject/saveLevelSubjectGrade',params)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	
	/**
	 * 2.  根据 学校 查询 学科
	 */
	
	// 1.通过学校的ID 获取 学科分类集合
	this.getSubTypeListByOfficeId = function(params,succ,error) {
    	//$http.post(requireIp+'/edu/eduSubject/getSubTypeListByOfficeId',params)
    	$http.post(requireIp+'/edu/eduSubject/findSubjectTypeByLevelOrOfficeId',params)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
    }
	
	// 2. 通过学校ID 查询年级学科
	this.getGradeSubListByOfficeId = function (params,succ,error) {
		//$http.post(requireIp+'/edu/eduSubject/getGradeSubListByOfficeId',{officeId:officeId})
		$http.post(requireIp+'/edu/eduSubject/getGradeListByLevelOrOfficeId',params)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	
	// 3. 通过学校ID 获取 学段
	this.findLevelByOfficeId = function (officeId,succ,error) {
		$http.post(requireIp+'/edu/eduSubject/findLevelByOfficeId',{officeId:officeId})
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	
	// 4. 学校 添加年级学科
	this.saveSubjectGrade = function (params,succ,error) {
		$http.post(requireIp+'/edu/eduSubject/saveSubjectGrade',params)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	
	// 5.查询 学校所属的学段 的学科
	
	this.getSubjectListByOfficeId = function(params,succ,error) {
		$http.post(requireIp+'/edu/eduSubject/getSubjectListByOfficeId',params)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	
	// 6.查询学校所有的学科
	this.getOfficeSubjectList = function(params,succ,error) {
		$http.post(requireIp+'/edu/eduSubject/getOfficeSubjectList',params)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	
	
	
	
}])
