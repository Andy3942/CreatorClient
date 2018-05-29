/*
 * @Author: Suifeng 
 * @Date: 2018-05-14 19:23:25 
 * @Description: 
 */

import { HHGameView } from "./HHGameView";
import { h } from "../../../../hall/script/common/H";
import { HallUserModel } from "../../../../hall/script/view/login/HallUserModel";
import { HHGameModel } from "./HHGameModel";
import { HallAlert } from "../../../../hall/script/common/HallAlert";

export class HHGameController {

    static showGameView():HHGameView {
        let view:HHGameView = new HHGameView();
        h.viewManager.pushView(view);
        return view;
    }
}