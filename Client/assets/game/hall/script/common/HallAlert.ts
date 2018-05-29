/*
 * @Author: Suifeng 
 * @Date: 2018-01-17 22:50:27 
 * @Desc: alert
 */

import { HallBaseView } from "./HallBaseView";
import { h } from "./H";

export enum HallAlertType {
    oneButton = 0,
    twoButton = 1
}
export class HallAlert extends HallBaseView {

    private closeBtn:cc.Node;
    private textLabel:cc.Node;
    private cancelBtn:cc.Node;
    private confirmBtn:cc.Node;
    private rightConfirmBtn:cc.Node;
    private text:string;
    private tipLabel:cc.Label;
    private degConfirmCallback:Function;
    private degCancelCallback:Function;
    private type:HallAlertType = HallAlertType.oneButton;

    constructor(text:string = "tip"){
        super();
        this.text = text;
        this.setBindDatas({
            closeBtn:{varName:"closeBtn", callback:this.cancelCallback.bind(this)},
            cancel:{varName:"cancelBtn", callback:this.cancelCallback.bind(this)},
            queding:{varName:"confirmBtn", callback:this.confirmCallback.bind(this)},
            queding2:{varName:"rightConfirmBtn", callback:this.confirmCallback.bind(this)},
            tipText:{varName:"tipLabel"}
        });
        this.showMaskView(true);
        this.setPrefab("prefab/common/alert");
    }

    static show(text:string, confimCallback:Function = null, cancelCallback:Function = null){
        let view:HallAlert = new HallAlert(text);
        h.viewManager.pushView(view);
        view.setConfirmCallback(confimCallback);
        view.setCancelCallback(cancelCallback);
        return view;
    }

    setType(type:HallAlertType){
        this.type = type;
        if(type == HallAlertType.oneButton){
            this.cancelBtn.active = false;
            this.confirmBtn.active = true;
            this.rightConfirmBtn.active = false
        }else{
            this.cancelBtn.active = true;
            this.confirmBtn.active = false;
            this.rightConfirmBtn.active = true;
        }
    }

    setCancelText(text:string){
        this.cancelBtn.getChildByName("text").getComponent(cc.Label).string = text;
    }

    setConfirmText(text:string){
        this.confirmBtn.getChildByName("text").getComponent(cc.Label).string = text;
    }

    setRightConfirmText(text:string){
        this.rightConfirmBtn.getChildByName("text").getComponent(cc.Label).string = text;
    }

    setCancelCallback(callback:Function){
        this.degCancelCallback = callback;
    }

    setConfirmCallback(callback:Function){
        this.degConfirmCallback = callback;
    }

    onPrefabLoaded(){
        this.tipLabel.getComponent(cc.Label).string = this.text;
    }

    cancelCallback(){
        h.viewManager.removeView(this);
        if(this.degCancelCallback){
            this.degCancelCallback();
        }
    }

    confirmCallback(){
        h.viewManager.removeView(this);
        if(this.degConfirmCallback){
            this.degConfirmCallback();
        }
    }
}