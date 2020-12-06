<template>
  <div>
    <div class="reg-bg">
      <img src="../assets/img/reg-bg-01.jpg" alt="" />
    </div>

    <div class="main">
      <div v-if="state === 0" class="regSwitch">
        <p>注册账号</p>
        <p>请选择您在日常教学的实际身份</p>
        <div class="firstLine">
          <img
            src="../assets/img/teacher.png"
            alt="teacher"
            @click="state = 1"
          />
          <div @click="state = 1" class="cursor">我是老师/助教</div>
        </div>

        <div class="secondLine">
          <img
            src="../assets/img/student.png"
            alt="student"
            @click="state = 2"
          />
          <div @click="state = 2" class="cursor">我是学生</div>
        </div>
      </div>

      <div v-else-if="state !== 0" class="regMessage">
        <img
          src="../assets/img/returnReg.png"
          class="back"
          alt="返回"
          @click="state = 0"
        />
        <h3 v-if="state === 1">老师/助教注册</h3>
        <h3 v-if="state === 2">学生注册</h3>

        <el-input
          v-model="regAccount.account"
          class="el-inpit"
          placeholder="邮箱/手机"
          @blur="checkAccount()"
        />
        <el-popover
          placement="right"
          title="密码强度"
          width="240"
          trigger="manual"
          v-model="passwordPopover"
        >
          <div>
            <el-progress
              :percentage="percentage"
              :color="customColorMethod"
            ></el-progress>
            <p :class="{ 'red-font': passwordCondition[0] != 1 }">
              1、6~20个字符.
            </p>
            <p :class="{ 'red-font': passwordCondition[1] != 1 }">
              2、字母、数字以及标点符号至少包含2种.
            </p>
          </div>
          <el-input
            show-password
            slot="reference"
            v-model="regAccount.password"
            class="el-inpit"
            placeholder="密码"
            @input="checkPassword()"
          />
        </el-popover>

        <el-popover
          placement="right"
          width="200"
          trigger="manual"
          v-model="againPasswordPopover"
        >
          <p class="red-font">请确保两次密码相同</p>
          <el-input
            show-password
            slot="reference"
            v-model="againPassword"
            class="el-inpit"
            placeholder="再次输入确认密码"
            @input="
              againPasswordPopover = !(regAccount.password === againPassword)
            "
          />
        </el-popover>
        <el-input
          v-model="regAccount.name"
          class="el-inpit"
          placeholder="姓名"
        />
        <el-input
          v-model="regAccount.id"
          v-if="state === 2"
          class="el-inpit"
          placeholder="学号"
        />
        <el-input
          v-model="regAccount.school"
          class="el-inpit"
          placeholder="学校"
        />

        <div class="YZMdiv">
          <el-input
            style="width: 236px"
            v-model="regAccount.captcha"
            placeholder="验证码"
          />

          <img :src="YZMImg" alt="" class="YZM-img" @click="refresh()" />
        </div>

        <el-button
        style="width: 100%"
          v-if="state === 1"
          type="primary"
          class="el-button"
          @click="getRegisterCaptcha()"
          :disabled="regAccount.captcha == ''"
          >注册为老师/助教</el-button
        >
        <el-button
        style="width: 100%"
          v-if="state === 2"
          type="primary"
          class="el-button"
          @click="getRegisterCaptcha()"
          :disabled="regAccount.captcha == ''"
          >注册为学生</el-button
        >
      </div>

      <div class="bottom">
        <router-link to="login">
          <a href="">已有账号?</a>
          <a href="">去登录</a>
        </router-link>
      </div>
    </div>

    <el-dialog
      title="安全验证"
      :visible.sync="SMSVerificationDialog"
      width="380px"
    >
      <p>
        动态验证码已发送至<span class="yellow-font"
          >"{{ regAccount.account }}"</span
        >
      </p>
      <div style="display: flex">
        <el-input v-model="remoteCaptcha" placeholder="验证码"></el-input>
        <div class="getCaptcha" :class="{ 'not-allowed': countdown > 1 }">
          重新获取 <span v-show="countdown != 0">{{ countdown }}s</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="register">完 成 验 证</el-button>
      </span>
    </el-dialog>

    <el-dialog title="注册成功" :visible.sync="successDialog" width="380px">
      <p>
        <i class="el-icon-circle-check green-font"></i>
        您的账号{{ regAccount.account }}注册成功,可以登录!
      </p>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="login()">直 接 登 录</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      remoteCaptcha: "",
      againPasswordPopover: false,
      percentage: 0,
      passwordPopover: false,
      againPassword: "",
      regAccount: {
        account: "2232878351@qq.com",
        emailNumber: "2232878351@qq.com",
        name: "曾新",
        password: "Zx123456",
        school: "重庆理工大学",
        captcha:'',
      },
      state: 0, // 模态框分三个状态: 0选择身份 1教师注册 2学生注册
      YZMImg: "",
      virtualId: "",
      passwordCondition: [],
      SMSVerificationDialog: false,
      countdown: 10,
      successDialog: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    login() {
      this.$req.accountLogin(this.regAccount).then((val) => {
        if (val.data) {
          this.$router.push("homepage");
        }
      });
    },

    register() {
      let role = this.state === 1 ? "teacher" : "student";
      this.regAccount.captcha=this.remoteCaptcha
      this.$req.register(this.regAccount, role, this.virtualId).then((val) => {
        if (val.data) {
          //注册成功
          this.SMSVerificationDialog = false;
          this.successDialog = true;
        } else {
          this.$message({
            showClose: true,
            message: "注册失败,请检查个人信息",
            type: "error",
          });
          this.regAccount = null;
        }
      });
    },

    countdownTime() {
      let time = setInterval(() => {
        this.countdown--;

        if (this.countdown < 1) {
          clearInterval(time);
        }
      }, 1000);
    },

    refresh() {
      this.YZMImg =
        `${this.$axios.baseURL()}/register/mathCaptcha?virtualId=${
          this.virtualId
        }` +
        `&width=157&height=50&r=` +
        Math.random();
    },

    getRegisterCaptcha() {
      let obj = {};
      obj = this.$module.deepClone(this.regAccount);

      this.password=obj.password

      for (let i in obj) {
        if (i === "") {
          this.$message({
            showClose: true,
            message: "请将信息填写完毕!",
            type: "error",
          });
          return;
        }
      }

      if (!this.checkAccount()) {
        return;
      }

      this.$req
        .sendRegisterCaptcha(
          this.regAccount.account,
          this.regAccount.captcha,
          this.virtualId
        )
        .then((val) => {
          if (val.data === -1) {
            this.$message({
              showClose: true,
              message: "图形验证码输入错误",
              type: "error",
            });
            this.refresh();
          } else if (typeof val.data === "number") {
            this.countdown = val.data + 2;
            this.countdownTime();
            this.SMSVerificationDialog = true;
          } else {
            this.$message({
              showClose: true,
              message: "出了这个问题就找软工四班杨能,他写的后端",
              type: "info",
            });
          }
        });
    },

    checkAccount() {
      let account = this.regAccount.account;
      if (this.$module.isPhone(account)) {
        this.regAccount.telephoneNumber = account;
      } else if (this.$module.isEmail(account)) {
        this.regAccount.emailNumber = account;
      } else {
        this.$message({
          showClose: true,
          message: "注册账号请使用有效电话号码或邮箱",
          type: "error",
        });
        return false;
      }

      this.$req.checkAccount(account).then((val) => {
        if (val.data) {
          this.$message({
            showClose: true,
            message: "该账户已存在,请重新输入",
            type: "error",
          });
          return false;
        }
      });

      return true;
    },

    checkPassword() {
      // 确认密码的提示
      if (this.againPassword != "") {
        this.againPasswordPopover = !(
          this.regAccount.password === this.againPassword
        );
      }

      this.percentage = 0;
      let p = this.regAccount.password;
      let level = 0;

      if (p.length > 5 && p.length < 20) {
        this.passwordCondition[0] = 1;
        this.percentage += 30;
      }

      if (
        this.$module.isContainLowercase(p) &&
        this.$module.isContainCapital(p)
      ) {
        this.passwordCondition[1] = 1;
        this.percentage += 40;
      }

      if (this.$module.isContainSpecial(p)) {
        this.percentage += 30;
      }

      if (this.passwordCondition[0] == 1 && this.passwordCondition[1] == 1) {
        this.passwordPopover = false;
      } else {
        this.passwordPopover = true;
      }
    },

    customColorMethod(percentage) {
      if (percentage < 30) {
        return "#909399";
      } else if (percentage < 70) {
        return "#e6a23c";
      } else {
        return "#67c23a";
      }
    },
  },
  created() {
    this.virtualId = this.$req.getVirtualId();
    this.refresh();
    this.countdownTime();
  },
};
</script>
<style scoped>
.green-font {
  color: greenyellow;
}

.getCaptcha {
  cursor: pointer;
  line-height: 36px;
  margin-top: 14px;
  width: 126px;
  height: 40px;
  box-sizing: border-box;
  text-align: center;
  color: #818181;
  border: 1px solid #dcdcdc;
  background: #f2f2f2;
  border-radius: 3px;
}

.not-allowed {
  cursor: not-allowed;
}

.yellow-font {
  color: #f93;
}

.red-font {
  color: indianred;
}

.YZM-img {
  height: 50px;
  margin-top: 10px;
  border: solid 1px black;
  width: 157px;
}

.el-input {
  margin-top: 14px;
  font-size: 14px;
}

.cursor {
  cursor: pointer;
}

.el-button {
  margin-top: 10px;
  font-size: 16px;
}

.YZMdiv {
  display: flex;
  justify-content: space-between;
}

.regMessage h3 {
  line-height: 40px;
  font-size: 32px;
  color: #3b3d45;
  font-weight: 400;
  margin-left: 20px;
  display: inline-flex;
}

.regMessage .back {
  width: 40px;
  height: 40px;
  margin-top: -11px;
}

.regMessage {
  flex-wrap: wrap;
}

.regSwitch {
  height: 394px;
}

.bottom {
  text-align: right;
  margin: 15px 0;
  font-size: 14px;
}

a {
  outline: none;
  text-decoration: none;
  color: #5f6368;
}

.bottom a:nth-child(2) {
  color: #32baf0;
}

.main .firstLine,
.main .secondLine {
  margin-top: 70px;
  display: flex;
}

.main .firstLine img,
.main .secondLine img {
  width: 60px;
  height: 60px;
}

.main .firstLine div,
.main .secondLine div {
  width: 330px;
  height: 60px;
  background-color: #32baf0;
  margin-left: 40px;
  text-align: center;
  line-height: 64px;
  color: white;
  border-radius: 5px;
  font-size: 16px;
}

.reg-bg {
  width: 100%;
  height: 100%;
  position: fixed;
}
img {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

.main {
  width: 410px;
  padding: 30px 30px 0;
  background-color: white;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 1%;
  text-align: left;
}

.main p:nth-child(1) {
  font-size: 32px;
}

.main p:nth-child(2) {
  margin-top: 20px;
  font-size: 14px;
}
</style>

<style>

</style>