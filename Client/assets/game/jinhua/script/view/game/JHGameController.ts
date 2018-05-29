/*
 * @Author: Suifeng 
 * @Date: 2018-05-25 14:16:49 
 * @Description: 
 */

import { h } from "../../../../hall/script/common/H";
import { JHGameView } from "./JHGameView";
import { JHGameModel, JHPlayerActionType } from "./JHGameModel";
import { HallAlert } from "../../../../hall/script/common/HallAlert";

export class JHGameController {

    static showGameView(): JHGameView {
        let view: JHGameView = new JHGameView();
        h.viewManager.pushView(view);
        return view;
    }

}