/*
 * @Author: Suifeng 
 * @Date: 2018-05-25 14:12:33 
 * @Description: 
 */

import { HallBaseModel } from "../../../../hall/script/common/HallBaseModel";
import { HallUserModel } from "../../../../hall/script/view/login/HallUserModel";
import { h } from "../../../../hall/script/common/H";

export class JHPlayerActionType {
    static addChip:number = 1;
    static followChip:number = 2;
    static giveUp:number = 3;
    static compare:number = 4;
}

export class JHGameModel extends HallBaseModel {
    private static instance:JHGameModel;
    private gameName:string = "jinhua";
  
    static getInstance(): JHGameModel {
        if (this.instance == null) {
            this.instance = new JHGameModel();
        }
        return this.instance;
    }

    setGameName(gameName){
        this.gameName = gameName;
    }

    getGameName():string{
        return this.gameName;
    }
}