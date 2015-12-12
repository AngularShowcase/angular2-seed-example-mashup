import {Directive, ElementRef, Renderer} from 'angular2/angular2';

export interface ITreeNode {
	id: number;
	text: string;
	left: ITreeNode;
	right: ITreeNode;
};

export interface IRenderInfo {
	totalUsed: number;
	nodeCenter: number[];
	heightUsed: number;
}

@Directive({
	selector: '[tree-display]',		// Not sure why you need to put it in brackets
	inputs: ['tree',
		'maxLevels:max-levels',
		'leftLabel:left-label',
		'rightLabel:right-label',
		'canvasBackgroundColor:canvas-background-color',
		'nodeColor:node-color',
		'nodeLabelColor:node-label-color',
		'connectorColor:connector-color',
		'connectorLabelColor:connector-label-color'
				],
	host: {
		'(click)': 'onClick($event)',
		'(load)': 'onLoad($event)',
		'(unload)': 'onUnload($event)'
	}
})
export class TreeDisplay {

	_maxLevels: number = 3;
	extraRoom: number = 20;
	_tree: ITreeNode;
	svg: d3.Selection<any>;
	circleRadius: number = 35;
	levelHeight: number = 3 * this.circleRadius;
	horizontalPadding: number = 0;
	nodeGroup: d3.Selection<any>;
	connectorGroup: d3.Selection<any>;
	leftLabel: string = 'Left';
	rightLabel: string = 'Right';
	_canvasBackgroundColor = 'black';
	_nodeColor = 'white';
	_nodeLabelColor = 'white';
	_connectorColor = 'brown';
	_connectorLabelColor = 'tan';
	_showLevels: boolean = true;
	_levelDisplayOffset: number = 20;

	get tree(): ITreeNode {
		return this._tree;
	}

	set tree(val: ITreeNode) {
		this._tree = val;
		this.renderTree();
	}

	get showLevels(): boolean {
		return this._showLevels;
	}

	set showLevels(val: boolean) {
		if (this._showLevels !== val) {
			this._showLevels = val;
			this.renderTree();
		}
	}

	get maxLevels(): number {
		return this._maxLevels;
	}

	set maxLevels(val: number) {
		if (val !== this._maxLevels) {
			this._maxLevels = val;
			this.renderTree();
		}
	}

	get canvasBackgroundColor() { return this._canvasBackgroundColor; }
	set canvasBackgroundColor(val: string) {
		if (val !== this._canvasBackgroundColor) {
			this._canvasBackgroundColor = val;
			this.renderTree();
		}
	}

	get nodeColor() { return this._nodeColor; }
	set nodeColor(val: string) {
		if (this._nodeColor !== val) {
			this._nodeColor = val;
			this.renderTree();
		}
	}

	get nodeLabelColor() { return this._nodeLabelColor; }
	set nodeLabelColor(val: string) {
		if (this._nodeLabelColor !== val) {
			this._nodeLabelColor = val;
			this.renderTree();
		}
	}

	get connectorColor() { return this._connectorColor; }
	set connectorColor(val: string) {
		if (this._connectorColor !== val) {
			this._connectorColor = val;
			this.renderTree();
		}
	}

	get connectorLabelColor() { return this._connectorLabelColor; }
	set connectorLabelColor(val: string) {
		if (this._connectorLabelColor !== val) {
			this._connectorLabelColor = val;
			this.renderTree();
		}
	}

	constructor(public _element: ElementRef, public _renderer: Renderer) {
		console.log('Directive TreeDisplay constructed.');
		var root = d3.select(this._element.nativeElement);
		root.selectAll('svg').remove();
	}

	onLoad($event) {
		console.log('onLoad for ', $event);
	}

	onUnload($event) {
		console.log('onUnload for ', $event);
	}

	onClick($event) {
		console.log('click for ', $event);
	}

	renderTree() {
		if (!this.tree) {
			return;
		}
		if (!this.svg) {
			this.svg = this.svg = d3.select(this._element.nativeElement).append('svg');
		}

		this.svg.style({
			'background-color': this.canvasBackgroundColor
		});

		this.svg.selectAll('*').remove();
		this.connectorGroup = this.svg.append('g');
		this.nodeGroup = this.svg.append('g');
		var renderInfo = this.renderNode(this.tree, 0, 0);
		this.svg.attr({
			width: renderInfo.totalUsed + this.extraRoom,
			height: renderInfo.heightUsed + this.extraRoom
		});
	}

	drawNode(x: number, y: number, node: ITreeNode, level: number): d3.Selection<any> {
		//console.log(`Drawing node at ${x},${y}`);
		var circle = this.nodeGroup.append('circle')
			.datum(node)
			.attr({
				cx: x,
				cy: y,
				r: this.circleRadius,
				fill: this.nodeColor
			});

		this.svg.append('text')
			.attr({
				x: x,
				y: y,
				'text-anchor': 'middle',
				fill: this.nodeLabelColor
			})
			.style({
				'font-size': '9pt'
			})
			.text(node.text);

		if (this.showLevels) {
			this.svg.append('text')
				.attr({
					x: x,
					y: y + this._levelDisplayOffset,
					'text-anchor': 'middle',
					fill: this.nodeLabelColor
				})
				.style({
					'font-size': '7pt'
				})
				.text(level.toString());
		}

		circle.on('click', (node: ITreeNode) => {
			var path: string = this.getPathToNode(node);
			alert(path);
        });


		return circle;
	}

	// Returns total space used
	renderNode(node: ITreeNode, level: number, xStart: number): IRenderInfo {
		var renderInfo: IRenderInfo = {
			totalUsed: 0,
			heightUsed: 0,
			nodeCenter: [0, 0]
		};

		if (!node || level >= this.maxLevels) {
			return renderInfo;
		}

		var leftInfo = this.renderNode(node.left, level + 1, xStart);

		var x: number = xStart + leftInfo.totalUsed + this.horizontalPadding + this.circleRadius;
		var y: number = level * this.levelHeight + this.circleRadius;

		//console.log(`Drawing level ${level} ${node.text} at ${x},${y}`);
		this.drawNode(x, y, node, level + 1);

		var rightInfo = this.renderNode(node.right, level + 1, x + this.circleRadius + this.horizontalPadding);

		renderInfo.totalUsed = leftInfo.totalUsed + rightInfo.totalUsed + 2 * this.horizontalPadding + 2 * this.circleRadius;
		renderInfo.nodeCenter = [x, y];
		renderInfo.heightUsed = this.levelHeight + Math.max(leftInfo.heightUsed, rightInfo.heightUsed);
		this.connect(renderInfo, leftInfo, rightInfo);

		return renderInfo;
	}

	drawLine(from: number[], to: number[], connectorLabel: string): d3.Selection<any> {
		var x1 = from[0];
		var y1 = from[1];
		var x2 = to[0];
		var y2 = to[1];

		var line = this.connectorGroup.append('line')
			.style({
				'stroke-width': '4px',
				'stroke': this.connectorColor
			})
			.attr({
				class: 'connector',
				x1: x1,
				y1: y1,
				x2: x2,
				y2: y2
			});

		var xMid: number = (x1 + x2) / 2;
		var yMid: number = (y1 + y2) / 2;
		var radians: number;

		if (x1 === x2) {
			radians = Math.PI / 2;
		} else {
			var slope = (y1 - y2) / (x2 - x1);  //Remember that y values increase going down
			radians = Math.atan(slope);
		}

		var degrees = 180 * (radians / Math.PI);
		var rotation = -1 * degrees;
		var transformText = `translate(${xMid},${yMid})rotate(${rotation})translate(0,-5)`;

		this.connectorGroup.append('text')
			.attr({
				x: 0,
				y: 0,
				'text-anchor': 'middle',
				'transform': transformText,
				fill: this.connectorLabelColor
			})
			.style({
				'font-size': '12pt'
			})
			.text(connectorLabel);

		return line;
	}

	connect(node: IRenderInfo, leftChild: IRenderInfo, rightChild: IRenderInfo) {
		if (leftChild.totalUsed > 0) {
			this.drawLine(node.nodeCenter, leftChild.nodeCenter, this.leftLabel);
		}

		if (rightChild.totalUsed > 0) {
			this.drawLine(node.nodeCenter, rightChild.nodeCenter, this.rightLabel);
		}
	}

	getPathToNode(node: ITreeNode): string {
		var path: string = this.traverseFrom(this._tree, node, 1);
		return path;
	}

	traverseFrom(fromNode: ITreeNode, targetNode: ITreeNode, level: number) {

		if (fromNode.id === targetNode.id) {
			return this.numberPrefix(level, targetNode.text);
		}

		if (fromNode.left) {
			var leftPath = this.traverseFrom(fromNode.left, targetNode, level + 1);
			if (leftPath !== '') {
				return this.numberPrefix(level, fromNode.text) + ' (' + this.leftLabel + ')\n' + leftPath;
			}
		}

		if (fromNode.right) {
			var rightPath = this.traverseFrom(fromNode.right, targetNode, level + 1);
			if (rightPath !== '') {
				return this.numberPrefix(level, fromNode.text) + ' (' + this.rightLabel + ')\n' + rightPath;
			}
		}

		return '';
	}

	numberPrefix(num: number, text: string): string {
		return num.toString() + '. ' + text;
	}
}
