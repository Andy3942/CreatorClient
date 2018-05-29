/*
 * @Author: Suifeng 
 * @Date: 2018-01-16 13:50:36 
 * @Desc: 登录
 */

import { HallLoginView } from "./HallLoginView";
import { HallUserModel } from "./HallUserModel";
import { h } from "../../common/H";
import { HallAlert } from "../../common/HallAlert";
import { HallNetConfig } from "../../net/HallNetConfig";
import { HallUIUtil } from "../../util/HallUIUtil";
import { HallUtil } from "../../util/HallUtil";

export class HallLoginController {

    static showLoginView() {
        let view: HallLoginView = new HallLoginView();
        h.viewManager.pushView(view);
    }
}
