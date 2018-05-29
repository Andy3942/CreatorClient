/*
 * @Author: Suifeng 
 * @Date: 2018-01-13 21:40:58 
 * @Desc: 文件描述
 */

import { HallViewConfig } from "../config/HallViewConfig";
import { h } from "../common/H";
import { HallNetConfig } from "../net/HallNetConfig";
import { HallStringUtil } from "./HallStringUtil";

export class HallUIUtil {
    static adaptive(node: cc.Node, isRoot:boolean = false): void {
        if (isRoot){
            node.setContentSize(HallViewConfig.getScreenSize());
        }
        let name: string = node.name;
        if (name.startsWith("bgNode")) {
            let bgScale: cc.Vec2 = HallViewConfig.getBgScale();
            node.setScale(bgScale.x, bgScale.y);
        } else if (name.startsWith("uiNode")) {
            // let visibleSize: cc.Size = HallViewConfig.getUISize();
            // node.setContentSize(visibleSize);
            let children: cc.Node[] = node.children;
            let uiScale: number = HallViewConfig.getUIScale();
            let bgScale: cc.Vec2 = HallViewConfig.getUIBgScale();
            for (let i = 0; i < children.length; ++i) {
                let child: cc.Node = children[i];
                if (!child.name.startsWith("uiNode")) {
                    let btn: cc.Button = child.getComponent(cc.Button);
                    if (btn) {
                        btn.target = btn.target;
                        btn.normalColor = btn.normalColor;
                    }
                    let widget: cc.Widget = child.getComponent(cc.Widget);
                    if (widget) {
                        widget.bottom *= bgScale.y;
                        widget.top *= bgScale.y;
                        widget.left *= bgScale.x;
                        widget.right *= bgScale.x;
                        widget.horizontalCenter *= bgScale.x;
                        widget.verticalCenter *= bgScale.y;
                    }
                    let notModifyScale:boolean = false;
                    if(widget){
                        notModifyScale = widget.isAlignBottom && widget.bottom == 0 && widget.isAlignTop && widget.top == 0;
                        notModifyScale = notModifyScale ? notModifyScale:widget.isAlignLeft && widget.left == 0 && widget.isAlignRight && widget.right == 0;
                    }
                    if(!notModifyScale){
                        child.scale = uiScale;
                    }
                }
            }
        }
        let children: cc.Node[] = node.children;
        for (let i = 0; i < children.length; ++i) {
            let child: cc.Node = children[i];
            this.adaptive(child);
        }
    }

    // static bind(bindDatas: any, node: cc.Node, rootNode?: cc.Node) {
    //     rootNode = rootNode ? rootNode : node;
    //     for (let i = 0; i < node.children.length; ++i) {
    //         let child: cc.Node = node.children[i];
    //         let bindData: any = bindDatas[child.name];
    //         if (bindData) {
    //             rootNode[bindData.varName] = child;
    //             if (bindData.callback) {
    //                 child.on(cc.Node.EventType.TOUCH_END, function (event) {
    //                     h.audioManager.playSoundByName("anniu");
    //                     bindData.callback(event);
    //                 });
    //             }
    //         }
    //         this.bind(bindDatas, child, rootNode);
    //     }
    // }

    static bind(bindDatas: any, node: cc.Node, rootNode?: cc.Node) {
        rootNode = rootNode ? rootNode : node;
        for (let key in bindDatas) {
            let bindData: any = bindDatas[key];
            let bindNode: any = cc.find(key, node)
            if (bindNode) {
                rootNode[bindData.varName] = bindNode;
                if (bindData.callback) {
                    let button:cc.Button = bindNode.getComponent(cc.Button);
                    if(!button || button.transition == cc.Button.Transition.NONE){
                        bindNode.on(cc.Node.EventType.TOUCH_START, function(event){
                            event.target.runAction(cc.scaleTo(0.1, 1.2))
                        });
                        bindNode.on(cc.Node.EventType.TOUCH_END, function(event){
                            event.target.runAction(cc.scaleTo(0.1, 1));
                        });
                        bindNode.on(cc.Node.EventType.TOUCH_CANCEL, function(event){
                            event.target.runAction(cc.scaleTo(0.1, 1));
                        });
                    }

                    bindNode.on(cc.Node.EventType.TOUCH_END, function (event) {
                        // h.audioManager.playSoundByName("anniu");
                        bindData.callback(event);
                    });
                }
            }
        }
        for (let i = 0; i < node.children.length; ++i) {
            let child: cc.Node = node.children[i];
            this.bind(bindDatas, child, rootNode);
        }
    }

    /**
     * 创建按钮
     * titleString 按钮名称
     * bgAtlasPath atlas路径
     * bgSpritName 图片名称
     * callback 按钮回调
     * parentNode 显示按钮的父节点
     * pos 显示位置
     * 调用方式： cc.qp.util.createButton("准 被", "images/atlas/youxizhong", "zhuomian_button_anniu01", self.clckReady, cc.find("Canvas"), cc.v2(80,250));
     */
    static createButton(titleString, bgAtlasPath, bgSpritName, callback, parentNode) {
        //cc.loader.getRes("prefab/sheji/button_item",cc.Prefab);
        //取按钮预制体
        let buttonPrefab = h.resManager.getPrefabByName("prefab/sheji/ButtonItem");
        //取挂在按钮预制体上脚本
        let btnNode = cc.instantiate(buttonPrefab);
        //cc.qp.util.log("btnNode = " + btnNode);
        let buttonItem = btnNode.getComponent('buttonItem');
        //cc.qp.util.log("buttonItem = " + buttonItem);
        //调用按钮的初始化
        buttonItem.initButton(titleString, bgAtlasPath, bgSpritName, callback);
        //返回根据预制体生成的node
        btnNode.parent = parentNode;
        //btnNode.setPosition(pos.x,pos.y);
        return btnNode;
    }

    static urlSprite(url: string, node: cc.Node) {
        if (url && url != "") {
            if(!url.startsWith("http")){
                if(!url.startsWith("/")){
                    url = "/" + url;
                }
                url = HallNetConfig.hallURL + url;
            }
            h.log.debug("url===", url);
            cc.loader.load({ url: url, type: "png" }, function (error: Error, texture: cc.Texture2D) {
                if (error) {
                    h.log.debug(error.message);
                    return;
                }
                //let nodeTemp: cc.Node = new cc.Node();
                //nodeTemp.setContentSize(node.getContentSize());
                let sprite: cc.Sprite = node.getComponent(cc.Sprite);
                //sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                let frame = new cc.SpriteFrame(texture);
                sprite.spriteFrame = frame;
                //node.addChild(nodeTemp);
            }.bind(this));
        }
    }

    static getGPSDesc(ew, sn){
        var ewName = ew >= 0 ? "东" : "西";
        var snName = sn >= 0 ? "北" : "南";
        return HallStringUtil.format("{0}经 {1} {2}纬 {3}", ewName, ew, snName, sn);
    }

    static getCardSpriteFrame(card){
        return h.resManager.getSpriteFrame("image/card/card_" + card, true);
    }
}