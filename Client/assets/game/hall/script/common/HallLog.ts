/*
 * @Author: Suifeng 
 * @Date: 2018-01-15 14:22:02 
 * @Desc: 日志
 */

import { HallTimeUtil } from "../util/HallTimeUtil";

// 日志级别
enum HallLogLevel {
    // 用于打印所有调试信息
    kDebug = 0,
    // 原则上所有的代码分支都有一行这条日志
    kTrace = 1,
    // 一般来说线上可能是这种日志级别，打印一些标志性信息
    kInfo = 2,
    // 一般来跟预期不一致的异常都应该打印这个结果
    kWarning = 3,
    // 一般来说错误都应该打印这个级别的日志，注意这个级别的日志会把调用栈信息也打印出来
    kFatal = 4,
}

export class HallLog {

    private curLevel: HallLogLevel = HallLogLevel.kDebug;    // 当前日志级别

    private deep: number = 0;                                      // 缩进深度

    private maxDeep: number = 20;                              // 打印日志输出的最大深度 防止无限递归

    private logLines: number = 0;
    private maxLogLines: number = 99999999;

    private levelDesc: string[] = ["DEBUG", "TRACE", "INFO", "WARNING", "FATAL"];

    /**
     * 低于这个level的日志将不被打印
     * @param level
     */
    setLevel(level: HallLogLevel): void {
        this.curLevel = level;
    }

    // 用于打印所有调试信息
    debug(...args: any[]) {
        this.log(HallLogLevel.kDebug, args);
    }

    // 原则上所有的代码分支都有一行这条日志
    trace(...args: any[]) {
        this.log(HallLogLevel.kTrace, args);
    }

    // 一般来说线上可能是这种日志级别，打印一些标志性信息
    info(...args: any[]) {
        this.log(HallLogLevel.kInfo, args);
    }

    // 一般来跟预期不一致的异常都应该打印这个结果
    warning(...args: any[]) {
        this.log(HallLogLevel.kWarning, args);
    }

    // 一般来说错误都应该打印这个级别的日志，注意这个级别的日志会把调用栈信息也打印出来
    fatal(...args: any[]) {
        this.log(HallLogLevel.kFatal, args);
    }



    /**
     * 按照日志级别输出
     * @param level
     * @param args
     */
    private log(level: HallLogLevel, args: any[]): void {
        if (level < this.curLevel) {
            return
        }
        var logTitle = HallTimeUtil.getDateStr(Date.now()) + "[" + this.levelDesc[level] + "]";
        // if (level == HallLogLevel.kFatal) {
        //     console.error(logTitle);
        // } else if (level == HallLogLevel.kWarning) {
        //     console.warn(logTitle);
        // } else {
        //     console.log(logTitle);
        // }
        // if (level == HallLogLevel.kFatal) {
        //     // TODO 调用栈
        // }
        for (var key in args) {
            if (level == HallLogLevel.kFatal) {
                console.error(logTitle, args[key]);
            } else if (level == HallLogLevel.kWarning) {
                console.warn(logTitle, args[key]);
            } else {
                console.log(logTitle, args[key]);
            }
        }

    }


    /**
     * 迭代格式化输出、序列化、
     * @param obj
     * @returns {string}
     */
    private objToString(obj: any): string {
        var description = "";
        if (this.logLines > this.maxLogLines) {
            this.warning("Logger exceed the maximum depth of recursion!!!");
        } else {
            this.deep += 2;
            for (var i in obj) {
                this.logLines++;
                var property = obj[i];
                if(obj.length){
                    i = "/*" + i + "*/";
                }else if (typeof i == "string") {
                    i = "\"" + i + "\":";
                }
                if( property != true && property != false && !property){
                    property = String(property);
                }
                if (typeof property == "object") {
                    if(property.length){
                        description += this.conSpace(this.deep) + i + "[\n" + this.objToString(property) + this.conSpace(this.deep) + " ],\n";
                    }else{
                        description += this.conSpace(this.deep) + i + "{\n" + this.objToString(property) + this.conSpace(this.deep) + " },\n";
                    }
                } else {
                    if (typeof property == "string") {
                        property = "\"" + property + "\"";
                    }
                    description += this.conSpace(this.deep) + i + property + ",\n";
                }
            }
            this.deep -= 2;
        }

        return description;
    }

    /**
     * 日志输出
     * @param msg
     */
    logObj(msg: any) {
        //console.log(msg)
        if (typeof msg == "object") {
            console.log(this.loggerObj(msg));
        } else {
            console.log(msg)
        }
    }

    /**
     * 输出对象
     * @param obj
     * @param parmName
     */
    private loggerObj(obj: any, parmName: string = "") {
        this.deep = 0;
        this.logLines = 0;
        return "\n{\n" + this.objToString(obj) + "\n}"
    }

    /**
     * 分隔符
     * @param deep
     * @returns {string}
     */
    private conSpace(deep): string {
        var sp = "";
        for (var i = 0; i < deep; i++) {
            sp += "  ";
        }
        return sp;
    }
}