/*
 * @Author: Suifeng 
 * @Date: 2018-05-25 16:33:26 
 * @Description: 金花加载界面
 */

import { HallLoadingView } from "../../../../hall/script/view/loading/HallLoadingView";
import { h } from "../../../../hall/script/common/H";
import { JHHomeController } from "../home/JHHomeController";

 export class JHLoadingView extends HallLoadingView {

    onFinished(){
        h.viewManager.removeView(this);
        JHHomeController.showHomeView();
    }
 }
