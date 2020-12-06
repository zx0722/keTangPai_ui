<template>
  <div class="child-all">
    <div v-show="isTeacher(this.task.promulgator)" class="tea-show">
      <div class="tea-top">
        <div class="tea-top-top">
          <h2>{{ task.name }}</h2>
          <el-button size="mini" type="primary">生成期末成绩</el-button>
        </div>

        <div class="tea-top-bottom">
          <span>截止时间: {{ dateFormat(task.deadline) }}</span>
          <el-input
            placeholder="请输入内容"
            suffix-icon="el-icon-search"
            v-model="search"
            style="width: 200px"
          >
          </el-input>
        </div>

        <a :href="downloadAllTask()" class="download-a">下载全部学生作业</a>
      </div>

      <p class="tea-main-p">
        已筛选出人{{ showList.length }} (全班共{{
          notSubmitted.length + submitted.length
        }}人)
      </p>
      <div class="tea-main">
        <div class="tea-choice">
          <div class="tea-row">
            <div class="tea-row-left">成绩</div>
            <div class="tea-row-right" style="display: flex">
              <el-checkbox
                label="不限"
                v-model="optionScoreAll"
                class="tea-row-checkbox"
                @change="scoreCheckAllChange"
              ></el-checkbox>
              <el-checkbox-group
                v-model="optionScore"
                class="tea-row-checkbox"
                @change="checkedScoreChange"
              >
                <el-checkbox label="已批"></el-checkbox>
                <el-checkbox label="未批"></el-checkbox>
                <el-checkbox label="未交"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div class="tea-row">
            <div class="tea-row-left">相似度</div>
            <div class="tea-row-right">
              <el-checkbox-group
                v-model="optionDuplicate"
                class="tea-row-checkbox"
              >
                <el-checkbox label="不限"></el-checkbox>
                <el-checkbox label="0 - 50%"></el-checkbox>
                <el-checkbox label="50% - 70%"></el-checkbox>
                <el-checkbox label="70% - 90%"></el-checkbox>
                <el-checkbox label="90% - 100%"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div class="tea-row">
            <div class="tea-row-left">提交状态</div>
            <div class="tea-row-right" style="display: flex">
              <el-checkbox
                label="不限"
                v-model="isDeadtimeAll"
                class="tea-row-checkbox"
                @change="deadtimeCheckAllChange"
              ></el-checkbox>
              <el-checkbox-group
                v-model="isDeadtime"
                class="tea-row-checkbox"
                @change="checkedDeadtimeChange"
              >
                <el-checkbox label="按时交"></el-checkbox>
                <el-checkbox label="超时交"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div class="tea-row">
            <div class="tea-row-left">分享状态</div>
            <div class="tea-row-right">
              <el-checkbox-group v-model="isShare" class="tea-row-checkbox">
                <el-checkbox label="不限"></el-checkbox>
                <el-checkbox label="未分享"></el-checkbox>
                <el-checkbox label="已分享"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div class="tea-row">
            <div class="tea-row-left">作业字数</div>
            <div class="tea-row-right">
              <div class="tea-row-all">
                <el-input-number
                  v-model="wordCount[0]"
                  :min="0"
                  size="mini"
                ></el-input-number>
                --
                <el-input-number
                  v-model="wordCount[1]"
                  :min="0"
                  size="mini"
                ></el-input-number>
                <el-button
                  size="mini"
                  style="margin-left: 10px"
                  @click="
                    clickWordCount = true;
                    screen();
                  "
                  >确定</el-button
                >
              </div>
            </div>
          </div>

          <div class="tea-row">
            <div class="tea-row-left">批改次数</div>
            <div class="tea-row-right">
              <div class="tea-row-all">
                <el-input-number
                  v-model="correctNum[0]"
                  :min="0"
                  size="mini"
                ></el-input-number>
                --
                <el-input-number
                  v-model="correctNum[1]"
                  :min="0"
                  size="mini"
                ></el-input-number>
                <el-button size="mini" style="margin-left: 10px"
                  >确定</el-button
                >
              </div>
            </div>
          </div>
        </div>

        <div class="tea-sort" v-show="showList.length > 0">
          <div
            :class="{ 'sort-div': true, 'click-sort-div': s.id === sortWay }"
            v-for="s in sortArr"
            :key="s.id"
            @click="clickSort(s.id)"
          >
            {{ s.value }}
            <i class="el-icon-top" v-if="sortWay == s.id && sortState == 1" />
            <i
              class="el-icon-bottom"
              v-if="sortWay == s.id && sortState == 2"
            />
          </div>
        </div>

        <div class="tea-main">
          <div class="tea-main-top" v-show="showList.length > 0">
            <el-button
              size="mini"
              type="primary"
              :disabled="selection.length == 0"
              @click="batchScoringDialog = true"
              >批量给分</el-button
            >
            <el-button
              size="mini"
              type="primary"
              :disabled="selection.length == 0"
              @click="batchReturnDialog = true"
              >打回作业</el-button
            >

            <el-button
              size="mini"
              type="primary"
              :disabled="selection.length == 0"
              @click="batchDownLoad()"
              >批量下载</el-button
            >
          </div>

          <div class="tea-main-table">
            <el-table
              v-show="showList.length > 0"
              ref="multipleTable"
              :data="showList"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="selectionChange"
            >
              <el-table-column type="selection" width="55"> </el-table-column>

              <el-table-column
                label="学号"
                prop="student.studentId"
                width="120"
              />

              <el-table-column label="姓名" width="120">
                <template slot-scope="scope">
                  <p class="font-weight">{{ scope.row.student.name }}</p>
                </template>
              </el-table-column>

              <el-table-column label="分数" width="120">
                <template slot-scope="scope">
                  <span
                    style="font-size: 20px"
                    v-show="scoreInput != scope.row.student.id"
                    @click="
                      scoreInput = scope.row.student.id;
                      scoring = scope.row.score;
                    "
                    >{{ scope.row.score }}</span
                  >
                  <el-input-number
                    size="mini"
                    style="width: 50px"
                    :min="0"
                    :max="task.fullMarks"
                    v-model="scoring"
                    :controls="false"
                    v-show="scoreInput == scope.row.student.id"
                    @blur="singleScoring(scope.row)"
                  >
                  </el-input-number>
                  <span style="color: #aaa"> /{{ task.fullMarks }}</span>
                </template>
              </el-table-column>

              <el-table-column label="查重率" width="70"
                ><template slot-scope="scope">
                  <span style="font-size: 20px; color: #aaa">{{
                    scope.row.similarity
                  }}</span
                  >%
                </template>
              </el-table-column>

              <el-table-column label="提交时间" width="220"
                ><template slot-scope="scope">
                  <span style="color: #aaa">{{
                    dateFormat(scope.row.datetime)
                  }}</span>
                  <span v-show="!scope.row.isOnTime" class="deadline-font"
                    >超</span
                  >
                </template>
              </el-table-column>

              <el-table-column label="字数" width="120"
                ><template slot-scope="scope">
                  <span style="color: #aaa"
                    >字数:{{ scope.row.wordCount }}</span
                  >
                </template>
              </el-table-column>

              <el-table-column label="批阅" width="120"
                ><template slot-scope="scope">
                  <!-- <span class="tea-click-font"></span> -->
                  <router-link
                    :to="{
                      path: '/readFile',
                      query: {
                        taskId: task.id,
                        userId: scope.row.student.id,
                      },
                    }"
                    >进入批阅</router-link
                  >
                </template>
              </el-table-column>
            </el-table>

            <div
              class="tea-main-top"
              style="margin-top: 10px"
              v-show="notSubmitted.length > 0"
            >
              <el-button
                size="mini"
                type="primary"
                :disabled="selectionTwo.length == 0"
                @click="batchUrgeDialog = true"
                >批量催交</el-button
              >
            </div>

            <el-table
              v-show="notSubmitted.length > 0"
              :data="notSubmitted"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="selectionTwoChange"
            >
              <el-table-column type="selection" width="55"> </el-table-column>

              <el-table-column label="学号" prop="studentId" width="120" />

              <el-table-column label="姓名" width="120">
                <template slot-scope="scope">
                  <p class="font-weight">{{ scope.row.name }}</p>
                </template>
              </el-table-column>

              <el-table-column label="打回次数" width="120"
                ><template slot-scope="scope"
                  ><span>打回{{ scope.row.returnCount }}次</span></template
                >
              </el-table-column>

              <el-table-column label="" width="240"
                ><template slot-scope="scope"
                  ><span v-if="scope.row.returnLastTime"
                    >最近打回{{ dateFormat(scope.row.returnLastTime) }}</span
                  ></template
                >
              </el-table-column>

              <el-table-column label="" width="120"
                ><template slot-scope="scope"
                  >催交{{ scope.row.expediteCount }}次</template
                >
              </el-table-column>

              <el-table-column label="催交" width="160"
                ><template slot-scope="scope"
                  ><span class="tea-click-font" @click="urge(scope.row)"
                    >催交</span
                  ></template
                >
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <div v-show="!isTeacher(this.task.promulgator)" class="stuShow">
      <div class="blank" />
      <p class="stu-title">{{ task.name }}</p>
      <p class="stu-resume" v-html="task.resume"></p>
      <div class="stu-detail">
        <div class="stu-detail-left">
          <span>截止日期: {{ dateFormat(task.deadline) }}</span>
          <span>个人作业</span>
          <span v-show="task.isCheckDuplicate">需要查重</span>
          <span v-show="task.strict" style="background-color: red; color: white"
            >不能补交</span
          >
        </div>
        <div class="stu-detail-right">
          <i class="el-icon-tickets"></i>
          <span>查看谁交了</span>
        </div>
      </div>
      <el-button
        type="primary"
        :disabled="this.uploadTask.fileList.length==0"
        v-if="stuTask.submitTaskFiles.length > 0"
        style="margin-top: 30px"
        @click="updateSubmission()"
      >
        更新提交
      </el-button>

      <el-button
      :disabled="this.uploadTask.fileList.length==0"
        type="primary"
        v-else
        style="margin-top: 30px"
        @click="updateSubmission()"
      >
        作业提交
      </el-button>
      <div
        class="stu-file-show"
        v-for="f in stuTask.submitTaskFiles"
        :key="f.fileId"
      >
        <img @click="readFile(f.fileId)" :src="getIcon(f.filePlan.type)" alt="" />
        <div class="stu-file-right">
          <p>{{ f.filePlan.name }}</p>
          <a class="download-a" :href="getDownloadPath(f.fileId)" download=""
            >下载</a
          >
        </div>
      </div>

      <el-upload
        :auto-upload="false"
        :data="uploadTask"
        :file-list="uploadTask.fileList"
        :show-file-list="true"
        class="upload-demo"
        drag
        :on-change="onChange"
        action=""
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>

    <!-- 批量打分 模态框 -->
    <el-dialog
      title="批量打分"
      :visible.sync="batchScoringDialog"
      width="20%"
      style="text-align: center"
    >
      <el-input-number
        v-model="batchScore"
        :min="0"
        :max="task.fullMarks"
      ></el-input-number>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchScoringDialog = false">取 消</el-button>
        <el-button type="primary" @click="batchScoring">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量催交 模态框 -->
    <el-dialog
      title="是否批量催交?"
      :visible.sync="batchUrgeDialog"
      width="20%"
      style="text-align: center"
    >
      <p class="warn">同生们将收到催交信息</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchUrgeDialog = false">取 消</el-button>
        <el-button type="primary" @click="batchUrge">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 作业打回 模态框 -->
    <el-dialog
      title="确定要打回选中学生的作业?"
      :visible.sync="batchReturnDialog"
      width="20%"
      style="text-align: center"
    >
      <p class="warn">同生们需要重新提交作业以便批阅成绩</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchReturnDialog = false">取 消</el-button>
        <el-button type="primary" @click="batchReturn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    taskId: {
      require: true,
    },
  },
  data() {
    return {
      // 教师端
      clickWordCount: false,
      optionScoreAll: true,
      isDeadtimeAll: true,
      scoreInput: "",
      scoring: 0,
      batchUrgeDialog: false,
      selectionTwo: [],
      batchReturnDialog: false,
      batchScore: 0,
      batchScoringDialog: false,
      task: {},
      search: "",
      optionScore: ["已批", "未批", "未交"],
      optionDuplicate: ["不限"],
      isDeadtime: ["按时交", "超时交"],
      isShare: ["不限"],
      wordCount: [0, 0],
      correctNum: [0, 0],
      showList: [],
      submitted: [],
      notSubmitted: [],
      allList: [],
      sortWay: "",
      sortState: 1, // 0无 1上 2下
      selection: [],
      sortArr: [
        {
          id: "id",
          value: "学号",
        },
        {
          id: "name",
          value: "姓名",
        },
        {
          id: "score",
          value: "成绩",
        },
        {
          id: "similarity",
          value: "相似度",
        },
        {
          id: "isSubmit",
          value: "提交状态",
        },
        {
          id: "wordCount",
          value: "作业字数",
        },
        {
          id: "correctNum",
          value: "批改次数",
        },
      ],
      condition: {
        已批: function (obj) {
          return obj.isCorrect;
        },
        未批: function (obj) {
          return !obj.isCorrect && obj.submitTaskFiles.length > 0;
        },
        未交: function (obj) {
          return obj.submitTaskFiles.length == 0;
        },
        按时交: function (obj) {
          return obj.isOnTime;
        },
        超时交: function (obj) {
          return !obj.isOnTime;
        },
        作业字数: function (obj, min, max) {
          return obj.wordCount >= min && obj.wordCount <= max;
        },
      },

      // 学生端
      stuTask: {
        submitTaskFiles: [],
      },
      uploadTask: {
        fileList: [],
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 预览文件
    readFile(fileId){
      this.$router.push({
        path:'readFile',
        query:{
          fileId:fileId
        }
      })
    },

    // 文件上传赋值
    onChange(file, fileList) {
      this.uploadTask.fileList = fileList;
    },

    // 学生更新提交作业
    updateSubmission() {
      let del = [];
      this.stuTask.submitTaskFiles.forEach((val) => {
        del.push(val.fileId);
      });
      this.$req
        .updateSubmittedTask(this.task.id, del, this.uploadTask.fileList)
        .then((val) => {
          this.stuTask = val.data;
          this.uploadTask = {};
        });
    },

    //获取下载文件路径
    getDownloadPath(id) {
      return `${this.$axios.baseURL()}/task/downloadTaskFile?fileId=${id}`;
    },

    // 批量下载
    batchDownLoad() {
      let userIds = [];
      this.selection.forEach((e) => {
        userIds.push(e.student.id);
      });

      let a = document.createElement("a");
      a.href = `${this.$axios.baseURL()}/submitTask/downSomeSubmittedTask?taskId=${
        this.task.id
      }&userIds=${userIds.join(",")}`;
      a.click();
    },

    // 下载全部地址
    downloadAllTask() {
      return `${this.$axios.baseURL()}/submitTask/downAllSubmittedTask?taskId=${
        this.task.id
      }`;
    },

    checkedDeadtimeChange(val) {
      this.optionScoreAll = val.length === 3;
      this.screen();
    },

    checkedScoreChange(val) {
      this.optionScoreAll = val.length === 3;
      this.screen();
    },

    scoreCheckAllChange(val) {
      this.optionScore = val ? ["已批", "未批", "未交"] : [];
    },

    deadtimeCheckAllChange(val) {
      this.isDeadtime = val ? ["按时交", "超时交"] : [];
    },

    //批量催交
    batchUrge() {
      let userIds = [];
      this.selectionTwo.forEach((el) => {
        userIds.push(el.id);
      });
      this.$req.batchUrge(userIds, this.task.id).then((val) => {
        if (val.data) {
          this.selectionTwo.forEach((el) => {
            el.expediteCount++;
          });
          this.batchUrgeDialog = false;
        }
      });
    },

    //单个催交
    urge(obj) {
      this.$req.batchUrge([obj.id], this.task.id).then((val) => {
        if (val.data) {
          obj.expediteCount++;
        }
      });
    },

    // 单个给分
    singleScoring(obj) {
      if (obj.score == this.scoring) {
        this.scoreInput = "";
        return;
      }
      this.$req
        .batchCorrectSubmittedTask([obj.student.id], this.task.id, this.scoring)
        .then((val) => {
          if (val.data) {
            obj.score = this.scoring;
          }
        });
      this.scoreInput = "";
    },

    // 批量打回
    batchReturn() {
      let userIds = [];
      this.selection.forEach((el) => {
        userIds.push(el.student.id);
      });
      this.$req.batchReturn(userIds, this.task.id).then((val) => {
        if (val.data) {
          this.batchReturnDialog = true;
          location.reload();
        }
      });
    },

    // 批量给分
    batchScoring() {
      let userIds = [];
      this.selection.forEach((el) => {
        userIds.push(el.student.id);
      });
      this.$req
        .batchCorrectSubmittedTask(userIds, this.task.id, this.batchScore)
        .then((val) => {
          if (val.data) {
            this.selection.forEach((el) => {
              el.score = this.batchScore;
            });
          }
        });
      this.batchScoringDialog = false;
    },

    // 展示数据筛选
    screen() {
      let all = this.$module.deepClone(this.submitted);

      this.showList = [];
      for (let i of all) {
        let flag = false;
        for (let j of this.optionScore) {
          flag = this.condition[j](i) ? true : flag;
        }
        if (!flag) {
          console.log("一类不满足");
          break;
        }

        flag = false;
        for (let j of this.isDeadtime) {
          flag = this.condition[j](i) ? true : flag;
        }

        if (!flag) {
          console.log("二类不满足");
          break;
        }

        if (
          this.clickWordCount &&
          !this.condition.作业字数(
            i,
            Math.min(...this.wordCount),
            Math.max(...this.wordCount)
          )
        ) {
          break;
        }

        this.showList.push(i);
      }
      this.clickWordCount = false;
    },

    selectionChange(val) {
      this.selection = val;
    },

    selectionTwoChange(val) {
      this.selectionTwo = val;
    },

    // 点击sort
    clickSort(id) {
      if (id === this.sortWay && this.sortState === 2) {
        this.sortState = 1;
      } else if (id === this.sortWay && this.sortState != 2) {
        this.sortState = 2;
      } else {
        this.sortWay = id;
        this.sortState = 1;
      }

      if (id == "id" || id == "name") {
        this.showList = this.showList.sort((a, b) => {
          if (this.sortState == 1) {
            return a.student[id] - b.student[id];
          } else {
            return b.student[id] - a.student[id];
          }
        });
      } else {
        this.showList = this.showList.sort((a, b) => {
          if (this.sortState == 1) {
            return a[id] - b[id];
          } else {
            return b[id] - a[id];
          }
        });
      }
    },

    //获取已提交作业的学生
    getSubmitted() {
      this.$req
        .getSubmittedTasks(this.taskId)
        .then((val) => {
          this.submitted = val.data;
          this.showList = this.showList.concat(this.submitted);
        })
        .catch((err) => {
          console.log("学生身份");
        });
    },

    //获取未提交作业的学生
    getNotSubmitted() {
      this.$req
        .getNotSubmittedTasks(this.taskId)
        .then((val) => {
          this.notSubmitted = val.data;
        })
        .catch((err) => {
          console.log("学生身份");
        });
    },

    // 时间格式
    dateFormat(dateStr) {
      let d = new Date(dateStr);
      return `${d.getFullYear()}年 ${
        d.getMonth() + 1
      }月${d.getDate()}日 ${d.getHours()}:${d.getMinutes()}`;
    },

    // 身份判断
    isTeacher(id) {
      return id == this.$store.getters.getAccount;
    },

    // 学生提交作业情况
    getStudentSubmitted(taskId) {
      this.$req.getStudentSubmittedTaskByTaskId(taskId).then((val) => {
        if (val.data) {
          this.stuTask = val.data;
        }
      });
    },

    // 文档图标
    getIcon(str) {
      return require(`../../../assets/office-icon/${this.$iconType.typeChangeIcon(
        str
      )}.png`);
    },
  },

  async created() {
    await this.$req.getTaskById(this.taskId).then((val) => {
      this.task = val.data;
    });

    if (this.isTeacher(this.task.promulgator)) {
      this.getSubmitted();
      this.getNotSubmitted();
    } else {
      this.getStudentSubmitted(this.task.id);
    }
  },
};
</script>
<style scoped>
.stu-file-right {
  margin-top: 10px;
}

.stu-file-right p {
  font-size: 16px;
  font-weight: 900;
}

.stu-file-show a {
  color: #32baf0;
  font-size: 14px;
}

.stu-file-show {
  display: flex;
  margin: 20px 0;
}

.download-a {
  color: #32baf0;
  font-size: 14px;
  margin-left: 10px;
}

.tea-click-font {
  font-size: 16px;
  color: #4d90fe;
  cursor: pointer;
}

.warn {
  color: red;
  font-size: 20px;
  font-weight: 900;
}

.deadline-font {
  background-color: red;
  color: white;
  margin-left: 3px;
  padding: 0 4px;
}

.font-weight {
  font-weight: 900;
  overflow: hidden;
}

.tea-main-table {
  width: 958px;
  margin: auto;
}

.tea-main-top {
  display: flex;
  margin: auto;
  width: 938px;
  background-color: #f6f6f6;
  /* height: 48px; */
  border: 1px solid #dcdcdc;
  padding: 8px 10px;
}

.click-sort-div {
  color: #4d90fe;
  background-color: #fff;
  border-left-color: #d2d2d2;
  border-right-color: #d2d2d2;
}

.sort-div {
  width: 100px;
  line-height: 38px;
  /* color: #595959; */
  text-align: center;
  cursor: pointer;
  font-size: 12px;
}

.tea-sort {
  display: flex;
  margin: 20px auto;
  width: 958px;
  height: 40px;
  border: 1px solid #dcdcdc;
  background-color: #f6f6f6;
}

.tea-row-all {
  margin: 9px 0 0 50px;
}

.tea-row-checkbox {
  margin: 15px 0 0 50px;
}

.tea-row-left {
  font-size: 14px;
  padding: 15px 0 0 50px;
  background-color: #5f6368;
  color: #5a5a5a;

  width: 100px;
  border-right: 1px solid #dcdcdc;
  background: #f2f2f2;
}

.tea-row {
  display: flex;
  height: 46px;
  border-bottom: 1px dashed #eaeaea;
}

.tea-show {
  width: 1020px;
  margin: auto;
}

.tea-choice {
  width: 958px;
  margin: auto;
}

.tea-main-p {
  font-size: 12px;
  color: #5a5a5a;
  margin: 10px 28px;
}

.tea-main {
  margin: 0 auto;
}

.tea-top-bottom span:nth-child(1) {
  padding: 5px 20px;
  background: rgba(0, 0, 0, 0.1);
  height: 20px;
}

.tea-top-bottom {
  margin-top: 30px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
}

.tea-show,
.tea-choice {
  border: 1px solid #c8c8c8;
}

.tea-top-top {
  display: flex;
  justify-content: space-between;
}

.tea-top-top h2 {
  font-size: 18px;
  color: #2d2d2d;
  font-weight: 400;
}

.tea-top {
  padding: 39px 30px 27px;
  border-bottom: 1px solid #c8c8c8;
}

.stu-detail-right span {
  font-size: 12px;
  margin-left: 4px;
}

.stu-detail-left span {
  color: #5f6368;
  font-size: 12px;
  border-radius: 2px;
  background-color: #f1f3f4;
  padding: 3px 7px;
  margin-right: 7px;
}

.stu-detail {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.stu-resume {
  margin-top: 20px;
  color: #707070;
  font-size: 12px;
  /* word-break: break-all; */
}

.stu-title {
  font-size: 18px;
}

.blank {
  border-radius: 8px;
  border: 1px solid rgba(218, 220, 224, 1);
  padding: 24px;
  margin-bottom: 24px;
  box-sizing: border-box;
}

.stuShow {
  width: 1224px;
  margin: auto;
}

.child-all {
  margin: auto;
  text-align: left;
}
</style>