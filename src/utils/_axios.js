import { getToken } from "./auth.js";

const { Message } = ELEMENT;

axios.defaults.timeout = 3000; // 接口请求超时时间设置（3秒）

function handleRes(res, resolve, reject) {
  if (res.status === 200 && res.data.code === 0) {
    resolve(res.data);
  } else {
    Message({
      message: res.data && res.data.msg,
      type: "error",
      duration: 3000
    });
    reject(res.data);
  }
}

function handleError(error, reject) {
  Message.error({
    message: error.message,
    type: "error",
    duration: 3000
  });
  reject(error);
}

function goLogin() {
  window.location = "#/login/";
}

window._axios = {
  get: (path, params, config) => {
    const token = getToken();
    if (!token) {
      goLogin();
      return;
    }
    return new Promise((resolve, reject) => {
      axios
        .get(path, {
          headers: {
            ...config,
            "Content-Type": "application/json;charset=UTF-8"
          },
          params: params
        })
        .then(res => {
          handleRes(res, resolve, reject);
        })
        .catch(error => {
          handleError(error, reject);
        });
    });
  },
  post: (path, params, config) => {
    const token = getToken();
    if (!token) {
      goLogin();
      return;
    }
    return new Promise((resolve, reject) => {
      axios
        .post(path, params, {
          ...config,
          headers: {
            "Content-Type": "application/json;charset=UTF-8"
          }
        })
        .then(res => {
          handleRes(res, resolve, reject);
        })
        .catch(error => {
          handleError(error, reject);
        });
    });
  },
  postForm: (path, params) => {
    const token = getToken();
    if (!token) {
      goLogin();
      return;
    }
    return new Promise((resolve, reject) => {
      axios
        .post(path, params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          // 提交前更改格式
          transformRequest: [
            function(data) {
              let ret = "";
              for (const it in data) {
                ret +=
                  encodeURIComponent(it) +
                  "=" +
                  encodeURIComponent(data[it]) +
                  "&";
              }
              return ret.substr(0, ret.length - 1);
            }
          ]
        })
        .then(res => {
          handleRes(res, resolve, reject);
        })
        .catch(error => {
          handleError(error, reject);
        });
    });
  },
  postFormWithoutToken: (path, params) => {
    return new Promise((resolve, reject) => {
      axios
        .post(path, params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          // 提交前更改格式
          transformRequest: [
            function(data) {
              let ret = "";
              for (const it in data) {
                ret +=
                  encodeURIComponent(it) +
                  "=" +
                  encodeURIComponent(data[it]) +
                  "&";
              }
              return ret.substr(0, ret.length - 1);
            }
          ]
        })
        .then(res => {
          handleRes(res, resolve, reject);
        })
        .catch(error => {
          handleError(error, reject);
        });
    });
  },
  getWithOut: (path, params) => {
    return new Promise((resolve, reject) => {
      axios
        .get(path, {
          headers: {
            "Content-Type": "application/json;charset=UTF-8"
          },
          params: params
        })
        .then(res => {
          handleRes(res, resolve, reject);
        })
        .catch(error => {
          handleError(error, reject);
        });
    });
  }
};
