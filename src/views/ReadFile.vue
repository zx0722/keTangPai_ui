<template>
  <div class="">
    <div class="header" v-show="!isStuRead">
      <div class="header-left">
        <p>姓名:{{ task.student.name }}</p>
        <p>学号:{{ task.student.id }}</p>
        <p style="cursor: pointer">
          目录 {{ index + 1 }}/{{ task.submitTaskFiles.length }}
        </p>

        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-arrow-left"
            :disabled="index == 0"
            @click="--index"
            >上一页</el-button
          >
          <el-button
            type="primary"
            :disabled="index == task.submitTaskFiles.length - 1"
            @click="index++"
            >下一页<i class="el-icon-arrow-right el-icon--right"></i
          ></el-button>
        </el-button-group>
      </div>
      <div class="header-right">
        <el-button
          style="height: 44px"
          :disabled="calledback"
          @click="returnTask"
          >作业打回</el-button
        >
        <p>成绩:</p>
        <el-input-number
          v-model="scoring"
          :min="0"
          :max="task.fullMarks"
        ></el-input-number>
      </div>
    </div>
    <div class="file-show">
      <iframe :src="path" frameborder="0" id="fileIframe"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      fileId: "",
      isStuRead: false,

      calledback: false,
      scoring: 0,
      task: {
        student: {
          name: "",
        },
        submitTaskFiles: [],
      },
      index: 0,
      path: "",
    };
  },
  computed: {},
  watch: {
    index: function (newVal, oldVal) {
      this.path = this.getPath();
    },

    scoring: function (newVal, oldVal) {
      if (newVal != oldVal) {
        this.$req.batchCorrectSubmittedTask(
          [this.task.userId],
          this.task.taskId,
          newVal
        );
      }
    },
  },
  methods: {
    returnTask() {
      this.$req
        .batchReturn([this.task.userId], this.task.taskId)
        .then((val) => {
          if (val.data) {
            this.$message({
              showClose: true,
              message: "作业已打回",
              type: "info",
            });
            this.calledback = true;
          }
        });
    },

    getPath() {
      return `${this.$axios.baseURL()}/submitTask/previewSubmittedTaskFile?fileId=${this.getFileId(
        this.index
      )}`;
    },
    getFileId(i) {
      if (this.index == -1) {
        return this.fileId;
      }
      return this.task.submitTaskFiles[i].fileId;
    },
  },
  async created() {
    if (this.$route.query.userId == this.$store.getAccount) {
      this.isStuRead = true;
    }
    if (this.$route.query.fileId) {
      this.fileId = this.$route.query.fileId;
      this.index = -1;
    } else {
      await this.$req
        .getSubmittedTask(this.$route.query.taskId, this.$route.query.userId)
        .then((val) => {
          this.task = val.data;
        });

      this.path = this.getPath();
      this.scoring = this.task.score;
    }
  },

  mounted() {
    /**
     * iframe-宽高自适应显示
     */
    const iframe = document.getElementById("fileIframe");
    const deviceWidth = document.documentElement.clientWidth;
    const deviceHeight = document.documentElement.clientHeight;

    iframe.style.width = Number(deviceWidth) + "px"; //数字是页面布局宽度差值
    iframe.style.height = Number(deviceHeight) + "px"; //数字是页面布局高度差

    window.onresize = function () {
      const deviceWidth = document.documentElement.clientWidth;
      const deviceHeight = document.documentElement.clientHeight;
      iframe.style.width = Number(deviceWidth) + "px"; //数字是页面布局宽度差值
      iframe.style.height = Number(deviceHeight) + "px"; //数字是页面布局高度差
    };
  },
};
</script>
<style scoped>
.header-left p,
.header-right p {
  margin: 0 20px;
  line-height: 50px;
  font-size: 26px;
}
.header-right {
  margin-right: 100px;
}

.header-left {
  margin-left: 100px;
}

.header-left,
.header-right {
  display: flex;
  justify-content: space-around;
}

.header {
  color: white;
  background: #333;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
}

.file-show {
  width: 100%;
  height: 100%;
}
</style>