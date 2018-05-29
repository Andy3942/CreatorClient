/*
 * @Author: Suifeng 
 * @Date: 2018-05-14 19:23:30 
 * @Description: 红黑游戏
 */

import { HallBaseView } from "../../../../hall/script/common/HallBaseView";
import { h } from "../../../../hall/script/common/H";

export class HHGameView extends HallBaseView {

    constructor() {
        super();
        this.setBindDatas({
            backBtn: { callback: this.backCallback.bind(this) },
        });
        this.showMaskView(true);
        this.setPrefab("prefab/game/game");
    }

    onPrefabLoaded() {
    }

    backCallback() {
        h.viewManager.popToGameStartView();
    }

}