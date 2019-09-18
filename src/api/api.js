import { get, post, getImg } from "./axiosUtil";

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
  queryBlogArticleList: function(pageNum, rowsize, headers) {

    return post(
      "colornote-blog/blogArticle/queryBlogArticleList",
      {
        pageNum,
        rowsize
      },
      {
        headers: headers
      }
    );
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
  }
};

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
  }
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
  }
};
