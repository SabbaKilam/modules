/*
    Created: 2018-07-10
    Modified: N/A
    Purpose: Update the MVC,
    specifically the MODEL (state variables), and the VIEW (user's input and output)
*/
/*global L*/
/*global m*/
/*global v*/
/*global c*/
////////////////////////////
c.setXXX = function(m){}
c.showXXX = function(v){}
///////////////////////////
c.setXXY = function(m){}
c.showXXY = function(v){}
///////////////////////////
c.setXXZ = function(m){}
c.showXXZ = function(v){}
//////////////////
c.testFooter = function(){
	alert("LIQUX is ready")
}

////////////////////////////////////////////////////
///////////////| UPDATE META_EVENTS |///////////////
////////////////////////////////////////////////////
c.updateMetaEvents = function(eventObject){
	//define meta events
    let currentTime = Date.now()
    m.timeBetweenEvents = currentTime - m.eventTime
    m.eventTime = currentTime

	m.eventObject = eventObject    //the event object itself
	m.source = eventObject.target  //where the event took place
	m.type = eventObject.type      //what the event was
	m.id = eventObject.target.id   //the id of the element where the event occurred


	//Shortcuts to combine similar mobile and computer events
	m.pressed = m.type === `mousedown` || m.type === `touchstart`
	if(m.pressed){
		m.stillPressed = true
	}
	m.released = m.type === `mouseup` || m.type === `touchend`
	if(m.released){
		m.stillPressed = false
	}
	m.moved = m.type === `mousemove` || m.type === `touchmove`
	m.resized = m.type === `resize` ||
				m.type === `orientationchange` ||
				m.type === `load` ||
				m.type === `DOMContentLoaded`

	//update eventType history
	m.historyType.unshift(m.type)
	m.historyType.pop()

	//update Id history
	m.historyId.unshift(m.id)
	m.historyId.pop()

	// get mouse or touch positions
	m.clientX = ((e)=>{
		let x = 0;
		e.changedTouches && e.changedTouches[0]
		  ? x = e.changedTouches[0].clientX
		  : x = e.clientX
		return x
	})(m.eventObject)

	m.clientY = ((e)=>{
	    let x = 0;
	    e.changedTouches && e.changedTouches[0]
	      ? x = e.changedTouches[0].clientY
	      : x = e.clientY;
	    return x;
	})( m.eventObject);

	m.clicked = m.timeBetweenEvents <= m.MAX_TIME &&
              m.timeBetweenEvents >= m.MIN_TIME &&
              m.released

	//establish where on the screen a press starts (press means touchstart ot mousdown)
	m.startCoordinates = m.pressed ? ( () => [m.clientX, m.clientY] )() : m.startCoordinates

	//et cetera ....


	///////| NOW run c.designateFunction |//////
	c.qualifyFunctions(m.eventObject)
	///////////////////////////////////////////
}
