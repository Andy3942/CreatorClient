'use strict' ;
var self = null ;
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        musicVolume: 1.0,       //音乐竟量大小
        musicStates: 1,         //音乐开还是关

        soundVolume:1.0,           // 音效音量大小
        soundStates: 1,             //音效开关

        bgAudioID:-1,            //   背景 音乐  id
        yinXiaoMap : null,
        yinyueMap:null,
    },

    // use this for initialization
    init: function () {
        self = this ;
        this.yinXiaoMap = new Map();
        this.yinyueMap = new Map();
        this.audioMap = new Map(); // 所有音频 名称：路径 对应表

        this.getMusicVolume();
        this.getSoundVolume();
        this.getMusicState();
        this.getSoundState();

        //  通过配置文件加载进 音频名称和路径对应表
        cc.loader.loadRes('config/AudioPath', function( err, res){
            if(err){
                cc.log('加载音频路径文件失败', err) ;
                return ;
            }
            else{
                this.configProcess(res) ;
            }
        }.bind(this));


        cc.game.on(cc.game.EVENT_HIDE, function () {
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            cc.audioEngine.resumeAll();
        });

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    // 获取到音频文件
    getAudio: function(name){

        var audio = this.audioMap.get(name) ;
        if(!audio){
            audio = {
                playSFX: function(){},
                stopSFX: function(){},
                playBGM: function(){}
            } ;
            cc.error('audio.getAudio() name ' + name + 'not found') ;
        }
        return audio;
    },

    getUrl:function(url){
        return cc.url.raw("resources/sounds/" + url);
    },

    //播放音乐
    playBGM(url){
        var audioUrl = this.getUrl(url);
        // if(this.bgAudioID >= 0){
        //     cc.audioEngine.stop(this.bgAudioID);
        // }
        if(this.musicStates > 0) {
            this.bgAudioID = cc.audioEngine.play(audioUrl,true,this.musicVolume);
        }else {
            this.bgAudioID = cc.audioEngine.play(audioUrl,true,0);
        }
    },

    stopBGM(){
        if(this.bgAudioID >= 0){
            cc.audioEngine.stop(this.bgAudioID);
        }
    },

    //播放音效
    playSFX(url,loop){
        loop = loop || false;
        var audioUrl = this.getUrl(url);
        if(this.soundStates > 0){
            var audioId = cc.audioEngine.play(audioUrl,loop,this.soundVolume);
            cc.log("play url=" + url + " id=" + audioId);
            this.yinXiaoMap.set(url,audioId);
        }
    },
    stopSFX(url){
        let auidoId = this.yinXiaoMap.get(url);
        cc.log("stop url=" + url + " id=" + auidoId);
        if(auidoId >= 0){
            cc.audioEngine.stop(auidoId);
            this.yinXiaoMap.delete(url);
        }
    },
    //保存音效大小
    setSFXVolume:function(v){
        cc.sys.localStorage.setItem("soundVolume",v);
        this.soundVolume = v;
    },


      //保存音效大小
    setBGMVolume:function(v){
        if(this.bgmVolume != v){
            cc.sys.localStorage.setItem("musicVolume",v);
            this.bgmVolume = v;
        }
    },


    //保存音量开关状态
    setMusicState:function (v) {
        cc.sys.localStorage.setItem("musicStates",v);
    },

    setSoundState: function (v) {
        cc.sys.localStorage.setItem("soundStates",v);
    },

    getState:function(){
        return cc.audioEngine.getState(this.bgAudioID);
    },

    //设置背景大小和开关
    setBGMSwitch:function(v,control){
        if(this.bgAudioID >= 0){
            if(v > 0 && control){
                cc.audioEngine.resume(this.bgAudioID);
            }else if(v == 0){
                cc.audioEngine.pause(this.bgAudioID);
            }
        }

        if(this.bgVolume != v){
            cc.audioEngine.setVolume(this.bgAudioID,v);
        }

    },

    //设置音效大小
    setSFXSwitch:function(v){
        this.soundStates = v;
    },


     //设置音效大小
     setSFXNum:function(v){
        this.soundVolume = v;
    },

    pauseAll:function(){
        cc.audioEngine.pauseAll();
    },

    resumeAll:function(){
        cc.audioEngine.resumeAll();
    },

    getMusicVolume: function () {
        var t = cc.sys.localStorage.getItem('musicVolume');
        if(t != null) {
            this.musicVolume = parseFloat(t);
        }
        return this.musicVolume;
    },

    getSoundVolume: function () {
        var t = cc.sys.localStorage.getItem("soundVolume");
        if(t != null){
            this.soundVolume = parseFloat(t);
        }
        return this.soundVolume;
    },

    getMusicState: function () {

        var t = cc.sys.localStorage.getItem("musicStates");
        if(t != null){
            this. musicStates = parseInt(t);
        }
        return this.musicStates;
    },

    getSoundState: function () {
        var t = cc.sys.localStorage.getItem("soundStates");
        if(t != null){
            this. soundStates = parseInt(t);
        }
        return this.soundStates;
    },

    //  处理音频配置文件
    configProcess: function(data){

        var audioList = data.audio ;

        var playSFX = function(loop){
            self.playSFX(this.path, loop) ;
        } ;

        var playBGM = function(){
            self.playBGM(this.path) ;
        } ;

        var stopSFX = function(){
            self.stopSFX(this.path) ;
        } ;

        for(let i = 0 ; i < audioList.length ; i++){
            let item = audioList[i] ;

            this.audioMap.set( item.name,
            {
                // memeber variable
                id: item.id,
                name: item.name,
                path: item.path,

                // member fuction
                playSFX: playSFX,
                playBGM: playBGM,
                stopSFX: stopSFX,
            }) ;
            // cc.log('音频加载', this.audioMap.get(item.name)) ;
        }
    },
});
