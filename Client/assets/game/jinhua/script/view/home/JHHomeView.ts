/*
 * @Author: Suifeng 
 * @Date: 2018-05-25 13:34:42 
 * @Description: 金花首页
 */

import { HallBaseView } from "../../../../hall/script/common/HallBaseView";
import { h } from "../../../../hall/script/common/H";


export class JHHomeView extends HallBaseView {

    constructor() {
        super();
        this.setBindDatas({
            backBtn: { callback: this.backCallback.bind(this) },
        });
        this.showMaskView(true);
        this.setPrefab("prefab/home/home");
    }

    onPrefabLoaded() {

    }


    backCallback(){
        h.viewManager.popToGameStartView();
    }
}