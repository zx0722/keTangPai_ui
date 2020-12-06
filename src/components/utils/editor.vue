<template>
  <div>
    <el-row :style="{ height: borderStyle }">
      <quill-editor
        ref="my"
        v-model="text"
        :style="{ height: heightStyle }"
        :options="editorOption"
     
        @change="sendText()"
      >
      </quill-editor>
    </el-row>
  </div>
</template>

<script>
import { quillEditor,Quill } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {

  components:{quillEditor},
  props: ["content", "height", "borderHeight", "placeholder"],
  data() {
    return {
      text:'',
      editorOption: {},
      heightStyle: this.height === undefined ? "250px" : this.height,
      borderStyle:
        this.borderHeight === undefined ? "320px" : this.borderHeight,
    };
  },
  methods: {
    sendText() {
      this.$emit("getContent", this.text);
    },

    onEditorBlur(editor) {
      //失去焦点
      this.$emit("update:content", this.content);
    },
    onEditorFocus(editor) {
      //获得焦点
      this.$emit("update:content", this.content);
    },
    onEditorChange() {
      //编辑
      this.$emit("update:content", this.content);
      console.log(this.content);
    },

  },

  created() {
      this.text = this.content;
      if (this.placeholder !== "") {
        this.editorOption.placeholder = this.placeholder;
      }
    },
};
</script>
<style>
</style>