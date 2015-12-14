import {Injectable, Observable} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';

@Injectable()
export class MapServices {

	mapRoot:string = '/assets/data/maps/';

	constructor(public http:Http) {

	}

	loadMap(mapfile:string) : Observable<any> {
		let url = this.mapRoot + mapfile;

		var obs = this.http.get(url)
				.map((response:Response) => response.json());

		return obs;
	}

	getBoundsOfFeatures(features:any[]) : [[number,number], [number,number]] {

        let gbounds: [[number,number],[number,number]];

        for (var i = 0; i < features.length; ++i) {
            var feature = features[i];
            var bounds = d3.geo.bounds(feature);

            var minLng = bounds[0][0];
            var minLat = bounds[0][1];
            var maxLng = bounds[1][0];
            var maxLat = bounds[1][1];

			if (!gbounds) {
				gbounds = [
					[minLng, minLat],
					[maxLng, maxLat]
				];
			} else {

				if (minLng < gbounds[0][0])
					gbounds[0][0] = minLng;
				if (minLat < gbounds[0][1])
					gbounds[0][1] = minLat;
				if (maxLng > gbounds[1][0])
					gbounds[1][0] = maxLng;
				if (maxLat > gbounds[1][1])
					gbounds[1][1] = maxLat;
			}
        }
        return gbounds;
    }
}
