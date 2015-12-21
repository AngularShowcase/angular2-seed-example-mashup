///<reference path="../../tools/typings/tsd/d3/d3.d.ts" />
import {Directive, ElementRef, Renderer} from 'angular2/core';
import {MapServices} from '../services/MapServices';
import {IWeatherUpdate} from '../common/interfaces/WeatherInterfaces';
import {IAccident} from '../common/interfaces/TrafficInterfaces';

interface IState {
	state: string;
	lnglat: [number, number];
}

@Directive({
	selector: 'weather-map',		// Not sure why you need to put it in brackets
	providers: [MapServices],
	inputs: ['lastUpdate:lastupdate', 'lastAccident:lastaccident'],
	host: {
		'(click)': 'onClick($event)',
		'(load)': 'onLoad($event)',
		'(unload)': 'onUnload($event)'
	}
})
export class WeatherMap {

	states:Map<string, IState>;
	readyForUpdates: boolean;
	_lastUpdate:IWeatherUpdate;
    _lastAccident:IAccident;
    fadeTime = 2500;
    tempUpdateTime = 3000;

	get lastUpdate() : IWeatherUpdate {
		return this._lastUpdate;
	}

	set lastUpdate(val:IWeatherUpdate) {
		if (val.city && this.readyForUpdates) {
			this._lastUpdate = val;
			//console.log(`Weather map got an update for ${this._lastUpdate.city}.`);
			this.cityMap.set(val.city, val);
			this.updateCity(val);
		}
	}

    get lastAccident() : IAccident {
        return this._lastAccident;
    }

    set lastAccident(val:IAccident) {
        if (val.state && this.readyForUpdates) {
            this._lastAccident = val;
            this.reportAccident(val);
        }
    }

	cityMap:Map<string, IWeatherUpdate> = new Map<string, IWeatherUpdate>();

	svg: d3.Selection<any>;
	canvasBackgroundColor: string = 'teal';
	width: number = 1000;
	height: number = 600;
	mapData: any;
	lngScale:d3.scale.Linear<number,number>;
	latScale:d3.scale.Linear<number,number>;
	lineFun:d3.svg.Line<number>;

	// private palette0:string[] = ['rgb(215,48,39)','rgb(244,109,67)','rgb(253,174,97)',
	// 							 'rgb(254,224,144)','rgb(255,255,191)','rgb(224,243,248)',
	// 							 'rgb(171,217,233)','rgb(116,173,209)','rgb(69,117,180)'];

	private palette1:string[] = ['rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,144)',
							     'rgb(255,255,191)','rgb(224,243,248)','rgb(171,217,233)',
								 'rgb(116,173,209)'];

	constructor(public _element: ElementRef, public _renderer: Renderer, public mapServices:MapServices) {
		console.log('Directive WeatherMap constructed.');
		this.states = new Map<string, IState>();
		this.renderMap();
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

	renderMap() {
		let self = this;
		var root = d3.select(this._element.nativeElement);
		root.select('svg').remove();

		this.svg = root.append('svg');
		this.svg.attr({width: this.width, height: this.height});
		this.svg.style({border: '1px solid black'});
		this.svg.append('g').attr({id: 'map'});
		this.svg.append('g').attr({id: 'cities'});
        this.svg.append('g').attr({id: 'accidents'});

		this.mapServices.loadMap('us.json')
			.subscribe(mapData => self.plotMapData(mapData, ['Alaska','Hawaii', 'Puerto Rico']));
	}

	public plotMapData(mapData:any, excludedFeatures:string[]) {

		var self = this;

		this.mapData = mapData;

		this.mapData.features = _.filter(this.mapData.features,
									(f:any) => _.indexOf(excludedFeatures, f.properties.NAME) === -1);

		// For each state in the map, store a lnglat that is somewhere in the state
		_.each(this.mapData.features, (f:any) => {
			let stateName = f.properties.NAME;
			let lnglat = d3.geo.centroid(f);
			this.states.set(stateName, { state: stateName, lnglat: lnglat});
		});

		// this.states.forEach((state, stateName) => {
		// 	console.log(`State ${stateName} has object with name ${state.state} at ${state.lnglat}.`);
		// });

		var bounds = this.mapServices.getBoundsOfFeatures(this.mapData.features);

		// Assume the mins are in slot 0 and max are in slot 1 but swap if not
		var minLng = bounds[0][0];
		var minLat = bounds[0][1];
		var maxLng = bounds[1][0];
		var maxLat = bounds[1][1];

		//var padding = 30;
		var padding = 0;

		this.lngScale = d3.scale
			.linear()
			.domain([minLng, maxLng])
			.range([padding, this.width - padding]);

		this.latScale = d3.scale
			.linear()
			.domain([minLat, maxLat])
			.range([this.height - padding, padding]);

		var customProjection:d3.geo.Projection = function (lngLat) {
			var lng = lngLat[0];
			var lat = lngLat[1];
			var result = [self.lngScale(lng), self.latScale(lat)];
			return result;
		}.bind(this);

		//Define path generator
		var path = d3.geo.path()
			.projection(customProjection);

		this.svg.select('g#map').selectAll('path')
			.data(this.mapData.features)
			.enter()
			.append('path')
			.attr('d', path)
			.attr('fill', function(d,i) {
				return self.palette1[i % self.palette1.length];
			})
			.attr('stroke', 'black');

		this.readyForUpdates = true;
	}

	updateCity(update:IWeatherUpdate) {

		let x = this.lngScale(update.lnglat[0]);
		let y = this.latScale(update.lnglat[1]);

		if (x < 0) {
			x = 0;
		}

		if (x + 100 > this.width) {
			x -= 100;
		}

		let id = this.makeIdFromLngLat(update.lnglat);

		let cities = this.svg.select('g#cities');

		let city = cities.select(`g#${id}`);
		city.remove();

		city = cities.append('g').attr({id: id});

		city.append('text')
				.attr({
					x: x,
					y: y,
					'text-anchor': 'left',
					fill: 'black'
				})
				.text(update.city)
				.style({
					'font-size':'14pt',
					'font-weight': 'bold'
				});

		let temp = city.append('text')
				.attr({
					x: x,
					y: y + 30,
					'text-anchor': 'left',
					fill: 'red'
				})
				.text(`${update.tempFarenheit} deg.`)
				.style({
					'font-size': '24pt',
					'font-weight': 'bold'
				});

		temp.transition()
                .duration(this.tempUpdateTime)
				.attr({fill: 'black'})
				.style({
					'font-size' : '14pt',
					'font-weight' : 'normal'
				});
	}

    reportAccident(accident:IAccident) {
        //console.log(`Accident report at ${accident.time} in ${accident.state} at ${accident.time}.`);
        let state = accident.state;
        if (!this.states.has(state)) {
            console.log(`I don't know where to plot accident for state ${state}.`);
            return;
        }

        let lnglat = this.states.get(state).lnglat;
        // let message = `${accident.vehiclesInvolved} vehicle accident reported at ${accident.time} in ${accident.state}`;
		let x = this.lngScale(lnglat[0]);
		let y = this.latScale(lnglat[1]);

		let accidents = this.svg.select('g#accidents');

        let accidentGroup = accidents.append('g');

        accidentGroup.append('circle')
				.attr({
					cx: x,
					cy: y,
                    r: 25,
					fill: 'red'
				})
                .style({
                    opacity: 0.75
                });

        accidentGroup.append('text')
				.text(accident.vehiclesInvolved.toString())
                .attr({x: x,
                       y: y + 5,
                       fill: 'black',
                       'text-anchor': 'middle'
                 })
				.style({
                    opacity: 1,
					'font-size': '14pt',
					'font-weight': 'bold',
                    'color' : 'black'
				});

        accidentGroup.transition()
                    .duration(this.fadeTime)
                    .style({
                        opacity: 0
                    })
                    .each('end', () => {
                        accidentGroup.remove();
                    });
    }

	makeIdFromLngLat(lnglat:[number, number]) : string {
		let str1 = lnglat[0].toString().replace('.', '').replace('-', '');
		let str2 = lnglat[1].toString().replace('.', '').replace('-', '');

		return 'city_' + str1 + str2;
	}

	removeFeatureLabels() {
		var featureGroup = this.svg.select('g#featureLabels');
		featureGroup.remove();
    }

    drawFeatureLabels() {
		var self = this;
		var features = this.mapData.features;
		self.removeFeatureLabels();
		var featureGroup:d3.Selection<any> = self.svg.append('g').attr({id:'featureLabels'});
		for (var i = 0; i<features.length; ++i) {
			self.drawFeatureLabel(features[i], featureGroup);
		}
	}

	drawFeatureLabel(feature, featureGroup:d3.Selection<any>) {
		var featureName = feature.properties.NAME;
		var center;
		console.log('Adding label for feature ' + featureName);

		var bounds = d3.geo.bounds(feature);
		center = [(bounds[1][0] + bounds[0][0]) /2, (bounds[1][1] + bounds[0][1]) /2 ];

		//center = d3.geo.centroid(feature);

		var x = this.lngScale(center[0]);
		var y = this.latScale(center[1]);

		featureGroup.append('text')
			.attr({
				x: x,
				y: y,
				'text-anchor': 'middle',
				fill: 'black'
			})
			.text(featureName)
			.style({
				'font-size':'7pt',
				'font-weight': 'bold'
			});
	}
}
