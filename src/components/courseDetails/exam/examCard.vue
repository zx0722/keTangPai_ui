<template>
  <div class="exam-card">
    <div class="top">
      <div>
        <div class="top-left-top">
          <span
            class="span-icon"
            :class="{
              'span-red': exam.state === '待完成',
              'span-grey': exam.state === '已批改',
              'span-white': exam.state === '未批改',
            }"
            >{{ exam.state }}
          </span>
          <h3>{{ exam.title }}</h3>
        </div>
        <div class="top-left-bottom">
          限时：{{ exam.timeLimit }} | 起止时间：{{ exam.start }} ~
          {{ exam.end }}
        </div>
      </div>

      <div>
        <ul v-if="role === 1" class="top-right-top">
          <li>
            <p>已批</p>
            <p style="color: #32baf0">{{ exam.finished }}</p>
          </li>
          <li>
            <p>未批</p>
            <p style="color: #202124">{{ exam.unfinished }}</p>
          </li>
          <li>
            <p>未交</p>
            <p style="color: #ff6000">{{ exam.unSubmit }}</p>
          </li>
        </ul>
        <el-button v-else type="primary" class="el-button">开始答题</el-button>
      </div>
    </div>

    <div class="main">
      {{ exam.info }}
    </div>

    <div class="bottom">
      <p>创建于{{ exam.createTime }}</p>
      <div>
        <el-button type="primary" class="bottom-btn">重新发布</el-button>
        <el-button type="primary" class="bottom-btn">讲解试卷</el-button>
        <el-button type="primary" plain class="bottom-btn"
          >编辑标题及简介</el-button
        >
        <el-button type="primary" plain class="bottom-btn"
          >编辑试题内容</el-button
        >
        <el-button type="primary" plain class="bottom-btn">更多</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      examStu: {
        title: "学生测试",
        info: "请认真完成每一次测试，测试分数将计入平时成绩",
        id: "008",
        state: 0, // 0待完成 1待批改 2已批改
        timeLimit: -1, // -1为无限制
        start: "20/11/03 17:13", // 开始时间
        end: "无", // 结束时间
        createTime: "20/09/30/ 10:22", //创建时间
      },
      examTea: {
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

      exam: {},
      role: 1, // 0为学生 1为老师
    };
  },
  computed: {},
  watch: {},
  methods: {},
  created() {
    if (this.role === 0) {
      this.exam = this.examStu;

      switch (this.exam.state) {
        case 0:
          this.exam.state = "待完成";
          break;
        case 1:
          this.exam.state = "待批改";
          break;
        case 2:
          this.exam.state = "已批改";
      }
    } else if (this.role === 1) {
      this.exam = this.examTea;

      switch (this.exam.state) {
        case 0:
          this.exam.state = "未发布";
          break;
        case 1:
          this.exam.state = "未开始";
          break;
        case 2:
          this.exam.state = "已发布";
          break;
        case 3:
          this.exam.state = "已结束";
          break;
      }
    }
  },
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
 .bottom-btn{
   margin-right: 0;
   
 }

.top-right-top li p:nth-child(2) {
  padding-top: 6px;
  font-size: 20px;
}

.top-right-top li p {
  font-weight: 700;
}

.top-right-top li:nth-child(2) {
  border-left: 1px solid rgba(226, 230, 237, 1);
  border-right: 1px solid rgba(226, 230, 237, 1);
}

.top-right-top li {
  padding: 0 30px;
}

.top-right-top {
  display: flex;
}

ul {
  list-style: none;
}

.bottom {
  text-align: left;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.bottom p {
  font-size: 12px;
  color: #a0a0a0;
  margin-bottom: 6px;
}

.main {
  text-align: left;
  margin-top: 10px;
  height: 54px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.main,
.top-left-bottom {
  color: #5f6368;
  font-size: 14px;
}

.el-button {
  width: 124px;
  margin-right: 20px;
}

.top-left-bottom {
  margin-top: 20px;
}

.top-left-top h3 {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  margin-top: -3px;
  max-width: 240px;
}

.top-left-top {
  text-align: left;
  display: flex;
}

.top {
  display: flex;
  justify-content: space-between;
}

.span-white {
  background: rgba(50, 186, 240, 1);
  color: #fff;
}

.span-grey {
  color: #5f6368;
  background: #f1f3f4;
}
.span-red {
  color: #fff;
  background: #eb5050;
}

.span-icon {
  font-size: 14px;
  margin-right: 15px;
  border-radius: 2px;
  padding: 0 4px;

  height: 23px;
}

.exam-card {
  padding: 24px 20px 0 40px;
  border: 1px solid #e2e6ed;
  border-radius: 8px;
}
</style>

<style>
.el-button[data-v-fdce7012] {
  content: 'examCard中修改';
    width: 124px;
    margin-right: 0px;
}

</style>