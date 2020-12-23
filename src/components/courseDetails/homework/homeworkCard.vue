<template>
  <div class="all">
    <div v-if="!isEdit">
      <div class="top">
        <div class="top-left">
          <span>个人作业</span>
          <span>{{ work.releaseTime }}</span>
        </div>

        <div class="top-right" v-show="type == 'teach'">
          <el-dropdown trigger="click">
            <i class="el-icon-more"></i>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="editBefore"
                >编辑</el-dropdown-item
              >
              <el-dropdown-item @click.native="saveTask"
                >保存到</el-dropdown-item
              >
              <el-dropdown-item @click.native="deleteTask"
                >删除</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <div class="main">
        <div class="main-left">
          <router-link
            class="title"
            :to="{
              path: '/courseTask',
              query: {
                taskId: work.id,
                courseId:courseId,
              },
            }"
            >{{ work.name }}</router-link
          >
          <div class="resume" v-html="work.resume"></div>

          <div class="files">
            <div
              v-for="f of work.releaseTaskFiles"
              :key="f.fileId"
              class="file"
            >
            <router-link :to="{path:'/readFile',query:{fileId:f.fileId}}">
              <img :src="getIcon(f.filePlan.type)" title="预览" class="cursor" alt="" />
            </router-link>
              
              <p>{{ f.filePlan.name }}</p>
              <a
                class="download-a"
                :href="getDownloadPath(f.fileId)"
                download=""
                >下载</a
              >
            </div>
          </div>
        </div>

        <div class="main-right" v-show="type == 'teach'">
          <ul>
            <li>
              <p>{{ work.correctedCount }}</p>
              <p>已批</p>
            </li>
            <li>
              <p>{{ work.notCorrectedCount }}</p>
              <p style="color: #970002">未批</p>
            </li>
            <li>
              <p>{{ work.unpaidCount }}</p>
              <p>未交</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="bottom">
        <div class="bottom-left">
          <p>截止时间:{{ work.deadline }}</p>
          <p>{{ work.commentCount }}条评论</p>
        </div>

        <div class="bottom-right" v-show="type == 'learn'">
          <el-button type="primary" plain width="100" size="small">
            <span v-if="!work.isSubmit">提交作业</span>
            <span v-else>已完成</span>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 编辑状态 -->
    <div class="editWork" v-else>
      <el-input v-model="editWork.name" placeholder="作业名称" />
      <editor
        @getContent="getContent"
        class="editWork-editor"
        :content="editWork.resume"
        :placeholder="'作业简介,作业格式等要求,温馨提醒:word,pdf,txt等文字性的文档,都可以进行查重'"
        :borderHeight="'200px'"
        :height="'130px'"
      />

      <div class="editWork-row">
        <p>截止日期:</p>

        <el-date-picker
          v-model="editWork.deadline"
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
          v-model="editWork.strict"
        >
        </el-switch>
      </div>

      <div class="editWork-row">
        <div class="files">
          <div v-for="(f, index) in fileUploaded" :key="f.fileId" class="file">
            <i
              class="el-icon-error icon-circle-close"
              @click="preDeleteFile(index)"
            ></i>
            <img :src="getIcon(f.filePlan.type)" alt="" />
            <p>{{ f.filePlan.name }}</p>
          </div>
        </div>

        <el-upload
          ref="upload"
          class="upload-demo upload"
          action=""
          :show-file-list="true"
          :data="data"
          :file-list="data.fileList"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-change="onChange"
          :auto-upload="false"
          multiple
        >
          <el-button size="small" type="primary">上传附件</el-button>
        </el-upload>
      </div>

      <div class="editWork-row">
        <p style="margin-right: 28px">满分值:</p>
        <el-input-number
          v-model="editWork.fullMarks"
          :min="1"
          :max="150"
        ></el-input-number>
      </div>

      <div class="editWork-row">
        <p>是否查重</p>

        <el-switch
          active-color="#32BAF0"
          class="strict-switch"
          v-model="editWork.isCheckDuplicate"
        >
        </el-switch>

        <p>查重警戒值</p>
        <el-input-number
          v-model="editWork.taskCheckDuplicate.warningValue"
          :min="1"
          :max="100"
        />
        <span>%</span>
      </div>

      <div class="editWork-row" v-show="editWork.isCheckDuplicate">
        <el-checkbox
          class="editWork-checkbox"
          v-model="editWork.taskCheckDuplicate.isReturn"
        ></el-checkbox>
        <p>查重率高于</p>
        <el-input-number
          v-model="editWork.taskCheckDuplicate.returnValue"
          :min="1"
          :max="100"
        />
        <span>%自动打回</span>
      </div>

      <div class="editWork-bottom">
        <div style="display: flex">
          <el-button type="primary" plain @click="isEdit = false"
            >取消</el-button
          >
          <el-button
            type="primary"
            :disabled="editWork.name.length > 0 ? false : true"
            @click="eidtHomeWork"
            >保存</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import editor from "../../utils/editor";
import homeworkVue from "./homework.vue";
export default {
  components: {
    editor,
  },
  props: {
    type: {
      require: true,
      type: String,
    },
    homework: {
      require: true,
    },
    courseId: {
      require: true,
    },
  },
  data() {
    return {
      work: this.homework,
      deleteFiles: [],
      fileUploaded: [],
      isEdit: false,
      editWork: {},
      data: {},
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
    //获取下载文件路径
    getDownloadPath(id) {
      return `${this.$axios.baseURL()}/task/downloadTaskFile?fileId=${id}`;
    },

    //准备删除的文件
    preDeleteFile(index) {
      this.deleteFiles.push(this.fileUploaded[index].fileId);
      this.fileUploaded.splice(index, 1);
    },

    // 编辑作业之前
    editBefore() {
      this.editWork = this.$module.deepClone(this.work);
      this.fileUploaded = this.$module.deepClone(this.work.releaseTaskFiles);
      if (!this.editWork.isCheckDuplicate) {
        this.editWork.taskCheckDuplicate = {
          warningValue: 1,
          isReturn: false,
          returnValue: 1,
        };
      }
      this.isEdit = true;
    },

    // 编辑作业
    eidtHomeWork() {
      this.$req
        .editTask(this.editWork, this.data.fileList, this.deleteFiles)
        .then((val) => {
          this.work = this.$module.deepClone(val.data);
          this.isEdit = false;
          this.deleteFiles = [];
          this.data = {};
          this.$message({
            showClose: true,
            message: `${this.work.name} 更新成功`,
            type: "success",
          });
        });
    },

    // 富文本编辑器绑定事件
    getContent(text) {
      this.editWork.resume = text;
    },

    getIcon(str) {
      return require(`../../../assets/office-icon/${this.$iconType.typeChangeIcon(
        str
      )}.png`);
    },

    deleteTask() {
      this.$emit("childDeleteTask", this.work);
    },

    saveTask() {
      this.$emit("childSaveTask", this.work);
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
    this.editWork = this.$module.deepClone(this.work);
    if (!this.editWork.isCheckDuplicate) {
      this.editWork.taskCheckDuplicate = {
        warningValue: 1,
        isReturn: false,
        returnValue: 1,
      };
    }
  },
};
</script>
<style scoped>
.cursor {
  cursor: pointer;
}

.download-a {
  color: #ffff;
  font-size: 14px;
}

.file:hover .download-a {
  color: #32baf0;
}

.upload {
  margin: 30px 0 0 60px;
}

.icon-circle-close {
  position: absolute;
  left: 62%;
  top: -8%;
  color: rgb(202, 67, 67);
  font-size: 23px;
}

.editWork-checkbox {
  margin: 13px 0 0 90px;
}

.strict-switch {
  margin-top: 10px;
}

.editWork-bottom {
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
}

.editWork-row span {
  line-height: 40px;
  font-size: 14px;
  color: #a0a0a0;
}

.editWork-row p {
  font-size: 14px;
  text-align: right;
  margin-right: 15px;
  margin-left: 15px;
  line-height: 40px;
  color: #010000;
}

.editWork-row {
  margin-top: 20px;
  display: flex;
}

.editWork-editor {
  margin: 20px 0;
}

.editWork {
  width: 100%;
  background: #fff;
  margin: 20px 0;
}

.file {
  text-align: center;
  width: 80px;
  margin: 30px 5px 0;
  position: relative;
}

.file p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.files {
  display: flex;
}

.bottom-left {
  color: #a0a0a0;
  margin: 20px 0;
  justify-content: space-between;
}

.bottom-left p {
  margin-right: 20px;
}

.bottom {
  display: flex;
  justify-content: space-between;
}

.main-right ul,
.bottom-left {
  display: flex;
}

.main-right ul li {
  margin: 0 45px;
}

.main-right {
  position: relative;
}

.main-right ul {
  position: absolute;
  left: -360px;
  top: 60%;
  transform: translateY(-50%);
}

.main-right ul li p:nth-child(1) {
  font-size: 30px;
  margin-bottom: 10px;
}

li {
  list-style: none;
}

.main-left .title {
  font-weight: 400;
  font-size: 20px;
  outline: none;
  text-decoration: none;
  word-break: break-all;
  word-wrap: break-word;
  color: #3b3d45;
}

.title:hover {
  color: #32baf0;
}

.main-left .resume {
  margin-top: 10px;
  color: #707070;
  overflow: hidden;
  line-height: 1.8;
}

.el-icon-more {
  font-size: 20px;
  color: #5f6368;
}

.top-right i {
  margin-top: 22px;
}

.top-left span:nth-child(1) {
  color: #5f6368;
  background: #f1f3f4;
  padding: 3px 5px;
  border-radius: 2px;
  margin-right: 15px;
}

.top-left {
  color: #aaa;

  padding: 21px 0 10px;
  line-height: 30px;
}

.top,
.main {
  display: flex;
  justify-content: space-between;
}

.all {
  font-size: 14px;
  padding: 0 20px 0 40px;
  width: 1164px;
  border: 1px solid #e2e6ed;
  border-radius: 8px;
  background: #fff;
  text-align: left;
}
</style>