/*
 * @Author: Suifeng 
 * @Date: 2018-01-20 11:34:18 
 * @Desc: 存储数据
 */

import { HallUserModel } from "../view/login/HallUserModel";

export class HallStorage {
    setItem(key: string, value, isBindUser: boolean = true) {
        key = this.getKey(key, isBindUser);
        cc.sys.localStorage.setItem(key, String(value));
    }

    getItem(key: string, isBindUser: boolean = true): any {
        key = this.getKey(key, isBindUser);
        return cc.sys.localStorage.getItem(key) || String(isBindUser);
    }

    getKey(key: string, isBindUser: boolean): string {
        if (isBindUser && HallUserModel.getInstance().getUserID() != "") {
            key = HallUserModel.getInstance().getUserID() + "_" + key;
        }
        return key;
    }

    removeItem(key: string, isBindUser) {
        key = this.getKey(key, isBindUser);
        cc.sys.localStorage.removeItem(key);
    }
}
