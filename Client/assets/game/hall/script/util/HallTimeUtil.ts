import { Stream } from "stream";

/*
 * @Author: Suifeng 
 * @Date: 2018-01-20 22:06:07 
 * @Desc: 时间类
 */

export class HallTimeUtil {
    // yy-MM-dd hh:mm:ss
    static getDateStr(time) {
        var date = new Date(time);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var mm = date.getMinutes();
        var s = date.getSeconds();
        return cc.js.formatStr("%s-%s-%s %s:%s:%s", y, m, d, h, mm, s);
    }

    static getDateByFormat(time:number, format:string = "yyyy-MM-dd hh:mm:ss"){
        let date = new Date(time);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        let h = date.getHours();
        let mm = date.getMinutes();
        let s = date.getSeconds();
        let formatDatas = {
            "yyyy":y,
            "MM":m,
            "dd":d,
            "hh":h,
            "mm":mm,
            "ss":s
        }
        let ret = format;
        for(let key in formatDatas){
            ret = ret.replace(key, formatDatas[key]);
        }
        return ret;
    }
    /**
    * 取时间小时和分
    */
    static getHourAndMinites() {
        var t = new Date();
        var hours = (t.getHours() > 9) ? t.getHours() : ("0" + t.getHours());
        var minutes = (t.getMinutes() > 9) ? t.getMinutes() : ("0" + t.getMinutes());
        //var seconds = (t.getMilliseconds() > 9) ? t.getMilliseconds() : ("0" + t.getMilliseconds());
        var str = "" + hours + ":" + minutes;
        return str;
    }

}
