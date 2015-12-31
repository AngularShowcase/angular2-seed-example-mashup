export interface IWeatherUpdate {
	city: string;
	lnglat: [number, number];
	time: Date;
	tempFarenheit: number;
}
