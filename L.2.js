/*
  Author:  Abbas Abdulmalik
  Created: ~ May, 2017
  Revised: August 14, 2017 
  Original Filename: L.js 
  Purpose: a small personal re-usable js library for a simple MVC architecture
  Notes: 
*/

var L = {}
L.styles = function(styleString){
  const colonPosition = styleString.indexOf(':');
  const property = styleString.slice(0, colonPosition)
  const value = styleString.slice(colonPosition + 1)
  this.style[property] = value
  
  return this.styles  
}

L.attachAllElementsById = function(here){
    let allElements = document.getElementsByTagName('*')
    let array = []
    array.forEach.call(allElements, function(element)  {
        if(element.id){
            here[element.id] = element
            element.styles = L.styles.bind(element) // attach L's styles() method here         
        }
    })
}

L.noPinchZoom = function(){
  window.ontouchstart = function(eventObject){
    if(eventObject.touches && eventObject.touches.length > 1){
      eventObject.preventDefault();
    }
  }  
}

L.runQualifiedMethods = function(functionQualifiers, object, runNextUpdate){
  Object
    .keys(functionQualifiers)
    .filter(qualifyFunction)
    .forEach(runFunction)
  if(typeof runNextUpdate === 'function'){runNextUpdate()}
  
  //-----| helpers |-----//
  function qualifyFunction(functionName){
    const isQualified = functionQualifiers[functionName].every( qualifier => qualifier)
    return isQualified
  }
  function runFunction(functionName){
    object[functionName]()    
    /*
      If the prefix of this function's name is 'set' (for updating the MODEL),
      and there is a similarly named function with a prefix of 'show' (for updating the VIEW),
      then run the 'show' version as well.
    */
    let prefix = functionName.slice(0,3)
    let newFunctionName = 'show' + functionName.slice(3)
    
    if(prefix === 'set' && object[newFunctionName]){
      object[newFunctionName]()
    }
  }
}

