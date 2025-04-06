<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title">
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间限制">
                  {{ question.judgeConfig.timeLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  {{ question.judgeConfig.memoryLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ question.judgeConfig.stackLimit ?? 0 }}
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer :value="question.content || ''" />
              <template #extra>
                <a-space wrap>
                  <a-tag v-for="(tag, index) of question.tags" :key="index"
                    >{{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="answer" title="题解">
            <a-card v-if="question">
              <MdViewer :value="question.answer || ''" />
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-form :model="searchParams" layout="inline">
          <a-form-item field="language" label="编程语言" style="width: 240px">
            <a-select
              v-model="form.language"
              :style="{ width: '320px' }"
              placeholder="请选择编程语言"
            >
              <a-option>java</a-option>
              <a-option>cpp</a-option>
              <a-option>python</a-option>
              <a-option>go</a-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              style="width: 150px; margin-bottom: 10px"
              @click="doSubmit"
              >提交
            </a-button>
          </a-form-item>
        </a-form>
        <CodeEditor
          :value="form.code as string"
          :language="form.language"
          :handle-change="changeCode"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect, withDefaults, defineProps } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitControllerService,
  QuestionVO,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import MdViewer from "@/components/MdViewer.vue";
import CodeEditor from "@/components/CodeEditor.vue";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});
const question = ref<QuestionVO>();

const localData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    Message.error("加载失败" + res.message);
  }
};

const form = ref({
  language: "java",
  code: "",
});

const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    Message.success("提交成功");
  } else {
    Message.error("提交失败，" + res.message);
  }
};
/**
 * 页面加载请求数据
 */
onMounted(() => {
  localData();
});

const changeCode = (value: string) => {
  form.value.code = value;
};
</script>
<style scoped>
#viewQuestionView {
  max-width: 1400px;
}
</style>
