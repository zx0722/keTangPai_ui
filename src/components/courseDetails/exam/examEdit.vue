<template>
  <div class="edit-all">
    <div class="left">
      <div class="left-top">
        <p>试题概览</p>
        <p>
          共<span>{{ questions.length }}</span
          >题,总分<span>{{ getScore }}</span
          >分
        </p>

        <div v-for="(t, i) in total" :key="i" class="left-top-score">
          <p>{{ questionType(i) }}</p>
          <p>{{ t }}题</p>
          <p>{{ scoreTotal[i] }}分</p>
        </div>
      </div>

      <div class="left-bottom">
        <div>
          <p>添加试题类型</p>
          <el-button
            type="primary"
            plain
            class="left-bottom-btn"
            @click="createQuestion(0)"
            ><i class="el-icon-check"></i>判断题</el-button
          >
          <el-button
            type="primary"
            plain
            class="left-bottom-btn"
            @click="createQuestion(1)"
            ><i class="el-icon-circle-check"></i>单选题</el-button
          >
          <el-button
            type="primary"
            plain
            class="left-bottom-btn"
            @click="createQuestion(2)"
            ><i class="el-icon-finished"></i>多选题</el-button
          >
          <el-button
            type="primary"
            plain
            class="left-bottom-btn"
            @click="createQuestion(3)"
            ><i class="el-icon-thumb"></i>不定项题</el-button
          >
          <el-button
            type="primary"
            plain
            class="left-bottom-btn"
            @click="createQuestion(4)"
            ><i class="el-icon-notebook-2"></i>填空题</el-button
          >
          <el-button
            type="primary"
            plain
            class="left-bottom-btn"
            @click="createQuestion(5)"
            ><i class="el-icon-edit"></i>简答题</el-button
          >
          <el-button
            type="primary"
            plain
            class="left-bottom-btn"
            @click="createQuestion(6)"
            ><i class="el-icon-document-remove"></i>文件题</el-button
          >
        </div>

        <div style="margin-top:20px">
          <p>添加试题类型</p>
          <el-button type="primary" plain style="margin:5px 0">+ 从测试导入</el-button>
          <el-button type="primary" plain style="margin:5px 0">+ 从互动导入</el-button>
          <el-button type="primary" plain style="margin:5px 0">+ 从word导入</el-button>
        </div>

        <div></div>
      </div>
    </div>

    <div class="right">
      <div class="right-top">
        <div class="right-top-top">
          <span>{{ getExamState }}</span>
          <p>{{ exam.title }}</p>
        </div>
        <div class="right-top-bottom">
          <p>
            限时：{{ exam.timeLimit }} | 起止时间：{{ exam.start }} ~
            {{ exam.end }}
          </p>

          <p>请认真完成每一次测试，测试分数将计入平时成绩</p>
          <p>创建于{{ exam.createTime }}</p>
        </div>
      </div>

      <div class="">
        <div class="group-btns">
          <div class="sorticon"></div>
          <div class="tips">批量排序</div>
        </div>

        <div class="group-btns">
          <div class="delicon"></div>
          <div class="tips">批量删除</div>
        </div>

        <div class="group-btns">
          <div class="modifyscoreicon"></div>
          <div class="tips">批量改分</div>
        </div>

        <div class="group-btns">
          <div class="outputword"></div>
          <div class="tips">导出word</div>
        </div>

        <div class="group-btns">
          <div class="viewicon"></div>
          <div class="tips">预览试题</div>
        </div>
      </div>

      <div v-for="q in questions">
        <questionCard class="question-card" :question="q" />
      </div>
    </div>
  </div>
</template>

<script>
import questionCard from "./questionCard";

export default {
  components: {
    questionCard,
  },
  data() {
    return {
      questions: [
        {
          titleNumber: 1,
          type: 0, //0判断题 1单选题 2多选题 3不定项题 4填空题 5简答题 6文件题
          score: 10,
          answer: ["true"],
          rightKey: "", // 正确答案
          analysis: `<p>解析分析试题</p>`,
          problem: `<p>题目</p>`,
        },
        {
          titleNumber: 2,
          type: 1, //0判断题 1单选题 2多选题 3不定项题 4填空题 5简答题 6文件题
          score: 10,
          answer: ["选项一", "选项二", "选项三", "选项四"],
          rightKey: "A", // 正确答案
          analysis: `<p>解析分析试题:答案选A</p>`,
          problem: `<p>题目</p>`,
        },
        // {
        //   titleNumber: 3,
        //   type: 2, //0判断题 1单选题 2多选题 3不定项题 4填空题 5简答题 6文件题
        //   score: 10,
        //   answer: ['选项一','选项二','选项三','选项四','选项五'],
        //   rightKey: "ABCD", // 正确答案
        //   analysis: `<p>解析分析试题:答案选A</p>`,
        //   problem: `<p>题目</p>`,
        // },
        {
          titleNumber: 3,
          type: 4, //0判断题 1单选题 2多选题 3不定项题 4填空题 5简答题 6文件题
          score: 10,
          answer: ["这是操蛋的填空题答案"],
          rightKey: "", // 正确答案
          analysis: `<p>解析分析试题:这题就该这样填</p>`,
          problem: `<p>这是一道填空题____</p>`,
        },
        {
          titleNumber: 4,
          type: 5, //0判断题 1单选题 2多选题 3不定项题 4填空题 5简答题 6文件题
          score: 10,
          answer: ["这是操蛋的简答题答案"],
          rightKey: "", // 正确答案
          analysis: `<p>解析分析试题:这题就该这样填</p>`,
          problem: `<p>这是一道填空题简答题,简答,简答</p>`,
        },
        {
          titleNumber: 5,
          type: 6, //0判断题 1单选题 2多选题 3不定项题 4填空题 5简答题 6文件题
          score: 10,
          answer: ["这是操蛋的文件题"],
          rightKey: "", // 正确答案
          analysis: `<p>解析分析试题:垃圾文件题</p>`,
          problem: `<p>文件 文件 文件</p>`,
        },
      ],
      total: [], //下标 0判断题 1单选题 2多选题 3不定项题 4填空题 5简答题 6文件题
      scoreTotal: [],
      exam: {
        info: "请认真完成每一次测试，测试分数将计入平时成绩",
        title: "教师发布学生测试",
        id: "007",
        state: 0, // 0未发布 1未开始 2已发布 3已结束
        timeLimit: -1, // -1为无限制
        start: "20/11/03 17:13", // 开始时间
        end: "无", // 结束时间
        createTime: "20/09/30/ 10:22", //创建时间
        examList: [], // 测试集
        finished: 1, // 已批改
        unfinished: 2, // 未批改
        unSubmit: 17, //未提交
      },
    };
  },
  computed: {
    getExamState: function () {
      switch (this.exam.state) {
        case 0:
          return "未发布";
        case 1:
          return "未开始";
        case 2:
          return "已发布";
        case 3:
          return "已结束";
      }
    },

    getScore: function () {
      let s = 0;
      for (let i = 0; i < this.questions.length; i++) {
        console.log(this.questions[i]);
        s = s + this.questions[i].score;
      }
      return s;
    },

    computeTotal: function () {
      for (q in questions) {
        this.total[q.type]++;
        this.scoreTotal[q.type] = +q.score;
      }
    },

    questionType: function (val) {
      switch (val) {
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
    createQuestion(val) {
      let obj = {};
      obj.titleNumber = this.questions.length + 1;
      obj.type = val;
      obj.score = 0;
      obj.problem = `<p>题目</p>`;
      obj.analysis = `<p>解析分析试题</p>`;
      obj.answer = [];
      //       switch (val) {
      //         case 0:
      //         case 1:
      // obj.answer = "";
      // break;
      //         case 2:
      //         case 3:
      //         case 4:
      //           obj.answer = [];
      //           break;
      //         case 5:
      //         case 6:
      //           obj.answer = "";
      //       }
      this.questions.push(obj);
    },
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
.group-btns {
    display: inline-block;

    margin-right: 60px;
    text-align: center;
    cursor: pointer;
}

.group-btns .viewicon{
  background: url('../../../assets/img/yulan.png') center no-repeat;
}

.group-btns .outputword{
  background: url('../../../assets/img/word.png') center no-repeat;
}

.group-btns .sorticon {
    background: url('../../../assets/img/paixu-3.png') center no-repeat;
}

.group-btns .delicon{
  background: url('../../../assets/img/bianzu.png') center no-repeat;
}

.group-btns .modifyscoreicon{
  background: url('../../../assets/img/dafen.png') center no-repeat;
}

.delicon,.sorticon,.viewicon,.modifyscoreicon,.outputword{
  width: 64px;
    height: 32px;
    text-align: center;
}

.group-btns .tips {
    text-align: center;
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    color: #32BAF0;
}

.question-card {
  width: 922px;
  margin-top: 30px;
}

.right-top-bottom p:nth-child(3) {
  color: #999;
}

.right-top-bottom p {
  margin-top: 20px;
  font-size: 14px;

  background: #fff;
  color: #2d2d2d;
}

.right-top-top p {
  font-size: 18px;
  color: #333;
}

.right-top-top span {
  margin-top: 4px;
  margin-right: 7px;
  color: #5f6368;
  background: #f1f3f4;
  font-size: 12px;
  border-radius: 2px;
  padding: 2px 4px;
  height: 17px;
}

.right-top-top {
  display: flex;
}

.left-bottom-btn {
  width: 100px;
  margin: 10px 0 0 10px;
}

.left-top-score {
  margin-top: 6px;
  font-size: 14px;
  display: flex;
  justify-content: space-around;
}

.left-top p span {
  color: #32baf0;
  padding: 0 3px;
}

.left-top p:nth-child(1),
.left-top p:nth-child(2),
.left-bottom p {
  font-size: 14px;
  font-weight: 600;
}

.right-top {
  text-align: left;
  width: 900px;
  border-radius: 8px;
  border: 1px solid rgba(218, 220, 224, 1);
  padding: 20px;
}

.left-bottom {
  text-align: left;
  padding: 20px;
  margin-top: 10px;
  width: 220px;
  border-radius: 8px;
  border: 1px solid rgba(218, 220, 224, 1);
}

.left-top {
  padding: 20px 20px;
  width: 220px;
  text-align: left;

  border-radius: 8px;
  border: 1px solid rgba(218, 220, 224, 1);
}

.left {
  position: fixed;
}

.right {
  float: right;
}

.edit-all {
  width: 1224px;
  margin: 30px auto;
}
</style>