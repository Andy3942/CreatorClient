/*
 * @Author: Suifeng 
 * @Date: 2018-05-25 16:34:00 
 * @Description: 
 */

import { JHLoadingView } from "./JHLoadingView";
import { h } from "../../../../hall/script/common/H";

export class JHLoadingController {

    static showLoadingView():JHLoadingView {
        let view:JHLoadingView = new JHLoadingView();
        h.viewManager.pushView(view);
        return view;
    }
}