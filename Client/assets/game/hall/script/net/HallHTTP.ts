/*
 * @Author: zhy 
 * @Date: 2018-01-15 15:27:40 
 * @Desc: function
 */

import { HallNetConfig } from "./HallNetConfig";
import { h } from "../common/H";
import { HallStringUtil } from "../util/HallStringUtil";

enum HallRequestType {
    POST = 1,
    GET = 2,
    PUT = 3,
    DELETE = 4,
}

export class HallHTTP {
    baseURL: string = HallNetConfig.hallURL;
    authorization: any = null;

    constructor(url: string = null) {
        if (url) {
            this.baseURL = url;
        }
    }

    setBaseURL(url) {
        this.baseURL = url;
    }

    setAuthorization(authorization: any) {
        this.authorization = authorization;
    }

    send(requestType: HallRequestType, url: string, callback: Function, param: any = {}, err: boolean = false) {
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    let respone = xhr.responseText;
                        let data = JSON.parse(respone);
                        h.log.debug("=================收到http返回数据begin============");
                        h.log.debug("status:" + xhr.status);
                        h.log.logObj(data);
                        h.log.debug("=================收到http返回数据end==============");
                        if (!err && data.code == HallNetConfig.HTTP_CODE.SUCCEED) {
                            if (callback) {
                                callback(data);
                            }
                        } else {
                            if (callback) {
                                callback(data);
                            }
                        }
                } else {
                    h.log.debug("status:" + xhr.status);
                }
            }
        };
        if (!url.startsWith("http")) {
            url = this.baseURL + url;
        }
        h.log.debug("====================发送http请求begin==================");
        h.log.debug("url:" + url);
        h.log.logObj(param);
        h.log.debug("====================发送http请求end==================");
        switch (requestType) {
            case HallRequestType.GET:
                xhr.open("GET", url, true);
                xhr.timeout = HallNetConfig.httpGetTimeout;
                break;
            case HallRequestType.POST:
                xhr.open("POST", url, true);
                xhr.timeout = HallNetConfig.httpPostTimeout;
                xhr.setRequestHeader("Content-Type", "application/json");
                break;
            case HallRequestType.PUT:
                xhr.open("PUT", url, true);
                xhr.timeout = HallNetConfig.httpPutTimeout;
                xhr.setRequestHeader("Content-Type", "application/json");
                break;
            case HallRequestType.DELETE:
                xhr.open("DELETE", url, true);
                xhr.timeout = HallNetConfig.httpDeleteTimeout;
                xhr.setRequestHeader("Content-Type", "application/json");
                break;
        }
        if (this.authorization != null) {
            xhr.setRequestHeader("authorization", this.authorization);
        }
        if (requestType == HallRequestType.GET) {
            xhr.send();
        } else {
            xhr.send(JSON.stringify(param));
        }
    }

    getFile(url: string, callback: Function, err: boolean = false) {
        this.send(HallRequestType.GET, url, callback, null, "file", err);
    }

    get(url: string, callback: Function, param: any = null, err: boolean = false) {
        url = this.getUrl(url, param);
        this.send(HallRequestType.GET, url, callback, {}, null, err);
    }

    getUrl(url: string, param: any = null): string {
        if (param) {
            let paramStr = "";
            for (let key in param) {
                paramStr += HallStringUtil.format("&{0}={1}", key, param[key]);
            }
            url += "?" + paramStr.substr(1);
        }
        return url;
    }

    post(url: string, callback: Function, param: any, err: boolean = false) {
        this.send(HallRequestType.POST, url, callback, param, null, err);
    }

    put(url: string, callback: Function, param: any, err: boolean = false) {
        this.send(HallRequestType.PUT, url, callback, param, null, err);
    }

    delete(url: string, callback: Function, param: any, err: boolean = false) {
        this.send(HallRequestType.DELETE, url, callback, param, null, err);
    }
}

