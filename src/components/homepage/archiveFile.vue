<template>
  <div class="card">
    <img :src="bg" alt="" />
    <div class="main">
      <div class="info">
        <el-row>
          <el-col>
            <p class="infoTitle">{{ course.name }}</p>
          </el-col>
        </el-row>

        <el-row style="width: 200px">
          <el-col :span="12" style="margin-top: 10px">
            <div>角色:{{ course.role.name }}</div>
          </el-col>
          <el-col :span="12" v-if="course.role.id === '1'">
            <div>老师:{{ teacher.name }}</div>
          </el-col>
        </el-row>
      </div>

      <el-dropdown trigger="click" style="height: 30px">
        <span class="el-dropdown-link">
          <i class="el-icon-more" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="childRecoveryCourse()">恢复</el-dropdown-item>
          <el-dropdown-item v-if="course.role.id=='1'" @click.native="DropOut()">退课</el-dropdown-item>
          <el-dropdown-item v-else @click.native="childDeleteCourse()">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      bg: "",
      teacher: {},
    };
  },
  props: {
    course: {
      type: Object,
      require: true,
    },
  },
  computed: {},
  watch: {},
  methods: {
    childRecoveryCourse() {
      console.log('recovery');
      this.$emit("childRecoveryCourse", this.course);
    },

    childDropOut(){
      this.$emit("dropOut", this.course.id);
    },

   

    childDeleteCourse(){
      this.$emit("childDeleteCourse", this.course);
    },

    getTeacherInfo() {
      this.$req.getInfoByID(this.course.adminTeacherId).then((val) => {
        this.teacher = val.data;
      });
    },
  },
  created() {
    this.bg = require(`../../assets/file/${this.course.theme}.jpg`);

    // 获取教师信息
    if (this.course.role.id === "2") {
      this.getTeacherInfo();
    }

    console.log(this.course);
  },
};
</script>
<style scoped>
.main i {
  color: white;
  font-size: 27px;
}

.main {
  padding: 24px 16px 14px;
  display: flex;
  justify-content: space-between;
}

.infoTitle {
  font-size: 20px;
}

.info {
  color: #ffffff;
  font-size: 12px;
  text-align: left;
}

.card img {
  width: 100%;
  height: 100%;
  position: absolute;

  top: 0;
  left: 0;
}

.card {
  position: relative;
  width: 300px;
  height: 110px;
}
</style>