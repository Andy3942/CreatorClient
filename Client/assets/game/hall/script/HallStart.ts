/*
 * @Author: Suifeng 
 * @Date: 2018-05-07 21:44:15 
 * @Description: 启动大厅
 */

import { h } from "./common/H";
import { HallLoadingController } from "./view/loading/HallLoadingController";
import { HallViewConfig } from "./config/HallViewConfig";


 // Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    init(){
        HallViewConfig.resetSearchPath();
    }

    start () {
        // window.__errorHandler = function (filename, lineNumber, message, stack) {
        //     cc.loader.loadRes("res/config/project.manifest", function(err, data){
        //         let version = JSON.parse(data).version;
        //         let text = "";
        //         text += "date:" + HallTimeUtil.getDateByFormat(parseInt(version), "yyyy-MM-dd hh:mm:ss") + "\n";
        //         text += "filename:" + filename + "\n";
        //         text += "lineNumber:" + lineNumber + "\n";
        //         text += "message:" + message + "\n";
        //         text += "stack:" + stack + "\n";
        //         HallLogView.show(text);
        //     })
        // }
        this.init();
        let s = cc.view.getViewPortRect();
        cc.view.setDesignResolutionSize(s.width, s.height, cc.ResolutionPolicy.SHOW_ALL);
        let visibleSize = cc.director.getVisibleSize();
        this.node.setPosition(visibleSize.width * 0.5, visibleSize.height * 0.5);
        h.viewManager.setRootNode(this.node);
        HallLoadingController.showLoadingView();
    }

    // update (dt) {}
}
