<template>
  <div class="">
    <Nav></Nav>

    <div class="notice">
      <div class="notice-top">
        <h3>通知</h3>
        <!-- <span class="cancel-unread" @click="ignoreUnread">忽略未读</span> -->
      </div>

      <div class="notice-card" v-for="notice in noticeList" :key="notice.id">
        <i v-if="!notice.isRead" class="el-icon-warning red"></i>
        <i v-else class="el-icon-success green"></i>
        <p class="notice-card-type">{{notice.type}}</p>
        <p class="notice-card-title">{{ notice.title }}</p>
        <router-link 
        @click="readNotice(notice.id)"
          :to="{
              path: '/courseTask',
              query: {  
                taskId: notice.taskId,
                courseId:notice.task.courseId,
              },
            }" class="notcie-card-content">{{ notice.content }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../components/homepage/Navigation";

export default {
  components: {
    Nav,
  },
  data() {
    return {
      noticeList: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
      ignoreUnread(){
      },

      readNotice(id){
          this.$req.readNotice(id)
      }
  },
  created() {
    this.$req.getAllTaskNotice().then((val) => {
      console.log(val.data);
      this.noticeList = val.data;
    });
  },
  mounted() {},
};
</script>
<style scoped>
.notice-card-type{
    font-size: 16px;
    margin:0 10px;
}

.notcie-card-content {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 270px;
  color: rgb(128, 128, 128);
}

.notice-card-title {
    margin:0 10px;
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.green {
  color: greenyellow;
  margin: 23px 30px 0 0;
}

.red {
  color: red;
  margin: 23px 30px 0 0;
}

.notice-card {
  padding: 0 20px 0 30px;
  text-align: left;
  line-height: 58px;
  height: 58px;
  display: flex;
}

.notice-top h3 {
  font-size: 18px;
  color: #2d2d2d;
  font-weight: 400;
}

.cancel-unread {
  color: #818181;
  cursor: pointer;
}

.cancel-unread:hover {
  color: black;
}

.notice-top {
  line-height: 58px;
  height: 58px;
  border-bottom: 1px solid #dcdcdc;
  padding: 0 28px 0 36px;
  background: #f8f8f8;
  display: flex;
  justify-content: space-between;
}

.notice {
  width: 810px;
  margin: 20px auto;
  border: 1px solid #c8c8c8;
}
</style>