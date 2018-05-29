/*
 * @Author: Suifeng 
 * @Date: 2018-01-30 11:38:58 
 * @Desc: 文件描述
 */

import { HallLoadingView } from "./HallLoadingView";
import { h } from "../../common/H";

 export class HallLoadingController {
     static showLoadingView(){
         let view = new HallLoadingView();
         h.viewManager.pushView(view);
     }
 }