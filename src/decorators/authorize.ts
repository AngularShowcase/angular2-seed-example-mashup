export function Authorize(options:any) {
	return function(cls:any) {
		console.log('Got class:', cls);
		console.log('Options:', options);
	};
}
