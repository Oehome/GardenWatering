/*

Starten der Beregnung für den Seitenstreifen
Wichtig: Vor der Beregnung müssen die Rolladen an der Hausseite
geschlossen werden, sonst gibt es Wasserflecken und Ärger.

*/

var ID_VENTIL_SEITE     ='hm-rpc.1.XXXXXXXXXXXXX.STATE';
var ID_ROLLADE1         ='hm-rpc.0.XXXXXXXXXX.1.LEVEL'/*Esszimmer SV*/;
var ID_ROLLADE2         ='hm-rpc.0.XXXXXXXXXX.1.LEVEL'/*Wohnzimmer SV*/;


var ID_BEREGNUNGSDAUER  ='Beregnung.0.Seite.Beregnungsdauer';
var ID_BEREGNUNGSDAUER_AKTUELL = 'Beregnung.0.Seite.AktuelleBeregnungsdauer'/*aktuelleBeregnungsDauer*/ ;
var ID_ZEIT             ='Beregnung.0.Seite.startBeregnung';
var ID_AUTOMATIC        ='Beregnung.0.Seite.Automatik';
var ID_MANSTART         = 'Beregnung.0.Seite.manStart';
var logging             = true;
var raum                = 'Aussenbereich';
var colour              = 'gold';
const sname=" ("+name.substr(10)+")";

setze_startzeit();

schedule({astro: "sunset", shift: -getState(ID_BEREGNUNGSDAUER).val}, function (obj) {
  if (getState(ID_AUTOMATIC).val===true) {
    tolog(logging,"Automatische Beregnung Seite ist aktiv:");
    event("Automatische Beregnung Seite ist aktiv:"+sname,raum,colour);
    beregnungSeite(getState(ID_BEREGNUNGSDAUER).val);
    
  } else {
    tolog(logging,"Automatische Beregnung Seite ist inaktiv, beende Beregnbung Seite");
    event("Automatische Beregnung Seite ist inaktiv, beende Beregnbung Rasen"+sname,raum,colour);
  } 
});

schedule("1 2 * * *", function () {
    setze_startzeit();
});

on({id: ID_BEREGNUNGSDAUER, change: "any"}, function (obj) {
  setze_startzeit
});

on({id: ID_MANSTART, change: "any"}, function (obj) {
  var value = obj.state.val;
  if (value === true ) {
        tolog(logging,"Manuelle Beregnung Seite ist aktiv:");
        event("Automatische Beregnung Seite ist aktiv:"+sname,raum,colour);
        beregnungSeite(getState(ID_BEREGNUNGSDAUER).val);
        setState(ID_MANSTART,false);
  }
});


function setze_startzeit () {
    var beregnungsdauerSeite=getState(ID_BEREGNUNGSDAUER).val;
    var zeit=formatDate(getAstroDate("sunset").getTime()-(1000*60*beregnungsdauerSeite),"hh:mm");
    event("Setze Startzeit fuer "+ID_ZEIT+" auf: "+zeit+ ' Uhr'+sname,raum,colour);  
    setState(ID_ZEIT,zeit);
  };


function beregnungSeite (beregnungsDauer) {
    tolog(logging,"Start Beregung Seite fuer "+beregnungsDauer+" min");
    event("Start Beregung Seite fuer "+beregnungsDauer+" min"+sname,raum,colour);
    var delayRolladen=20*1000;
    var delayRegnerAn=delayRolladen;
    var delayRegnerAus=delayRegnerAn+(1000*60*beregnungsDauer);
    
    // Rolladen runter
    tolog(logging,"Fahre Rolladen Runter");
    var idnam=getObject(ID_ROLLADE1).common.name;
    event("Fahre Rollade "+idnam+" runter"+sname,raum,colour);
    setState(ID_ROLLADE1,0);
    
    idnam=getObject(ID_ROLLADE2).common.name;
    event("Fahre Rollade "+idnam+" runter"+sname,raum,colour);
    setStateDelayed(ID_ROLLADE2,0,500);
    
   
    // Öffnen des Ventils
    setTimeout(function() {
        tolog(logging,"Oeffne Beregnungsventile fuer "+beregnungsDauer+" min");
        setState(ID_VENTIL_SEITE,true);
    }, delayRegnerAn);
    
    // Schliessen der Seitesprenger Ventile, Hochfahren der Rolladen nicht notwendig da nach Sonnenuntergang
    setTimeout(function() {
        var idnam=getObject(ID_VENTIL_SEITE).common.name;
        tolog(logging,"Schliesse Beregnungsventil");
        event("Schliesse Beregnungsventil "+idnam+sname,raum,colour);
        setState(ID_VENTIL_SEITE,false);
        tolog(logging,"Ende Beregung Seite");
        event("Ende Beregung Seite"+sname,raum,colour);
    }, delayRegnerAus);

}
