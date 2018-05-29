/*
 * @Author: Suifeng 
 * @Date: 2018-01-17 13:47:10 
 * @Desc: 大厅界面
 */

import { HallBaseView } from "../../common/HallBaseView";
import { HallHomeModel } from "./HallHomeModel";
import { h } from "../../common/H";
import { HallUIUtil } from "../../util/HallUIUtil";
import { HallViewConfig } from "../../config/HallViewConfig";
import { HallUserModel } from "../login/HallUserModel";
import { HallConstant } from "../../common/HallConstant";
import { HallHomeController } from "./HallHomeController";

export class HallHomeView extends HallBaseView {
    private gameDatas: any[] = HallHomeModel.getInstance().getGameDatas();
    private gameList: cc.Node;

    constructor() {
        super();
        this.setBindDatas({
            gameList: { varName: "gameList" },
        });
        this.setPrefab("prefab/home/home");
    }

    onPrefabLoaded() {
        this.refreshGameList();
    }

    iconCallback(event) {
        let gameData = this.gameDatas[event.target.tag];
        HallHomeController.startGame(gameData.name);
    }

    refreshGameList() {
        let prefabName = "prefab/home/iconCell";
        let prefab = h.resManager.getPrefabByName(prefabName);
        let cell = cc.instantiate(prefab);
        let cellSize = cell.getContentSize();
        let cellBindDatas = {
            gameNameLabel: { varName: "gameNameLabel" },
            button:{varName:"iconBtn", callback:this.iconCallback.bind(this)}
        }
        var handler = function (funcName, list, index) {
            switch (funcName) {
                case "count":
                    return this.gameDatas.length;
                case "cellSize":
                    return cellSize;
                case "cell":
                    let cell: any = cc.instantiate(prefab);
                    HallUIUtil.bind(cellBindDatas, cell);
                    let gameData = this.gameDatas[index];
                    cell.gameNameLabel.getComponent(cc.Label).string = gameData.name;
                    cell.iconBtn.tag = index;
                    return cell;
            }
        }.bind(this);
        this.gameList.getComponent("MyList").setHandler(handler);
        this.gameList.getComponent("MyList").reloadData();
    }
}