/*
 * @Author: Suifeng 
 * @Date: 2018-05-25 14:08:16 
 * @Description: 
 */

import { JHHomeView } from "./JHHomeView";
import { h } from "../../../../hall/script/common/H";

export class JHHomeController {

    static showHomeView():JHHomeView {
        let view:JHHomeView = new JHHomeView();
        h.viewManager.pushView(view);
        return view;
    }
}