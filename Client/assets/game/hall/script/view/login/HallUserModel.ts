/*
 * @Author: Suifeng 
 * @Date: 2018-01-16 20:02:42 
 * @Desc: 用户数据
 */

import { HallBaseModel } from "../../common/HallBaseModel";
import { HallStorage } from "../../common/HallStorage";
import { h } from "../../common/H";
import {HallUIUtil} from "../../util/HallUIUtil";
import { HallUtil } from "../../util/HallUtil";
import { HallConstant } from "../../common/HallConstant";

export class HallUserModel extends HallBaseModel {
    private static instance:HallUserModel;
    private userData:any;

    static getInstance(): HallUserModel {
        if (this.instance == null) {
            this.instance = new HallUserModel();
        }
        return this.instance;
    }

    setUserData(data){
        this.userData = data;
    }
}