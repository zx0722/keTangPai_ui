<template>
  <div class="">
    <div class="top">
      <el-button type="primary" class="exam-button">+&nbsp;新建测试(考试)</el-button>
      <el-button type="primary" plain class="exam-button">导入测试(考试)</el-button>
      <span>先去备课区组卷</span>
    </div>
    <div class="main">
      <div class="main-top">
        <div class="main-top-left">
          <span class="main-top-left-span click-span" @click="changeState(0)"
            >全部({{ examList.length }})</span
          >
          <span class="main-top-left-span" @click="changeState(1)"
            >未发布({{ unpublished.length }})</span
          >
          <span class="main-top-left-span" @click="changeState(2)"
            >未开始({{ notStarted.length }})</span
          >
          <span class="main-top-left-span" @click="changeState(3)"
            >已发布({{ published.length }})</span
          >
          <span class="main-top-left-span" @click="changeState(4)"
            >已完成({{ finished.length }})</span
          >
        </div>
      </div>

      <examCard/>
    </div>
  </div>
</template>

<script>
import myModule from "../../../modules/myModule";
import examCard from './examCard';

export default {
  components: {
      examCard
  },
  data() {
    return {
      examList: [], // 测试集
      unpublished: [], // 未发布
      notStarted: [], // 未开始
      published: [], // 已发布
      finished: [], // 已完成
      state: 0, // 1为全部 2未发布 3未开始 4未开始 5已发布 6已完成
    };
  },
  computed: {},
  watch: {},
  methods: {
    changeState(val) {
      if (val === this.state) {
        return;
      }

      let arr = document.getElementsByClassName("main-top-left")[0].children;
      myModule.toggleClass(arr[this.state], "click-span");
      myModule.toggleClass(arr[val], "click-span");

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
.main-top-left-span {
  cursor: pointer;
  font-size: 14px;
  color: #5f6368;
  margin-right: 48px;
  padding: 3px 14px;
}

.click-span {
  background: rgba(50, 186, 240, 1);
  border-radius: 4px;
  color: #fff;
}

.main-top-left {
  display: flex;
}

.main-top {
  margin: 28px 0 24px;
}

.top span {
  padding-top: 11px;
  margin-left: 30px;
  font-size: 14px;
  color: #32baf0;
  font-weight: 700;
  cursor: pointer;
}

.top {
  display: flex;
}

.exam-button {
  width: 143px;
}
</style>