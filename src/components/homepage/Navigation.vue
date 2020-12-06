<template>
  <div class="container">
    <div class="navOptions">
      <ul class="first">
        <li class="item">
          <img class="logo" src="../../assets/img/logo-mainblue.png" alt="" />
        </li>
        <li class="item active" @click="changeState(1)">
          <a href="http://localhost:8080/#/homepage">课堂</a>
        </li>
        <li class="item" @click="changeState(2)">
          <a href="javascript:;">精品慕课</a>
        </li>
        <li class="item" @click="changeState(3)">
          <a href="javascript:;">我的精品</a>
        </li>
        <li class="item" @click="changeState(4)">
          <a href="javascript:;">双选会</a>
        </li>
        <li class="item" @click="changeState(5)">
          <a href="javascript:;">论文管理</a>
        </li>
      </ul>

      <ul class="second">
        <li>
          <img src="../../assets/img/tool_icon.png" alt="工具" />
        </li>

        <li>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <i
                v-if="noticeList.length == 0"
                class="el-icon-bell"
                style="font-size: 25px"
              />
              <el-badge v-else :value="noticeList.length" class="item">
                <i class="el-icon-bell" style="font-size: 25px" />
              </el-badge>
            </span>
            <el-dropdown-menu slot="dropdown">
              <div
                v-show="noticeList.length != 0"
                v-for="(notice,index) in noticeList"
                @click="intoTask(index)"
                class="notice-row"
                :key="notice.id"
              >
                <p class="notice-type">【{{ notice.type }}】</p>
                <p class="notice-title">{{ notice.title }}</p>
                <p class="notice-content">{{ notice.content }}</p>
              </div>

              <el-button
                type="primary"
                plain
                style="width: 90%; margin: 4px 0 0 18px"
                @click="checkAllNotice"
                >查看全部</el-button
              >
            </el-dropdown-menu>
          </el-dropdown>
        </li>

        <li>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <el-avatar
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              ></el-avatar>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                ><div class="icon" style="background-position: 50% 56%" />
                开通VIP</el-dropdown-item
              >
              <el-dropdown-item
                ><div class="icon" style="background-position: 50% 30%" />
                机构账号绑定</el-dropdown-item
              >
              <el-dropdown-item
                ><router-link to="/info" style="display: flex">
                  <div class="icon" style="background-position: 50% 2%" />
                  个人设置
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item
                ><div class="icon" style="background-position: 50% 83%" />
                推出账号</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import myModule from "../../modules/myModule.js";
export default {
  components: {},
  data() {
    return {
      state: 1, // 1 课堂 2 精品慕课 3 我的精品 4 双选会 5论文管理
      noticeList: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    intoTask(index){
      this.$router.push({
        path:'/courseTask',
        query:{
          courseId:this.noticeList[index].task.courseId,
          taskId:this.noticeList[index].taskId
        }
      })
    },

    checkAllNotice() {
      this.$router.push("notice");
    },

    changeState(val) {
      if (val === this.state) {
        return;
      } else {
        let arr = document.querySelectorAll(".item");
        myModule.toggleClass(arr[this.state], "active");
        myModule.toggleClass(arr[val], "active");
        this.state = val;

        //   向父组件传递...
      }
    },
  },
  created() {
    this.$req.getUnreadNotice().then((val) => {
      this.noticeList = val.data;
      console.log(this.noticeList);
    });
  },
  mounted() {},
};
</script>
<style scoped>
.notice-title,
.notice-content {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: rgb(128, 128, 128);
  width: 100px;
}

.notice-type {
  font-size: 18px;
  width: 90px;
}

.notice-row {
  cursor: pointer;
  width: 340px;
  display: flex;
  height: 30px;
  margin: 0 20px;
  border-bottom: 1px solid rgb(196, 195, 195);
}

.notice-row:hover {
  border-bottom: 1px solid rgb(89, 172, 228);
}

.icon {
  margin: 5px 6px 0 0;
  width: 25px;
  height: 25px;
  background-image: url("../../assets/img/user-info-icon-bg.png");
}

.second li:nth-child(3) {
  padding-top: 19px;
}

.second li img {
  width: 25px;
  height: 25px;
}

.first .item a {
  color: #5f6368;
}

.first .item {
  padding: 21px 10px 19px 10px;
  margin: 0 15px;
}

.active {
  border-bottom: solid 2px #2c58ab;
}

.navOptions {
  padding: 0 4%;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
}

.second,
.first {
  display: flex;
}

.first li,
.second li {
  display: inline;
  list-style: none;
  vertical-align: middle;
  padding: 0;
  margin: 0;
}

.second li {
  padding: 25px 10px 0 10px;
}

.logo {
  width: 106px;
  height: 28px;
}

a {
  outline: none;
  text-decoration: none;
  color: #5f6368;
}

.container {
  width: 100%;
  height: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>

<style >
.el-dropdown-menu__item {
  display: flex;
}
</style>