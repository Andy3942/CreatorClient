/*
 * @Author: Suifeng 
 * @Date: 2018-01-31 23:11:13 
 * @Desc: 热更
 */

import { h } from "../common/H";

export let HallHotUpdateEvent = {
    UPDATE_PROGRESSION:"UPDATE_PROGRESSION",    // 更新进度
    ALREADY_UP_TO_DATE:"ALREADY_UP_TO_DATE",    // 已经是最新版本
    UPDATE_FINISHED:"UPDATE_FINISHED",          // 更新完成
    ERROR_UPDATING:"ERROR_UPDATING",            // 更新出错
    NEW_VERSION_FOUND:"NEW_VERSION_FOUND",      // 发现新版本
}

 export class HallHotUpdateManager {

    private customManifestStr = "";
    private manifestUrl: cc.RawAsset = null;
    private _updating = false;
    private _canRetry = false;
    private _storagePath = '';
    
    setManifestUrl(url){
        this.manifestUrl = url;
    }

    checkCb (event) {
        cc.log('Code: ' + event.getEventCode());
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                h.log.debug("No local manifest file found, hot update skipped.");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                h.log.debug("Fail to download manifest file, hot update skipped.");
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                h.log.debug("Already up to date with the latest remote version.");
                h.eventManager.dispatchEvent(HallHotUpdateEvent.ALREADY_UP_TO_DATE, {event:event});
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                h.log.debug('New version found, please try to update.haha');
                h.eventManager.dispatchEvent(HallHotUpdateEvent.NEW_VERSION_FOUND);
                this._updating = false;
                // this.hotUpdate();
                // this.panel.checkBtn.active = false;
                // this.panel.fileProgress.progress = 0;
                // this.panel.byteProgress.progress = 0;
                break;
            default:
                return;
        }
        
        cc.eventManager.removeListener(this._checkListener);
        this._checkListener = null;
        this._updating = false;
    }

    updateCb(event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                h.log.debug('No local manifest file found, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                // this.panel.byteProgress.progress = event.getPercent();
                // this.panel.fileProgress.progress = event.getPercentByFile();

                // this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                // this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();

                var msg = event.getMessage();
                if (msg) {
                    //this.panel.info.string = 'Updated file: ' + msg;
                    h.log.debug(event.getPercent()/100 + '% : ' + msg);
                }
                h.eventManager.dispatchEvent(HallHotUpdateEvent.UPDATE_PROGRESSION, {event:event})
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                h.log.debug('Fail to download manifest file, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                h.log.debug('Already up to date with the latest remote version.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                h.log.debug('Update finished. ' + event.getMessage());
                h.eventManager.dispatchEvent(HallHotUpdateEvent.UPDATE_FINISHED);
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                h.log.debug('Update failed. ' + event.getMessage());
                //this.panel.retryBtn.active = true;
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                h.log.debug('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                h.log.debug(event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            this._updating = false;
        }

        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    }

    loadCustomManifest () {
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            var manifest = new jsb.Manifest(this.customManifestStr, this._storagePath);
            this._am.loadLocalManifest(manifest, this._storagePath);
            h.log.debug('Using custom manifest');
        }
    }
    
    retry() {
        if (!this._updating && this._canRetry) {
            //this.panel.retryBtn.active = false;
            this._canRetry = false;
            
            h.log.debug('Retry failed Assets...');
            this._am.downloadFailedAssets();
        }
    }
    
    checkUpdate() {
        if (this._updating) {
            h.log.debug('Checking or updating ...');
            return;
        }
        h.log.debug("gege123===", this._am.getState())
        h.log.debug("123===", jsb.AssetsManager.State.UNINITED);
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            this._am.loadLocalManifest(this.manifestUrl);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            h.log.debug('Failed to load local manifest ...');
            return;
        }
        this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
        cc.eventManager.addListener(this._checkListener, 1);

        this._am.checkUpdate();
        this._updating = true;
    }

    hotUpdate() {
        if (this._am && !this._updating) {
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                this._am.loadLocalManifest(this.manifestUrl);
            }

            this._failCount = 0;
            this._am.update();
            // this.panel.updateBtn.active = false;
            this._updating = true;
        }
    }

    // use this for initialization
    constructor(){
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            return;
        }
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'update');
        cc.log('Storage path for remote asset : ' + this._storagePath);

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this.versionCompareHandle = function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            return parseInt(versionA) - parseInt(versionB);
            // var vA = versionA.split('.');
            // var vB = versionB.split('.');
            // for (var i = 0; i < vA.length; ++i) {
            //     var a = parseInt(vA[i]);
            //     var b = parseInt(vB[i] || 0);
            //     if (a === b) {
            //         continue;
            //     }
            //     else {
            //         return a - b;
            //     }
            // }
            // if (vB.length > vA.length) {
            //     return -1;
            // }
            // else {
            //     return 0;
            // }
        };

        // Init with empty manifest url for testing custom manifest
        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);
        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.retain();
        }

        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                h.log.debug( "Verification passed : " + relativePath);
                return true;
            }
            else {
                h.log.debug("Verification passed : " + relativePath + ' (' + expectedMD5 + ')');
                return true;
            }
        });

        h.log.debug('Hot update is ready, please check or directly update.');

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(2);
            h.log.debug("Max concurrent tasks count have been limited to 2");
        }
        
        //this.panel.fileProgress.progress = 0;
        //this.panel.byteProgress.progress = 0;
    }

    onDestroy() {
        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
        if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.release();
        }
    }
}
