app.controller('jigouHandleCtrl', ['$scope', '$timeout', '$filter', 'loginService', '$http', '$state','$stateParams', function ($scope, $timeout, $filter, loginService, $http, $state,$stateParams) {
    // sessionStorage.setItem('tableChange',0);
    var areaIdGrade = "";
    var flagReturn = true;
    var currentPage = 1;
    var pageSize = 10;
    if (sessionStorage.getItem('tableChangeP') == null) {
        sessionStorage.setItem('tableChangeP', 0)
    }
    var teachStatus = JSON.parse(sessionStorage.getItem('userObj')).teachStatus || null;
    var teachMain = {
        teaId: sessionStorage.getItem('userId')
    }
    $scope.parentPaginationOnline = {};
    $scope.parentPaginationStop = {};
    $scope.parentPaginationRecover = {};
    $scope.parentPaginationOnline.pagesLength = 10;
    $scope.parentPaginationStop.pagesLength = 10;
    $scope.parentPaginationRecover.pagesLength = 10;
    //数据
    $scope.state = {
        headTab: sessionStorage.getItem('tableChangeP'), //判断头部选项卡
        allchecked: false, //家长注册-判断是否选中
        allStopchecked: false, //家长注册-判断是否选中
        allcheckedRecover: false, //回收-判断是否选中
        warningShow: false,
        parentsOnlineCount: 0,
        deletStatus: false,
        imgNotice: 'img/wonde_big.png',
        sureDeletContent: '确认删除所选机构？',
        amendState: teachStatus,
        AddState: false,
        modelDown: requireIp,
    }
    
    $scope.newkeyword="";
    
    //路由传参
	if($stateParams.tableChange){
        $scope.state.headTab = $stateParams.tableChange;
    }
    
    $scope.parentsList = {
        areaId: '',
        schoolGrade: '',
        checkboxArr: [],
        checkboxStopArr: [],
        checkboxReArr: [],
        gradeList: [
        ],
        classList: [
            {
                name: '全部',
                id: 'all'
            },
        ],
        tableMsgList: [
        ],
        tableMsgStop: [
        ],
        tableMsgListRecover: [
        ]
    };
    if (sessionStorage.getItem("scope") == 2) {
        areaIdGrade = sessionStorage.getItem("areaId");
        success();
    } else if (sessionStorage.getItem("scope") == 3) {
        $http.post(requireIp + '/uc/ucUser/findUserInfoUserId', {
            userId: sessionStorage.getItem("userId"),
            userType: sessionStorage.getItem("userType")
        }).success(function (dataUser) {
            console.log(dataUser);
            console.log(dataUser.ret);
            console.log(dataUser.data.userInfo.areaId);
            if (dataUser.ret == 200) {
                areaIdGrade = dataUser.data.userInfo.areaId;
                console.log(dataUser.data.userInfo.areaId);
                success();
            } else {
                $scope.parentsList.tableMsgList = "";
                $scope.state.parentsOnlineCount = 0;
                $scope.parentsList.tableMsgStop = "";
                $scope.state.parentsStopCount = 0;
                $scope.parentsList.tableMsgListRecover = "";
                $scope.state.parentsRecoverCount = 0;
            }
        })
    } else {
        $scope.parentsList.tableMsgList = "";
        $scope.state.parentsOnlineCount = 0;
        $scope.parentsList.tableMsgStop = "";
        $scope.state.parentsStopCount = 0
        $scope.parentsList.tableMsgListRecover = "";
        $scope.state.parentsRecoverCount = 0;
    };
    if (!flagReturn) {
        return false;
    }

    function success() {

        console.log(areaIdGrade);
        $http.post(requireIp + '/ea/eaOffice/findSchoolList', {
            flag: '0',
            state: '1',
            name: '',
            areaIds: areaIdGrade,
            pageNo: currentPage,
            pageSize: pageSize
        }).success(function (data) {
            console.log(data);
            if (data.ret == 200) {
                $timeout(function () {
                    $scope.parentsList.tableMsgList = data.data.schoolList;
                    $scope.state.parentsOnlineCount = data.data.schoolCount;
                    $scope.parentPaginationOnline.totalItems = data.data.schoolCount;
                })
            } else {
                $scope.parentsList.tableMsgList = "";
                $scope.state.parentsOnlineCount = 0;
                $scope.parentPaginationOnline.totalItems = "";
            }

        })
        $http.post(requireIp + '/ea/eaOffice/findSchoolList', {
            flag: '0',
            state: '2',
            name: '',
            areaIds: areaIdGrade,
            pageNo: currentPage,
            pageSize: pageSize
        }).success(function (data) {
            console.log(data);
            if (data.ret == 200) {
                $scope.parentsList.tableMsgStop = data.data.schoolList;
                $scope.state.parentsStopCount = data.data.schoolCount;
                $scope.parentPaginationStop.totalItems = data.data.schoolCount;
            } else {
                $scope.parentsList.tableMsgStop = "";
                $scope.state.parentsStopCount = 0;
                $scope.parentPaginationStop.totalItems = "";
            }

        })
        $http.post(requireIp + '/ea/eaOffice/findSchoolList', {
            flag: '3',
            state: '',
            name: '',
            areaIds: areaIdGrade,
            pageNo: currentPage,
            pageSize: pageSize
        }).success(function (data) {
            console.log(data);
            if (data.ret == 200) {
                $scope.parentsList.tableMsgListRecover = data.data.schoolList;
                $scope.state.parentsRecoverCount = data.data.schoolCount;
                $scope.parentPaginationRecover.totalItems = data.data.schoolCount;
            } else {
                $scope.parentsList.tableMsgListRecover = "";
                $scope.state.parentsRecoverCount = 0;
                $scope.parentPaginationRecover.totalItems = "";
            }
        })




        //修改机构
        $scope.updateSchoolMsg = function (data, flag, state) {
            $state.go('teacher_index.editorJigou', {
                officeId: data,
                flag: flag,
                state: state
            });
        }

        if (sessionStorage.getItem("scope") == 2) {
            //添加机构
            $scope.addParentInfo = function () {
                $scope.state.AddState = true;
                $http.post(requireIp + '/ea/eaArea/findAreaListByAreaId', {
                    areaId: sessionStorage.getItem("areaId")
                }).success(function (data) {
                    console.log(data);
                    $scope.areaa = data.data;
                })
            };
        } else if (sessionStorage.getItem("scope") == 3) {
            $scope.addParentInfo = function () {
                $scope.state.AddState = true;
                $http.post(requireIp + '/ea/eaArea/getAreaByAreaId', {
                    areaId: areaIdGrade
                }).success(function (data) {
                    if (data.ret == 200) {
                        $scope.areaa = data.data;
                    } else {
                        $scope.areaa = "";
                    }
                })
            };
        } else {
            $scope.areaa = "";
        };
        $scope.selSchoolArea = function () {
            console.log($scope.parentsList.areaId)
        }
        var isQuery = true;
        // 创建机构，提交按钮
        $scope.submitOfficeMsg = function () {
            console.log($scope.officeName)
            console.log($scope.parentsList.areaId)
            console.log($scope.officeType)
            if (isQuery) {
//                isQuery = false;
                if ($scope.officeName == undefined || $scope.officeName == "" || $scope.parentsList.areaId == undefined || $scope.parentsList.areaId == "" || $scope.officeType == undefined || $scope.officeType == "") {
//                    $scope.state.AddState = false;
                    $scope.state.warningShow = true;
                    $scope.state.imgNotice = 'img/wonde_big.png';
                    $scope.state.noteContent = '请填写完整';
                    $timeout(function () {
                        $scope.state.warningShow = false;
                    }, 1000);
                    return false;
                }
                $http.post(requireIp + '/ea/eaOffice/saveOfficeAndGrade', {
                    name: $scope.officeName,
                    type: '1',
                    areaId: $scope.parentsList.areaId,
                    grade: $scope.officeType,
                    createBy: sessionStorage.getItem('userId')
                }).success(function (data) {
                    $scope.state.AddState = false;
                    console.log(data);
                    if (data.ret == "200") {
                        $scope.state.AddState = false;
                        $scope.state.warningShow = true;
                        $scope.state.imgNotice = 'img/chenggong.png';
                        $scope.state.noteContent = '添加成功!';
                        $timeout(function () {
                            $scope.state.warningShow = false;
                        }, 1000);
                        location.reload();
                        isQuery = true;
                        return false;
                    } else {
                        $scope.state.warningShow = true;
                        $scope.state.imgNotice = 'img/wonde_big.png';
                        $scope.state.noteContent = data.message;
                        $timeout(function () {
                            $scope.state.warningShow = false;
                        }, 1000);
                        isQuery = true;
                        return false;
                    }
                    //$scope.areaa = data.data;
                })
            }

        }
        $scope.closeTea = function () {
            $scope.parentsList.areaId = "";
            $scope.officeType = "";
            $scope.officeName = "";
            //添加弹框
            $scope.state.AddState = false;
            //修改弹框
            $scope.state.UpdateState = false;
        }
        //点击hide删除弹窗
        $scope.gbtc = function () {
            $scope.state.deletStatus3 = false;
            $scope.state.deletStatus2 = false;
            $scope.state.deletStatus1 = false;
        };
        //确认删除
        $scope.suredel = function (flags) {
            console.info("删除窗口" + flags)
            if (flags == 3) {
                $http.post(requireIp + '/ea/eaOffice/delAndrRestoreOffice', {
                    ids: $scope.parentsList.checkboxArr.join(','),
                    flag: '3'
                }).success(function (data) {
                    console.log(data);
                    if (data.ret == "200") {
                        $scope.state.AddState = false;
                        $scope.state.warningShow = true;
                        $scope.state.imgNotice = 'img/chenggong.png';
                        $scope.state.noteContent = '删除成功!';
                        $timeout(function () {
                            $scope.state.warningShow = false;
                        }, 1000);
                        location.reload();
                        return false;

                    } else {
                        $scope.state.warningShow = true;
                        $scope.state.imgNotice = 'img/wonde_big.png';
                        $scope.state.noteContent = '操作失败!';
                        $timeout(function () {
                            $scope.state.warningShow = false;
                        }, 1000);
                        return false;
                    }

                })
            } else if (flags == 2) {
                $http.post(requireIp + '/ea/eaOffice/delAndrRestoreOffice', {
                    ids: $scope.parentsList.checkboxStopArr.join(','),
                    flag: '3'
                }).success(function (data) {
                    console.log(data);
                    if (data.ret == "200") {
                        $scope.state.AddState = false;
                        $scope.state.warningShow = true;
                        $scope.state.imgNotice = 'img/chenggong.png';
                        $scope.state.noteContent = '删除成功!';
                        $timeout(function () {
                            $scope.state.warningShow = false;
                        }, 1000);
                        location.reload();
                        return false;

                    } else {
                        $scope.state.warningShow = true;
                        $scope.state.imgNotice = 'img/wonde_big.png';
                        $scope.state.noteContent = '操作失败!';
                        $timeout(function () {
                            $scope.state.warningShow = false;
                        }, 1000);
                        return false;
                    }
                })
            } else {
                $http.post(requireIp + '/ea/eaOffice/delAndrRestoreOffice', {
                    ids: $scope.parentsList.checkboxReArr.join(','),
                    flag: '1'
                }).success(function (data) {
                    console.log(data);
                    if (data.ret == "200") {
                        $scope.state.AddState = false;
                        $scope.state.warningShow = true;
                        $scope.state.imgNotice = 'img/chenggong.png';
                        $scope.state.noteContent = '删除成功!';
                        $timeout(function () {
                            $scope.state.warningShow = false;
                        }, 1000);
                        location.reload();
                        return false;

                    } else {
                        $scope.state.warningShow = true;
                        $scope.state.imgNotice = 'img/wonde_big.png';
                        $scope.state.noteContent = '操作失败!';
                        $timeout(function () {
                            $scope.state.warningShow = false;
                        }, 1000);
                        return false;
                    }
                })
            }
            $scope.state.deletStatus1 = false;
            $scope.state.deletStatus2 = false;
            $scope.state.deletStatus3 = false;
        }

        //审核、停用 重置密码
        $scope.parentonlineAction = function (state) {
            if (!$scope.parentsList.checkboxArr.length) {
                $scope.state.warningShow = true;
                $scope.state.imgNotice = 'img/wonde_big.png';
                $scope.state.noteContent = '请至少选择一项!';
                $timeout(function () {
                    $scope.state.warningShow = false;
                }, 1000);
                return false;
            } else {
                console.info("选中" + $scope.parentsList.checkboxArr.length)
                console.info($scope.parentsList.checkboxArr)
                console.info($scope.parentsList.checkboxArr.join(','))
                $http.post(requireIp + '/ea/eaOffice/changeOfficeMsg', {
                    ids: $scope.parentsList.checkboxArr.join(','),
                    state: '2'
                }).success(function (data) {
                    console.log(data);
                    //$scope.areaa = data.data;
                    if (data.ret == "200") {
                        $scope.state.AddState = false;
                        $scope.state.warningShow = true;
                        $scope.state.imgNotice = 'img/chenggong.png';
                        $scope.state.noteContent = '操作成功!';
                        $timeout(function () {
                            $scope.state.warningShow = false;
                        }, 1000);
                        location.reload()
                        return false;

                    } else {
                        $scope.state.warningShow = true;
                        $scope.state.imgNotice = 'img/wonde_big.png';
                        $scope.state.noteContent = '操作失败!';
                        $timeout(function () {
                            $scope.state.warningShow = false;
                        }, 1000);
                        return false;
                    }
                })
            }
        };
        //家长停用内的 启用 删除
        $scope.parentStopAction = function (state) {
            if (!$scope.parentsList.checkboxStopArr.length) {
                $scope.state.warningShow = true;
                $scope.state.imgNotice = 'img/wonde_big.png';
                $scope.state.noteContent = '请至少选择一项!';
                $timeout(function () {
                    $scope.state.warningShow = false;
                }, 1000);
                return false;
            } else {
                console.info("选中" + $scope.parentsList.checkboxStopArr.length)
                console.info($scope.parentsList.checkboxStopArr)
                console.info($scope.parentsList.checkboxStopArr.join(','))
                $http.post(requireIp + '/ea/eaOffice/changeOfficeMsg', {
                    ids: $scope.parentsList.checkboxStopArr.join(','),
                    state: '1'
                }).success(function (data) {
                    console.log(data);
                    if (data.ret == "200") {
                        $scope.state.AddState = false;
                        $scope.state.warningShow = true;
                        $scope.state.imgNotice = 'img/chenggong.png';
                        $scope.state.noteContent = '操作成功!';
                        $timeout(function () {
                            $scope.state.warningShow = false;
                        }, 1000);
                        location.reload();
                        return false;

                    } else {
                        $scope.state.warningShow = true;
                        $scope.state.imgNotice = 'img/wonde_big.png';
                        $scope.state.noteContent = '操作失败!';
                        $timeout(function () {
                            $scope.state.warningShow = false;
                        }, 1000);
                        return false;
                    }
                })
            }
        }
        //点击头部的确认删除按钮
        $scope.parentDeleAction = function (status) {
            switch (status) {
                case 'delete':
                    console.info($scope.parentsList.checkboxArr.length)
                    if (!$scope.parentsList.checkboxArr.length) {
                        $scope.state.warningShow = true;
                        $scope.state.imgNotice = 'img/wonde_big.png';
                        $scope.state.noteContent = '请至少选择一项!';
                        $timeout(function () {
                            $scope.state.warningShow = false;
                        }, 1000);
                        return false;
                    }
                    $scope.state.sureDeletContent = '确认删除所选机构？'
                    $scope.state.deletStatus3 = true;
                    break;
                case 'stop':
                    if (!$scope.parentsList.checkboxStopArr.length) {
                        $scope.state.warningShow = true;
                        $scope.state.imgNotice = 'img/wonde_big.png';
                        $scope.state.noteContent = '请至少选择一项!';
                        $timeout(function () {
                            $scope.state.warningShow = false;
                        }, 1000);
                        return false;
                    }
                    $scope.state.sureDeletContent = '确认删除所选机构？'
                    $scope.state.deletStatus2 = true;
                    break;
                case 'recover':
                    if (!$scope.parentsList.checkboxReArr.length) {
                        $scope.state.warningShow = true;
                        $scope.state.imgNotice = 'img/wonde_big.png';
                        $scope.state.noteContent = '请至少选择一项!';
                        $timeout(function () {
                            $scope.state.warningShow = false;
                        }, 1000)
                        return false
                    }
                    $scope.state.sureDeletContent = '确认彻底删除所选机构？(该操作不可恢复)'
                    $scope.state.deletStatus1 = true;
                    break;
            }

        }

        var schoolId = {
            officeId: JSON.parse(sessionStorage.getItem('userObj')).oid
        }

        var parentMainClassId = '';
        var gradeListStatus = JSON.parse(sessionStorage.getItem('userObj')).teachStatus;
        var onlineState = [];
        var onlineName = [];
        //头部选项卡
        $scope.changeTable = function (change) {
            if (change == 0) {
                $http.post(requireIp + '/ea/eaOffice/findSchoolList', {
                    flag: '0',
                    state: '1',
                    name: $scope.state.parentOnlineSearch,
                    areaIds: areaIdGrade,
                    pageNo: currentPage,
                    pageSize: pageSize
                }).success(function (data) {
                    console.log(data);
                    if (data.ret == 200) {
                        $scope.parentsList.tableMsgList = data.data.schoolList;
                        $scope.state.parentsOnlineCount = data.data.schoolCount;
                        $scope.parentPaginationOnline.totalItems = data.data.schoolCount;

                    } else {
                        $scope.parentsList.tableMsgList = "";
                        $scope.state.parentsOnlineCount = 0;
                        $scope.parentPaginationOnline.totalItems = "";
                    }
                })
            } else if (change == 1) {
                $http.post(requireIp + '/ea/eaOffice/findSchoolList', {
                    flag: '0',
                    state: '2',
                    name: $scope.state.parentStopSearch,
                    areaIds: areaIdGrade,
                    pageNo: currentPage,
                    pageSize: pageSize
                }).success(function (data) {
                    console.log(data);
                    if (data.ret == 200) {
                        $scope.parentsList.tableMsgStop = data.data.schoolList;
                        $scope.state.parentsStopCount = data.data.schoolCount;
                        $scope.parentPaginationStop.totalItems = data.data.schoolCount;
                    } else {
                        $scope.parentsList.tableMsgStop = "";
                        $scope.state.parentsStopCount = 0;
                        $scope.parentPaginationStop.totalItems = "";
                    }
                })
            } else if (change == 2) {
                $http.post(requireIp + '/ea/eaOffice/findSchoolList', {
                    flag: '3',
                    state: '',
                    name: $scope.state.parentRecoverSearch,
                    areaIds: areaIdGrade,
                    pageNo: currentPage,
                    pageSize: pageSize
                }).success(function (data) {
                    console.log(data);
                    if (data.ret == 200) {
                        $scope.parentsList.tableMsgListRecover = data.data.schoolList;
                        $scope.state.parentsRecoverCount = data.data.schoolCount;
                        $scope.parentPaginationRecover.totalItems = data.data.schoolCount;

                    } else {
                        $scope.parentsList.tableMsgListRecover = "";
                        $scope.state.parentsRecoverCount = 0;
                        $scope.parentPaginationRecover.totalItems = "";
                    }
                })
            }
            $scope.state.headTab = change;
            sessionStorage.setItem('tableChangeP', change)
            
            $state.go('teacher_index.jigou',{'tableChange':change})
        }
        //点击注册家长全选
        $scope.clickallCheck = function (event) {
            if ($scope.state.allchecked) {
                $scope.parentsList.checkboxArr = [];
                $scope.parentsList.tableMsgList.forEach(function (v) {
                    $scope.parentsList.checkboxArr.push(v.id);
                    onlineState.push(v.state);
                    onlineName.push(v.prarentsName);
                })
            } else {
                $scope.parentsList.checkboxArr = [];
                onlineState = [];
                onlineName = [];
            }
        }
        //点击停用全选
        $scope.clickStopCheck = function (event) {
            if ($scope.state.allStopchecked) {
                $scope.parentsList.checkboxStopArr = [];
                $scope.parentsList.tableMsgStop.forEach(function (v) {
                    $scope.parentsList.checkboxStopArr.push(v.id);
                })
            } else {
                $scope.parentsList.checkboxStopArr = [];
            }
        }
        //点击回收站全选
        $scope.clickRecoverCheck = function (event) {
            if ($scope.state.allcheckedRecover) {
                $scope.parentsList.checkboxReArr = [];
                $scope.parentsList.tableMsgListRecover.forEach(function (v) {
                    $scope.parentsList.checkboxReArr.push(v.id)
                })
            } else {
                $scope.parentsList.checkboxReArr = [];
            }
        }
        //家长注册单选的选中状态
        $scope.isChecked = function (id) {
            return $scope.parentsList.checkboxArr.indexOf(id) >= 0
        }
        //家长停用单选的选中状态
        $scope.isStopChecked = function (id) {
            return $scope.parentsList.checkboxStopArr.indexOf(id) >= 0
        }
        //回收站单选的选中状态
        $scope.isCheckedRecover = function (id) {
            return $scope.parentsList.checkboxReArr.indexOf(id) >= 0
        }
        //家长注册点击单个checkbox
        $scope.changeCheckbox = function (event, item) {
            var action = event.target.checked ? 'add' : 'remove';
            if (action == 'add' && $scope.parentsList.checkboxArr.indexOf(item.id) == -1) {
                $scope.parentsList.checkboxArr.push(item.id);
                //      	onlineState.push(v.state);
                //          onlineName.push(v.prarentsName);
                if ($scope.parentsList.checkboxArr.length == $scope.parentsList.tableMsgList.length) {
                    $scope.state.allchecked = true;
                }
            };
            if (action == 'remove' && $scope.parentsList.checkboxArr.indexOf(item.id) != -1) {
                var inx = $scope.parentsList.checkboxArr.indexOf(item.id);
                var sta = onlineState.indexOf(item.state);
                var rea = onlineName.indexOf(item.prarentsName);
                $scope.parentsList.checkboxArr.splice(inx, 1);
                onlineState.splice(sta, 1);
                onlineName.splice(rea, 1);
                $scope.state.allchecked = false;
            }
        }
        //家长停用点击单个checkbox
        $scope.changeStopCheckbox = function (event, id) {
            var action = event.target.checked ? 'add' : 'remove';
            if (action == 'add' && $scope.parentsList.checkboxStopArr.indexOf(id) == -1) {
                $scope.parentsList.checkboxStopArr.push(id);
                if ($scope.parentsList.checkboxStopArr.length == $scope.parentsList.tableMsgStop.length) {
                    $scope.state.allStopchecked = true;
                }
            }
            if (action == 'remove' && $scope.parentsList.checkboxStopArr.indexOf(id) != -1) {
                var inx = $scope.parentsList.checkboxStopArr.indexOf(id);
                $scope.parentsList.checkboxStopArr.splice(inx, 1);
                $scope.state.allStopchecked = false;
            }
        }
        //回收站点击单个checkbox
        $scope.changeRecoverCheckbox = function (event, id) {
            var action = event.target.checked ? 'add' : 'remove';
            if (action == 'add' && $scope.parentsList.checkboxReArr.indexOf(id) == -1) {
                $scope.parentsList.checkboxReArr.push(id);
                if ($scope.parentsList.checkboxReArr.length == $scope.parentsList.tableMsgListRecover.length) {
                    $scope.state.allcheckedRecover = true
                }
            }
            if (action == 'remove' && $scope.parentsList.checkboxReArr.indexOf(id) != -1) {
                var inx = $scope.parentsList.checkboxReArr.indexOf(id);
                $scope.parentsList.checkboxReArr.splice(inx, 1);
                $scope.state.allcheckedRecover = false;
            }
        }
        //回收站头部按钮事件--还原
        $scope.parentRecoverAction = function (change) {
            if (!$scope.parentsList.checkboxReArr.length) {
                $scope.state.warningShow = true;
                $scope.state.imgNotice = 'img/wonde_big.png';
                $scope.state.noteContent = '请至少选择一项!';
                $timeout(function () {
                    $scope.state.warningShow = false;
                }, 1000)
                return false
            } else {
                $http.post(requireIp + '/ea/eaOffice/delAndrRestoreOffice', {
                    ids: $scope.parentsList.checkboxReArr.join(','),
                    flag: '0'
                }).success(function (data) {
                    console.log(data);
                    if (data.ret == "200") {
                        $scope.state.AddState = false;
                        $scope.state.warningShow = true;
                        $scope.state.imgNotice = 'img/chenggong.png';
                        $scope.state.noteContent = '操作成功!';
                        $timeout(function () {
                            $scope.state.warningShow = false;
                        }, 1000);
                        location.reload();
                        return false;

                    } else {
                        $scope.state.warningShow = true;
                        $scope.state.imgNotice = 'img/wonde_big.png';
                        $scope.state.noteContent = '操作失败!';
                        $timeout(function () {
                            $scope.state.warningShow = false;
                        }, 1000);
                        return false;
                    }
                })
            }

        }
        $scope.onkeydown = function (data,event) {
        	
            if (data == "online") {
            	if(event.keyCode == 13) {
            			$scope.newkeyword=$scope.state.parentOnlineSearch;
						$http.post(requireIp + '/ea/eaOffice/findSchoolList', {
	                    flag: '0',
	                    state: '1',
	                    name: $scope.state.parentOnlineSearch,
	                    areaIds: areaIdGrade,
	                    pageNo: currentPage,
	                    pageSize: pageSize,
	                    grade: $scope.parentsList.schoolGrade
	                }).success(function (data) {
	                    console.log(data);
	                    if (data.ret == 200) {
	                        $scope.parentsList.tableMsgList = data.data.schoolList;
	                        $scope.state.parentsOnlineCount = data.data.schoolCount;
	                        $scope.parentPaginationOnline.totalItems = data.data.schoolCount;
	                    } else {
	                        $scope.parentsList.tableMsgList = "";
	                        $scope.state.parentsOnlineCount = 0;
	                        $scope.parentPaginationOnline.totalItems = "";
	
	                    }
	                })
				}
            	
            	
                
            } else if (data == "stop") {
            	if(event.keyCode == 13) {
            		$scope.newkeyword=$scope.state.parentOnlineSearch;
	                $http.post(requireIp + '/ea/eaOffice/findSchoolList', {
	                    flag: '0',
	                    state: '2',
	                    name: $scope.state.parentStopSearch,
	                    areaIds: areaIdGrade,
	                    pageNo: currentPage,
	                    pageSize: pageSize,
	                    grade: $scope.parentsList.schoolGrade
	                }).success(function (data) {
	                    console.log(data);
	                    if (data.ret == 200) {
	                        $scope.parentsList.tableMsgStop = data.data.schoolList;
	                        $scope.state.parentsStopCount = data.data.schoolCount;
	                        $scope.parentPaginationStop.totalItems = data.data.schoolCount;
	                    } else {
	                        $scope.parentsList.tableMsgStop = "";
	                        $scope.state.parentsStopCount = 0;
	                        $scope.parentPaginationStop.totalItems = "";
	                    }
	                })
                }
            } else if (data == "recover") {
            	if(event.keyCode == 13) {
            		$scope.newkeyword=$scope.state.parentOnlineSearch;
	                $http.post(requireIp + '/ea/eaOffice/findSchoolList', {
	                    flag: '3',
	                    state: '',
	                    name: $scope.state.parentRecoverSearch,
	                    areaIds: areaIdGrade,
	                    pageNo: currentPage,
	                    pageSize: pageSize,
	                    grade: $scope.parentsList.schoolGrade
	                }).success(function (data) {
	                    console.log(data);
	                    if (data.ret == 200) {
	                        $scope.parentsList.tableMsgListRecover = data.data.schoolList;
	                        $scope.state.parentsRecoverCount = data.data.schoolCount;
	                        $scope.parentPaginationRecover.totalItems = data.data.schoolCount;
	
	                    } else {
	                        $scope.parentsList.tableMsgListRecover = "";
	                        $scope.state.parentsRecoverCount = 0;
	                        $scope.parentPaginationRecover.totalItems = "";
	                    }
	                })
	            }
            }
        }

        //机构名称查询onkeydown
        $scope.handleSearch = function (data) {
            if (data == "online") {
            	$scope.newkeyword=$scope.state.parentOnlineSearch;
                $http.post(requireIp + '/ea/eaOffice/findSchoolList', {
                    flag: '0',
                    state: '1',
                    name: $scope.state.parentOnlineSearch,
                    areaIds: areaIdGrade,
                    pageNo: currentPage,
                    pageSize: pageSize,
                    grade: $scope.parentsList.schoolGrade
                }).success(function (data) {
                    console.log(data);
                    if (data.ret == 200) {
                        $scope.parentsList.tableMsgList = data.data.schoolList;
                        $scope.state.parentsOnlineCount = data.data.schoolCount;
                        $scope.parentPaginationOnline.totalItems = data.data.schoolCount;
                    } else {
                        $scope.parentsList.tableMsgList = "";
                        $scope.state.parentsOnlineCount = 0;
                        $scope.parentPaginationOnline.totalItems = "";

                    }
                })
            } else if (data == "stop") {
            	$scope.newkeyword=$scope.state.parentOnlineSearch;
                $http.post(requireIp + '/ea/eaOffice/findSchoolList', {
                    flag: '0',
                    state: '2',
                    name: $scope.state.parentStopSearch,
                    areaIds: areaIdGrade,
                    pageNo: currentPage,
                    pageSize: pageSize,
                    grade: $scope.parentsList.schoolGrade
                }).success(function (data) {
                    console.log(data);
                    if (data.ret == 200) {
                        $scope.parentsList.tableMsgStop = data.data.schoolList;
                        $scope.state.parentsStopCount = data.data.schoolCount;
                        $scope.parentPaginationStop.totalItems = data.data.schoolCount;
                    } else {
                        $scope.parentsList.tableMsgStop = "";
                        $scope.state.parentsStopCount = 0;
                        $scope.parentPaginationStop.totalItems = "";
                    }
                })
            } else if (data == "recover") {
            	$scope.newkeyword=$scope.state.parentOnlineSearch;
                $http.post(requireIp + '/ea/eaOffice/findSchoolList', {
                    flag: '3',
                    state: '',
                    name: $scope.state.parentRecoverSearch,
                    areaIds: areaIdGrade,
                    pageNo: currentPage,
                    pageSize: pageSize,
                    grade: $scope.parentsList.schoolGrade
                }).success(function (data) {
                    console.log(data);
                    if (data.ret == 200) {
                        $scope.parentsList.tableMsgListRecover = data.data.schoolList;
                        $scope.state.parentsRecoverCount = data.data.schoolCount;
                        $scope.parentPaginationRecover.totalItems = data.data.schoolCount;

                    } else {
                        $scope.parentsList.tableMsgListRecover = "";
                        $scope.state.parentsRecoverCount = 0;
                        $scope.parentPaginationRecover.totalItems = "";
                    }
                })
            }
        }

        $scope.selettypefn = function (areaId, schoolGrade) {
        	$scope.state.parentOnlineSearch=null;
        	$scope.state.parentStopSearch=null;
        	$scope.state.parentRecoverSearch=null;
            areaIdGrade = areaId;
            $scope.parentsList.areaId = areaId;
            $scope.parentsList.schoolGrade = schoolGrade;
            
            $scope.state.allcheckedRecover=false;
			$scope.state.allStopchecked=false;
			$scope.state.allchecked=false;
			
			$scope.parentsList.checkboxArr = [];
			$scope.parentsList.checkboxStopArr = [];
			$scope.parentsList.checkboxReArr = [];
            
//          console.log('areaId:' + $scope.parentsList.areaId, 'schoolGrade:' + $scope.parentsList.schoolGrade + "当前选中table" + $scope.state.headTab)
            $http.post(requireIp + '/ea/eaOffice/findSchoolList', {
                flag: '0',
                state: '1',
                name: $scope.state.parentOnlineSearch,
                areaIds: $scope.parentsList.areaId,
                pageNo: currentPage,
                pageSize: pageSize,
                grade: $scope.parentsList.schoolGrade
            }).success(function (data) {
                console.log(data);
                if (data.ret == 200) {
                    $scope.parentsList.tableMsgList = data.data.schoolList;
                    $scope.state.parentsOnlineCount = data.data.schoolCount;
                    $scope.parentPaginationOnline.totalItems = data.data.schoolCount;
                    $scope.parentPaginationOnline.currentPage=1;
                } else {
                    $scope.parentsList.tableMsgList = "";
                    $scope.state.parentsOnlineCount = 0;
                    $scope.parentPaginationOnline.totalItems = "";
                }
            })
            $http.post(requireIp + '/ea/eaOffice/findSchoolList', {
                flag: '0',
                state: '2',
                name: $scope.state.parentStopSearch,
                areaIds: $scope.parentsList.areaId,
                pageNo: currentPage,
                pageSize: pageSize,
                grade: $scope.parentsList.schoolGrade
            }).success(function (data) {
                console.log(data);
                if (data.ret == 200) {
                    $scope.parentsList.tableMsgStop = data.data.schoolList;
                    $scope.state.parentsStopCount = data.data.schoolCount;
                    $scope.parentPaginationStop.totalItems = data.data.schoolCount;
                    $scope.parentPaginationStop.currentPage=1;
                } else {
                    $scope.parentsList.tableMsgStop = "";
                    $scope.state.parentsStopCount = 0;
                    $scope.parentPaginationStop.totalItems = "";
                }
            })
            $http.post(requireIp + '/ea/eaOffice/findSchoolList', {
                flag: '3',
                state: '',
                name: $scope.state.parentRecoverSearch,
                areaIds: $scope.parentsList.areaId,
                pageNo: currentPage,
                pageSize: pageSize,
                grade: $scope.parentsList.schoolGrade
            }).success(function (data) {
                console.log(data);
                if (data.ret == 200) {
                    $scope.parentsList.tableMsgListRecover = data.data.schoolList;
                    $scope.state.parentsRecoverCount = data.data.schoolCount;
                    $scope.parentPaginationRecover.totalItems = data.data.schoolCount;
					$scope.parentPaginationRecover.currentPage=1;
                } else {
                    $scope.parentsList.tableMsgListRecover = "";
                    $scope.state.parentsRecoverCount = 0;
                    $scope.parentPaginationRecover.totalItems = "";
                }
            })
        }
    }

	//分页组件配置
        $scope.parentPaginationOnline = {
            currentPage: 1,
            // totalItems: 100  ,
            pagesLength: 10,
            itemsPerPage: pageSize,
            perPageOptions: [15],
            onChange: function () {
                var currentPage = this.currentPage;
                $http.post(requireIp + '/ea/eaOffice/findSchoolList', {
                    flag: '0',
                    state: '1',
                    name: $scope.newkeyword,
                    areaIds: areaIdGrade,
                    pageNo: currentPage,
                    pageSize: pageSize,
                    grade: $scope.parentsList.schoolGrade,
                }).success(function (data) {
                    console.log(data);
                    if (data.ret == 200) {
                        $scope.parentsList.tableMsgList = data.data.schoolList;
                        $scope.state.parentsOnlineCount = data.data.schoolCount;
                        $scope.parentPaginationOnline.totalItems = data.data.schoolCount;
                        
                        $scope.state.allcheckedRecover=false;
						$scope.state.allStopchecked=false;
						$scope.state.allchecked=false;
						
						$scope.parentsList.checkboxArr = [];
						$scope.parentsList.checkboxStopArr = [];
						$scope.parentsList.checkboxReArr = [];
                        
                    } else {
                        $scope.parentsList.tableMsgList = "";
                        $scope.state.parentsOnlineCount = 0;
                        $scope.parentPaginationOnline.totalItems = "";
                    }
                })
            }
        }
        //停用组件配置
        $scope.parentPaginationStop = {
            currentPage: 1,
            // totalItems: 100  ,
            pagesLength: 10,
            itemsPerPage: pageSize,
            perPageOptions: [15],
            onChange: function () {
                var currentPage = this.currentPage;
                $http.post(requireIp + '/ea/eaOffice/findSchoolList', {
                    flag: '0',
                    state: '2',
                    name: $scope.newkeyword,
                    areaIds: areaIdGrade,
                    pageNo: currentPage,
                    pageSize: pageSize,
                    grade: $scope.parentsList.schoolGrade,
                }).success(function (data) {
                    console.log(data);
                    if (data.ret == 200) {
                        $scope.parentsList.tableMsgStop = data.data.schoolList;
                        $scope.state.parentsStopCount = data.data.schoolCount;
                        $scope.parentPaginationStop.totalItems = data.data.schoolCount;
                        
                        $scope.state.allcheckedRecover=false;
						$scope.state.allStopchecked=false;
						$scope.state.allchecked=false;
						
						$scope.parentsList.checkboxArr = [];
						$scope.parentsList.checkboxStopArr = [];
						$scope.parentsList.checkboxReArr = [];
                    } else {
                        $scope.parentsList.tableMsgStop = "";
                        $scope.state.parentsStopCount = 0;
                        $scope.parentPaginationStop.totalItems = "";
                    }
                })
            }
        }
        //回收站分页
        $scope.parentPaginationRecover = {
            currentPage: 1,
            // totalItems: 100  ,
            pagesLength: 10,
            itemsPerPage: pageSize,
            perPageOptions: [15],
            onChange: function () {
                var currentPage = this.currentPage;
                $http.post(requireIp + '/ea/eaOffice/findSchoolList', {
                    flag: '3',
                    state: '',
                    name: $scope.newkeyword,
                    areaIds: areaIdGrade,
                    pageNo: currentPage,
                    pageSize: pageSize,
                    grade: $scope.parentsList.schoolGrade,
                }).success(function (data) {
                    console.log(data);
                    if (data.ret == 200) {
                        $scope.parentsList.tableMsgListRecover = data.data.schoolList;
                        $scope.state.parentsRecoverCount = data.data.schoolCount;
                        $scope.parentPaginationRecover.totalItems = data.data.schoolCount;
                        
                        $scope.state.allcheckedRecover=false;
			$scope.state.allStopchecked=false;
			$scope.state.allchecked=false;

                    } else {
                        $scope.parentsList.tableMsgListRecover = "";
                        $scope.state.parentsRecoverCount = 0;
                        $scope.parentPaginationRecover.totalItems = "";
                    }
                })
            }
        };
}]);