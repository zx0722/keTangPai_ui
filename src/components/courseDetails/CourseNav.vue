<template>
  <div class="course-nav">
    <i class="el-icon-circle-plus-outline icon"></i>
    <div class="left">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/homepage' }"
          >课堂</el-breadcrumb-item
        >
        <el-breadcrumb-item
          >{{ course.name }}&nbsp;{{ course.courseClass }}
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div>
        <ul class="ul-icon">
          <li>
            <img src="../../assets/img/tool_icon.png" alt="工具" />
          </li>

          <li>
            <i class="el-icon-bell" style="font-size: 25px"></i>
          </li>

          <li>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <el-avatar />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  ><div
                    class="litle-icon"
                    style="background-position: 50% 56%"
                  />
                  开通VIP</el-dropdown-item
                >
                <el-dropdown-item
                  ><div
                    class="litle-icon"
                    style="background-position: 50% 30%"
                  />
                  机构账号绑定</el-dropdown-item
                >
                <el-dropdown-item
                  ><div
                    class="litle-icon"
                    style="background-position: 50% 2%"
                  />
                  个人设置</el-dropdown-item
                >
                <el-dropdown-item
                  ><div
                    class="litle-icon"
                    style="background-position: 50% 83%"
                  />
                  推出账号</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  props: {
    course: {
      type: Object,
      require: true,
    },
  },
  computed: {},
  watch: {},
  methods: {},
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
.litle-icon {
  margin: 5px 6px 0 0;
  width: 25px;
  height: 25px;
  background-image: url("../../assets/img/user-info-icon-bg.png");
}

.ul-icon li:nth-child(3) {
  padding-top: 19px;
}

.ul-icon li:nth-child(1) img {
  width: 25px;
  height: 25px;
}

.ul-icon li {
  padding: 25px 10px 0 10px;
}

.ul-icon {
  display: inline-flex;
  list-style: none;
  vertical-align: middle;
  padding: 0 40px 0 0;
  margin: 0;
}

.left {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.breadcrumb {
  margin-left: 45px;
  line-height: 70px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon {
  font-size: 30px;
  padding-left: 40px;
  color: #5f6368;
  cursor: pointer;
  line-height: 70px;
}

.course-nav {
  width: 100%;
  position: fixed;
  top: 0;
  height: 72px;
  background: white;
  box-sizing: border-box;
  z-index: 5;
  display: flex;
 box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>
