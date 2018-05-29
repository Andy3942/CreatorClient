/*
 * @Author: Suifeng
 * @Date: 2018-01-16 20:17:57
 * @Desc: 网络配置
 */

import { HallStringUtil } from "../util/HallStringUtil";
import { HallConfig } from "../config/HallConfig";

export module HallNetConfig {
    export let wsURL: string = "ws://118.25.40.163:8088";
    export let hallURL: string = "http://www.baidu.com";
    export let httpGetTimeout: number = 3000;
    export let httpPostTimeout: number = 5000;
    export let httpPutTimeout: number = 5000;
    export let httpDeleteTimeout:number = 5000;
    export enum HTTP_CODE {
        NET_ERROR = -2,
        ERROR = -1,
        SUCCEED = 0,
    }
}