/*
 * @Author: Suifeng 
 * @Date: 2018-01-15 13:52:08 
 * @Desc: ui管理者
 */

import { HallBaseView } from "../common/HallBaseView";
import { HallUtil } from "../util/HallUtil";
import { HallStringUtil } from "../util/HallStringUtil";
import { h } from "../common/H";

export class HallViewManager {

    private mainView: HallBaseView;
    private rootNode: cc.Node;

    private viewDatas: Array<{ view: HallBaseView }> = new Array();
    private signIndex: number = 0;

    constructor(){
        window.viewDatas = this.viewDatas;
    }

    setRootNode(node) {
        this.rootNode = node;
    }

    /**
     * 检查sign是否已经被占用
     * @param sign
     * @returns {boolean}
     */
    private hasSignInStack(sign: string): boolean {

        for (var key in this.viewDatas) {
            if (this.viewDatas[key].view.getSign() == sign) {
                return true;
            }
        }
        return false
    }

    /**
     * 在栈顶压入一个View，如果sign重复，将push不成功
     * @param view      新View
     * @returns {boolean}   成功返回true 否则返回false
     */
    public pushView(view: HallBaseView): boolean {
        let sign: string = view.getSign();
        if (sign == null) {
            sign = HallStringUtil.format("{0}_{1}", HallUtil.getClassName(view), ++this.signIndex);
            view.setSign(sign);
        }
        h.log.debug("pushView : " + sign);
        if (this.hasSignInStack(sign)) {
            h.log.fatal("The viewSign: " + sign + " is Duplicate in stack!");
            return false;
        }
        this.viewDatas.push({ view: view });
        this.rootNode.addChild(view);
        return true;
    }

    /**
     * 获取栈顶View
     * @returns {any}
     */
    public getTopView(): HallBaseView {
        var topViewData = this.getTopViewData();
        if (topViewData != null) {
            return topViewData.view;
        }
        return null;
    }

    /**
     * 获取栈顶信息
     * @returns {null}
     */
    public getTopViewData(): any {
        var topStack = null;
        if (this.viewDatas.length > 0) {
            topStack = this.viewDatas[this.viewDatas.length - 1];
        }
        return topStack;
    }

    /**
     * 弹出指定View
     * @param hasEvent 是否调用popToTopViewEvent事件 有时不需要调用
     */
    public removeView(view: HallBaseView): void {
        this.removeViewBySign(view.getSign());
    }

    removeViewBySign(sign: string): void {
        h.log.debug("removeSign", sign);
        let index: number = this.getIndexBySign(sign);
        this.removeViewByIndex(index);
    }

    removeViewByIndex(index: number) {
        if(!index){
            return;
        }
        let view: HallBaseView = this.viewDatas[index].view;
        view.removeFromParent();
        this.viewDatas.splice(index, 1);
        h.eventManager.removeListenersByObj(view);
        h.log.debug("removeView : " + view.getSign())
        view.destroy();
    }

    private popView() {
        let viewData = this.viewDatas[this.viewDatas.length - 1];
        this.removeView(viewData.view);
    }


    /**
     * pop 出所有的view 回到rootView
     */
    public popToRootView(): void {
        this.popToIndexView(0);
    }

    public popToGameStartView(){
        this.popToSignView("gameStart");
    }

    public getGameStartView(){
        return this.getViewBySign("gameStart");
    }
    /**
     * pop 到指定的View
     * @param index
     */
    public popToIndexView(index: number): void {
        while (this.viewDatas.length > index) {
            this.popView();
        }
    }

    /**
     * pop 到指定的view     filled by yangrui
     * @param viewSign
     */
    public popToSignView(viewSign: string): void {
        var isFind: boolean = false;
        for (var index in this.viewDatas) {
            if (this.viewDatas[index].view.getSign() == viewSign) {
                isFind = true;
                this.popToIndexView(<number><any>index);
                break;
            }
        }
        if (!isFind) {
            h.log.fatal("can not find sign:" + <number><any>viewSign + " in viewStack!!!");
        }
    }

    /**
     * pop 到 第一个view     filled by yangrui
     */
    public popToFirstView(): void {
        while (this.viewDatas.length > 1) {
            this.popView();
        }
    }

    /**
     * 通过 sign 获取对应的View
     * @param viewSign
     * @returns {any}
     */
    public getViewBySign(viewSign: string): any {
        var index = this.getIndexBySign(viewSign);
        if (index != null) {
            return this.viewDatas[index].view;
        }
        return null;
    }

    /**
     * 获取 sign 对应的 Index
     * @param viewSign
     * @returns {any}
     */
    private getIndexBySign(viewSign: string): number {
        for (var index in this.viewDatas) {
            if (this.viewDatas[index].view.getSign() == viewSign) {
                return <number><any>index;
            }
        }
        return null;
    }
}