/**
  Author:  Abbas Abdulmalik
  Created: ~ May, 2017
  Revised: March 19, 2018 
  Original Filename: L.js 
  Purpose: a small (but growing) personal re-usable js library for a simple MVC architecture
  Notes: Now qualifyFunction helper doesn't return true for empty arrays (no vacuous truth)
         UploadFiles added.
         uploadFiles takes a callback -- progressReporter-- as it FIRST argument (parameter)
         to allow for an optional fourth parameter of an upload path for the server.
         progressReporter will be passed three arguments when called:
         1.) the amount of bytes uploaded so far
         2.) the total size of the file in bytes
         3.) the index of the file in the "array" of files being uploaded
         
      Added sortByExtension that alphabetizes an array of strings 'in place' by filename extension          
      Added arrayStringMatch that matches a collection of string arrays to a search string.
      Added loopCall as a 'better' version of setInterval
      Removed L.attributes. It's a reserved word: an object belonging to DOM elements
       Now it uses L.attribs
      Added L.loopCall.stop() so that user can easily stop L.loopCall
      Added L.symDiff for comparing arrays to determine their symmetric differnce = conjunctive union =
       exclusive-or
*/

var L = {}
L.styles = function(styleString){
  const colonPosition = styleString.indexOf(':')
  const property = styleString.slice(0, colonPosition)
  const value = styleString.slice(colonPosition + 1)
  this.style[property] = value
  
  return this.styles  
}

L.attribs = function(attributeString){
  const assignmentPosition = attributeString.indexOf('=')
  const attribute = attributeString.slice(0, assignmentPosition)
  const value = attributeString.slice(assignmentPosition + 1)
  this.setAttribute(attribute, value)
  
  return this.attribs
}

L.attachAllElementsById = function(here){
  let allElements = document.getElementsByTagName('*')
  let array = []
  array.forEach.call(allElements, function(element)  {
      if(element.id){
          here[element.id] = element
          element.styles = L.styles.bind(element) // attach L's styles() method here
          element.attribs = L.attribs.bind(element) // attach L's attribs() method here
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
    const isQualified = functionQualifiers[functionName].every( qualifier => qualifier) &&
                        !!functionQualifiers[functionName].length
    return isQualified
  }
  function runFunction(functionName){
    if(typeof object[functionName] === 'function'){
      object[functionName]()        
    }
   
    /*
      If the prefix of this function's name is 'set' (for updating the MODEL),
      and there is a similarly named function with a prefix of 'show' (for updating the VIEW),
      then run the 'show' version as well.
    */
    let prefix = functionName.slice(0,3)
    let newFunctionName = 'show' + functionName.slice(3)
    
    if(prefix === 'set' && typeof object[newFunctionName] === 'function'){
      object[newFunctionName]()
    }
  }
}

L.uploadFiles = function(progressReporter, fileElement, phpScriptName, uploadPath='uploads/'){
  const array = [] // make a real array to borrow it's forEach method
  array.forEach.call(fileElement.files, (file, index) => {
    const postman = new XMLHttpRequest() // make a file deliverer for each file
    const uploadObject = postman.upload // This object keeps track of upload progress
    const envelope = new FormData() // make a holder for the file's name and content
    envelope.stuff = envelope.append // give 'append' the nickname 'stuff'
    const reader = new FileReader() // make a file reader (the raw file element is useless)
    
    reader.readAsDataURL(file) // process the file's contents
    reader.onload = function(){ // when done ...
      const contents = reader.result // collect the result, and ...
      envelope.stuff('contents', contents) // place it in the envelope along with ...
      envelope.stuff('filename', file.name) // its filename
      envelope.stuff('path', uploadPath) // its upload path on the server
      
      postman.open(`POST`, phpScriptName)// open up a POST to the server's php script
      postman.send(envelope) // send the file
      
      //check when file loads and when there is an error
      postman.onload = eventObject => {
        postman.status !== 200 ? showMessage() : false
        //-----| helper |------//
        function showMessage(){
          const message = `Trouble with file: ${postman.status}`
          console.log(message)
          alert(message)
        }
      }
      
      postman.onerror = eventObject => {
        const message = `Trouble connecting to server`
        console.log(message)
        alert(message)
      }
      
      //invoke the callback for each upload progress report
      uploadObject.onprogress = function(progressObject){
        if(typeof progressReporter === 'function'){
          progressReporter(progressObject.loaded, progressObject.total, index)
        }
      }
    }
  })
}
//---------------------------------------------------------//
/**
  Given an array of strings (array), sorts the array 'in place' by filename EXTENSION,
  and returns a copy of the array as well. Since it mutates the array, it is decidedly not
  functionistic (but it functions).
*/
L.sortByExtension = function (array) {
  const type = {}.toString.call(array, null);
  if (type !== '[object Array]') {
    return array;
  }
  if (array.length === 0 || array.some(member => typeof member !== 'string')) {
    return array;
  }
  //-------------------------------------//
  let extension = ``;
  let nudeWord = ``;  
  array.forEach((m, i, a) => {
    if (m.lastIndexOf(`.`) !== -1) {
      //get the extension
      extension = m.slice(m.lastIndexOf(`.`) + 1);
      nudeWord = m.slice(0, m.lastIndexOf(`.`));
      a[i] = `${extension}.${nudeWord}`;
    }
  });
  
  array.sort();
  
  array.forEach((m, i, a) => {
    if (m.indexOf(`.`) !== -1){
      //get prefix (formerly the extension)
      extension = m.slice(0, m.indexOf(`.`))
      nudeWord = m.slice(m.indexOf(`.`) + 1)
      a[i] = `${nudeWord}.${extension}`
    }
  });
  
  const newArray = []
  array.forEach( m => newArray.push(m))
  
  return newArray;
}

L.arrayStringMatch = function(subString, arrayOfStringArrays){
  /**
  From an array of string arrays, return a possibly smaller array
  of only those string arrays whose member strings contain the given subString
  regardless of case.
     1. For arrayOfStringArrays, use the filter method (a function property of an array)
     that expects a function argument that operates on each array member
     2. Let's call the function argument 'match'
     3. 'match' should test each member array for a match of the substring as follows:
      a.) join the members strings together into a bigString that is lowerCased
      b.) lowerCase the subString
      c.) use indexOf to match substring to the bigString
      d.) return true for a match, otherwise return false
     4. the filter creates a new array after doing this.
     5. final step: return the new array that the filter produced 
  */
  //============================================================//
  return arrayOfStringArrays.filter(match)
  //-------| Helper function 'match' |---------//
  function match(memberArray){
    const bigString = memberArray.join(``).toLowerCase()
    const substringToMatch = subString.toLowerCase()
    return bigString.indexOf(substringToMatch) !== -1   
  }
}
//-------------------------------------------------//

/**
  L.loopCall can be used to replace setInterval, which has been somewhat discredited.
  See this blog post:
  https://dev.to/akanksha_9560/why-not-to-use-setinterval--2na9
  
  L.loopCall uses setTimeout recursively, which is a technique
  reportedly more reliabale than setInterval.  

  L.loopCall repeatedly calls (invokes) the callback function provided as its first argument.
  The first call is immediate, but subsequent calls are delayed by the milliseconds
  provided as the second argument. All additional arguments are optional
  to be used by the callback if required.
  
  If needed, you can delay the initial call as well,
  by having loopCall invoked by setTimeout using the same delay:
  
    setTimeout(L.loopCall, delay, callback, delay, arg1, arg2 ...)
    
    or the more readable, but more risky ...
    
    setTimeout("L.loopCall(callback, delay, arg1, arg2 ...)", delay) 
    //Doug Crockford would not be pleased  

  To stop the loop, the callback function can test some external state condition,
  (or test its own arguments, if they are passed by reference):
   
    if(externalStateCondition){
      L.loopCall.stop()
    }
*/
L.loopCall = function (callback, delay, ...args){
    L.loopCall.stopLoop = setTimeout(L.loopCall, delay, callback, delay, ...args)   
    callback(...args)
}

L.loopCall.stop = () => {
  clearTimeout(L.loopCall.stopLoop)  
}

/**
  Returns an array that is the "mathematical or logical" symmetric difference among or between
  any number of arrays provided as arguments (usually two). If the order of members is ignored
  (as is done for mathematical sets), the result acts as the the exclusive-or (XOR), also know as
  the disjunctive union. For the trivial cases of comparing one or two arrays, the result is
  not surprising: for one array, the result is itself: L.symDiff(A, []) =>  A ⊕ [] = A. 
  For two arrays, the result is an array that has only members which are not shared in common:
  L.symDiff(A, B) => A ⊕ B .
  When comparing more than two arrays, the result may ne surprising. The proper result can be verified 
  by comparing only two at a time: L.symDiff(A, B, C) => A ⊕ B ⊕ C = (A ⊕ B) ⊕ C
*/
L.symDiff = function symDiff(arrayA, arrayB){ // dummy paramters NOT referenced in body of the function
    var partialSymDiff = [],   
        argsArray = arguments
    ;
    //============THE CRUX=================
    return findSymDiff(partialSymDiff,0);
    //============UNDER THE HOOD===========
    function findSymDiff(partialSymDiff,index){
        if (argsArray[index] === undefined){
            return partialSymDiff;
        }
        else{
            partialSymDiff = sd(partialSymDiff, argsArray[index] );
            return findSymDiff( partialSymDiff, index + 1 );
        }
    }    
    //=====================================
    function sd(arrayI, arrayJ){
        var diff = [],
            blackList = [],
            i = 0,
            j = 0,
            maxI = arrayI.length,
            maxJ = arrayJ.length
        ;
        //-------------------------------------------------
        //1.) Combine the arrays into a third array.
        //2.) Find the matched elements and place them into a blacklist array.
        //3.) Pull blacklisted elements from the combined array.
        //4.) return the "reduced" combined array.
        //---------------------------------------------------
        // 1.) Combine the arrays into a third array.
        diff = arrayI.concat(arrayJ);        
        //---------------------------------------------------
        // 2.) Find the matched elements and place them into a blacklist array.
        for ( i=0; i < maxI; i++ ){
            for( j=0; j< maxJ; j++ ){
                if(arrayI[i] === arrayJ[j]){
                    blackList.push(arrayI[i] );
                }                
            }  
        }
        //----------------------------------------------------
        // 3.) Pull blacklisted elements from the combined array.
            diff = diff.filter( (element) => blackList.indexOf(element) === -1 )
        //----------------------------------------------------
        // 4.) return the "reduced" combined array.        
        return killDupes(diff);
    }
    //========================================================
    function killDupes(array){
        var kept = []; // Record of the "keepers"
        return array.filter(function(element){
            if ( kept.indexOf(element) === -1 ){ //if not already retained ...
                kept.push(element); // Record it as retained now, and...
                return true;  // allow this element to be kept (true)
            }
            else{
                return false; // otherwise, don't keep it (already kept)
            }
        });
    }      
};

