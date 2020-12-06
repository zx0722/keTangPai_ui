<template>
  <div class="">
    <div class="login-bg">
      <img src="../assets/img/login-bg.jpg" alt="" />
    </div>
    <div class="login-bg2"></div>

    <div class="login-box">
      <div class="">
        <div class="title">
          <a
            href="javascript:;"
            :class="{ active: state === 0 }"
            @click="state = 0"
            >账号登录</a
          >
          <a
            href="javascript:;"
            :class="{ active: state === 1 }"
            @click="state = 1"
            >手机短信登录</a
          >
          <a
            href="javascript:;"
            :class="{ active: state === 2 }"
            @click="state = 2"
            >微信登录</a
          >
        </div>

        <div class="main">
          <div class="useAccount" v-if="state === 0">
            <input
              type="text"
              name="account"
              v-model="useAccount.account"
              placeholder="邮箱/账号/手机号"
            />
            <input
              v-model="useAccount.password"
              type="password"
              autocomplete="off"
              name="pass"
              placeholder="密码"
            />
          </div>

          <div class="useMessage" v-if="state === 1">
            <input type="text" placeholder="手机号" v-model="phone" />
            <div class="secondLine">
              <input type="text" v-model="YZM" placeholder="验证码" />
              <div
                :class="{ 'not-allowed': countdown > 1 }"
                class="getCode"
                @click="confirmPhone()"
              >
                <span v-if="countdown != 0">等待{{ countdown }}s</span>
                <span v-else>获取验证码</span>
              </div>
            </div>
          </div>

          <div class="useWeiXin" v-else></div>
        </div>

        <div class="bottom" v-if="state != 2">
          <div class="firstLine">
            <div class="autoLogin">
              <input type="checkbox" />
              <p>下次自动登录</p>
            </div>

            <a href="javascript:;">忘记密码?</a>
          </div>
          <div class="secondLine">
            <button class="loginBtn" @click="login()">登录</button>
          </div>

          <div class="third">
            <router-link to="register">
              <p>还没有账号?<span style="color: #32baf0">去注册</span></p>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="请输入图形验证码"
      :visible.sync="YZMDialog"
      width="360px"
      center
      style="margin-top: 20vh"
    >
      <img
        :src="YZMImg"
        alt=""
        @click="refresh()"
        class="YZM-img"
        title="点击刷新"
      />
      <input
        type="text"
        placeholder="请输入计算结果"
        v-model="confirm"
        class="resultInput"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="getCaptcha()" class="cancelBtn">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import myModule from "../modules/myModule.js";

export default {
  components: {},
  data() {
    return {
      // 登录框共有三个状态:0 账号、1 短信、2 微信
      state: 0,
      phone: "",
      YZMDialog: false,
      useAccount: {},
      YZM: "",
      virtualId: "",
      YZMImg: "",
      confirm: "",
      countdown: 0,
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 获取短信登录验证码
    getCaptcha() {
      this.$req
        .getCaptcha({
          telephone: this.phone,
          webCaptchaResult: this.confirm,
          virtualId: this.virtualId,
        })
        .then((val) => {
          if (!val.success) {
            this.$message({
              showClose: true,
              message: "获取验证码失败,请重新获取",
              type: "error",
            });
            this.refresh();
          } else {
            this.YZMDialog = false;
          }
          this.countdown = val.data;
          this.countdownTime();
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: "请检查网络连接",
            type: "error",
          });
        });
    },

    login() {
      if (this.state === 0) {
        if (!this.checkAccount()) {
          this.$message({
            showClose: true,
            message: "账号格式错误,请重新输入",
            type: "error",
          });
          return;
        }
        this.$req
          .accountLogin(this.useAccount)
          .then((val) => {
            console.log(val);
            if (!val.data) {
              this.$message({
                showClose: true,
                message: "请输入正确的用户名或密码",
                type: "error",
              });
            } else {
              this.$router.push("homepage");
            }
          })
          .catch((err) => {
            this.$message({
              showClose: true,
              message: "请检查网络连接",
              type: "error",
            });
          });
      } else if (this.state === 1) {
        this.$req
          .messageLogin({ telephone: this.phone, captcha: this.YZM })
          .then((val) => {
            if (!val.data) {
              this.$message({
                showClose: true,
                message: "请输入正确的电话号码和验证码",
                type: "error",
              });
            } else {
              this.$router.push("homepage");
            }
          })
          .catch((val) => {
            this.$message({
              showClose: true,
              message: "登录失败,请检查网络连接",
              type: "error",
            });
          });
      }
    },

    // 检查账号格式
    checkAccount() {
      let account = this.useAccount.account;

      if (
        account.match("^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$")
      ) {
        //邮箱
        return true;
      } else if (
        account.match(
          "^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\\d{8}$"
        )
      ) {
        //手机号
        return true;
      } else if (account.match("^[a-zA-Z0-9]{9}$")) {
        return true;
      } else {
        return false;
      }
    },

    // 刷新图形验证码
    refresh() {
      this.YZMImg =
        `${this.$axios.baseURL()}/login/mathCaptcha?virtualId=${
          this.virtualId
        }` +
        "&r=" +
        Math.random();
    },

    // 确认电话号码
    async confirmPhone() {
      // 判断是否是验证码等待状态
      if (this.countdown != 0) {
        this.$message({
          showClose: true,
          message: `请等待${this.countdown}秒后获取验证码`,
          type: "error",
        });
        return;
      }

      // 判断是否有该电话账号
      await this.$req.checkAccount(this.phone).then((val) => {
        if (!val.data) {
          this.$message({
            showClose: true,
            message: "该用户未注册,请先注册",
            type: "error",
          });
          return;
        } else {
          // 判断电话号码格式是否正确
          if (!this.$module.isPhone(this.phone)) {
            this.$message({
              showClose: true,
              message: "请输入正确的手机号码",
              type: "error",
            });
          } else {
            this.YZMDialog = true;
            this.refresh();
          }
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
  },
  created() {
    this.virtualId = this.$req.getVirtualId();
  },
};
</script>
<style scoped>
.resultInput {
  height: 30px;
}

.YZM-img {
  height: 150px;
}

.login-bg {
  z-index: -1;
}
.login-bg2 {
  background: rgba(20, 27, 47, 0.6);
}

.login-bg,
.login-bg2 {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
}

img {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

.login-box {
  background: white;
  width: 480px;
  height: 563px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 1%;
}

.title {
  display: flex;
  justify-content: center;
  padding: 47px 41px 58px 0;
  font-size: 16px;
}

a {
  padding: 0 15px;
  outline: none;
  text-decoration: none;
  color: #5f6368;
}

.title a:nth-child(2)::after,
.title a:nth-child(2)::before {
  content: "";
  position: absolute;
  height: 16px;
  width: 1px;

  background: #e2e6ed;
  top: 11%;
}

.title a:nth-child(2)::after {
  left: 0;
}

.title a:nth-child(2)::before {
  right: 0;
}

.title a:nth-child(2) {
  position: relative;
}

.active {
  font-size: 26px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(59, 61, 69, 1);
}

.main,
.bottom {
  overflow: hidden;
  padding: 0 30px 30px;
}

.useMessage .secondLine,
.bottom .firstLine {
  display: flex;
  justify-content: space-between;
}

.useMessage .secondLine input {
  width: 60%;
}

.getCode {
  cursor: pointer;
  width: 30%;
  height: 64px;
  background: #f2f2f2;
  border-radius: 3px;
  color: #818181;
  border: 1px solid #dcdcdc;
  text-align: center;
  line-height: 65px;
}

.not-allowed {
  cursor: not-allowed;
}

input {
  width: 98%;
  height: 64px;
  border-radius: 4px;
  /* float: left; */
  font-size: 16px;
  padding-left: 12px;
  margin-bottom: 24px;

  /* 去除input获得焦点时的黑色边框 */
  outline: none;

  border: 1px solid rgba(226, 230, 237, 1);
  box-sizing: border-box;

  /* 添加边框过渡效果 */
  transition: all 0.3s;
}

input:focus {
  border: 1px solid rgb(41, 105, 216);
}

.leftMove {
  transform: translateX();
}

.autoLogin input {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  margin-left: 4px;
}

.autoLogin {
  display: flex;
}

.bottom .firstLine .autoLogin p {
  font-size: 12px;
  margin: 0;
  padding: 0;
}

.bottom .firstLine a {
  font-size: 12px;
}

.loginBtn {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #32baf0;
  text-align: center;
  border-radius: 5px;
  border-color: white;
  color: #fff;
  font-size: 16px;
  margin-top: 25px;
  outline: none;
}

.bottom .third {
  text-align: right;
  color: #afb1b3;
  font-size: 14px;
  margin-top: 9px;
}

.bottom .third p span {
  color: #32baf0;
}

.cancelBtn {
  width: 90%;
  color: white;
  background-color: #328eeb;
}
</style>