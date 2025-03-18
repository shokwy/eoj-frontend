import AccessEnum from "@/access/accessEnum";

/**
 * 检查权限
 * @param loginUser 当前登录用户
 * @param needAccess 需要的权限
 */
const checkAccess = (loginUser: any, needAccess = AccessEnum.NOT_LOGIN) => {
  //获取当前登录用户权限，没有则未登录
  const loginUserAccess = loginUser?.userRole ?? AccessEnum.NOT_LOGIN;
  //console.log(loginUserAccess);
  //console.log(needAccess);
  if (needAccess === AccessEnum.NOT_LOGIN) {
    return true;
  }
  if (needAccess === AccessEnum.USER) {
    return true;
  }

  if (needAccess === AccessEnum.ADMIN) {
    //console.log(loginUserAccess === AccessEnum.ADMIN);
    return loginUserAccess === AccessEnum.ADMIN;
  }

  return false;
};

export default checkAccess;
