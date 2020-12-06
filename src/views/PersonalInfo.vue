<template>
  <div class="">
    <Nav></Nav>

    <div class="top">
      <el-avatar
        :size="73"
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      ></el-avatar>
      <h1>{{ user.name }}</h1>
      <div class="top-choice">
        <span :class="{ 'click-choice': state === 0 }" @click="state = 0"
          >个人设置</span
        >
        <span :class="{ 'click-choice': state === 1 }" @click="state = 1"
          >通知设置</span
        >
      </div>
    </div>

    <div class="main">
      <h3 class="little-title">基本资料</h3>
      <div class="main-card">
        <div>
          <div class="main-card-line">
            <p>姓名&nbsp;:</p>
            <el-input
              placeholder="请输入姓名"
              v-model="editUser.name"
              v-if="editInfo"
              size="mini"
              maxlength="6"
              class="main-card-input"
            />
            <span v-else>{{ user.name }}</span>
          </div>

          <div class="main-card-line">
            <p>学校&nbsp;:</p>
            <el-input
              placeholder="请输入学校"
              v-model="editUser.school"
              v-if="editInfo"
              size="mini"
              maxlength="12"
              class="main-card-input"
            />
            <span v-else>{{ user.school }}</span>
          </div>

          <div class="main-card-line" v-show="user.role === '2'">
            <p>院系&nbsp;:</p>
            <el-input
              v-model="editUser.department"
              v-if="editInfo"
              size="mini"
              maxlength="12"
              class="main-card-input"
            />
            <span v-else>{{ user.department }}</span>
          </div>
        </div>

        <el-button class="main-card-button" @click="editInfo = !editInfo">
          <span v-if="!editInfo">编辑资料</span>
          <span v-else>取消编辑</span>
        </el-button>
      </div>
      <el-button
        type="primary"
        style="width: 98px"
        v-show="editInfo"
        @click="saveEdit()"
        >保存编辑</el-button
      >

      <h3 class="little-title">身份角色</h3>
      <div class="main-card">
        <div class="main-card-line">
          <p>角色&nbsp;:</p>
          <span>{{ getRole }}</span>
        </div>

        <el-button class="main-card-button" @click="switchRole">
          <span> 切换身份 </span>
        </el-button>
      </div>
      <el-button
        type="primary"
        style="width: 98px"
        v-show="editRole"
        @click="saveEdit(0)"
        >保存</el-button
      >

      <h3 class="little-title">账号设置</h3>
      <div class="main-card" v-if="!bindMail && !bindPhone">
        <div>
          <div class="main-card-line">
            <p>账号&nbsp;:</p>
            <span>{{ user.accountNumber }}</span>
          </div>

          <div class="main-card-line">
            <p>邮箱&nbsp;:</p>
            <span v-if="!user.emailNumber">未绑定</span>
            <span>{{ user.emailNumber }}</span>
          </div>

          <div class="main-card-line">
            <p>手机&nbsp;:</p>
            <span v-if="user.telephoneNumber === '' || !user.telephoneNumber"
              >未绑定</span
            >
            <span>{{ user.telephoneNumber }}</span>
          </div>
        </div>

        <div style="width: 100px; margin-top: 14px">
          <el-button
            class="main-card-button"
            type="primary"
            plain
            @click="bindMail = true"
          >
            <span v-if="editUser.mail === ''">绑定邮箱</span>
            <span v-else>修改邮箱</span>
          </el-button>

          <el-button
            class="main-card-button"
            style="margin-left: 0"
            @click="bindPhone = !bindPhone"
          >
            <span v-if="!editUser.phoneNumber">绑定手机号</span>
            <span v-else>修改手机号</span>
          </el-button>
        </div>
      </div>

      <!-- 绑定邮箱 -->
      <div class="main-card" v-if="bindMail">
        <div>
          <div class="main-card-line">
            <p>当前邮箱&nbsp;:</p>
            <span v-if="!user.emailNumber">未绑定</span>
            <span>{{ user.emailNumber }}</span>
            <el-button
              v-show="user.emailNumber"
              size="mini"
              round
              type="info"
              plain
              style="margin-left: 10px"
              @click="unBindEmailDialog = true"
              >解除绑定</el-button
            >
          </div>

          <div class="main-card-line">
            <p>新邮箱&nbsp;:</p>
            <el-input
              placeholder="请输入新邮箱"
              v-model="editUser.mail"
              size="mini"
              class="main-card-input"
            />
          </div>

          <div class="main-card-line">
            <p>密码校验&nbsp;:</p>
            <el-input
              v-model="verifiers"
              placeholder="请输入登录密码"
              size="mini"
              class="main-card-input"
              show-password
            />
          </div>
        </div>
        <el-button class="main-card-button" @click="bindMail = false"
          >取消变更</el-button
        >
      </div>
      <el-button
        size="mini"
        type="primary"
        style="width: 98px"
        v-show="bindMail"
        @click="updateEmail"
        >保存</el-button
      >

      <!-- 修改手机号 -->
      <div class="main-card" v-if="bindPhone">
        <div>
          <div class="main-card-line">
            <p>当前手机号&nbsp;:</p>
            <span v-if="user.mail === ''">未绑定</span>
            <span>{{ user.phone }}</span>
            <el-button
              size="mini"
              round
              type="info"
              plain
              style="margin-left: 10px"
              v-show="user.phoneNumber"
              >解除绑定</el-button
            >
          </div>

          <div class="main-card-line">
            <p>绑定手机号:&nbsp;</p>
            <el-input
              placeholder="请输入手机号"
              v-model="editUser.phoneNumber"
              size="mini"
              class="main-card-input"
            />
          </div>
          <!-- 
          <div class="main-card-line">
            <p>图形验证码&nbsp;:</p>
            <img
              :src="imgCheckPath"
              alt=""
              class="img-check"
              @click="refresh()"
            />
          </div> -->

          <div class="main-card-line">
            <p>短信验证码&nbsp;:</p>
            <el-input
              v-model="messageCheck"
              class="main-card-input"
              size="mini"
            ></el-input>
            <el-button @click="getMessageCheck"
              >获取短信验证码<span v-show="countDown > 0"
                >({{ countDown }}s)</span
              ></el-button
            >
          </div>

          <el-button
            size="mini"
            type="primary"
            style="width: 98px"
            v-show="bindMail"
            @click="updatePhone"
            >保存</el-button
          >
        </div>
        <el-button class="main-card-button" @click="bindPhone = false"
          >取消变更</el-button
        >
      </div>
      <el-button
        size="mini"
        type="primary"
        style="width: 98px"
        v-show="bindPhone"
        @click="updatePhone"
        >保存</el-button
      >

      <h3 class="little-title">密码</h3>
      <div class="main-card" v-if="!editPassword">
        <div class="main-card-line">
          <p>密码&nbsp;:</p>
          <!-- <span>{{ showPassword }}</span> -->
        </div>

        <el-button
          class="main-card-button"
          @click="editPassword = !editPassword"
        >
          <span v-if="!editPassword">更换密码</span>
          <span v-else>取消修改</span>
        </el-button>
      </div>

      <div class="main-card" v-else>
        <div>
          <div class="main-card-line">
            <p>新密码&nbsp;:</p>
            <el-input
              v-model="editUser.password"
              :maxlength="20"
              placeholder="请输入新密码"
              size="mini"
              class="main-card-input"
              show-password
            />
            <p class="Tips">
              (1.6~20个字符&nbsp;2.字母、数字以及标点符号至少包含2种;&nbsp;3.大小写字母、数字以及标点符号。)
            </p>
          </div>

          <div class="main-card-line">
            <p>确认密码&nbsp;:</p>
            <el-input
              show-password
              v-model="verifiers"
              placeholder="请输入密码"
              size="mini"
              class="main-card-input"
            />
            <p class="Tips">(再次输入新密码)</p>
          </div>
        </div>

        <el-button
          class="main-card-button"
          @click="editPassword = !editPassword"
        >
          <span v-if="!editPassword">更换密码</span>
          <span v-else>取消修改</span>
        </el-button>
      </div>
      <el-button
        size="mini"
        type="primary"
        style="width: 98px"
        v-show="editPassword"
        @click="updatePassword"
        >保存</el-button
      >

      <h3 class="little-title">第三方账号绑定</h3>
      <div class="main-card">
        <div>
          <div class="main-card-line">
            <p>微信&nbsp;:</p>
            <span v-if="user.WeChat === ''">未绑定</span>
            <span>{{ user.WeChat }}</span>
          </div>
        </div>

        <el-button class="main-card-button" @click="chooseWeChat">
          <span v-if="bindWeChat">绑定账号</span>
          <span v-else>取消绑定</span>
        </el-button>
      </div>
    </div>

    <!-- 解绑邮箱 -->
    <el-dialog
      top="15%"
      title="登录密码验证"
      :visible.sync="unBindEmailDialog"
      width="20%"
    >
      <div>
        <el-input v-model="verifiers" show-password />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="unbundEmail"
          style="width: 100%"
          :disabled="verifiers.length < 5"
          >确 定</el-button
        >
      </span>
    </el-dialog>

   
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
      uploadDialog: false,
      countDown: 0,
      user: {
        roles: [{ id: "" }],
      },
      editUser: {},
      unBindEmailDialog: false,
      editInfo: false,
      editRole: false,
      editAccount: false,
      editPassword: false,
      bindMail: false,
      bindWeChat: false,
      bindPhone: false,
      unBindWeChat: false,
      state: 0,
      verifiers: "", //密码校验
      imgCheck: "", // 图形验证码
      messageCheck: "", //短信验证
      imgCheckPath: "",
    };
  },
  computed: {
    getRole() {
      if (this.user.roles[0].id == "1") {
        return "学生";
      } else if (this.user.roles[0].id == "2") {
        return "老师";
      } else {
        return "个人信息未获取";
      }
    },

    showPassword() {
      let result = "";
      for (let i = 0; i < this.user.password.length; i++) {
        result = result + "*";
      }
      return result;
    },
  },
  watch: {},
  methods: {
    // 更新密码
    updatePassword() {
      if (this.editUser.password != this.verifiers) {
        this.$message({
          showClose: true,
          type: "error",
          message: "两次密码不同,请再次确认",
        });
        this.verifiers = "";
        return;
      }

      if (
        this.$module.isContainCapital(this.editUser.password) &&
        this.$module.isContainLowercase(this.editUser.password) &&
        this.$module.isContainNumber(this.editUser.password)
      ) {
        this.$req.updateInfo(this.editUser).then((val) => {
          if (val.data) {
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success",
            });
            this.editUser.password = "";
            this.verifiers = "";
            this.editPassword = false;
          } else {
            this.$message({
              showClose: true,
              message: "修改失败",
              type: "error",
            });
          }
        });
      } else {
        this.$message({
          showClose: true,
          type: "error",
          message: "密码格式错误,密码中必须包含字母和数字",
        });
        this.editUser.password = "";
        return;
      }
    },

    //获取短信验证码
    getMessageCheck() {
      this.$req.getUpdatePhoneMessageCheckCode().then((val) => {});
    },

    // 倒计时
    countdownTime() {
      let time = setInterval(() => {
        this.countdown--;

        if (this.countdown < 1) {
          clearInterval(time);
        }
      }, 1000);
    },

    // 刷新图形码
    refresh() {
      this.imgCheckPath =
        `${this.$axios.baseURL()}/register/mathCaptcha?virtualId=${
          this.virtualId
        }` +
        `&width=157&height=50&r=` +
        Math.random();
    },

    // 更新电话
    updatePhone() {
      this.$req
        .updatePhone(this.messageCheck, this.editUser.phoneNumber)
        .then((val) => {
          if (val.data) {
            this.$message({
              showClose: true,
              message: "更新电话号码成功",
              type: "success",
            });
            this.user.phoneNumber = this.editUser.phoneNumber;
            this.bindPhone = false;
          } else {
            this.$message({
              showClose: true,
              message: "密码错误",
              type: "error",
            });
          }
        });
    },

    // 解绑邮箱
    unbundEmail() {
      this.$req.unbindEmail(this.verifiers).then((val) => {
        if (val.data) {
          this.verifiers = "";
          (this.unbindEmailDialog = false), (this.bindMail = false);
          this.user.emailNumber = null;
        }
      });
    },

    // 更新邮箱
    updateEmail() {
      if (!this.$module.isEmail(this.editUser.mail)) {
        this.$message({
          showClose: true,
          message: "邮箱格式错误",
          type: "error",
        });
        return;
      }
      if (this.verifiers.length < 6) {
        this.$message({
          showClose: true,
          message: "密码错误",
          type: "error",
        });
        return;
      }

      this.$req.updateEmail(this.verifiers, this.editUser.mail).then((val) => {
        if (val.data) {
          this.user.emailNumber = this.editUser.mail;
          this.bindMail = false;
          this.$message({
            showClose: true,
            message: "邮箱修改成功",
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: "密码错误",
            type: "error",
          });
        }
      });
      this.verifiers = "";
    },

    // 切换角色
    switchRole() {
      this.$req.switchRole(this.user.roles[0].id).then((val) => {
        if (val.data) {
          this.$message({
            showClose: true,
            message: "切换成功",
            type: "success",
          });
          this.user = val.data;
          this.editUser = this.$module.deepClone(val.data);
        }
      });
    },

    chooseWeChat() {
      if (user.weChat !== "") {
        this.unBindWeChat = true;
      }
    },

    // 保存基本个人信息修改
    saveEdit(val) {
      if (!this.$module.isChineseName(this.editUser.name)) {
        this.$message({
          showClose: true,
          message: "请输入中文姓名,长度2至6",
          type: "error",
        });
        return;
      }

      if (this.editUser.school.length === 0) {
        this.$message({
          showClose: true,
          message: "学校不能为空",
          type: "error",
        });
        return;
      }

      this.$req.updateInfo(this.editUser).then((val) => {
        this.user = val.data;
        this.editUser = this.$module.deepClone(val.data);
        this.editInfo = false;
        this.$message({
          showClose: true,
          message: "个人信息修改成功",
          type: "success",
        });
      });
    },
  },

  created() {
    this.$req.getMe().then((val) => {
      console.log(val.data);
      this.user = val.data;
      this.editUser = this.$module.deepClone(val.data);
    });
  },
  mounted() {},
};
</script>
<style scoped>
.img-check {
  height: 50px;
  border: solid 1px black;
  width: 157px;
}

.Tips {
  color: red;
}

.role-choose {
  margin: 4px 0 0 30px;
}

.main-card-input {
  margin-left: 30px;
}

.main-card-line span {
  margin-left: 30px;
  color: #595959;
}

.main-card-button {
  margin-top: 20px;
  height: 38px;
}

.main-card-line p {
  white-space: nowrap;
  width: 40px;
}

.main-card-line {
  display: flex;
  vertical-align: middle;
  color: #969696;
  height: 32px;
  margin-top: 10px;
}

.main-card {
  display: flex;
  justify-content: space-between;
}

.little-title {
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #dcdcdc;
  padding-bottom: 20px;
  line-height: 1;
  margin-top: 14px;
}

.main {
  font-size: 14px;
  width: 1661px;
  text-align: left;
  margin: 30px auto;
}

.top-choice {
  margin-top: 30px;
  height: 60px;
  border-top: 1px solid #c8c8c8;
  border-bottom: 1px solid #c8c8c8;
  color: #aaa;
}

.top-choice span {
  font-size: 14px;
  margin: auto 80px;
  line-height: 55px;
  cursor: pointer;
}

.click-choice {
  color: #4d90fe;
}

.top {
  margin-top: 70px;
}
</style>