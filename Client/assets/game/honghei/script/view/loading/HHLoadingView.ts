/*
 * @Author: Suifeng 
 * @Date: 2018-05-14 19:03:16 
 * @Description: 红黑加载界面
 */

import { HallLoadingView } from "../../../../hall/script/view/loading/HallLoadingView";
import { HHGameController } from "../game/HHGameController";
import { h } from "../../../../hall/script/common/H";

export class HHLoadingView extends HallLoadingView {

    onFinished() {
        h.viewManager.removeView(this);
        HHGameController.showGameView();
    }
}