/*global L*/
/*global m*/
/*global v*/
/*global c*/

c.qualifyFunctions = function(eventObject){
	let functionQualifiers = {
        testFooter: [m.source === v.testFooter, m.clicked],
        /*
        setXXY: [],
        setXXZ: [],
        setXYX: [],
        setXYY: [],
        */
	};
	L.runQualifiedFunctions(functionQualifiers, m, v, c);
};
///////////////
