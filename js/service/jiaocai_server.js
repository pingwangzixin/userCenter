
app.service('textBookService',['$http','$timeout',function($http,$timeout) {
	
	//获取学段
	this.getLevel = function(params,succ,error){
		$http.get(requireIp+'/edu/eduLevel?token='+token)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	
	//根据学段获取科目
	this.getSubjectByLevelId = function(params,succ,error) {
		$http.get(requireIp+'/edu/eduSubject?token='+token,{params:params})
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	
	//获取版本
	this.getVersion = function(params,succ,error){
		$http.get(requireIp+'/edu/eduVersion?token='+token,{params:params})
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	
	//获取课本
	this.getTextBook = function(params,succ,error){
		$http.get(requireIp+'/edu/eduTextbook?token='+token,{params:params})
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	
	//保存版本
	this.saveVersion = function(params,succ,error){
		$http.post(requireIp+'/edu/eduVersion?token='+token,params)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	
	//保存学段、科目、版本关联关系
	this.saveVerLevelSub = function(params,succ,error){
		$http.post(requireIp+'/edu/eduVersion/saveVerLevelSub?token='+token,params)
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	
	//删除学段、科目、版本关联关系
	this.deleteVerLevelSub = function(params,succ,error){
		$http.delete(requireIp+'/edu/eduVersion/deleteVerLevelSub?token='+token,{method :'DELETE',params:params})
		.success(function(res){
			succ(res)
		})
		.error(function(res){
			error(res)
		})
	}
	
	//修改版本
	this.updateVersion = function(params,succ,error){
		$http.put(requireIp+'/edu/eduVersion?token='+token,null,{params:params})
		.success(function(res){
			succ(res)
		})
		.error(function(res){
			error(res)
		})
	}
	
	/**
	 * 下载课本模版
	 */
	this.downTextBookModel = function(){
		window.location.href = requireIp+'/uc/ucUser/downloadModel?token='+token+'&fileName=textbook.xlsx'
	}
	
	/**
	 * 上传课本
	 */
	this.uploadBook = function(params,succ,error){
		$http({
        	 method:'POST',
        	 url:requireIp+'/edu/eduTextbook/importBook?token='+token,
        	 data:params,
	    	 headers: {'Content-Type':undefined},
	         transformRequest: angular.identity 
        }).success(function(res){
        	succ(res)
        }).error(function(res){
        	error(res)
        })
	}
	
	/**
	 * 修改课本
	 */
	this.updateBook = function(params,succ,error){
		$http({
        	 method:'PUT',
        	 url:requireIp+'/edu/eduTextbook?token='+token,
        	 params:params
        }).success(function(res){
        	succ(res)
        }).error(function(res){
        	error(res)
        })
	}
	
	/**
	 * 添加课本
	 */
	this.insertBook = function(params,succ,error){
		$http.post(requireIp+'/edu/eduTextbook?token='+token,null,{params:params})
		.success(function(res){
			succ(res)
		})
		.error(function(res){
			error(res)
		})
		
	}
	
	/**
	 * 删除课本
	 */
	this.delBook = function(id,succ,error){
		$http.delete(requireIp+'/edu/eduTextbook/'+id+'?token='+token)
		.success(function(res){
			succ(res)
		})
		.error(function(res){
			error(res)
		})
		
	}
	
	/**
	 * 保存册与章节调整方法
	 */
	this.saveTextBook  = function(params,succ,error){
		$http.post(requireIp+'/edu/eduTextbook/saveTextBook?token='+token,params)
		.success(function(res){
			succ(res)
		})
		.error(function(res){
			error(res)
		})
	}
	
	/**
	 * 根据学校Id查询学科
	 */
	this.getBookByOffice = function(officeId,succ,error){
		$http.post(requireIp+'/edu/eduSubject/findSubjectByOid?token='+token,{officeId:officeId})
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	
	/**
	 * 根据学校Id查询学段
	 */
	this.getLevelByOffice = function(officeId,succ,error){
		$http.post(requireIp+'/ea/eaOffice/findSchoolByOid?token='+token,{officeId:officeId,flag:'0',state:'1'})
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
	
	
	/**
	 * 保存学科、版本、年级段关联关系
	 */
	this.saveSubVerGrade = function(params,succ,error){
		$http.post(requireIp+'/edu/eduVersion/saveSubVerGrade?token='+token,params
		,{
			transformRequest: angular.identity, //使用angular传参认证
		    headers: {'Content-Type': undefined }
		})
		.success(function(res){
			succ(res)
		})
		.error(function(e){
			error(e)
		})
	}

	/**
	 * 根据年级段和学科查询版本
	 */
	this.findVerByGradeAndSub = function(params,succ,error){
		$http.get(requireIp+'/edu/eduVersion?token='+token,{params:params})
		.success(function(res) {
			succ(res)
		})
		.error(function(e) {
			error(e)
		})
	}
}])
