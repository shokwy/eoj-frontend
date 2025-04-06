<template>
  <div id="addQuestionView"><h2>创建题目</h2></div>
  <a-form :model="form" label-align="left">
    <a-form-item field="title" label="标题">
      <a-input v-model="form.title" placeholder="请输入标题" />
    </a-form-item>
    <a-form-item field="tags" label="标签">
      <a-input-tag v-model="form.tags" placeholder="请输入标签" allow-clear />
    </a-form-item>
    <a-form-item field="content" label="题目内容">
      <MdEditor :value="form.content" :handle-change="onContentChange" />
    </a-form-item>
    <a-form-item field="answer" label="答案">
      <MdEditor :value="form.answer" :handle-change="onAnswerChange" />
    </a-form-item>
    <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
      <a-space direction="vertical">
        <a-form-item field="judgeConfig.timeLimit" label="时间限制">
          <a-input-number
            v-model="form.judgeConfig.timeLimit"
            placeholder="请输入时间限制"
            :style="{ width: '320px' }"
            mode="button"
            size="large"
            :min="0"
          />
        </a-form-item>
        <a-form-item field="judgeConfig.memoryLimit" label="空间限制">
          <a-input-number
            v-model="form.judgeConfig.memoryLimit"
            placeholder="请输入空间限制"
            :style="{ width: '320px' }"
            mode="button"
            size="large"
            :min="0"
          />
        </a-form-item>
        <a-form-item field="judgeConfig.stackLimit" label="堆栈限制">
          <a-input-number
            v-model="form.judgeConfig.stackLimit"
            placeholder="请输入堆栈限制"
            :style="{ width: '320px' }"
            mode="button"
            size="large"
            :min="0"
          />
        </a-form-item>
      </a-space>
    </a-form-item>
    <a-form-item
      label="测试用例配置"
      :content-flex="false"
      :merge-props="false"
    >
      <a-form-item
        v-for="(judgeCaseItem, index) of form.judgeCase"
        :label="`测试用例 ${index}`"
        :key="index"
        no-style
      >
        <a-space direction="vertical" style="min-width: 640px">
          <a-form-item
            :field="`form.judgeCase.[${index}].input`"
            :label="`输入用例 ${index}`"
            :key="index"
          >
            <a-input
              v-model="judgeCaseItem.input"
              placeholder="请输入测试输入用例"
            />
          </a-form-item>
          <a-form-item
            :field="`form.judgeCase.[${index}].output`"
            :label="`输出用例 ${index}`"
            :key="index"
          >
            <a-input
              v-model="judgeCaseItem.output"
              placeholder="请输入测试输出用例"
            />
          </a-form-item>
          <a-button status="danger" @click="handleDelete(index)"
            >删除
          </a-button>
        </a-space>
      </a-form-item>
      <div></div>
      <div>
        <a-button @click="handleAdd" status="success" style="margin-top: 15px"
          >新增测试用例
        </a-button>
      </div>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="doSubmit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { Message } from "@arco-design/web-vue";
import {
  QuestionAddRequest,
  QuestionControllerService,
} from "../../../generated";
import { useRoute } from "vue-router";
import router from "@/router";

const route = useRoute();
//如果页面路径包含update，视为更新页面
const updatePage = route.path.includes("update");

/**
 * 根据题目id查询题目信息
 */
const localData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    Message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  localData();
});

let form = ref({
  title: "A + B",
  answer: "答案",
  content: "内容",
  judgeCase: [
    {
      input: "1，2",
      output: "3",
    },
  ],
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  tags: ["简单", "栈"],
} as QuestionAddRequest);

const onContentChange = (value: string) => {
  form.value.content = value;
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};

const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};
const handleDelete = (index) => {
  form.value.judgeCase.splice(index, 1);
};

const doSubmit = async () => {
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      Message.success("更新成功");
    } else {
      Message.error("更新失败，" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      Message.success("创建成功");
    } else {
      Message.error("创建失败" + res.message);
    }
  }
  // router.push({
  //   path: "/manage/question",
  // });
};
</script>
<style scoped>
#addQuestionView {
}
</style>
