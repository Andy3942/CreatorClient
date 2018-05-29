/*
 * @Author: Suifeng 
 * @Date: 2018-01-16 13:45:46 
 * @Desc: 登录
 */

import { HallBaseView } from "../../common/HallBaseView";
import { HallConfig } from "../../config/HallConfig";
import { HallUserModel } from "./HallUserModel";
import { HallNetConfig } from "../../net/HallNetConfig";
import { h } from "../../common/H";
import { HallLoginController } from "./HallLoginController";
import { HallAlert, HallAlertType } from "../../common/HallAlert";
import { HallHotUpdateEvent } from "../../manager/HallHotUpdateManager";
import { HallHomeController } from "../home/HallHomeController";

export class HallLoginView extends HallBaseView {
    private routeEB:cc.Node;
    private paramEB:cc.Node;
    private idEB:cc.Node;
    private signupBtn:cc.Node;
    private hostEB:cc.Node;
    private urlEB:cc.Node;
    private portEB:cc.Node;
    private debugNode:cc.Node;
    
    constructor() {
        super();
        this.setBindDatas({
            loginBtn: {callback: this.loginCallback.bind(this) },
           
        });
        this.setPrefab("prefab/login/login");
    }
    onPrefabLoaded() {
    }
    
    loginCallback() {
        HallHomeController.showHomeView();
    }
}