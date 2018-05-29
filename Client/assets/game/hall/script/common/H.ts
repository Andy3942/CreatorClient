/*
 * @Author: Suifeng 
 * @Date: 2018-05-07 21:45:21 
 * @Description: 大厅单例
 */

import { HallEventManager } from "../manager/HallEventManager";
import { HallViewManager } from "../manager/HallViewManager";
import { HallResManager } from "../manager/HallResManager";
import { HallNet } from "../net/HallNet";
import { HallHTTP } from "../net/HallHTTP";
import { HallNetConfig } from "../net/HallNetConfig";
import { HallLog } from "./HallLog";
import { HallStorage } from "./HallStorage";
import { HallAudioManager } from "../manager/HallAudioManager";
import { HallUtil } from "../util/HallUtil";
import { HallHotUpdateManager } from "../manager/HallHotUpdateManager";

export namespace h {
    export let eventManager:HallEventManager = new HallEventManager();
    export let viewManager:HallViewManager = new HallViewManager();
    export let resManager:HallResManager = new HallResManager();
    export let net:HallNet = HallNet.getInstance();
    export let http:HallHTTP = new HallHTTP(HallNetConfig.hallURL);
    export let log:HallLog = new HallLog();
    export let storage:HallStorage = new HallStorage();
    export let audioManager:HallAudioManager = new HallAudioManager();
    export let os:string = HallUtil.getOS();
    export let hotUpdateManager:HallHotUpdateManager = new HallHotUpdateManager();
}
window.h = h;