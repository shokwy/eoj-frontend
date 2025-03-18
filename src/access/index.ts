import router from "@/router";
import store from "@/store";
import AccessEnum from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";

router.beforeEach(async (to, from, next) => {
  console.log("登录用户信息", store.state.user.loginUser);
  const loginUser = store.state.user.loginUser;
  //未登录自动登录
  if (!loginUser || !loginUser.userRole) {
    //await 用户登录成功后，在执行后续代码
    await store.dispatch("user/getLoginUser");
  }
  const needAccess = (to.meta?.access as string) ?? AccessEnum.NOT_LOGIN;
  //要跳转的页面需要登录
  if (needAccess !== AccessEnum.NOT_LOGIN) {
    //未登录跳转到登录页面
    if (!loginUser || !loginUser.userRole) {
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    //若已经登录，但权限不足，则跳转的权限不足页面
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }
  next();
});
