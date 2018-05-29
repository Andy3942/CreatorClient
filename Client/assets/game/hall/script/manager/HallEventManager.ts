import { h } from "../common/H";
import { HallUtil } from "../util/HallUtil";
import { HallUIUtil } from "../util/HallUIUtil";

/*
* @Author: Suifeng 
* @Date: 2018-01-15 15:25:28 
* @Desc: 事件
*/


class HallListener {
    event: string = null;
    func: any = null;
    times: number = null;
    obj: any = null;
    constructor(event: string, func: Function, obj: any, times: number = -1) {
        this.event = event;
        this.func = func.bind(obj);
        this.obj = obj;
        this.times = times;
    }

    equal(listener: HallListener) {
        return this.event == listener.event && this.func == listener.event && this.obj == listener.obj;
    }
}

export class HallEventManager {
    private listeners: HallListener[] = [];

    addListener(event: string, func: Function, obj: cc.Node, times: number = -1) {
        h.log.debug("addListener:", event, times);
        if(!(obj instanceof cc.Node)){
            h.log.fatal("必须是cc.Node类型");
            return;
        }
        let listener: HallListener = new HallListener(event, func, obj, times);
        for (let i in this.listeners) {
            let listenerTemp: HallListener = this.listeners[i];
            if (listener.equal(listenerTemp)) {
                listener.times = listenerTemp.times;
                return;
            }
        }
        this.listeners.push(listener);
    }
    
    addListenerOnce(event: string, func: Function, obj: any){
        this.addListener(event, func, obj, 1);
    }

    removeListenersByObj(obj: any) {
        for (let i = this.listeners.length - 1; i >= 0; --i) {
            let listener: HallListener = this.listeners[i];
            if (listener.obj == obj) {
                h.log.debug("removeListener:", listener.event, HallUtil.getClassName(listener.obj));
                this.listeners.splice(i, 1);
            }
        }
    }

    dispatchEvent(event: string, data?: any) {
        this.checkListeners();
        for (let i = 0; i < this.listeners.length; ++i) {
            let listener: HallListener = this.listeners[i];
            if (listener.event == event) {
                h.log.debug("dispatchEvent:", event, HallUtil.getClassName(listener.obj));
                listener.func(data);
                if (listener.times >= 1) {
                    --listener.times;
                }
            }
        }
        this.checkListeners();
    }

    checkListeners() {
        for (let i = this.listeners.length - 1; i >= 0; --i) {
            let listener: HallListener = this.listeners[i];
            if (listener.times == 0 || listener.obj.isRunning() == null) {
                h.log.debug("removeListener:", listener.event, HallUtil.getClassName(listener.obj));
                this.listeners.splice(i, 1);
            }
        }
    }

    removeListener(event: string, func: Function, obj: any) {
        let listener: HallListener = new HallListener(event, func, obj);
        for (let i = this.listeners.length - 1; i >= 0; --i) {
            let listenerTemp: HallListener = this.listeners[i];
            if (listenerTemp.equal(listener)) {
                h.log.debug("removeListener:", listener.event, HallUtil.getClassName(listener.obj));
                this.listeners.splice(i, 1);
                return;
            }
        }
    }
}
