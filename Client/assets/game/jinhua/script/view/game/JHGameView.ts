/*
 * @Author: Suifeng 
 * @Date: 2018-05-25 14:18:15 
 * @Description: 金花游戏界面
 */

import { HallBaseView } from "../../../../hall/script/common/HallBaseView";
import { h } from "../../../../hall/script/common/H";

export class JHGameView extends HallBaseView {

    constructor() {
        super();
        this.setBindDatas({
            backBtn: { callback: this.backCallback.bind(this) }
        });
        this.setPrefab("prefab/game/game");
    }

    onPrefabLoaded() {
    }


    backCallback() {
        h.viewManager.popToGameStartView();
    }

}