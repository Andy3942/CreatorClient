import HTTP_CODE = HallNetConfig.HTTP_CODE;
import { h } from "../common/H";
// Learn TypeScript:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/typescript/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

const { ccclass, property } = cc._decorator;

export var ListDirection = cc.Enum({
    VERTICAL: 0,
    HORIZONTAL: 1
})

@ccclass
export default class MyList extends cc.Component {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    topTip: cc.Node = null;
    @property(cc.Node)
    bottomTip: cc.Node = null;

    @property
    space: number = 0;

    @property({ type: ListDirection })
    direction = ListDirection.VERTICAL;

    _count = 0;
    _cellPositions: any[];
    _lastUpdateOffset: cc.Vec2;
    _content: cc.Node;
    _willRemovedCells: any;
    _cells: any;
    _handler: any;
    _viewSize: cc.Size;
    _startIndex: number;
    _endIndex: number;
    _cellOffset:cc.Vec2 = cc.v2(0, 0);
    _firstCellSize:cc.Size;

    onLoad() {
        this._content = this.scrollView.content;
        this.setDirection(this.direction);
    }

    setCellOffset(offset){
        this._cellOffset = offset;
    }

    setDirection(direction){
        this.direction = direction;
        if (this.direction == ListDirection.VERTICAL) {
            this.scrollView.content.setAnchorPoint(0.5, 1);
        } else {
            this.scrollView.content.setAnchorPoint(0.5, 1);
        }
    }
    
    start() {

    }

    update(dt) {
        if (!this.scrollView.isScrolling()) {
            for (var i in this._willRemovedCells) {
                var cell = this._cells[i];
                cell.removeFromParent();
                delete this._cells[i];
            }
            this._willRemovedCells = {};
        }
        var isUpdate = true;
        var curOffset = this._content.getPosition();
        if (this._lastUpdateOffset && cc.pDistance(this._lastUpdateOffset, curOffset) <= 2) {
            isUpdate = false;
        }
        
        
        if (isUpdate) {
            this._lastUpdateOffset = curOffset;
            this.updateCells();
        }
    }

    setHandler(handler) {
        this._handler = handler;
    }

    reloadData(isNotResetOffset) {
        for (var i in this._cells) {
            var cell = this._cells[i];
            cell.removeFromParent();
        }
        this._viewSize = this.scrollView.node.getContentSize();
        var view = cc.find("view", this.scrollView.node);
        view.setContentSize(this._viewSize);
        view.setPosition(0, 0);
        this._cells = {};
        this._willRemovedCells = {};
        this._startIndex = -1;
        this._endIndex = -1;
        this._count = this._handler("count", this);
        if (this._count <= 0) {
            return;
        }
        this.updateCellPositions();
        this.updateContentSize(isNotResetOffset);
        //this.updateCells();
        this._lastUpdateOffset = null;
    }
    updateCellPositions() {
        this._cellPositions = Array(this._count + 1).fill(0);
        var currentPos = 0;
        if (this.direction == ListDirection.VERTICAL) {
            currentPos = this._cellOffset.y;
        } else {
            currentPos = this._cellOffset.x;
        }
        var cellSize;
        for (var i = 0; i < this._count; ++i) {
            this._cellPositions[i] = currentPos;
            cellSize = this._handler("cellSize", this, i);
            if(!this._firstCellSize){
                this._firstCellSize = cellSize;
            }
            if (this.direction == ListDirection.VERTICAL) {
                currentPos += cellSize.height;
            } else {
                currentPos += cellSize.width;
            }
            currentPos += this.space;
        }
        this._cellPositions[this._count] = currentPos;
        // if(this.vertical){
        //     for(var i = 0; i < this._count; ++i){
        //         this._cellPositions[i] = currentPos - this._cellPositions[i + 1];
        //     }
        // }
    };
    updateContentSize(isNotResetOffset) {
        var size;
        var maxPosition = this._cellPositions[this._count] - this.space;
        if (this.direction == ListDirection.VERTICAL) {
            size = cc.size(this._viewSize.width, Math.max(maxPosition, this._viewSize.height));
            if(size.width < this._firstCellSize.width){
                size.width = this._firstCellSize.width;
            }
        } else {
            size = cc.size(Math.max(maxPosition, this._viewSize.width), this._viewSize.height);
            if(size.height < this._firstCellSize.height){
                size.height = this._firstCellSize.height;
            }
        }
        this.scrollView.content.setContentSize(size);
        if (!isNotResetOffset) {
            if (this.direction == ListDirection.VERTICAL) {
                this.scrollView.content.setPosition(0, this._viewSize.height * 0.5);
            } else {
                this.scrollView.content.setPosition(this.scrollView.content.width * 0.5 - this._viewSize.width * 0.5, this.scrollView.content.height * 0.5);
            }
        }
    }
    indexFromOffset(offset: cc.Vec2) {
        offset = cc.p(offset.x, offset.y);
        if (this.direction == ListDirection.VERTICAL) {
            offset.y = this._content.getContentSize().height - offset.y;
        }
        var low = 0;
        var high = this._count - 1;
        var search;
        if (this.direction == ListDirection.VERTICAL) {
            search = offset.y;
        } else {
            search = offset.x;
        }
        if (search <= this._cellPositions[low]) {
            return low;
        } else if (search >= this._cellPositions[high]) {
            return high;
        }
        while (high >= low) {
            var index = Math.floor(low + (high - low) * 0.5);
            var cellStart = this._cellPositions[index];
            var cellEnd = this._cellPositions[index + 1];
            if (search >= cellStart && search <= cellEnd) {
                return index;
            } else if (search < cellStart) {
                high = index - 1;
            } else {
                low = index + 1;
            }
        }
    }
    offsetFromIndex(index: number) {
        var offset;
        if (this.direction == ListDirection.VERTICAL) {
            offset = cc.p(0, this._cellPositions[index]);
            offset.y = this._content.height - offset.y - (this._cellPositions[index + 1] - this._cellPositions[index] - this.space);
        } else {
            offset = cc.p(this._cellPositions[index], 0);
        }
        return offset;
    }

    updateCells() {
        if (this._count <= 0) {
            return;
        }
        var startOffset = this.scrollView.getScrollOffset();
        startOffset.x = -startOffset.x;
        if (this.direction == ListDirection.VERTICAL) {
             startOffset = cc.p(0, this._content.getContentSize().height - this._content.getPositionY() + this._viewSize.height * 0.5);
         }
         // else {
        //     startOffset = cc.p(-this._content.getPositionX() - this._viewSize.width * 0.5, 0)
        // }
        var endOffset = cc.p(startOffset.x, startOffset.y);

        var startIndex;
        var endIndex;
        if (this.direction == ListDirection.VERTICAL) {
            endOffset.y = startOffset.y - this._viewSize.height;
            startIndex = this.indexFromOffset(startOffset);
            endIndex = this.indexFromOffset(endOffset);
        } else {
            endOffset.x += this._viewSize.width;
            startIndex = this.indexFromOffset(startOffset);
            endIndex = this.indexFromOffset(endOffset);
        }
        if (this._startIndex >= 0) {
            for (var i = this._startIndex; i < startIndex && i <= this._endIndex; ++i) {
                if (this._cells[i]) {
                    this._willRemovedCells[i] = true;
                }
            }
        }
        if (this._endIndex >= 0) {
            for (var i: number = endIndex; i <= this._endIndex && i >= this._startIndex; ++i) {
                if (this._cells[i]) {
                    this._willRemovedCells[i] = true;
                }
            }
        }
        this._startIndex = startIndex;
        this._endIndex = endIndex;
        for (var i: number = startIndex; i <= endIndex; ++i) {
            delete this._willRemovedCells[i];
            if (!this._cells[i]) {
                this.updateCellAtIndex(i);
            }
        }
    }
    updateCellAtIndex(index) {
        if (index < 0 || index >= this._count) {
            return;
        }
        delete this._willRemovedCells[index];
        var cell = this._cells[index];
        if (cell) {
            cell.removeFromParent();
        }
        cell = this._handler("cell", this, index);
        this._cells[index] = cell;
        this._content.addChild(cell);
        var listCell = cell.getComponent("ListCell");
        if (listCell) {
            listCell.setIndex(index);
        }
        var offset = this.offsetFromIndex(index)
        var delta = this._cellPositions[index + 1] - this._cellPositions[index] - this.space;
        if (this.direction == ListDirection.VERTICAL) {
            cell.setPosition(0, offset.y - this._content.getContentSize().height + delta * 0.5);
        } else {
            cell.setPosition(-this._content.width * 0.5 + offset.x + delta * 0.5, -this._content.height * 0.5);
        }
    }
}
