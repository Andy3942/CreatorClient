/*
 * @Author: Suifeng 
 * @Date: 2018-01-15 12:03:30 
 * @Desc: 显示配置
 */

export class HallViewConfig {
    private static designSize: cc.Size = cc.size(1280, 720);
    private static bgScale: cc.Vec2 = null;
    private static UIScale: number = null;
    private static uiSize:cc.Size = null;
    private static uiBgScale:cc.Vec2 = null;
    private static screenSize:cc.Size = null;
    private static hallSearchPath:string = "game/hall/";
    private static searchPath:string = HallViewConfig.hallSearchPath;

    static getDesignSize(): cc.Size {
        return this.designSize;
    }

    static getBgScale(): cc.Vec2 {
        if (!this.bgScale) {
            let visibleSize: cc.Size = cc.director.getVisibleSize();
            let scaleX: number = visibleSize.width / this.designSize.width;
            let scaleY: number = visibleSize.height / this.designSize.height;
            this.bgScale = new cc.Vec2(scaleX, scaleY);
        }
        return this.bgScale;
    }

    static getScreenSize():cc.Size {
        if(!this.screenSize){
            this.screenSize = cc.director.getVisibleSize();
        }
        return this.screenSize;
    }

    static getUISize():cc.Size{
        if(!this.uiSize){
            let visibleSize = cc.director.getVisibleSize();
            this.uiSize = visibleSize;
            // this.uiSize.width -= 120;
        }
        return this.uiSize;
    }

    static getUIBgScale(){
        if (!this.uiBgScale) {
            let uiSize: cc.Size = this.getUISize();
            let scaleX: number = uiSize.width / this.designSize.width;
            let scaleY: number = uiSize.height / this.designSize.height;
            this.uiBgScale= new cc.Vec2(scaleX, scaleY);
        }
        return this.uiBgScale;
    }

    static getUIScale(): number {
        if (!this.UIScale) {
            let bgScale: cc.Vec2 = this.getUIBgScale();
            this.UIScale = Math.min(bgScale.x, bgScale.y);
        }
        return this.UIScale;
    }

    static getSearchPath():string {
        return this.searchPath;
    }

    static getHallSearchPath():string {
        return this.hallSearchPath;
    }

    static setSearchPath(path:string){
        this.searchPath = path;
    }

    static resetSearchPath(){
        this.searchPath = this.hallSearchPath;
    }
}