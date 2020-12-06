<template>
  <div class="all" @dblclick="edit()">
    <!-- 顶部题号 题目类型 分数 -->
    <div class="top">
      <span>{{ question.titleNumber }}:</span>
      <span>{{ questionType }}</span>
      <el-input-number
        style="width: 15 0px"
        v-if="isEdit"
        v-model="question.score"
        :min="1"
        :max="100"
      />
      <span v-else>{{ question.score }}</span>
      <span>分</span>
    </div>

    <!-- 题干 -->
    <div class="main" v-html="question.problem" v-if="!isEdit"></div>

    <!-- 编辑题干 -->
    <div v-else>
      <editor
        class="eidtor"
        :content.sync="question.problem"
        @getContent="editProblem"
        :placeholder="problemPla"
        :height="'100px'"
        :borderHeight="'200px'"
      />
    </div>

    <div class="bottom">
      <div v-show="question.type === 0">
        <el-radio
          v-model="question.answer[0]"
          label="true"
          border
          :disabled="!isEdit"
          >正确</el-radio
        >
        <el-radio
          v-model="question.answer[0]"
          label="false"
          border
          :disabled="!isEdit"
          >错误</el-radio
        >
      </div>

      <div v-show="question.type === 1">
        <el-radio v-model="question.rightKey" label="A" :disabled="!isEdit"
          >A.{{ question.answer[0] }}</el-radio
        >
        <el-radio v-model="question.rightKey" label="B" :disabled="!isEdit"
          >B.{{ question.answer[1] }}</el-radio
        >
        <el-radio v-model="question.rightKey" label="C" :disabled="!isEdit"
          >C.{{ question.answer[2] }}</el-radio
        >
        <el-radio v-model="question.rightKey" label="D" :disabled="!isEdit"
          >D.{{ question.answer[3] }}</el-radio
        >
      </div>

      <div v-show="question.type === 4">
        <p v-if="!isEdit">{{ question.answer[0] }}</p>
        <el-input
          v-else
          placeholder="请输入内容"
          v-model="question.answer[0]"
          clearable
        >
        </el-input>
      </div>

      <div v-show="question.type === 5">
        <p v-if="!isEdit">{{ question.answer[0] }}</p>
        <el-input
          type="textarea"
          v-else
          placeholder="请输入内容"
          v-model="question.answer[0]"
          clearable
        >
        </el-input>
      </div>

      <div v-show="question.type === 6">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
      
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </div>

      <!-- 试题解析 -->
      <div class="bottom-bottom">
        <p>试题解析:</p>
        <div v-if="!isEdit" v-html="question.analysis" class="main"></div>
        <!-- 解析编辑 -->
        <div v-else>
          <editor
            class="eidtor"
            :content="question.analysis"
            @getContent="editAnalysis"
            :placeholder="analysisPla"
            :height="'100px'"
            :borderHeight="'200px'"
          />
        </div>
      </div>
    </div>

    <!-- 编辑状态下的 确定 取消 删除按钮 -->
    <div class="edit-button" v-show="isEdit">
      <el-button @click="finalEdit" class="button" type="primary" size="small"
        >保存</el-button
      >
      <el-button
        @click="cancelEdit"
        class="button"
        type="primary"
        plain
        size="small"
        >取消</el-button
      >
      <el-button type="danger" size="small">删除</el-button>
    </div>
  </div>
</template>

<script>
import myMoudule from "@/modules/myModule";
import editor from "@/components/utils/editor.vue";

export default {
  components: {
    editor,
  },

  props: {
    question: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      fileList: [],

      isEdit: false,
      backups: {}, //备份

      // question: {
      //   titleNumber: 1,
      //   type: 0, //0判断题 1单选题 2多选题 3不定项题 4填空题 5简答题 6文件题
      //   score: 10,
      //   answer: ["true"],
      //   rightKey: "", // 正确答案
      //   analysis: `<p>解析分析试题</p>`,
      //   problem: `<p>题目</p>`,
      // },

      problemPla: "请输入题干",
      analysisPla: "如有试题解析，请输入试题解析",
      answerPla: "如有参考答案，请输入参考答案",
    };
  },
  computed: {
    questionType: function () {
      switch (this.question.type) {
        case 0:
          return "判断题";
        case 1:
          return "单选题";
        case 2:
          return "多选题";
        case 3:
          return "不定项题";
        case 4:
          return "填空题";
        case 5:
          return "简答题";
        case 6:
          return "文件题";
      }
    },
  },
  watch: {},
  methods: {
    editProblem(val) {
      this.question.problem = val;
    },

    editAnalysis(val) {
      this.question.analysis = val;
    },

    finalEdit() {
      this.isEdit = false;
      this.backups = this.$module.deepClone(this.question);
      console.log("save", this.backups);
    },

    cancelEdit() {
      this.isEdit = false;
      this.question = this.$module.deepClone(this.backups);
      console.log("cancel", this.backups);
    },

    edit() {
      if (!this.isEdit) {
        this.isEdit = !this.isEdit;
        this.backups = this.$module.deepClone(this.question);
        console.log("edit", this.backups);
      }
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${file.name}？`);
    // },
  },
  created() {},
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped>
.eidtor {
  margin: 10px 0;
}

.edit-button button {
  width: 120px;
}

.edit-button {
  text-align: right;
}

.bottom-bottom p {
  margin: 10px;
  color: green;
  font-size: 14px;
  font-weight: 400;
}

.main {
  margin: 10px 0 10px 20px;
}

.top span:nth-child(2) {
  margin-right: 10px;
}

.top {
  font-size: 14px;
}

.all:hover {
  border: 1px solid blue;
}

.all {
  border: 1px solid white;
  text-align: left;
  padding: 10px 10px 27px;
  border-radius: 8px;
}
</style>

<style >
.el-input__inner {
  margin-top: 0px;
  content: "questionCard";
}
</style>