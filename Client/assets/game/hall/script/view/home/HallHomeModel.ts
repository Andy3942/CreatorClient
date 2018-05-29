/*
 * @Author: Suifeng 
 * @Date: 2018-01-22 18:38:39 
 * @Desc: 大厅数据
 */

import { HallBaseModel } from "../../common/HallBaseModel";
import { h } from "../../common/H";

 export class HallHomeModel extends HallBaseModel {
    private static instance:HallHomeModel = null;

    static getInstance():HallHomeModel {
        if(!this.instance){
            this.instance = new HallHomeModel();
        }
        return this.instance;
    }

    getGameDatas():any[] {
        let gameDatas = h.resManager.getRes("config/game", true);
        return gameDatas;
    }

    getGameData(gameName:string):any{
        let gameDatas = this.getGameDatas();
        for(let i = 0; i < gameDatas.length; ++i){
            let gameData = gameDatas[i];
            if(gameData.name == gameName){
                return gameData;
            }
        }
    }
 }
