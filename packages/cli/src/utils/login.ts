import loginCli from "@mylinkpi/cli-login";
import consola from "consola";

export const getAdToken = async () => {
  return await loginCli.adToken();
};

export const checkLogin = async () => {
  const adToken = await getAdToken();
  return adToken.ad !== "";
};

export const loginLinkPi = async () => {
  const loggedIn = await checkLogin();
  if (!loggedIn) {
    consola.start("Login...");
    const isLoginSuccess = await loginCli.asyncLogin();
    return isLoginSuccess;
  } else {
    return true;
  }
};
