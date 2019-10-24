import { get, post, getImg } from "./axiosUtil";
import { Notification } from "element-ui";

export const blogApi = {
  queryBlogSiteByUsername: function(username, headers) {
    return post(
      "colornote-blog/blogPrivateOrder/queryBlogSiteByUsername",
      {
        username
      },
      {
        headers: headers
      }
    );
  },
  queryBlogArticleList: function(data, headers) {
    return post("colornote-blog/blogArticle/queryBlogArticleList", data, {
      headers: headers
    });
  },
  queryBlogArticleById: function(id, headers) {
    return get(
      "colornote-blog/blogArticle/queryBlogArticleById/" + id,
      {},
      headers
    );
  },
  queryBlogDic: function(dicType, keyword) {
    return post("colornote-common/dic/queryDictionary", {
      dicType,
      keyword
    });
  },
  queryBlogLabelByBid: function(headers) {
    return post(
      "colornote-blog/blogPrivateOrder/queryBlogLabelByBid",
      {},
      {
        headers: headers
      }
    );
  },
  queryBlogCateByBid: function(headers) {
    return post(
      "colornote-blog/blogPrivateOrder/queryBlogCateByBid",
      {},
      {
        headers: headers
      }
    );
  },
  insertBlogCategory: function(data, headers) {
    return post("colornote-blog/blogPrivateOrder/insertBlogCategory", data, {
      headers: headers
    });
  },
  insertBlogArticle: function(data, headers) {
    return post("colornote-blog/blogArticle/insertBlogArticle", data, {
      headers: headers
    });
  },
  updateBlogArticle: function(data, headers) {
    return post("colornote-blog/blogArticle/updateBlogArticle", data, {
      headers: headers
    });
  },
  saveFile: function(data, headers) {
    return post("colornote-common/file/saveFile", data, {
      headers: headers
    });
  },
  removeFile: function(data, headers) {
    return post("colornote-common/file/removeFile", data, {
      headers: headers
    });
  },
  queryBlogSiteByUid: function(data, headers) {
    return post("colornote-blog/blogPrivateOrder/queryBlogSiteByUid", data, {
      headers: headers
    });
  },
  updateBlogSite: function(data, headers) {
    return post("colornote-blog/blogPrivateOrder/updateBlogSite", data, {
      headers: headers
    });
  },
  queryBlogArticleInTimeLine: function(data, headers) {
    return post("colornote-blog/blogArticle/queryBlogArticleInTimeLine", data, {
      headers: headers
    });
  },
  //更新热度
  updateBlogArticleAttention: function(data){
    return post("colornote-blog/blogArticle/updateBlogArticleAttention", data, {});
  }
};

import CryptoJS from "crypto-js"; //引用AES源码js

const key = CryptoJS.enc.Utf8.parse("zhangZhang147258"); //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse("147258zhangZhang"); //十六位十六进制数作为密钥偏移量

//解密方法
function Decrypt(word) {
  word = decodeURIComponent(word);
  let base64 = CryptoJS.enc.Base64.parse(word);
  let srcs = CryptoJS.enc.Base64.stringify(base64);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

//加密方法
function Encrypt(word) {
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

export const TkApi = {
  isNotEmpty: function(v) {
    if (
      v != undefined &&
      v != null &&
      v != "null" &&
      v != "undefined" &&
      v.trim() != ""
    ) {
      return true;
    } else {
      return false;
    }
  },
  notify: function(title, msg, type, time) {
    Notification({
      title: title,
      message: msg,
      type: type,
      duration: time
    });
  },
  queryCommentList: function(data){
    return post("colornote-common/comment/queryCommentList", data, {});
  },
  insertComment: function(data){
    return post("colornote-common/comment/insertComment", data, {});
  },
  Encrypt,
  Decrypt
};

export const userApi = {
  refreshCode: function() {
    return getImg(
      "colornote-common/vcode/checkCode" + "?d=" + Math.random(),
      {}
    );
  },
  queryUserInfoById: function(data, headers) {
    return post("colornote-user-center/user/queryUserInfoById", data, {
      headers: headers
    });
  },
  updateUserInfo: function(data, headers) {
    return post("colornote-user-center/user/updateUserInfo", data, {
      headers: headers
    });
  },
  userLogin: function(data) {
    return post("colornote-user-center/user/userLogin", data);
  },
  registerUser: function(data, headers) {
    return post("colornote-user-center/user/registerUser", data, {
      headers
    });
  }
};
