/* global L*/
let		m = {};
const	v = {};
const	c = {};

/////////////////////////////
c.initialize = async function(eventObject) {
	c.initializeModel(eventObject);

	window.id = `window`;
	document.id = `document`;

	L.attachAllElementsById(v);

	m.player = v.player;

	const eventTypes = [
		`change`,
		//`click`, //not good for some elements on Apple devices
		`dblclick`,
		`input`,
		`keydown`,
		`keyup`,
        `keypress`, //maybe the preferred key event
		`load`,
		`mousedown`,
		`mousemove`,
		`mouseout`,
		`mouseover`,
		`mouseup`,
		`offline`,
		`online`,
		`orientationchange`,
		`resize`,
		`touchend`,
		`touchmove`,
		`touchstart`,
		////| music player event types |/////
	    'playing',
	    'play',
	    'pause',
	    'volumechange',
	    'timeupdate',
	    'durationchange',
	    'ended', //etc.
	];
	//A clever way to have the window object listen for every event listed in the eventTypes array:
	eventTypes.forEach( eventType => window.addEventListener(eventType, c.updateMetaEvents, true) );

	c.updateMetaEvents(eventObject);
	
};
//////////////////////////////////////////////////////

c.initializeModel = function(eventObject){
	//define meta events
	m.stillPressed = false;
	m.eventTime = Date.now();
    m.timeBetweenEvents = 0;

	m.eventObject = eventObject;    //the event object itself
	m.source = eventObject.target;  //where the event took place
	m.type = eventObject.type;      //what the event was
	m.id = eventObject.target.id;   //the id of the element where the event occurred

	//Shortcuts to combine similar mobile and computer events
	m.pressed = m.type === `mousedown` || m.type === `touchstart`;
	if(m.pressed){
		m.stillPressed = true;
	}
	m.released = m.type === `mouseup` || m.type === `touchend`;
	if(m.released){
		m.stillPressed = false;
	}
	m.moved = m.type === `mousemove` || m.type === `touchmove`;
	m.resized = m.type === `resize` ||
				m.type === `orientationchange` ||
				m.type === `load` ||
				m.type === `DOMContentLoaded`;

	//save current and prior three event types, four deep (or as deep as you like)
	m.historyType = [`noType`,`noType`,`noType`,`noType`];
	m.historyType.unshift(m.type);
	m.historyType.pop();

	//save current and prior three sources of events, four deep (or as deep as you like)
	m.historyId = [`noId`,`noId`,`noId`,`noId`];
	m.historyId.unshift(m.id);
	m.historyId.pop();

	m.clientX = ((e)=>{
	    let x = 0;
	    e.changedTouches && e.changedTouches[0]
	      ? x = e.changedTouches[0].clientX
	      : x = e.clientX;
	    return x;
	})( m.eventObject);

	m.clientY = ((e)=>{
	    let x = 0;
	    e.changedTouches && e.changedTouches[0]
	      ? x = e.changedTouches[0].clientY
	      : x = e.clientY;
	    return x;
	})( m.eventObject);

	m.MIN_TIME = 25;	//milliseconds
	m.MAX_TIME = 1100;	//milliseconds

	m.clicked = m.timeBetweenEvents <= m.MAX_TIME &&
              m.timeBetweenEvents >= m.MIN_TIME &&
              m.released;

	m.startCoordinates = [0,0];
	m.startCoordinates = m.pressed
						? ( () => [m.clientX, m.clientY] )()
						: m.startCoordinates
	;
	//et cetera ....

//////////////////////////////////////////////////////
//////| State variables particular to this app |//////
//////////////////////////////////////////////////////

};
