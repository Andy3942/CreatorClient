/*
 * @Author: Suifeng 
 * @Date: 2018-05-08 15:32:04 
 * @Description: 大厅
 */

import { h } from "../../common/H";
import { HallViewConfig } from "../../config/HallViewConfig";
import { HallHomeView } from "./HallHomeView";
import { HallBaseView } from "../../common/HallBaseView";
import { HallHomeModel } from "./HallHomeModel";

export class HallHomeController {
    static curGameName: string = null;
    static hallName: string = "hall";

    static showHomeView() {
        h.viewManager.popToRootView();
        HallViewConfig.resetSearchPath();
        let view: HallHomeView = new HallHomeView();
        view.setSign("hall");
        h.viewManager.pushView(view);
    }

    static closeHomeView() {
        h.viewManager.removeViewBySign("hall");
    }

    static getCurGameName() {
        return this.curGameName;
    }

    static getHallName() {
        return this.hallName;
    }

    static startGame(gameName: string) {
        this.curGameName = gameName;
        this.showGame(gameName);
    }

    static showGame(gameName: string): HallBaseView {
        let gameData = HallHomeModel.getInstance().getGameData(gameName);
        HallViewConfig.setSearchPath("game/" + gameData.name + "/");
        let view: HallBaseView = new HallBaseView();
        view.setSign("gameStart");
        view.setPrefab("prefab/start");
        h.viewManager.pushView(view);
        return view;
    }
}
