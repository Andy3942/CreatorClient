/*
 * @Author: Suifeng 
 * @Date: 2018-05-14 19:02:44 
 * @Description: 
 */

import { HHLoadingView } from "./HHLoadingView";
import { h } from "../../../../hall/script/common/H";

export class HHLoadingController {

    static showLoadingView():HHLoadingView {
        let view:HHLoadingView = new HHLoadingView();
        h.viewManager.pushView(view);
        return view;
    }
}