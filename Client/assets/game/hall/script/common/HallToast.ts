/*
 * @Author: Suifeng 
 * @Date: 2018-01-17 21:53:16 
 * @Desc: toast提示
 */

import { HallBaseView } from "./HallBaseView";
import { h } from "./H";

export class HallToast extends HallBaseView {
    private textBg:cc.Node = null;
    private textLabel:cc.Node = null;
    private text:string = "";

    constructor(text:string){
        super();
        this.text = text;
        this.setBindDatas({
            textBg:{varName:"textBg"},
            text:{varName:"textLabel"},
        })
        this.setPrefab("prefab/common/toast");
    }

    static show(text:string){
        let view:HallToast = new HallToast(text);
        h.viewManager.pushView(view);
    }
    onPrefabLoaded(){
        this.textLabel.getComponent(cc.Label).string = this.text;
        let labelSize = this.textLabel.getContentSize() ;
        this.textBg.setContentSize(labelSize.width + 20, labelSize.height + 10) ;
        this.showAction();
    }

    showAction(){
        let offsetY = 100;
        let speed = 0.3;
        let duration = 1;
        let actionFadeInOut = cc.sequence(
            cc.spawn(cc.moveBy(1.5, cc.p(0, offsetY)), cc.fadeOut(1.5)),
            cc.callFunc(this.onFadeOutFinish, this)
        )
        this.runAction(actionFadeInOut);
    }

    onFadeOutFinish(){
        h.viewManager.removeView(this);
    }
}