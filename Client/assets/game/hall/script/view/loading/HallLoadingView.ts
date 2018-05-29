/*
 * @Author: Suifeng 
 * @Date: 2018-01-30 11:28:42 
 * @Desc: 加载界面
 */

import { HallBaseView } from "../../common/HallBaseView";
import { h } from "../../common/H";
import { HallViewConfig } from "../../config/HallViewConfig";
import { HallLoginController } from "../login/HallLoginController";
import { HallHomeController } from "../home/HallHomeController";
import { HallUserModel } from "../login/HallUserModel";

export class HallLoadingView extends HallBaseView {
    protected progressBar: cc.Node;
    constructor() {
        super();
        this.setBindDatas({
            progressBar: { varName: "progressBar" },
        });
        this.setPrefab("prefab/loading/loading");
    }

    onPrefabLoaded() {
        cc.loader.loadResDir(HallViewConfig.getSearchPath(), function (completedCount: number, totalCount: number, item: any) {
            let progress: number = completedCount / totalCount;
            progress = parseFloat(progress.toFixed(2));
            this.progressBar.getComponent(cc.ProgressBar).progress = progress;
            h.log.debug("res:", item.url);
        }.bind(this), function (error: Error, resource: any[], urls: string[]) {
            if (error) {
                h.log.debug(error.message);
            }
            this.onFinished();
        }.bind(this));
    }

    onFinished() {
        h.viewManager.removeView(this);
        HallLoginController.showLoginView();
    }
}
