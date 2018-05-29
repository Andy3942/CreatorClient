/*
 * @Author: Suifeng 
 * @Date: 2018-01-20 21:48:22 
 * @Desc: 资源管理器
 */

import { HallViewConfig } from "../config/HallViewConfig";
import { h } from "../common/H";


export class HallResManager {

    getPrefabByName(path, isHall:boolean = false): cc.Prefab {
        let res:cc.Prefab = this.getRes(path, isHall);
        return res;
    }


    getSpriteFrame(path, isHall:boolean = false): cc.SpriteFrame {
        let texture = this.getRes(path, isHall);
        var frame = new cc.SpriteFrame(texture);
        return frame;
        // path = this.getPath(path, isHall);
        // let myPlist = cc.loader.getRes(path, cc.SpriteAtlas);
        // let myFrame = myPlist.getSpriteFrame(frameName);
        // return myFrame;
    }
    /**
 * 取plist
 *
 * atlasPath : "images/atlas/gongyong"
 */
    getAtlasByName(path, isHall:boolean = false) {
        path = this.getPath(path, isHall);
        return cc.loader.getRes(path, cc.SpriteAtlas);
    }

    getRes(path, isHall:boolean = false):any{
        let pathTemp = this.getPath(path, isHall);
        // h.log.debug("subgame===", pathTemp);
        let res:any = cc.loader.getRes(pathTemp);
        if(!res && !isHall){
            let pathTemp = this.getPath(path, true);
            // h.log.debug("hall===", pathTemp);
            res = cc.loader.getRes(pathTemp);
        }
        return res;
    }

    getPath(path, isHall:boolean = false){
        if(!isHall){
            path = HallViewConfig.getSearchPath() + path;
        }else{
            path = HallViewConfig.getHallSearchPath() + path;
        }
        return path;
    }
}
