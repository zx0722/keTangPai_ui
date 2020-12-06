<template>
  <div class="container">
    <Navigation />
    <div class="main">
      <div class="nav">
        <p v-if="topList.length === 0">全部课程</p>
        <ul class="">
          <li
            class="sortFile"
            @click="
              SFDialog = true;
              selectSF(0);
            "
          >
            <i class="el-icon-tickets" />课程排序
          </li>
          <li
            class="sortFile"
            @click="
              SFDialog = true;
              selectSF(1);
            "
          >
            <i class="el-icon-printer" />归档管理
          </li>
          <li>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <el-button type="primary" style="height: 40px"
                  >+ 创建/加入课程</el-button
                >
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="el-dropdown-item"
                  ><p @click="createCourseDialog = true">
                    创建课程
                  </p></el-dropdown-item
                >
                <el-dropdown-item class="el-dropdown-item"
                  ><p @click="joinCourseDialog = true">加入课程</p>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li>
            <el-button
              type="primary"
              style="height: 40px"
              @click="quickReleaseDialog = true"
              >+ 快速发布活动</el-button
            >
          </li>
        </ul>
      </div>

      <div class="courseShow">
        <courseCard
          @childDeleteCourse="childDeleteCourse"
          @childFileCourse="childFileCourse"
          @childTransferCourse="childTransferCourse"
          v-for="course in teachCourses"
          :key="course.id"
          :course="course"
          class="courseCard"
          :role="'0'"
        />

        <courseCard
          @childDropOut="childDropOut"
          @childFileCourse="childFileCourse"
          v-for="course in learnCourses"
          :key="course.id"
          :course="course"
          class="courseCard"
          :role="'1'"
        />

        <div class="addCourse">
          <div class="addBg"></div>
          <div class="addfont">
            <i @click="createCourseDialog = true" class="el-icon-plus"></i>
            <p @click="createCourseDialog = true">创建课程</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速发布任务模态框 -->
    <el-dialog :visible.sync="quickReleaseDialog" width="40%" top="30vh">
      <p class="quickRelease">选择要发布的类型</p>
      <div class="quickReleaseSelect">
        <div class="quickReleaseIcon">
          <div></div>
          <p>公告</p>
        </div>

        <div class="quickReleaseIcon">
          <div></div>
          <p>话题</p>
        </div>

        <div class="quickReleaseIcon">
          <div></div>
          <p>课堂互动</p>
        </div>

        <div class="quickReleaseIcon">
          <div></div>
          <p>作业</p>
        </div>

        <div class="quickReleaseIcon">
          <div></div>
          <p>测试</p>
        </div>
      </div>
    </el-dialog>

    <!-- 创建课程模态框 -->
    <el-dialog :visible.sync="createCourseDialog" width="660px" top="30vh">
      <p slot="title" class="createCourseTitle">新建课程</p>
      <div class="createCourse">
        <el-input
          class="createCourseInput"
          v-model="createCourse.name"
          placeholder="请输入课程名称"
          maxlength="20"
        />
        <el-input
          v-model="createCourse.className"
          class="createCourseInput"
          placeholder="请输入班级名称(选填)"
          maxlength="20"
        />
        <div class="selectSemester">
          <p>选择学期:</p>
          <el-date-picker
            v-model="createCourse.termYear"
            type="year"
            placeholder="选择学年"
          >
          </el-date-picker>

          <el-select v-model="createCourse.semester">
            <el-option
              v-for="item in optionSemeter"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <p style="margin: 0 4px 15px">学生必须额外填写下列信息才能加入课程</p>
        <div class="otherOptions">
          <el-checkbox-group v-model="createCourse.otherOptions">
            <el-checkbox label="自然班级"></el-checkbox>
            <el-checkbox label="年级"></el-checkbox>
            <el-checkbox label="入学年月"></el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div slot="footer" class="createCourseFooter">
        <el-button style="width: 100px" @click="createCourseDialog = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          :disabled="createCourse.name.length > 0 ? false : true"
          style="width: 100px"
          @click="create()"
          >创建</el-button
        >
      </div>
    </el-dialog>

    <!-- 归档课程 模态框 -->
    <el-dialog :visible.sync="fileCourseDialog" width="450px" top="30vh">
      <p slot="title" class="joinCourseTitle">
        确定要归档"{{ this.fileCourseObj.name }}"吗?
      </p>

      <div class="file-tips">
        <p>您可以在“课堂”-“归档管理”中查看此课程</p>
        <p v-show="this.fileCourseObj.role == 0">
          【归档全部】，学生的课程也会一起被归档
        </p>
        <p v-show="this.fileCourseObj.role == 0">
          【归档自己】，学生的课程不会被归档
        </p>
      </div>

      <div slot="footer" class="joinCourseFooter">
        <el-button @click="fileCourseDialog = false" style="width: 100px"
          >取消</el-button
        >

        <el-button v-show="this.fileCourseObj.role == 0" style="width: 100px" @click="fileCourse('')"
          >归档全部</el-button
        >
        <el-button
          type="primary"
          style="width: 100px"
          @click="fileCourse('Own')"
          >归档自己</el-button
        >
      </div>
    </el-dialog>

    <!-- 删除课程 模态框 -->
    <el-dialog :visible.sync="deleteCourseDialog" width="450px" top="30vh">
      <p slot="title" class="joinCourseTitle">
        确定要删除"{{ this.deleteCourseObj.name }}"吗?
      </p>

      <div class="delete-tips">
        <p>您的这个课程的任何信息或评论将被永久删除</p>
        <p>警告：此操作无法撤消</p>
        <p>提醒：已用课程数包含了“删除课程数”</p>
      </div>

      <el-input
        type="password"
        v-model="confirmPassword"
        class="joinCourseInput"
        placeholder="请输入登录密码验证"
        style="font-size: 16px"
      />

      <div slot="footer" class="joinCourseFooter">
        <el-button @click="deleteCourseDialog = false" style="width: 100px"
          >取消</el-button
        >
        <el-button
          type="primary"
          style="width: 100px"
          :disabled="confirmPassword.length < 6 ? true : false"
          @click="deleteCourse()"
          >删除</el-button
        >
      </div>
    </el-dialog>

    <!-- 加入课程 模态框 -->
    <el-dialog :visible.sync="joinCourseDialog" width="295px" top="30vh">
      <p slot="title" class="joinCourseTitle">加入课程</p>
      <el-input
        v-model="joinCode"
        class="joinCourseInput"
        placeholder="请输入课程加课码验证"
        style="font-size: 16px"
        maxlength="6"
      />
      <div slot="footer" class="joinCourseFooter">
        <el-button @click="joinCourseDialog = false" style="width: 100px"
          >取消</el-button
        >
        <el-button
          type="primary"
          style="width: 100px"
          :disabled="joinCode.length === 6 ? false : true"
          @click="joinCourse()"
          >加入</el-button
        >
      </div>
    </el-dialog>

    <!-- 课程排序和归档管理 模态框-->
    <el-dialog :visible.sync="SFDialog" width="810px" top="30vh">
      <div slot="title" class="SFtitle">
        <p @click="selectSF(0)">课程排序</p>
        <p class="SFClick" @click="selectSF(1)">归档管理</p>
      </div>

      <div v-if="SFState === 0">
        <div
          ref="sortCourse"
          class="sortCourse"
          v-for="course of courseList"
          :key="course.id"
          draggable="true"
        >
          <span></span>
          {{ course.name }}
        </div>
        <div ref="test"></div>
      </div>

      <div v-else class="archive">
        <archiveFile
          class="archiveFile"
          v-for="file in fileCourses"
          :key="file.id"
          :course="file"
          @childDeleteCourse="childDeleteCourse"
          @childRecoveryCourse="childRecoveryCourse"
          @dropOut="dropOut"
        />
      </div>
    </el-dialog>

    <!-- 恢复课程提示 模态框 -->
    <el-dialog :visible.sync="recoveryTipsDialog" width="350px" top="30vh">
      <p slot="title" class="joinCourseTitle">
        确定要恢复"{{ fileCourseObj.name }}"吗?
      </p>
      <div class="delete-tips">
        <p>您和您的学生将可以重新在此课程中互动。</p>
        <p>此课程会在课堂页上显示。</p>
      </div>

      <div slot="footer" class="joinCourseFooter">
        <el-button @click="recoveryTipsDialog = false" style="width: 100px"
          >取消</el-button
        >

        <el-button
          v-if="fileCourseObj.isArchiveAll"
          type="primary"
          style="width: 100px"
          @click="
            fileCourse('');
            recoveryTipsDialog = false;
          "
          >恢复课程</el-button
        >

        <el-button
          v-else
          type="primary"
          style="width: 100px"
          @click="
            fileCourse('Own');
            recoveryTipsDialog = false;
          "
          >恢复课程</el-button
        >
      </div>
    </el-dialog>

    <!-- 转让课程 模态框 -->
    <el-dialog :visible.sync="transferCourseDialog" width="450px" top="30vh">
      <p slot="title" class="joinCourseTitle">
        确定要转让"{{ this.transferCourseObj.name }}"吗?
      </p>

      <div class="delete-tips">
        <p v-if="transferTipsState == 0">
          您的这个课程的任何信息或评论将被永久转让
        </p>

        <p v-else-if="transferTipsState == 1">转让课程不能转让给自己</p>
        <p v-else-if="transferTipsState == 2">您输入的账号不存在</p>
        <p v-else-if="transferTipsState == 3">转让对象的身份不符合</p>
        <p v-else>
          转让对象:<span> {{ transferTeacher.name }}</span>
        </p>
        <p>警告：此操作无法撤消</p>
      </div>

      <el-input
        v-model="transferAccount"
        class="joinCourseInput"
        placeholder="请输入转让老师的账号/手机/邮箱"
        style="font-size: 16px"
        @blur="transferTips()"
      />

      <el-input
        type="password"
        v-model="confirmPassword"
        class="joinCourseInput"
        placeholder="请输入登录密码验证"
        style="font-size: 16px"
      />

      <div slot="footer" class="joinCourseFooter">
        <el-button @click="deleteCourseDialog = false" style="width: 100px"
          >取消</el-button
        >
        <el-button
          type="primary"
          style="width: 100px"
          :disabled="confirmPassword.length < 6 ? true : false"
          @click="transferCourse()"
          >转让课程</el-button
        >
      </div>
    </el-dialog>

    <!-- 退出课程 模态框 -->
    <el-dialog :visible.sync="dropOutDialog" width="450px" top="30vh">
      <p slot="title" class="joinCourseTitle">
        确定要转让"{{ this.dropOutObj.name }}"吗?
      </p>

      <div class="delete-tips">
        <p>您的这个课程的任何信息或评论将被永久删除</p>
        <p>警告：此操作无法撤消</p>
        <p>提醒：已用课程数包含了“删除课程数”</p>
      </div>

      <el-input
        type="password"
        v-model="confirmPassword"
        class="joinCourseInput"
        placeholder="请输入登录密码验证"
        style="font-size: 16px"
      />

      <div slot="footer" class="joinCourseFooter">
        <el-button @click="dropOutDialog = false" style="width: 100px"
          >取消</el-button
        >
        <el-button
          type="primary"
          style="width: 100px"
          :disabled="confirmPassword.length < 6 ? true : false"
          @click="safeDropOut()"
          >退出课程</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Navigation from "../components/homepage/Navigation";
import courseCard from "../components/homepage/courseCard";
import myModule from "../modules/myModule";
import archiveFile from "../components/homepage/archiveFile";

export default {
  components: {
    Navigation,
    courseCard,
    archiveFile,
  },
  data() {
    return {
      // 置顶课程
      topList: [],
      // 课程
      learnCourses: [],
      teachCourses: [],
      // 归档文件
      fileCourses: [],
      quickReleaseDialog: false, //快速发布活动
      createCourseDialog: false, // 创建课程
      SFDialog: false, // 课程排序与归档
      SFState: 1, // 0为课程排序 1为归档管理
      createCourse: {
        otherOptions: [],
        semester: 0,
        name:'',
      },

      optionSemeter: [
        {
          value: 0,
          label: "不限",
        },
        {
          value: 1,
          label: "第一学期",
        },
        {
          value: 2,
          label: "第二学期",
        },
      ],

      joinCourseDialog: false,

      deleteCourseDialog: false,
      fileCourseDialog: false,
      recoveryTipsDialog: false,
      transferCourseDialog: false,
      dropOutDialog: false,
      joinCode: "",
      confirmPassword: "", //确认密码
      deleteCourseObj: {},
      fileCourseObj: {},
      transferCourseObj: {},
      transferAccount: "",
      transferTeacher: {},
      transferTipsState: 0, //0为常态 1为自己转自己提示 2为账号不存在 3为身份问题 4为合适对象
      dropOutObj: {},
      userRole:'',
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 密码验证退课
    safeDropOut(){
      this.$req.safeDropOut(this.dropOutObj.id,this.confirmPassword)
      .then(val=>{
        if(val.data){
          this.dropOutDialog=false
          this.confirmPassword=''
          this.extractCourse(this.learnCourses,this.dropOutObj.id)
          this.$message({
            showClose: true,
            message: "退课成功",
            type: "info",
          });
          
        }else{
          this.$message({
            showClose: true,
            message: "退课失败,请确保密码正确并重新输入",
            type: "error",
          });
        }
      })
    },

    // 加入课程
    joinCourse() {
      this.$req.joinCourse(this.joinCode).then((val) => {
        if (val.data) {
          this.learnCourses.push(val.data);
          this.joinCourseDialog = false;
          this.joinCode = "";
        } else {
          this.$message({
            showClose: true,
            message: "加课码错误",
            type: "error",
          });
        }
      });
    },

    // 转让课程时的提示
    transferTips() {
      this.$req.getInfo("username", this.transferAccount).then((val) => {
        if (val.data) {
          if (this.$store.getters.getAccount == val.data.id) {
            this.transferTipsState = 1;
          } else {
            if (val.data.roles[0].id == "1") {
              this.transferTipsState = 3;
            } else {
              this.transferTeacher = val.data;
              this.transferTipsState = 4;
            }
          }
        } else {
          this.transferTipsState = 2;
        }
      });
    },

    //归档和恢复课程
    fileCourse(type) {
    
      this.$req
        .fileCourse(type, this.fileCourseObj.id, !this.fileCourseObj.isArchive)
        .then((val) => {
          if (val.data) {
            this.$message({
              showClose: true,
              message: "操作课程成功",
              type: "success",
            });
            let obj = {};
            if (this.fileCourseObj.isArchive) {
              // 恢复 将归档数组中删除
              obj = this.extractCourse(this.fileCourses, this.fileCourseObj.id);

              if (obj.role == "1") {
                // 1学 2教
                this.learnCourses.push(obj);
              } else {
                this.teachCourses.push(obj);
              }
            } else {
              // 归档
              if (this.fileCourseObj.role == "1") {
                obj = this.extractCourse(
                  this.learnCourses,
                  this.fileCourseObj.id
                );
              } else {
                obj = this.extractCourse(
                  this.teachCourses,
                  this.fileCourseObj.id
                );
              }
              this.fileCourses.push(obj);
            }
          }
        });
      this.fileCourseDialog = false;
    },

    //courseCard 子组件传值 退出课程
    childDropOut(obj) {
      this.dropOutObj = obj;
      this.dropOutDialog = true;
    },

    // courseCard 子组件传值 转让课程
    childTransferCourse(obj) {
      this.transferCourseObj = obj;
      this.transferCourseDialog = true;
    },

    //archiveFile 子组件传值 恢复归档课程
    childRecoveryCourse(obj) {
      this.SFDialog = false;
      this.fileCourseObj = obj;
      this.recoveryTipsDialog = true;
    },

    //courseCard 子组件传值 归档课程
    childFileCourse(obj) {
      this.fileCourseDialog = true;
      this.fileCourseObj = obj;
    },

    //courseCard archiveFile子组件传值 删除课程
    childDeleteCourse(obj) {
      this.deleteCourseObj = obj;
      this.deleteCourseDialog = true;
    },

    //删除根据id 若无id则根据isArchive是否归档
    extractCourse(arr, id) {
      if (id != "") {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === id) {
            let obj = arr.splice(i, 1)[0];
            return obj;
          }
        }
      } else {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].isArchive) {
            let obj = arr.splice(i, 1)[0];
            this.fileCourses.push(obj);
            i--;
          }
        }
      }
    },

    // 转让课程
    transferCourse() {
      if (this.transferTipsState != 4) {
        this.$message({
          showClose: true,
          message: "请核对转让对象并重新输入",
          type: "error",
        });
      } else {
        this.$req
          .transferCourse(
            this.transferCourseObj.id,
            this.transferTeacher.id,
            this.confirmPassword
          )
          .then((val) => {
            if (val.data) {
              this.extractCourse(this.teachCourses, this.transferCourseObj.id);
              this.transferCourseDialog = false;
              this.confirmPassword = "";
              this.transferAccount = "";
              this.$message({
                showClose: true,
                message: "转让课程成功",
                type: "success",
              });
            } else {
              this.$message({
                showClose: true,
                message: "密码错误,请重新输入",
                type: "error",
              });
            }
          });
      }
    },

    // 退出课程
    dropOut(id) {
      this.$req.dropOut(id).then((val) => {
        if (val.data) {
          this.$message({
            showClose: true,
            message: "退出课程成功",
            type: "success",
          });
        }
      });
    },

    // 删除课程
    deleteCourse() {
      this.$req
        .deleteCourse(this.deleteCourseObj.id, this.confirmPassword)
        .then((val) => {
          if (!val.data) {
            this.$message({
              showClose: true,
              message: "密码验证错误",
              type: "error",
            });
          } else {
            this.extractCourse(this.teachCourses, this.deleteCourseObj.id);
            // this.deleteCourseObj = null;

            this.teachCourses = null;
            this.deleteCourseDialog = false;
            this.$message({
              showClose: true,
              message: "删除课程成功",
              type: "success",
            });
          }
        });
      this.confirmPassword = "";
    },

    //创建课程
    create() {
      if (
        this.createCourse.name === "" ||
        this.createCourse.name === undefined
      ) {
        this.$message({
          showClose: true,
          message: "请输入课程名",
          type: "error",
        });
        return;
      }
      if (!this.createCourse.termYear) {
        this.createCourse.termYear = new Date();
      }

      this.$req
        .createCourse(this.createCourse)
        .then((val) => {
          this.teachCourses.push(val.data);
          this.createCourseDialog = false;
        })
        .catch((err) => {
          console.log("创建课程", err);
        });
    },

    // 获取教课程
    getTeachCourses() {
      this.$req.getCourses("Teach")
      .then((val) => {
        this.teachCourses = val.data;

        this.extractCourse(this.teachCourses, "");
      })
      .catch(err=>{
        console.log('学生身份');
      })
    },

    // 获取学课程
    getLearnCourse() {
      this.$req.getCourses("Learn").then((val) => {
        this.learnCourses = val.data;
        this.extractCourse(this.learnCourses,'')
      });
    },

    selectSF(state) {
      if (this.SFState === state) {
        return;
      }
      let p = document.getElementsByClassName("SFtitle")[0].children;

      myModule.toggleClass(p[0], "SFClick");
      myModule.toggleClass(p[1], "SFClick");

      this.SFState = state;
      if (this.SFState === 0) {
        this.setSort();
      }
    },

    setSort() {
      //设置排序
      //ondrop - 在一个拖动过程中，释放鼠标键时触发此事件
      //ondragstart - 用户开始拖动元素时触发
      //ondrag - 元素正在拖动时触发
      let sortCourse = document.getElementsByClassName("sortCourse");

      let container = null;
      for (let i = 0; i < sortCourse.length; i++) {
        sortCourse[i].onclick = function () {
        };

        sortCourse[i].ondragstart = function () {
          // 当拖动其中一个元素时，this的指向便是你所拖动的元素，将它存在container
          container = this;
        };
        // 默认的当你dragover的时候会阻止你做drop的操作，所以需要取消这个默认
        sortCourse[i].ondragover = function () {
          event.preventDefault();
         
        };
        // 当拖动结束时，给拖动div所在位置下面的div做drop事件，注意drop时this的指向发生改变
        sortCourse[i].ondrop = function () {
         
          if (container != null && container != this) {
            let temp = document.createElement("div");
            document.body.replaceChild(temp, this);
            document.body.replaceChild(this, container);
            document.body.replaceChild(container, temp);
          }
        };
      }
    },
  },
  created() {


    this.getTeachCourses();

    this.getLearnCourse();
  },
};
</script>
<style scoped>

.file-tips p {
  text-align: left;
  margin: 10px 0;
}

.delete-tips {
  text-align: left;
}

.delete-tips p:nth-child(2) {
  color: red;
  margin: 10px 0;
}

.delete-tips p:nth-child(3) {
  color: blue;
}

.archiveFile {
  margin: 16px 40px;
}
.archive {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
}
.sortCourse span {
  margin: 18px 5px 0 10px;
  background-color: rgb(49, 142, 235);
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.sortCourse {
  cursor: pointer;
  display: flex;
  border: 1px solid rgb(236, 236, 236);
  height: 58px;
  line-height: 58px;
  font-size: 16px;
  text-align: left;
}

.SFClick {
  border-bottom: 3px solid #aaa;
  color: #2d2d2d;
}

.SFtitle p {
  padding: 0 30px;
}

.SFtitle {
  display: flex;
  justify-content: center;
  color: #818181;
  font-size: 18px;
  cursor: pointer;
  line-height: 55px;

  border-bottom: 1px solid #dcdcdc;
  height: 58px;
  width: 100%;
}

.joinCourseInput {
  border-bottom: 2px solid #ececec;
}

.joinCourseInput:hover {
  border-bottom: 2px solid rgba(72, 104, 209, 0.3);
}

.joinCourseTitle {
  font-size: 18px;
  color: #a9a9a9;
  text-align: left;
  border-bottom: 1px solid #ececec;
  padding-bottom: 20px;
}

.createCourseFooter {
  text-align: right;
}
.otherOptions {
  margin-left: 10px;
  text-align: left;
}

.createCourse p {
  text-align: left;
  font-size: 14px;
  color: #666;
}

.selectSemester p:nth-child(1) {
  line-height: 39px;
  margin-left: -18px;
}

.selectSemester {
  margin: 20px 0;
}

.selectSemester,
.joinCourseFooter {
  display: flex;
  justify-content: space-around;
}

.createCourseInput {
  display: flex;
  border-bottom: 2px solid #c8c8c8;
}

.createCourseInput:hover {
  border-bottom: 2px solid #4d90fe;
}

.createCourseInput:nth-child(1)::before {
  content: "课程名称:";
  width: 80px;
  line-height: 66px;
  height: 40px;
}

.createCourseInput:nth-child(2)::before {
  content: "班级名称:";
  width: 80px;
  line-height: 66px;
  height: 40px;
}

.createCourseTitle {
  text-align: left;
  font-size: 18px;
}

.quickReleaseIcon p {
  font-size: 14px;
  font-weight: 600;
  color: rgba(67, 67, 67, 1);
}

.quickReleaseSelect {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
  cursor: pointer;
}

.quickReleaseIcon div {
  background: url("../assets/img/icon-gg.png") center no-repeat
    rgba(44, 87, 171, 1);
}

.quickReleaseSelect .quickReleaseIcon:nth-child(2) div {
  background: url("../assets/img/icon-ht.png") center no-repeat
    rgba(44, 87, 171, 1);
}

.quickReleaseSelect .quickReleaseIcon:nth-child(3) div {
  background: url("../assets/img/icon-hd.png") center no-repeat
    rgba(44, 87, 171, 1);
}

.quickReleaseSelect .quickReleaseIcon:nth-child(4) div {
  background: url("../assets/img/icon-zy.png") center no-repeat
    rgba(44, 87, 171, 1);
}

.quickReleaseSelect .quickReleaseIcon:nth-child(5) div {
  background: url("../assets/img/icon-cs.png") center no-repeat
    rgba(44, 87, 171, 1);
}

.quickReleaseIcon div {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

.quickRelease {
  margin-bottom: 30px;
}

.quickRelease {
  font-size: 24px;
  color: rgba(112, 112, 112, 1);
  font-weight: 600;
}

.el-dropdown-item {
  width: 100px;
  justify-content: center;
}

.addfont p {
  font-size: 14px;
  cursor: pointer;
}

.addfont i {
  margin-top: 46px;
  font-size: 20px;
}

.addBg {
  background-image: url("../assets/img/create-course.png");
  width: 100%;
  height: 127px;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
}

.addCourse {
  width: 270px;
  height: 275px;
  border-radius: 8px;
  border: 1px solid #e2e6ed;
}

.courseCard,
.addCourse {
  margin: 0 9px 10px;
}

.courseShow {
  padding-top: 60px;
  height: 100%;
  display: flex;

  align-content: flex-start;
  flex-wrap: wrap;
}

.sortFile {
  cursor: pointer;
}

.sortFile:hover {
  color: black;
}

.nav p,
.nav .sortFile {
  line-height: 42px;
}

.nav ul li {
  padding: 0 13px;
}

.nav ul {
  display: flex;
  justify-content: space-between;
  list-style: none;
}

.nav {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  height: 36px;
  padding: 20px 0 12px 0;
  color: #78787a;
  border-bottom: 1px solid #d9d9f0;
}

.main {
  overflow: hidden;
  padding: 0 4%;
}

p {
  margin: 0;
  padding: 0;
}

.container {
  width: 100%;
}
</style>

<style >
.createCourseInput .el-input__inner {
  outline: none;
  border: none;
}

.joinCourseInput .el-input__inner {
  outline: none;
  border: none;
}
</style>