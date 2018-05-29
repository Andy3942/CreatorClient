/*
 * @Author: Suifeng 
 * @Date: 2018-01-15 23:06:12 
 * @Desc: string工具类
 */

export class HallStringUtil {
    static format = function (formatSrt: string, ...args: any[]) {
        if (arguments.length == 0) {
            return null;
        }
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    }
}