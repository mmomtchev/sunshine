const SunCalc = require('suncalc');

const lat = process.argv[3] || 45.8131;
const lng = process.argv[4] || 6.2463;

const SLOPE_INCLINATION = Math.PI / 6;	// 30° slope

const slopes = {
	SLOPE_NORTH: 0,					// 0°
	SLOPE_SOUTH: Math.PI,			// 180°
	SLOPE_WEST: Math.PI * 3 / 2,	// 270°
	SLOPE_EAST: Math.PI / 2			// 90°
};

function sunInclinationCoefficient(elevation, azimuth, tilt, orientation) {
	if (elevation < 0)
		return 0;
	const r = Math.cos(elevation) * Math.sin(tilt) * Math.cos(orientation - azimuth) + Math.sin(elevation) * Math.cos(tilt);
	return Math.max(0, r);
}

const dateUTC = new Date(process.argv[2] || '2022-06-21');
const date = dateUTC.getTime() + dateUTC.getTimezoneOffset() * 60000;

console.log('date,time,north,south,east,west');
for (let time = date;
	time <= date + 24 * 3600 * 1000;
	time += 3600 * 1000) {

	const sunPos = SunCalc.getPosition(time, lat, lng);
	let sunShine = {};
	for (let i of ['SLOPE_NORTH', 'SLOPE_SOUTH', 'SLOPE_EAST', 'SLOPE_WEST'])
		sunShine[i] = sunInclinationCoefficient(sunPos.altitude, Math.PI + sunPos.azimuth, SLOPE_INCLINATION, slopes[i]);

	console.log(`${new Date(time).toLocaleDateString()},${new Date(time).getHours()}:00,${Object.keys(sunShine).map(k => sunShine[k]).join(',')}`);
}
