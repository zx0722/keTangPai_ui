<template>
  <div class="">
    <courseNav :course="course" />

    <div class="all">
      <div class="top">
        <ul>
          <li @click="changeState(0)" :class="{ 'click-title': state === 0 }">
            试题编辑
          </li>
          <li @click="changeState(1)" :class="{ 'click-title': state === 1 }">
            发布设置
          </li>
          <li @click="changeState(2)" :class="{ 'click-title': state === 2 }">
            评阅测试
          </li>
          <li @click="changeState(3)" :class="{ 'click-title': state === 3 }">
            测试分析
          </li>
          <li @click="changeState(4)" :class="{ 'click-title': state === 4 }">
            讲解试卷
          </li>
        </ul>
      </div>
    </div>

    <div class="main">
        <examEdit/>
    </div>
  </div>
</template>

<script>
import courseNav from "../components/courseDetails/CourseNav";
import examEdit from '../components/courseDetails/exam/examEdit'

export default {
  components: {
    courseNav,
    examEdit,
  },
  data() {
    return {
      course: {
        id: 1,
        state: 0, // 0为教 1为学
        theme: "05",
        name: "JavaEE",
        courseClass: "118230204",
        addCode: "89LVM4",
        schoolYear: "2020-2021",
        semester: "第一学期", //学期
        teacher: "徐传运",
        isTop: true,
        member: 1,
        interact: 0,
      },

      state: 0, // 0试题编辑 1发布设置 2评阅测试 3测试分析 4讲解试卷
    };
  },
  computed: {},
  watch: {},
  methods: {
    changeState(val) {
      if (val === this.state) {
        return;
      }

      this.state = val;
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
.click-title {
  border-bottom: 4px solid #2c58ab;
}

.top ul li {
  cursor: pointer;
  text-align: center;
  height: 40px;
  padding: 0 22px;
}

.top ul {
  margin: auto;
  width: 600px;
  display: flex;
  justify-content: space-around;
  font-size: 16px;
  font-weight: 500;
  color: rgba(59, 61, 69, 1);
}

ul {
  list-style: none;
}

.all {
  width: 1224px;
  margin:90px auto 0;
}

/* .top{
   margin-top: 90px;
} */
</style>