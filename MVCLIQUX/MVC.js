//////////////////////////////////////////////////////////////////
/**
    MVC LIQUX:
    Library
    Initialize
    Qualify
    Update
    eXtra
*/
/* global L*/ //LIBRARY
let		m = {}  //MODEL
const	v = {}  //VIEW
const	c = {   //CONTROLLER (_IQUX)
  ////////////////////////////////////////////////////
  ///////////////////| INITIALIZE |///////////////////
  ////////////////////////////////////////////////////
  initialize(eventObject) {
    c.initializeModel(eventObject);
    window.id = `window`;
    document.id = `document`;
    L.attachAllElementsById(v);

    const eventTypes = [
      `click`, //start by listening only to click (as a test)
      /*
      `change`,
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
      */
    ];
    //Have the window object listen for every event listed in the eventTypes array:
    eventTypes.forEach( eventType => window.addEventListener(eventType, c.qualifyHandlers, true) );
    
    
  },
  async initializeModel(eventObject){
  //////////////////////////////////////////////////
  ///////////| define all meta events  |////////////
  //////////////////////////////////////////////////
    /*
      should first get MODEL.json from website.
        If it is not empty, retain it as the current state repo,
        and exit this method
        const modelJson = await fetch(`MODEL.json`)
        const MODEL = JSON.parse(modelJson)
        if(Object.keys(MODEL).length !== 0){
          m = MODEL
          return
        }
    */	
    ////////////////////////
    const modelResponse = await window.fetch(`MODEL.json`)
    const modelJson = await modelResponse.text()
    const MODEL = JSON.parse(modelJson)
    if(Object.keys(MODEL).length > 5){
      m = MODEL
      m.firstTime = true;
      m.stillPressed = false;           
      return
    }    
    ////////////////////////
    m.firstTime = true;
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
  //////////////////////////////////////////////////////////////
  ///////////| define data particular to this app:  |////////////
  //////////////////////////////////////////////////////////////

  },
  /////////////////////////////////////////////////////
  ///////////////////| QUALIFY |///////////////////////
  /////////////////////////////////////////////////////
  qualifyHandlers(eventObject){
    c.updateMetaEvents(eventObject)
    const handlerQualifiers = {
          setXYZ:  [m.source === v.testButton, m.type === `click`],
          /*
          setXXY: [m.source === null, m.type === ``],
          setXXZ: [m.source === null, m.type === ``],
          setXYX: [m.source === null, m.type === ``],
          setXYY: [m.source === null, m.type === ``],
          */
    };
    L.runQualifiedHandlers(handlerQualifiers, m, v, c);
  },  
  /////////////////////////////////////////////////////
  ///////////////////| UPDATE |////////////////////////
  /////////////////////////////////////////////////////
  setXYZ(m){},
  showXYZ(v){
    console.log(`time btween click events: ${m.timeBetweenEvents/1000} seconds`)
  },
  /*
  ////////////////
  setXYZ(m){},
  showXYZ(v){},
  ////////////////
  setXYZ(m){},
  showXYZ(v){},
  ////////////////
  setXYZ(m){},
  showXYZ(v){},
  ////////////////
  setXYZ(m){},
  showXYZ(v){},
  ////////////////
  setXYZ(m){},
  showXYZ(v){},
  */  
  updateMetaEvents(eventObject){
    let currentTime = Date.now()
    m.timeBetweenEvents = currentTime - m.eventTime //time interval between prior event and this one
    m.eventTime = currentTime 
    
    if(m.firstTime){
      m.timeBetweenEvents = 0
      m.firstTime = false
    }

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
    //m.historyType = [`noType`,`noType`,`noType`,`noType`];
    m.historyType.unshift(m.type);
    m.historyType.pop();

    //save current and prior three sources of events, four deep (or as deep as you like)
    //m.historyId = [`noId`,`noId`,`noId`,`noId`];
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
  },
  /////////////////////////////////////////////////////
  ///////////////////| eXTRA |/////////////////////////
  /////////////////////////////////////////////////////  
  saveModel(m){
    const modelSaver = new XMLHttpRequest()
    modelSaver.open(`POST`, `saveModel.php`)
    modelSaver.setRequestHeader(`FILENAME`,`MODEL.json`)
    modelSaver.send(JSON.stringify(m))
    /////
    modelSaver.onload = function(){
      if(modelSaver.status !== 200){
        console.log('Trouble saving model')
      }
    }
    /////
    modelSaver.onerror = function(){
              console.log('Trouble connecting to server when saving model')
    }
  },
}//======| END of CONTROLLER |=======//
//////////////////////////////////////////////////////////////////
