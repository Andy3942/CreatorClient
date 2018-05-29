/*
 * @Author: Suifeng 
 * @Date: 2018-01-22 14:45:34 
 * @Desc: 音频管理者
 */

import { h } from "../common/H";
import { HallViewConfig } from "../config/HallViewConfig";

export enum HallAudioStatus {
    open = "true",
    close = "false"
}

export class HallAudioManager {
    musicVolumeKey:string = "musicVolumeKey";
    musicStatusKey:string = "musicStatusKey";
    soundVolumeKey:string = "soundVolumeKey";
    soundStatusKey:string = "soundStatusKey";

    musicVolume = 1;       //音乐竟量大小
    musicStatus = HallAudioStatus.open;         //音乐开还是关

    soundVolume = 1;           // 音效音量大小
    soundStatus = HallAudioStatus.open;             //音效开关

    bgAudioID = -1;            //   背景 音乐  id
    yinXiaoMap;
    yinyueMap;
    audioMap;

    constructor(){    
        this.yinXiaoMap = new Map();
        this.yinyueMap = new Map();
        this.audioMap = new Map(); // 所有音频 名称：路径 对应表
        this.musicVolume = parseFloat(h.storage.getItem(this.musicVolumeKey, false)) || 1;
        this.musicStatus = h.storage.getItem(this.musicStatusKey,false);
        this.soundVolume = parseFloat(h.storage.getItem(this.soundVolumeKey, false)) || 1;
        this.soundStatus = h.storage.getItem(this.soundStatusKey, false);
        cc.game.on(cc.game.EVENT_HIDE, function () {
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            cc.audioEngine.resumeAll();
        });
    }

    loadAudio(pathDatas:any[], tag:string = null){
        tag = tag || HallController.getCurGameName();
        this.audioMap[tag] = this.audioMap[tag] || {}
        for(let i in pathDatas){
            let pathData = pathDatas[i]
            this.audioMap[tag][pathData.name] = pathData;
        }
    }

    playMGBByName(name:string, tag:string = null){
        let url = this.getUrl(name, tag);
        if(url){
            h.log.debug("play bgm:", url);
            if (this.musicStatus == HallAudioStatus.open) {
                this.bgAudioID = cc.audioEngine.play(url, true, this.musicVolume);
            } else {
                this.bgAudioID = cc.audioEngine.play(url, true, 0);
            }
        }
    }

    playSoundByName(name:string, loop:boolean = false, tag:string = null){
        let url = this.getUrl(name, tag);
        if (this.soundStatus == HallAudioStatus.open) {
            loop = loop || false;
            if(this.yinXiaoMap.get(url) != null && loop){
            }else{
                var audioId = cc.audioEngine.play(url, loop, this.soundVolume);
                h.log.debug("play url=" + url + " id=" + audioId);
                this.yinXiaoMap.set(url, audioId);
            }
        }
    }

    getAudioId(name): any {
        let url = this.getUrl(name, null);
        if (this.yinXiaoMap.get(url) != null) {
            return this.yinXiaoMap.get(url);
        }
        return null;
    }

    private getUrl(name:string, tag:string = null) {
        tag = tag || HallController.getCurGameName();
        let pathDatas = this.audioMap[tag]
        let pathData = null;
        if(pathDatas){
            pathData = pathDatas[name]
        }
        if(!pathData){
            tag = HallController.getHallName();
            pathDatas = this.audioMap[tag];
            if(pathDatas){
                pathData = pathDatas[name];
            }
        }
        if(!pathData){
            h.log.debug("没有找到audio:", name, tag);
            return;
        }
        let path = pathData.path;
        if(tag == HallController.getCurGameName()){
            return cc.url.raw("resources/" + HallViewConfig.getSearchPath() + "res/sounds/" + path);
        }else{
            return cc.url.raw("resources/res/sounds/" + path);
        }
    }

    stopBGM() {
        if (this.bgAudioID >= 0) {
            cc.audioEngine.stop(this.bgAudioID);
        }
    }

    stopSound(name) {
        let url = this.getUrl(name, null);
        let auidoId = this.yinXiaoMap.get(url);
        cc.log("stop url=" + url + " id=" + auidoId);
        if(auidoId >= 0){
            cc.audioEngine.stop(auidoId);
            this.yinXiaoMap.delete(url);
        }
    }
    //保存音效大小
    setSoundVolume(v){
        if(this.soundVolume != v){
            h.storage.setItem(this.soundVolumeKey, v, false);
            this.soundVolume = v;
        }
    }

    //保存音乐大小
    setMusicVolume(v){
        if(this.musicVolume != v) {
            h.storage.setItem(this.musicVolumeKey, v, false);
            this.musicVolume = v;
        }
    }

    //保存音乐开关状态
    setMusicStatus(v) {
        v = String(v)
        if(v == HallAudioStatus.close){
            this.pauseMusic();
        }else{
            this.resumeMusic();
        }
        h.storage.setItem(this.musicStatusKey, v, false);
        this.musicStatus = v;
    }

    setSoundStatus(v) {
        v = String(v)
        h.storage.setItem(this.soundStatusKey, v, false);
        this.soundStatus = v;
    }

    getState(){
        return cc.audioEngine.getState(this.bgAudioID);
    }

    //设置音效大小
    setSFXSwitch(v){
        this.soundStatus = v;
    }


    //设置音效大小
    setSFXNum(v){
        this.soundVolume = v;
    }

    pauseAll(){
        cc.audioEngine.pauseAll();
    }

    pauseMusic(){
        cc.audioEngine.pause(this.bgAudioID);
    }

    resumeAll(){
        cc.audioEngine.resumeAll();
    }

    resumeMusic(){
        cc.audioEngine.setVolume(this.bgAudioID, this.getMusicVolume());
        cc.audioEngine.resume(this.bgAudioID);
    }

    getMusicVolume() {
        return this.musicVolume;
    }

    getSoundVolume() {
        return this.soundVolume;
    }

    getMusicStatus():HallAudioStatus {
        return this.musicStatus;
    }

    getSoundStatus():HallAudioStatus {
        return this.soundStatus;
    }
}
