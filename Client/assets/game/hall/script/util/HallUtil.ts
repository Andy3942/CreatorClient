/*
 * @Author: Suifeng 
 * @Date: 2018-01-16 13:21:30 
 * @Desc: 工具类
 */

import { h } from "../common/H";

export class HallUtil {

    static getClassName(obj: any): string {
        let funcNameRegex = /function (.{1,})\(/;
        let results: string[] = (funcNameRegex).exec((obj).constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    }

    static schedule(callback: Function, node: cc.Node, interval: number, repeat: boolean = false) {
        let sequence;
        if (interval >= 0) {
            sequence = cc.sequence(
                cc.delayTime(interval),
                cc.callFunc(callback),
            )
            let action = null;
            if (repeat) {
                action = cc.repeatForever(sequence);
            } else {
                action = sequence;
            }
            return node.runAction(action);
        } else {
            if (repeat) {
                while (true) {
                    let ret = callback();
                    if (!ret) {
                        break;
                    }
                }
            } else {
                callback();
            }

        }
    }

    static isEmpty(data) {
        if (data) {
            for (let k in data) {
                return false
            }
        }
        return true;
    }

    static deepCopy(obj): any {
        let str = JSON.stringify(obj);
        let newobj = JSON.parse(str);
        return newobj;
    }

    static getUrlParams(url) {
        if (!url || url == "") {
            return {};
        }
        let paramArray = url.match(/[0-9a-zA-Z]*=[0-9a-zA-Z]*/g);
        let paramDict: any = {};
        for (let i in paramArray) {
            let kv = paramArray[i].split("=");
            paramDict[kv[0]] = kv[1];
        }
        return paramDict;
    }

    static isAndroid(): boolean {
        return cc.sys.os == cc.sys.OS_ANDROID;
    }

    static isIOS(): boolean {
        return cc.sys.os == cc.sys.OS_IOS;
    }

    static isWeb(): boolean {
        return cc.sys.isBrowser;
    }

    static isMobile(): boolean {
        return this.isAndroid() || this.isIOS();
    }

    static getOS() {
        let os = cc.sys.os;
        if (os == cc.sys.OS_OSX) {
            os = "OS_X";
        }
        return os;
    }
}
