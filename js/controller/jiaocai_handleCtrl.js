app.controller('jiaocai_handleCtrl',['$scope','$timeout','textBookService','levelGradeMap',function($scope,$timeout,textBookService,levelGradeMap) {
	$scope.state = {
		levelList : [],
		subjectId : '',
		subjectName : '',
		subjectList:[],
		subjectType:[],
		versionList:[],
		gradeNoList:[],
		gradeNoVerList:[],
		addContent:'',
		addContentState:false,
		subjectEdit:false,
		editTitle:'',
		editTitleId:'',
		importAlert:false,
		addsection:false,
		fileshow:false,
		filename:'',
		filesize:'',
		filetype:'',
		levelIndex:0,
		levelName : '',
		levelId : '',
		versionId : '',
		addVersionId : '',
		versionName:'',
		editBookPid : '',
		versioinadd:1,
		schoolshowstate:false,
		levelShowState:false,
		schoolId:'',
		nodeIdMap:{},
		guanlian:false,
		gradeVerMap:{},
		userId:sessionStorage.getItem('userId'),
		userType : sessionStorage.getItem('scope'),
		oid:typeof(JSON.parse(sessionStorage.getItem('userObj')).oid)=='undefined'?'':JSON.parse(sessionStorage.getItem('userObj')).oid,
		oneFlag:true,
		areaId:sessionStorage.getItem('areaId'),
//		areaId:'78881913d0ce4b05b4a6b6455325a392',
		maxLength:40
	};
	
	/**
	 * 判断字符长度
	 */
	$scope.maxLength = function(val){
		if(val.length>$scope.state.maxLength){
			$scope.state.editTitle = val.substr(0,$scope.state.maxLength);
			poploading(true,'sb','最多输入'+$scope.state.maxLength+'个字符!',1000)
		}
			
	}
	
	/**
	 * 根据年级段和学科Id查询版本
	 */
	$scope.findVerByGradeAndSub = function(){
		var params = {levelId:$scope.state.levelId,subjectId:$scope.state.subjectId,gradeNo:'',areaId:$scope.state.areaId};
		textBookService.findVerByGradeAndSub(params,function(res){
			var gradeNoList = levelGradeMap[$scope.state.levelId];
			for(var i=0;i<gradeNoList.length;i++){
				gradeNoList[i].versionId = "";
			}
			if(res.ret == 200){
				$scope.state.gradeNoVerList = res.data;
				var temList = res.data;
				var verMap = {};
				for(var i=0;i<temList.length;i++){
					verMap[temList[i].gradeNo] = temList[i].id
				}
				for(var i=0;i<gradeNoList.length;i++){
					gradeNoList[i].versionId = verMap[gradeNoList[i].id]
				}
			}else{
				$scope.state.gradeNoVerList = [];
			}
			$scope.state.gradeNoList = gradeNoList;
		},function(res){
			$scope.state.gradeNoVerList = [];
			$scope.state.gradeNoList = levelGradeMap[$scope.state.levelId];
		})
	}
	
	
	/**
	 * 保存学科、年级段、版本关联关系
	 */
	$scope.saveGradeVer = function(){
		var list = [];
		for(var key in $scope.state.gradeVerMap){
			if($scope.state.gradeVerMap[key] != '' && typeof($scope.state.gradeVerMap[key])!='undefined'){
				var tem = {};
				tem['gradeNo'] = key;
				tem['versionId'] = $scope.state.gradeVerMap[key];
				tem['subjectId'] = $scope.state.subjectId;
				tem['areaId'] = $scope.state.areaId;
				list.push(tem);
			}
		}
		if(list.length == 0 && $scope.state.gradeNoVerList.length == 0){
			poploading(true,'sb','请选择需要关联的版本',1000)
			return;
		}
		if(list.length>0){
			var fd = new FormData();
			fd.append('list',angular.toJson(list));
			textBookService.saveSubVerGrade(fd,function(res){
				if(res.ret == 200){
					poploading(true,'cg','关联成功',1000);
					$scope.state.guanlian=false;
				}else{
					poploading(true,'sb',res.message,1000);
				}
			},function(res){
				
			})
		}else{
			poploading(true,'cg','关联成功',1000);
			$scope.state.guanlian=false;
		}
	}
	
	/**
	 * 关联年级弹窗 版本下拉框选择方法
	 */
	$scope.gradeVerChange = function(gradeNo,verId){
		$scope.state.gradeVerMap[gradeNo] = verId;
	}
	
	/**
	 * 查询不在该年级段下的相应学段、相应科目下的版本
	 */
	$scope.getNotGrade = function(gradeNo){
		var listFiled = 'gradeVerList_'+gradeNo;
		var notInparams = {notIn:'2',levelId:$scope.state.levelId,subjectId:$scope.state.subjectId,gradeNo:gradeNo,areaId:$scope.state.areaId};
		textBookService.getVersion(notInparams,function(res){
			if(res.ret == 200){
				$scope.state[listFiled] = res.data;
			}else{
				$scope.state[listFiled] = [];
			}
		},function(res){
			
		})
	}
	
	/**
	 * 关联年级
	 */
	$scope.relationGrade = function(){
		if($scope.state.subjectId == ''){
			poploading(true,'sb','请选择学科',1000)
			return;
		}
		
		$scope.state.guanlian=true
		
		$scope.findVerByGradeAndSub();
	}
	
	/**
	 * 获取选框中的学校Id
	 */
	$scope.selettypefn = function(schoolId){
		$scope.state.schoolId = schoolId;
	}
	
	$scope.pop = {
		loadingstate:false,
		imgurl:'./img/wonde_big.png',
		text:''
	};
	$scope.showschoolaction = function(){
		$scope.state.schoolshowstate = true;
		$scope.state.subjectType = [];
		$scope.data = [];
		$scope.state.subjectList = [];
		$scope.state.subjectType = [];
		$scope.state.subjectId = '';
		$scope.state.levelShowState = true;
		$scope.state.levelId = '';
//		$scope.state.levelList = [];
//		$scope.state.levelIndex = 0;
	}
	$scope.showxueduanaction = function(){
//		$scope.state.schoolId = '';
		$scope.state.levelIndex = 0;
		$scope.state.schoolshowstate = false;
		$scope.state.levelShowState = false;
		$scope.state.levelId = 1;
		$scope.getLevel();
	}
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
	
	
	/**
	 * 获取学段
	 */
	$scope.getLevel = function(){
		textBookService.getLevel('',function(res){
			if(res.ret == 200 && res.data.length>0){
				$scope.state.levelList = res.data;
				$scope.state.levelId = res.data[0].id;
				$scope.state.levelName = res.data[0].name;
				$scope.changeLevel($scope.state.levelIndex,{name:$scope.state.levelName,id:$scope.state.levelId});
			}else{
				$scope.state.levelList = []
			}
		},function(res){
			
		})
	}
	
	/**
	 * 选择学段事件
	 */
	$scope.changeLevel = function(index,level){
		$scope.state.levelName = level.name;
		$scope.state.levelId = level.id;
		$scope.state.levelIndex = index;
		$scope.state.versionList = [];
		$scope.data = [];
		$scope.state.subjectId = '';
		
		if(!$scope.state.schoolshowstate){
			$scope.state.subjectList = [];
			//获取学科
			var params = {leveId:$scope.state.levelId,areaId:$scope.state.areaId}
			textBookService.getSubjectByLevelId(params,function(res){
				if(res.ret == 200){
					$scope.state.subjectType = res.data;
				}else{
					$scope.state.subjectType = [];
				}
			},function(res){
				
			})
		}
	}
	
	/**
	 * 根据学校Id获取学科
	 */
	$scope.getBookByOffice = function(){
		
		if($scope.state.schoolId == ''){
			poploading(true,'sb','请选择学校',1000)
			return;
		}
		
		$scope.getLevelByOid($scope.state.schoolId);
		
		textBookService.getBookByOffice($scope.state.schoolId,function(res){
			if(res.ret == 200 && res.data.length>0){
				$scope.state.subjectType = res.data;
			}else{
				$scope.state.subjectType = [];
				poploading(true,'sb','暂无学科',1000)
			}
		},function(res){
			
		})
	}
	
	/**
	 * 获取版本
	 */
	$scope.subjectChange = function(subject){
		$scope.state.versionId = '';
		$scope.state.subjectId = subject==null?'':subject.id;
		$scope.state.subjectName = subject==null?'':subject.name;
		$scope.data = [];
		if(subject != null){
			var params = {subjectId:subject.id,levelId:$scope.state.levelId,areaId:$scope.state.areaId}
			textBookService.getVersion(params,function(res){
				if(res.ret == 200){
					$scope.state.subjectList = res.data;
				}else{
					poploading(true,'sb','暂无版本',1000)
					$scope.state.subjectList = [];
				}
			},function(res){
				
			})
			
			if(!$scope.state.schoolshowstate){
				var notInparams = angular.extend({notIn:'1'},params);
				textBookService.getVersion(notInparams,function(res){
					if(res.ret == 200){
						$scope.state.versionList = res.data;
					}else{
						$scope.state.versionList = [];
					}
				},function(res){
					
				})
			}
		}else{
			$scope.state.subjectList = [];
		}
	}
	
	/**
	 * 获取课本
	 */
	$scope.getTextBook =  function(versionId){
		$scope.state.versionId = versionId;
		var params = {subjectId:$scope.state.subjectId,levelId:$scope.state.levelId,versionId:versionId,isChapter:true}
		textBookService.getTextBook(params,function(res){
			if(res.ret == 200 && res.data.length>0){
				$scope.state.nodeIdMap = {};
				$scope.data = res.data;
			}else{
				$scope.data = [];
				poploading(true,'sb','暂无数据',1000)
			}
		},function(res){
			
		})
	}
	
	/**
	 * 选择版本事件
	 */
	$scope.selectVersion = function(index,versionId){
		$scope.state.sectionindex = index;
		$scope.state.addVersionId = versionId;
	}
	
	/**
	 * 保存版本
	 */
	$scope.saveVersion = function(){
		
		if($scope.state.versioinadd == 1&&$scope.state.sectionindex == undefined){
			poploading(true,'sb','请选择添加的版本',1500);
			return;
		}
		if($scope.state.versioinadd == 2&&$scope.state.editTitle == ''){
			poploading(true,'sb','请输入版本名称',1500);
			return;
		}
		var params = {levelId:$scope.state.levelId,subjectId:$scope.state.subjectId,createBy:$scope.state.userId,areaId:$scope.state.areaId};
		var subject = {id:$scope.state.subjectId,name:$scope.state.subjectName,areaId:$scope.state.areaId};
		if($scope.state.oneFlag){
			$scope.state.oneFlag = false;
			if($scope.state.versioinadd == 2){
				textBookService.saveVersion(angular.extend({name:$scope.state.editTitle},params),function(res){
					if(res.ret == 200){
						poploading(true,'cg','添加成功',1500);
						$scope.subjectChange(subject);
						$scope.insertVerBtn();
					}else{
						poploading(true,'sb',res.message,1500);
					}
					$scope.state.oneFlag = true;
				},function(res){
					$scope.state.oneFlag = true;
				});
			}else{
				textBookService.saveVerLevelSub(angular.extend({versionId:$scope.state.addVersionId},params),function(res){
					if(res.ret == 200){
						poploading(true,'cg','添加成功',1500);
						$scope.insertVerBtn();
						$scope.subjectChange(subject);
					}else{
						poploading(true,'sb',res.message,1500);
					}
					$scope.state.oneFlag = true;
				},function(res){
					$scope.state.oneFlag = true;
				})
			}
		}
	}
	
	/**
	 * 删除版本
	 */
	$scope.deleteVerLevelSub = function(versionId){
		var params = {levelId:$scope.state.levelId,subjectId:$scope.state.subjectId,versionId:versionId,updateBy:$scope.state.userId,areaId:$scope.state.areaId};
		var sbject = {id:$scope.state.subjectId,name:$scope.state.subjectName}
		textBookService.deleteVerLevelSub(params,function(res){
			if(res.ret == 200){
				poploading(true,'cg','删除成功',1500);
				$scope.subjectChange(sbject);
			}else{
				poploading(true,'sb',res.message,1500);
			}
		},function(res){
			
		})
	}
	
	/**
	 * 添加版本按钮
	 */
	$scope.insertVerBtn = function(){
		$scope.state.addsection = false;
		$scope.state.editTitle = '';
		$scope.state.versioinadd = 1;
		$scope.state.sectionindex = undefined;
		
	}
	
	/**
	 * 添加版本弹出框按钮
	 */
	$scope.addVerBoxBtn = function(){
		if($scope.state.subjectId == '' || $scope.state.subjectId == null){
			poploading(true,'sb','请选择科目',1500);
		}else{
			$scope.state.addsection = true;
			$scope.state.editTitle = '';
		}
	}
	
	/**
	 * 上传课本
	 */
	$scope.uploadBook = function(self){
		var fd = new FormData();
        var file = document.querySelector('#importbook').files[0];
        fd.append('file', file); 
        fd.append('levelId',$scope.state.levelId); 
        fd.append('subjectId',$scope.state.subjectId);
        fd.append('versionId',$scope.state.versionId);
        fd.append('createBy',$scope.state.userId);
        poploading(true,'sb','正在上传，请稍候...');
        textBookService.uploadBook(fd,function(res){
        	if(res.ret == 200){
        		poploading(true,'cg','上传成功！',1500);
        		$scope.getTextBook($scope.state.versionId);
        		$scope.closeimport();
        	}else{
        		poploading(true,'sb',res.message==''||typeof(res.message)=='undefined'?'上传失败！':res.message,1500);
        		$scope.errorImport();
        	}
        },function(res){
       		$scope.errorImport();
        });
	}
	
	$scope.bluraction = function(self){
		var verName  = self.innerText.trim();
		if(verName==''){
			poploading(true,'sb','请输入版本名称!',1500);
			return;
		}
		self.setAttribute('contenteditable',false);
		var params = {id:self.getAttribute("data-id"),name:verName,updateBy:$scope.state.userId,areaId:$scope.state.areaId}
		textBookService.updateVersion(params,function(res){
			if(res.ret == 200){
				poploading(true,'cg','修改成功！',1500);
				self.innerText = verName;
			}else{
				poploading(true,'sb',res.message,1500);
			}
		},function(res){
			
		})
	};
	$scope.addlistAction = function(){
		$scope.state.subjectList.push($scope.state.addContent);
		$scope.cancellistAction();
	};
	$scope.cancellistAction = function(){
		$scope.state.addContent = '';
		$scope.state.addContentState = false;
	};
	$scope.addStateAction = function(){
		$scope.state.addContentState = true;
	};
	$scope.editsubject = function(self,verName){
		angular.element(self.target).parent().parent().next().attr('contenteditable',true)
		self.target.parentNode.parentNode.nextElementSibling.focus();
	};
	
	
	
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
		var files = e.dataTransfer.files[0];
		$scope.$apply(function(){
			$scope.state.fileshow = true;
			$scope.state.filename = files.name;
			$scope.state.filesize = (files.size / 1024).toFixed(2) +'KB';
			$scope.state.filetype = files.type || '文件夹';
			
		})
	}, false);
	$scope.fileAction = function(event){
		var files = event.files[0];
		var suffix = files.name.substr(files.name.lastIndexOf('.')).toLowerCase();
		if(suffix == '.xlsx' || suffix == '.xls'){
			$scope.$apply(function(){
				$scope.state.fileshow = true;
				$scope.state.filename = files.name;
				$scope.state.filesize = (files.size / 1024).toFixed(2) +'KB';
				$scope.state.filetype = files.type || '文件夹';
			})
		}else{
			$scope.$apply(function(){
				poploading(true,'sb','请上传正确格式的文件!',1500);
			})
			var file = document.querySelector('#importbook');
			file.value = '';
		}
	};
	$scope.closeimport = function(){
		var file = document.querySelector('#importbook');
		file.value = '';
		$scope.state.fileshow = false;
		$scope.state.importAlert = false;
	};
	$scope.errorImport = function(){
		var file = document.querySelector('#importbook');
		file.value = '';
		$scope.state.fileshow = false;
	};
	$scope.importshow = function(){
		if($scope.state.subjectId == ''){
			poploading(true,'sb','请选择科目！',1500);
			return ;
		}
		if($scope.state.versionId == ''){
			poploading(true,'sb','请选择版本！',1500);
			return ;
		}
		$scope.state.importAlert = true;
	};
	$scope.downloadmodel = function(){
		textBookService.downTextBookModel();
	};
	
	/**
	 * 删除册与章节
	 */
	 $scope.removeBook = function (scope,id) {
	 	if(typeof($scope.state.nodeIdMap[id])!='undefined'||id.indexOf('-')==-1){
	 		textBookService.delBook(id.split('-')[0],function(res){
		 		if(res.ret == 200){
		 			delete $scope.state.nodeIdMap[id];
		 			poploading(true,'cg','删除成功！',1500);
		 			 scope.remove();
		 		}else{
		 			poploading(true,'sb','删除失败！',1500);
		 		}
		 	},function(res){
		 		
		 	})
	 	}else{
	 		scope.remove();
	 	}
      };

      $scope.toggle = function (scope) {
        scope.toggle();
      };
    
    /**
     * 编辑章节按钮
     * @param {Object} scope
     */
    $scope.editItem = function(scope){
		$scope.state.subjectEdit = true;
		$scope.state.editTitleId = scope.$modelValue.id;
		$scope.state.editTitle = scope.$modelValue.name;
		$scope.state.editBookPid = scope.$modelValue.pId;
    }
      $scope.moveLastToTheBeginning = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0, 0, a);
      };

     /**
      * 新增章节按钮
      * @param {Object} scope
      */
      $scope.newSubItem = function (scope) {
        var nodeData = scope.$modelValue;
    	nodeData.children.push({
    	  pId:nodeData.id.split('-')[0],
          id: $scope.getUUID() + '-' + nodeData.children.length+1,
          name: '新增节点 —— 第' + (nodeData.children.length + 1) + '个',
          children: []
        });
      };
      function eachObj(obj,nodeid,nodetit){
      	if(obj.id == nodeid){
      		obj.name = nodetit;
      		return false;
      	}else{
      		if(typeof(obj.children)!= 'undefined'){
      			obj.children.forEach(function(v){
      				eachObj(v,nodeid,nodetit)
      			})
      		}
      	}
      	
      }
      $scope.canceledit = function(){
      	$scope.state.subjectEdit = false;
      };
      
      /**
       * 保存章节
       */
      $scope.sureEdit = function(){
      	var nodeid = $scope.state.editTitleId;
      	var title = $scope.state.editTitle.trim();
      	var pid = $scope.state.editBookPid;
      	$scope.state.editTitle = '';
      	if(title==''){
      		poploading(true,'sb','请输入节点名称！',1500);
      		return;
      	}
      		
      	if(nodeid.indexOf('-') == -1||typeof($scope.state.nodeIdMap[nodeid])!='undefined'){
      		var params = {name :title,id:nodeid.split('-')[0],updateBy:$scope.state.userId};
      		textBookService.updateBook(params,function(res){
      			if(res.ret == 200){
      				poploading(true,'cg','修改成功！',1500);
      				$scope.data.forEach(function(val){
			      		eachObj(val,nodeid,title);
			      	});
      			}else{
      				poploading(true,'sb',res.message==''||typeof(res.message)=='undefined'?'修改失败':res.message,1500);
      			}
      		},function(res){
      			poploading(true,'sb','修改失败！',1500);
      		})
      	}else{
      		var insertParams = {id:nodeid.split('-')[0],parentId:pid,name:title,sort:nodeid.split('-')[1],createBy:$scope.state.userId};
      		textBookService.insertBook(insertParams,function(res){
      			if(res.ret == 200){
      				poploading(true,'cg','添加成功！',1500);
      				$scope.data.forEach(function(val){
			      		eachObj(val,nodeid,title);
			      	});
			      	$scope.state.nodeIdMap[nodeid] = nodeid;
      			}else{
      				poploading(true,'sb',res.message==''||typeof(res.message)=='undefined'?'添加失败':res.message,1500);
      			}
      		},function(res){
      			
      		})
      	}
      	$scope.state.subjectEdit = false;
      };
      
      /**
       * 册与章节保存按钮
       */
      $scope.saveimport = function(){
      	var params = {json:JSON.stringify($scope.data),levelId:$scope.state.levelId,subjectId:$scope.state.subjectId,versionId:$scope.state.versionId,createBy:$scope.state.userId};
      	textBookService.saveTextBook(params,function(res){
      		if(res.ret == 200){
      			poploading(true,'cg','保存成功！',1500);
      			$scope.getTextBook($scope.state.versionId);
      		}else{
      			poploading(true,'sb',res.message==''||typeof(res.message)=='undefined'?'保存失败':res.message,1500);
      		}
      	},function(res){
      		
      	})
      }
      
    /**
	 * 根据学校Id获取学段
	 */
	$scope.getLevelByOid = function(schoolId){
		$scope.state.levelId = '';
		textBookService.getLevelByOffice(schoolId,function(res){
			if(res.ret == 200){
				var schoolLevelList = res.data.schoolLevelList
				if(schoolLevelList.length==1){
					$scope.state.levelId = res.data.schoolLevelList[0].id;
				}
				if(schoolLevelList.length>1){
					for(var i=0;i<schoolLevelList.length;i++){
						$scope.state.levelId += schoolLevelList[i].id+',';
					}
				}
			}
		},function(res){
		})
	}
      /**
       * js 生成uuid
       */
      $scope.getUUID = function(){
      	var len = 32; //32长度
      	var radix = 16; //16进制
      	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
      	var uuid = [],
      		i;
      	radix = radix || chars.length;
      	if(len) {
      		for(i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
      	} else {
      		var r;
      		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      		uuid[14] = '4';
      		for(i = 0; i < 36; i++) {
      			if(!uuid[i]) {
      				r = 0 | Math.random() * 16;
      				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      			}
      		}
      	}
      	return uuid.join('');
      }
      
    if($scope.state.userType == 4){
		$scope.state.schoolId = $scope.state.oid;
		$scope.showschoolaction();
		$scope.getBookByOffice();
	}else{
		$scope.getLevel();
	}
}])