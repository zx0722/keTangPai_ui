<template>
  <div class="">
    <courseNav :course="course" />
    <div class="all">
      <div class="top">
        <ul>
          <li @click="state = 0" :class="{ 'click-title': state === 0 }">
            学生作业
          </li>
          <li @click="state = 1" :class="{ 'click-title': state === 1 }">
            作业评论
          </li>
        </ul>
      </div>
    </div>

    <div class="main">
      <discuss :taskId="this.$route.query.taskId" v-show="state == 1" />
      <taskDetails :taskId="this.$route.query.taskId" v-show="state == 0" />
    </div>
  </div>
</template>

<script>
import courseNav from "../components/courseDetails/CourseNav";
import discuss from "../components/courseDetails/homework/discuss";
import taskDetails from "../components/courseDetails/homework/taskDetails";
export default {
  components: {
    courseNav,
    discuss,
    taskDetails,
  },
  data() {
    return {
      course: {},
      state: 0, // 0 作业  1 作业评论
      task: {},
    };
  },
  computed: {},
  watch: {
    //   $route(to, from) {
    //     if (this.$route.query.taskId) {
    // this.course.id = this.$route.query.courseId;
    //  this.$req.getTaskById(this.$route.query.taskId).then((val) => {
    //     if (!val.data) {
    //       this.$router.push("/homepage");
    //     } else {
    //       if (val.data.couresId != this.courseId) {
    //         this.$router.push("/homepage");
    //       } else {
    //         this.task = val.data;
    //       }
    //     }
    //   });
    //   this.$req.getCourseById(this.course.id).then((val) => {
    //     if (val.data) {
    //       this.course = val.data;
    //     } else {
    //       this.$router.push("/homepage");
    //     }
    //   });
    //     }
    //   }
  },
  methods: {},
  created() {
    this.course.id = this.$route.query.courseId;

    this.$req.getTaskById(this.$route.query.taskId).then((val) => {
      if (!val.data) {
        this.$router.push("/homepage");
      } else {
        if (val.data.couresId != this.courseId) {
          this.$router.push("/homepage");
        } else {
          this.task = val.data;
        }
      }
    });

    this.$req.getCourseById(this.course.id).then((val) => {
      if (val.data) {
        this.course = val.data;
      } else {
        this.$router.push("/homepage");
      }
    });
  },
  mounted() {},
};
</script>
<style scoped>
.main {
  margin: 20px auto 0;
}

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
  margin: 90px auto 0;
}
</style>