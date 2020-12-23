<template>
  <div class="main">
    <div class="top">
      <h2 class="title">{{ task.name }}</h2>
      <div class="files">
        <div v-for="f of task.releaseTaskFiles" :key="f.fileId" class="file">
          <router-link :to="{path:'/readFile',query:{fileId:f.fileId}}">
              <img :src="getIcon(f.filePlan.type)" title="预览" class="cursor" alt="" />
            </router-link>
          <p>{{ f.filePlan.name }}</p>
          <a class="download-a" :href="getDownloadPath(f.fileId)" download=""
            >下载</a
          >
        </div>
      </div>
      <div class="details">
        <p class="details-left">截止 {{ task.deadline }}</p>
        <div class="details-right">
          <p><i class="el-icon-download" />下载讨论内容</p>
          <el-button style="margin-left: 30px" size="mini" type="primary"
            >展示词云</el-button
          >
        </div>
      </div>

      <div v-html="task.resume"></div>
    </div>

    <div class="add-discuss">
      <el-avatar icon="el-icon-user-solid" style="width: 44px"></el-avatar>
      <p v-if="!isAdd" @click="isAdd = true" style="width: 100%">添加评论</p>
      <div style="width: 100%" v-else>
        <el-input class="add-input" v-model="discuss"></el-input>
        <div class="add-discuss-bottom">
          <el-button
            type="text"
            style="margin-right: 40px"
            @click="isAdd = false"
            >取消</el-button
          >
          <el-button
            type="primary"
            style="margin-right: 40px"
            @click="addDiscuss"
            >确定</el-button
          >
        </div>
      </div>
    </div>

    <div class="discuss" v-for="(d, index) in discussList" :key="d.id">
      <el-avatar icon="el-icon-user-solid" style="width: 45px"></el-avatar>
      <div class="discuss-right">
        <div class="discuss-right-top">
          <p>
            {{ d.publisherName }} <span>{{ dateFormat(d.datetime) }}</span>
          </p>
          <div class="discuss-right-top-icon">
            <i class="el-icon-chat-dot-square" @click="replyBefore(index)"></i>
            <i
              class="el-icon-delete"
              v-show="isUser(d.userId)"
              @click="deleteDiscuss(index)"
            ></i>
          </div>
        </div>

        <p class="discuss-right-content">{{ d.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    taskId: {
      require: true,
    },
  },
  data() {
    return {
      isAdd: false,
      discuss: "",
      discussList: [],
      task: {},
    };
  },
  computed: {},
  watch: {},
  methods: {
    //回复预处理
    replyBefore(index){
      this.discuss=`@ ${this.discussList[index].publisherName}`
      this.isAdd=true
    },

    // 删除评论
    deleteDiscuss(index) {
      this.$req
        .deleteDiscuss(this.taskId, this.discussList[index].id)
        .then((val) => {
          if (val.data) {
            this.$message({
              showClose: true,
              message: "删除评论成功",
              type: "success",
            });
            this.discussList.splice(index,1)
          }
        });
    },

    // 是否是用户
    isUser(id) {
      return id == this.$store.getters.getAccount;
    },

    // 时间格式
    dateFormat(dateStr) {
      let d = new Date(dateStr);
      return `${d.getFullYear()}年 ${
        d.getMonth() + 1
      }月${d.getDate()}日 ${d.getHours()}:${d.getMinutes()}`;
    },

    //添加评论
    addDiscuss() {
      if (this.$module.isAllSpaces(this.discuss) || this.discuss == "") {
        this.$message({
          showClose: true,
          message: "请输入评论内容",
          type: "error",
        });
        return;
      }

      this.$req.addTaskDiscuss(this.task.id, this.discuss).then((val) => {
        this.discussList.push(val.data);
        this.discuss = "";
        this.isAdd = false;
      });
    },

    //获取下载文件路径
    getDownloadPath(id) {
      return `${this.$axios.baseURL()}/task/downloadTaskFile?fileId=${id}`;
    },

    getIcon(str) {
      return require(`@/assets/office-icon/${this.$iconType.typeChangeIcon(
        str
      )}.png`);
    },
  },
  created() {
    this.$req.getTaskById(this.taskId).then((val) => {
      if (val.data) {
        this.task = val.data;
      }
    });

    this.$req.getTaskDiscuss(this.taskId).then((val) => {
      this.discussList = val.data;
    });
  },
  mounted() {},
};
</script>
<style scoped>
.discuss-right-content {
  word-break: break-all;
}

.discuss-right-top-icon i {
  margin: 0 10px;
}

.discuss-right-top-icon {
  font-size: 28px;
  color: #a9a9a9;
}

.discuss-right-top-icon i:hover {
  color: #2d2d2d;
}

.discuss-right-top p {
  font-size: 14px;
  color: #2d2d2d;
}

.discuss-right-top p span {
  color: #a9a9a9;
  font-size: 12px;
}

.discuss-right-top {
  display: flex;
  justify-content: space-between;
}

.discuss-right {
  width: 100%;
  margin-left: 42px;
}

.discuss {
  display: flex;
  border-top: 1px solid #dcdcdc;
  padding: 20px 24px;
}

.add-discuss-bottom {
  margin-top: 20px;
  text-align: end;
}

.add-input {
  margin: 0 25px;
  width: 90%;
  border: none;
  display: flex;
  border-bottom: 2px solid #c8c8c8;
}

.add-input:hover {
  border-bottom: 2px solid #4d90fe;
}

.add-input >>> .el-input__inner {
  border: 0;
}

.add-discuss p {
  margin-left: 40px;
  font-size: 14px;
  line-height: 38px;
  color: grey;
  cursor: pointer;
}

.add-discuss {
  display: flex;
  border-top: 1px solid #dcdcdc;
  padding: 20px 24px;
}

.details-right {
  display: flex;
}

.details-right p i {
  font-weight: 900;
  color: #666;
}

.details {
  display: flex;
  justify-content: space-between;
  height: 34px;
  padding-top: 7px;
  line-height: 34px;
  font-size: 12px;
  color: #a0a0a0;
  margin-bottom: 6px;
}

.download-a {
  color: #ffff;
  font-size: 14px;
}

.file:hover .download-a {
  color: #32baf0;
}

.file {
  text-align: center;
  width: 80px;
  margin: 0 5px 0;
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

.top .title {
  padding-top: 10px;

  height: 50px;
  line-height: 50px;
  font-size: 18px;
  font-weight: 400;
  width: 100%;
}

.top {
  padding: 0 37px 10px 30px;
}

.main {
  width: 770px;
  padding: 0 20px;
  border: 1px solid #e2e6ed;
  border-radius: 8px;
  background: #fff;
  margin-bottom: 20px;
  text-align: left;
}
</style>