<template>
  <div id="userLoginView">
    <h2 style="margin-bottom: 16px">用户登录</h2>
    <a-form
      style="max-width: 480px; margin: 0 auto"
      label-align="left"
      auto-label-width
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" label="账号">
        <a-input
          v-model="form.userAccount"
          placeholder="please enter your username"
        />
      </a-form-item>
      <a-form-item field="userPassword" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="please enter your password"
        />
      </a-form-item>

      <a-form-item>
        <a-button
          html-type="submit"
          type="primary"
          style="width: 150px; margin-left: 130px"
          >登录
        </a-button>
        <a href="/user/register" style="margin-left: 30px"
          >没有账户？点击注册</a
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserAddRequest, UserControllerService } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();
const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserAddRequest);
const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  if (res.code === 0) {
    await store.dispatch("user/getLoginUser");
    Message.info("登陆成功！");
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    Message.error("登陆失败," + res?.message);
  }
};
</script>
