/*
 * @Author: Suifeng 
 * @Date: 2018-05-15 12:59:04 
 * @Description: 
 */

import { HallBaseModel } from "../../../../hall/script/common/HallBaseModel";
import { HallUtil } from "../../../../hall/script/util/HallUtil";
import { h } from "../../../../hall/script/common/H";
import { HallHomeModel } from "../../../../hall/script/view/home/HallHomeModel";

export class HHGameModel extends HallBaseModel {
    private static instance:HHGameModel;
    private gameName:string = "honghei";


    static getInstance(): HHGameModel {
        if (this.instance == null) {
            this.instance = new HHGameModel();
        }
        return this.instance;
    }

    constructor(){
        super();
    }

    setGameName(gameName){
        this.gameName = gameName;
    }

    getGameName():string{
        return this.gameName;
    }
}