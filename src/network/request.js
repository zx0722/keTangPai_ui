import axios from './http.js'

// 获取课程
function getCourses(role) {
    return axios.get(`/course/get${role}Courses`)
}

// 账号登录
function accountLogin(obj) {
    return axios.postForm('/jwtLogin', { username: obj.account, password: obj.password })
}

// 短信登录
function messageLogin(obj) {
    return axios.postForm('/user/smsLogin', obj)
}

//请求登录验证码
function getCaptcha(obj) {
    return axios.postForm('/login/sendCaptcha', obj)
}

// 获取虚拟账号
function getVirtualId() {
    let id = localStorage.getItem("virtualId");
    if (id === "null") {
        axios.get('/user/getVirtualId')
            .then((val) => {
                id = val.data;
                localStorage.setItem("virtualId", id);
                return id
            })
            .catch((err) => {
                console.log("获取id失败");
            });
    }
    else {
        return id
    }
}

// 注册
function register(obj, role, virtualId) {
    let url = `/${role}/register`
    let data = {}

    data.registerUsername = obj.account
    data.captcha = obj.captcha
    data.virtualId = virtualId
    data[role] = {
        'name': obj.name,
        'school': obj.school,
        'accountNumber': '',
        'emailNumber': obj.emailNumber,
        'telephoneNumber': obj.telephoneNumber,
        'password': obj.password,
    }
    return axios.post(url, data)

}

// 注册验证码
function sendRegisterCaptcha(username, captcha, virtualId) {
    return axios.get('register/sendCaptcha', { username: username, webCaptchaResult: captcha, virtualId: virtualId })
}

//检查账号是否被注册
function checkAccount(account) {
    return axios.get('/user/hasUsername', { 'username': account })
}

// 加课码的重置 停用
function addCodeOperation(courseId, operate) {
    return axios.get(`course/${operate}CourseCode`, { courseId: courseId })
}

// 创建课程
function createCourse(course) {
    let obj = {}
    obj.name = course.name
    obj.className = course.className
    obj.termYear = course.termYear
    obj.semester = course.semester
    return axios.post('course/createCourse', obj)
}

// 删除课程
function deleteCourse(courseId, password) {
    return axios.get('course/deleteCourse', { courseId: courseId, password: password })
}

// 归档和恢复课程 type='' 'Own'
function fileCourse(type, courseId, state) {
    return axios.get(`course/archive${type}Course`, { courseId: courseId, archiveState: state })
}

//根据用户id或者username获取简单信息
function getInfo(type, str) {
    let obj = {}
    obj[type] = str
    return axios.postForm(`user/getSafeUser`, obj)
}

// 退出课程
function dropOut(id) {
    return axios.get('course/exitCourse', { courseId: id })
}

// 获取自己 同步
async function getMe() {
    return await axios.get('user/getMe')
}

// 转让课程
function transferCourse(courseId, userId, password) {
    return axios.get('course/transfer', { courseId, userId, password })
}

// 加入课程
function joinCourse(courseCode) {
    return axios.get('course/enterCourse', { courseCode: courseCode })
}

// 安全退课
function safeDropOut(courseId, password) {
    return axios.get('course/exitCourse', { courseId, password })
}

// 课程是否属于用户 同步
async function isCoursesBelongToUser(courseId) {
    return await axios.get('course/hasCourse', { courseId: courseId })
}

// 根据课程id获得课程
async function getCourseById(courseId) {
    return await axios.get('course/getCourse', { courseId: courseId })
}

// 更新课程
function updateCourse(course) {
    return axios.post('course/editCourse', course)
}

// 获取作业
function getReleasedTasks(courseId) {
    return axios.get('task/getReleasedTasks', { courseId: courseId })
}

// 创建作业
function createTask(task, files) {

    task.deadline = task.deadline.Format("yyyy-MM-dd HH:mm:ss")
    let formData = new FormData()
    formData.append('task', JSON.stringify(task))
    if (files) {
        files.forEach(val => {
            formData.append('file', val.raw)
        })
    }

    return axios.postFormData('task/releaseTask', formData)
}

// 删除作业
function deleteTask(taskId) {
    return axios.get("task/deleteTask", { taskId: taskId })
}

//编辑作业
function editTask(task, files, deleteFiles) {

    task.deadline = new Date(task.deadline)
    task.deadline = task.deadline.Format("yyyy-MM-dd HH:mm:ss")
    let formData = new FormData()
    formData.append('task', JSON.stringify(task))
    if (files) {
        files.forEach(val => {
            formData.append('file', val.raw)
        })
    }
    formData.append('deleteReleasedTaskFileId', JSON.stringify(deleteFiles))
    return axios.postFormData("task/powerEditTask", formData)

}

// 根据taskId获取task
async function getTaskById(taskId) {
    return await axios.get('task/getTask', { taskId: taskId })
}

// 添加作业评论
function addTaskDiscuss(taskId, content) {
    return axios.post('taskComment/addTaskComment', {
        taskId: taskId,
        content: content
    })
}

// 根据作业id获取评论
function getTaskDiscuss(taskId) {
    return axios.get('taskComment/getTaskComments', { taskId: taskId })
}

// 删除作业评论
function deleteDiscuss(taskId, discussId) {
    return axios.get('taskComment/deleteTaskComment',
        {
            taskId: taskId,
            commentId: discussId
        })
}

// 获取已提交作业的学生
function getSubmittedTasks(taskId) {
    return axios.get('submitTask/getSubmittedTasks', { taskId: taskId })
}

// 获取未提交作业的学生
function getNotSubmittedTasks(taskId) {
    return axios.get('task/getUnpaidStudents', { taskId, taskId })
}

// 批量打分
function batchCorrectSubmittedTask(userIds, taskId, score) {
    return axios.postForm('submitTask/batchCorrectSubmittedTask',
        {
            userIds: JSON.stringify(userIds),
            submittedTaskId: taskId,
            score: score
        })
}

// 批量打回
function batchReturn(userIds, taskId) {
    return axios.postForm('recallSubmittedTask/batchRecallSubmittedTask',
        {
            userIds: JSON.stringify(userIds),
            submittedTaskId: taskId,
        }
    )
}

// 批量催交
function batchUrge(userIds, taskId) {
    return axios.postForm('task/batchExpediteTask',
        {
            userIds: JSON.stringify(userIds),
            taskId: taskId,
        })
}

// 批阅作业获取文件
function getSubmittedTask(taskId, userId) {
    return axios.get('/submitTask/getSubmittedTask', {
        userId: userId,
        submittedTaskId: taskId,
    })
}

//下载作业 作业流
async function downloadSubmittedTaskFile(fileId) {
    return await axios.get('/submitTask/downSubmittedTaskFile', { fileId: fileId })
}

// 更新个人基本信息
function updateInfo(obj) {
    return axios.post('user/simpleUpdateUser', obj)
}

// 切换身份 1为学生 2为老师
function switchRole(toRole) {
    if (toRole == 2) {
        return axios.get('teacher/roleToStudent')
    } else {
        return axios.get('student/roleToTeacher')
    }
}

// 更新邮箱
function updateEmail(password, email) {
    return axios.postForm('user/updateEmail', {
        password: password,
        newEmail: email
    })
}

// 解除邮箱绑定
function unbindEmail(password) {
    return axios.get('user/unbindEmail', { password: password })
}

// 更新电话号码
function updatePhone(messageCheck, phone) {
    return axios.get('user/updatePhone', {
        phone: phone,
        verificationCode: messageCheck
    })
}

// 获取更新电话号码短信验证码
function getUpdatePhoneCheckCode() {
    return axios.get('bindTelephone/sendCaptcha?telephone&webCaptchaResult')
}

// 获取所有消息通知
function getAllTaskNotice() {
    return axios.get('notice/getAllTaskNotice')
}

// 已读通知
function readNotice(noticeId) {
    return axios.get('notice/markReadTaskNotice', { noticeId: noticeId })
}

// 获取为阅读的通知
function getUnreadNotice(){
    return axios.get('notice/getNoReadTaskNotices')
}

// 学生提交作业情况
function getStudentSubmittedTaskByTaskId(taskId){
    return axios.get('submitTask/getMySubmittedTask',{
        taskId:taskId
    })
}

// 学生更新提交作业
function updateSubmittedTask(taskId,deleteFiles,files){
    let formData = new FormData()
    formData.append('submittedTaskId',taskId)
    console.log('files',files);
    if (files) {
        files.forEach(val => {
            formData.append('file', val.raw)
        })
    }
    formData.append('jsonDeleteFileIds', JSON.stringify(deleteFiles))
    return axios.postFormData('submitTask/updateSubmittedTask',formData)
}

export default {
    updateCourse,
    createCourse,
    accountLogin,
    messageLogin,
    getVirtualId,
    getCaptcha,
    register,
    checkAccount,
    sendRegisterCaptcha,
    getCourses,
    addCodeOperation,
    deleteCourse,
    fileCourse,
    getInfo,
    dropOut,
    getMe,
    transferCourse,
    joinCourse,
    safeDropOut,
    isCoursesBelongToUser,
    getCourseById,
    getReleasedTasks,
    createTask,
    deleteTask,
    editTask,
    getTaskById,
    addTaskDiscuss,
    getTaskDiscuss,
    deleteDiscuss,
    getSubmittedTasks,
    getNotSubmittedTasks,
    batchCorrectSubmittedTask,
    batchReturn,
    batchUrge,
    getSubmittedTask,
    downloadSubmittedTaskFile,
    updateInfo,
    switchRole,
    updateEmail,
    unbindEmail,
    updatePhone,
    getUpdatePhoneCheckCode,
    getAllTaskNotice,
    readNotice,
    getUnreadNotice,
    getStudentSubmittedTaskByTaskId,
    updateSubmittedTask,
}
