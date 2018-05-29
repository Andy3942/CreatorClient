import { HallBaseView } from "./HallBaseView";
import { HallAlert } from "./HallAlert";

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
export default class HallBaseComponent extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    private view:HallBaseView;

    onLoad () {
        this.view.onLoad();
    }

    start () {
        this.view.start();
    }

    update (dt) {
        this.view.update(dt);
    }

    onDestroy(){
        this.view.onDestroy();
    }

    setView(view:HallBaseView){
        this.view = view;
    }
}
