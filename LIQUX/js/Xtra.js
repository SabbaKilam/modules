/*global albumArt*/
/*global L*/
/*global m*/
/*global v*/
/*global c*/

c.not = (x) => !x;
c.log = (...args) => console.log.apply(null,args);
///////////////| music player methods |///////////////////////
c.setMusicSource = (source) => v.player.src = source;
c.play = () => v.player.play();
c.pause = () => v.player.pause();
c.mute = (boolean )=> v.player.muted = boolean;
c.getTime = () => v.player.currentTime;
c.setTime = (time) => v.player.currentTime = time; //in milliseconds
c.setVolume = (volume) => v.player.volume = volume;
c.getVolume = () => v.player.volume;
c.getDuration = () => v.player.duration;
c.durationOk = () => c.not( m.badDurationStates.includes(c.getDuration()) );  
c.getPaused = () => v.player.paused;
////////////////////////////////	
c.closeMenu = ()=>{
  m.menuOpen = false;
  c.showToggleMenu(v)  ;
};
////////////////////////////////
//sometimes a non-event needs to call a set-show pair of functions:
c.setAndShow = function(suffix, namespace = this){
	if(typeof suffix !== `string`){
		c.log(`For c.setAndShow(suffix), suffix needs to be a string.`);
		return;
	}
	//set the first letter of suffix to uppercase
	suffix = suffix.charAt(0).toUpperCase() + suffix.slice(1);
	const setFuntionName =    `set${suffix}`;
	const showFunctionName =  `show${suffix}`;
	namespace[setFuntionName](m);
	namespace[showFunctionName](v);
};
/////////////////////////////////////////////////////
c.getArt = async function(artist){
  let returnUrl = false  
  let result = await albumArt( artist )
   if(!result.message){
     returnUrl = result
     console.log(result)
   }
  return returnUrl
}
//////////////////////////////////////////
