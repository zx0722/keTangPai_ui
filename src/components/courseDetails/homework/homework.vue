<template>
  <div class="">
    <div class="top">
      <div v-show="type == 'teach'">
        <el-button
          class="button"
          type="primary"
          plain
          @click="createWorkDialog = true"
          >发布个人作业</el-button
        >
        <el-button class="button" type="primary" plain>发布小组作业</el-button>
      </div>

      <div>
        <i class="el-icon-download"></i>
        <span>下载所有作业</span>
      </div>
    </div>

    <div class="main">
      <!-- 发布个人作业 编辑框 -->
      <div class="createWork" v-show="createWorkDialog">
        <el-input v-model="createWork.name" placeholder="作业名称" />
        <editor
          @getContent="getContent"
          class="createWork-editor"
          :content="createWork.resume"
          :placeholder="'作业简介,作业格式等要求,温馨提醒:word,pdf,txt等文字性的文档,都可以进行查重'"
          :borderHeight="'200px'"
          :height="'130px'"
        />

        <div class="createWork-row">
          <p>截止日期:</p>

          <el-date-picker
            v-model="createWork.deadline"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions"
          >
          </el-date-picker>

          <span style="margin: 0 10px 0 20px">若超时,禁止提交</span>

          <el-switch
            active-color="#32BAF0"
            class="strict-switch"
            v-model="createWork.strict"
          >
          </el-switch>
        </div>

        <div class="createWork-row">
          <div class="contain">
            <el-upload
              ref="upload"
              class="upload-demo"
              drag
              action=""
              :show-file-list="true"
              :data="data"
              :file-list="data.fileList"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-change="onChange"
              :auto-upload="false"
              :limit="3"
              multiple
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
            </el-upload>
          </div>
        </div>

        <div class="createWork-row">
          <p style="margin-right: 28px">满分值:</p>
          <el-input-number
            v-model="createWork.fullMarks"
            :min="1"
            :max="150"
          ></el-input-number>
        </div>

        <div class="createWork-row">
          <p>是否查重</p>

          <el-switch
            active-color="#32BAF0"
            class="strict-switch"
            v-model="createWork.isCheckDuplicate"
          >
          </el-switch>

          <p>查重警戒值</p>
          <el-input-number
            v-model="createWork.taskCheckDuplicate.warningValue"
            :min="1"
            :max="100"
          />
          <span>%</span>
        </div>

        <div class="createWork-row" v-show="createWork.isCheckDuplicate">
          <el-checkbox
            class="createWork-checkbox"
            v-model="createWork.taskCheckDuplicate.isReturn"
          ></el-checkbox>
          <p>查重率高于</p>
          <el-input-number
            v-model="createWork.taskCheckDuplicate.returnValue"
            :min="1"
            :max="100"
          />
          <span>%自动打回</span>
        </div>

        <div class="createWork-bottom">
          <el-button type="primary" style="width: 140px"
            ><i class="el-icon-download"></i>导入作业</el-button
          >
          <div style="display: flex">
            <el-button
              type="primary"
              style="width: 100px"
              plain
              @click="createWorkDialog = false"
              >取消</el-button
            >
            <el-button
              type="primary"
              style="width: 180px"
              :disabled="createWork.name.length > 0 ? false : true"
              @click="createHomeWork"
              >发布个人作业</el-button
            >
          </div>
        </div>
      </div>

      <homeworkCard
        :type="type"
        v-for="work in works"
        :key="work.id"
        :homework="work"
        :courseId="courseId"
        class="work"
        @childDeleteTask="childDeleteTask"
      ></homeworkCard>
    </div>

    <div class="bottom">
      <p>欢迎开课!</p>
      <p>快速发布、收集学生作业，支持50多种文档在线批阅。</p>
      <p>
        多维度（全班查重、作业字数等）统计学生作业情况。（点击<span>播放视频</span>，查看使用详情）
      </p>
    </div>

    <!-- 删除作业 模态框 -->
    <el-dialog :visible.sync="deleteTaskDialog" width="450px" top="30vh">
      <p slot="title">确定要删除"{{ deleteTaskObj.name }}"吗?</p>

      <div slot="footer">
        <el-button @click="deleteTaskDialog = false" style="width: 100px"
          >取消</el-button
        >
        <el-button type="primary" style="width: 100px" @click="deleteTask"
          >删除</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import homeworkCard from "./homeworkCard";
import editor from "../../utils/editor";

export default {
  components: {
    homeworkCard,
    editor,
  },
  props: {
    courseId: {
      require: true,
    },
  },
  data() {
    return {
      data: {},
      deleteTaskDialog: false,
      works: [],
      type: "",
      createWork: {
        name: "",
        strict: false,
        fullMarks: 1,
        isCheckDuplicate: false,
        taskCheckDuplicate: {
          warningValue: 1,
          isReturn: false,
          returnValue: 1,
        },
      },
      createWorkDialog: false,
      deadTime: {},
      deleteTaskObj: {},

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "明天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
          {
            text: "两周后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 14);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一个月后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 子组件传值 删除
    childDeleteTask(obj) {
      this.deleteTaskObj = obj;
      this.deleteTaskDialog = true;
    },

    deleteTask() {
      this.$req.deleteTask(this.deleteTaskObj.id).then((val) => {
        this.deleteTaskDialog = false;
        if (val.data) {
          this.$message({
            showClose: true,
            message: "课程删除成功",
            type: "success",
          });
          for (let i = 0; i < this.works.length; i++) {
            if (this.works[i].id === this.deleteTaskObj.id) {
              this.works.splice(i, 1);
            }
          }
        }
      });
    },

    // 富文本编辑器绑定事件
    getContent(text) {
      this.createWork.resume = text;
    },

    //创建课程
    createHomeWork() {
      this.createWork.courseId = this.courseId;
      this.$req.createTask(this.createWork, this.data.fileList).then((val) => {
        this.works.push(val.data);
        this.createWorkDialog = false;
        this.$message({
          showClose: true,
          message: "个人作业发布成功",
          type: "success",
        });
      });
    },

    // 上传文件操作
    handleRemove(file, fileList) {
      console.log("remove", file, fileList);
    },
    handlePreview(file) {
      console.log("preview", file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    onChange(file, fileList) {
      this.data.fileList = fileList;
    },
  },

  created() {
    this.$req.getReleasedTasks(this.courseId).then((val) => {
      this.works = val.data;
    });

    this.$req.getCourseById(this.courseId).then((val) => {
      if (val.data.role.id == 1) {
        this.type = "learn";
      } else {
        this.type = "teach";
      }
    });
  },
  mounted() {},
};
</script>
<style scoped>
.createWork-checkbox {
  margin: 13px 0 0 90px;
}

.strict-switch {
  margin-top: 10px;
}

.createWork-bottom {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
}

.createWork-row span {
  line-height: 40px;
  font-size: 14px;
  color: #a0a0a0;
}

.createWork-row p {
  font-size: 14px;
  text-align: right;
  margin-right: 15px;
  margin-left: 15px;
  line-height: 40px;
  color: #010000;
}

.createWork-row {
  margin-top: 20px;
  display: flex;
}

.createWork-editor {
  margin: 20px 0;
}

.createWork {
  width: 1186px;
  border: 1px solid #e2e6ed;
  border-radius: 8px;
  background: #fff;
  padding: 20px 20px 20px;
  margin-top: 20px;
}

.work {
  margin: 10px 0;
}

.bottom p span {
  color: #32baf0;
  cursor: pointer;
}

.bottom p:nth-child(1) {
  color: #707070;
}

.bottom p {
  color: #a0a0a0;
  font-size: 14px;
  line-height: 24px;
}

.bottom {
  background: #f1f3f4;
  border-radius: 4px;
  margin-top: 42px;
  text-align: center;
  padding: 35px 0;
}

.top div:nth-child(2) {
  margin-top: 10px;
  cursor: pointer;
}

.top div span {
  padding: 10px 0 0 5px;
  color: #5f6368;
  font-size: 14px;
}

.top .el-button {
  width: 137px;
}

.top .el-button:nth-child(2) {
  margin-left: 10px;
}

.top {
  display: flex;
  justify-content: space-between;
}
</style>