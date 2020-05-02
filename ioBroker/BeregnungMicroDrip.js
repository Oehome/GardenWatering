/*

Starten der Beregnung für das Microdrip System

*/

var ID_VENTIL_HUETTE             = 'hm-rpc.0.XXXXXXXXXX.1.STATE';
var ID_BEREGNUNGSDAUER           = 'Beregnung.0.Tropfer.Beregnungsdauer';
var ID_BEREGNUNGSDAUER_AKTUELL   = 'Beregnung.0.Tropfer.AktuelleBeregnungsdauer'/*aktuelleBeregnungsDauer*/;
var ID_ZEIT                      = 'Beregnung.0.Tropfer.startBeregnung';
var ID_AUTOMATIC                 = 'Beregnung.0.Tropfer.Automatik';
var logging=true;
var raum                         = 'Aussenbereich';
var colour                       = 'gold';
const sname=" ("+name.substr(10)+")";


setze_startzeit();

// Beregnung soll vor der Beregnung der Seite starten, da sonst der Druck der Gartenpumpe nicht ausreicht

schedule({astro: "sunset", shift: -(getState(ID_BEREGNUNGSDAUER).val+getState('Beregnung.0.Seite.Beregnungsdauer').val)}, function (obj) {
  if (getState(ID_AUTOMATIC).val===true) {
    tolog(logging,"Automatische Beregnung Tropfer ist aktiv:");
    event("Automatische Beregnung Tropfer ist aktiv:"+sname,raum,colour);
    beregnungTropfer(getState(ID_BEREGNUNGSDAUER).val);
  } else {
    tolog(logging,"Automatische Beregnung Tropfer ist inaktiv, beende Beregnbung Seite");
    event("Automatische Beregnung Rasen ist inaktiv, beende Beregnbung MicroDrip"+sname,raum,colour);
  } 
    
});

schedule("1 2 * * *", function () {
  setze_startzeit();
});

on({id: ID_BEREGNUNGSDAUER, change: "any"}, function (obj) {
  setze_startzeit();
});

function beregnungTropfer (beregnungsDauer) {
    
    tolog(logging,"Start Beregung Tropfer fuer "+beregnungsDauer+" min");
    event("Start Beregung Tropfer fuer "+beregnungsDauer+" min"+sname,raum,colour);
    var delayRegnerAus=1000*60*beregnungsDauer;
    
    tolog(logging,"Oeffne Beregnungsventile fuer "+beregnungsDauer+" min");
    var idnam=getObject(ID_VENTIL_HUETTE).common.name;
    event("Oeffne Ventil "+idnam+" fuer "+getState(ID_BEREGNUNGSDAUER).val+" min"+sname,raum,colour);
    setState(ID_VENTIL_HUETTE,true);
    
    // Schliessen des Ventils
    setTimeout(function() {
        tolog(logging,"Schliesse Beregnungsventil");
        var idnam=getObject(ID_VENTIL_HUETTE).common.name;
        event("Schliesse Ventil "+idnam+sname,raum,colour);
        setState(ID_VENTIL_HUETTE,false);
        tolog(logging,"Ende Beregung Tropfer");
        event("Ende Beregung Tropfer"+sname,raum,colour);
    }, delayRegnerAus);

}

function setze_startzeit () {
  var beregnungsdauerTropfer=getState(ID_BEREGNUNGSDAUER).val;
  var zeit=formatDate(getAstroDate("sunset").getTime()-(1000*60*(getState('Beregnung.0.Seite.Beregnungsdauer').val+beregnungsdauerTropfer)),"hh:mm");
  event("Setze Startzeit fuer "+ID_ZEIT+" auf: "+zeit+" Uhr"+sname,raum,colour);    
  setState(ID_ZEIT,zeit);
};
