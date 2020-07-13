/*

Berecnet das Offset vor Sonnenuntergang und startet
bei Änderungen das Programm Beregnungssteuerung neu

*/

const logging=true
const objpfad='Beregnung.0.'
const ID_AKTIVE_BEREGNUNGEN=objpfad+".aktiveBeregnungen"
const ventile=["VentilRasenL","VentilRasenR","VentilTropfer","VentilSeite","VentilTest"]
const idRefresh='Beregnung.0.refreshDisplay'
const ID_SCRIPT='javascript.2.scriptEnabled.Beregnung.BeregnungsSteuerung'

/* 
Beim starten sollten alle Subscriptions erstellt.
Gleichzeitug wird ein array mit den id`s 
*/

let ventilIds=[]
for (let name of ventile) {
    ventilIds.push(getState(objpfad+name+".id").val)
    setzeStartEndZeiten(name)
}

/*
Neuberechnung der Startzeit jeden Morgen und
wenn sich Beregnungsdauer oder Zeit vor
Sonnenuntergnag geändert haben
*/



on ({id: /\.Beregnungsdauer/, change: 'any'}, function(obj) {
    let name=obj.id.split(".")[2];
    tolog(logging,"Beregnungsdauer  von: "+name+" wurde geändert")
    setzeStartEndZeiten(name)
    setStateDelayed(idRefresh,true,1000)
})

/* 
Ändern sich Startzeiten oder Beregnungsdauer wird
das Steuerungsscript neu gestartet
*/

on ({id: /minutenVorSonnenuntergang/, change: 'ne'}, function(obj) {
    let name=obj.id.split(".")[2];
    tolog(logging,"Zeitintervall vor Sonnenuntergang: "+name+" wurde geändert")
    setzeStartEndZeiten(name)
    setStateDelayed(idRefresh,true,1000)
    setState(ID_SCRIPT,false)
    setStateDelayed(ID_SCRIPT,true,1000)
})


/*
 Setzen des Timers anhand des Sonnenuntergangs, Beregnungsdauer und Start-Differenz
*/

function setzeStartEndZeiten(name) {
    tolog(logging,"Function: setStartTime param: "+name)
    const ID_STARTBEREGNUNG   = objpfad+name+'.startBeregnung'
    const ID_ENDEBEREGNUNG    = objpfad+name+'.endeBeregnung'
    const ID_BEREGNUNGSDAUER = objpfad+name+'.Beregnungsdauer'
    const beregnungsdauer=getState(ID_BEREGNUNGSDAUER).val
    const offset=getState(objpfad+name+".minutenVorSonnenuntergang").val
    tolog(logging,"offset: "+offset)

    let today=new Date();

    // fürs testen
    let zeit = getAstroDate('sunset')
    let sonnenUntergang=zweiStellig(zeit.getHours(),zeit.getMinutes() )
    tolog(logging,"Sonnenuntergang "+name+": "+sonnenUntergang)
    
    // Startzeitpunkt ist sonnenuntergang + offset
    zeit = getAstroDate('sunset', today, (-1)*offset)
    let startzeit=zweiStellig(zeit.getHours(),zeit.getMinutes() )
    tolog(logging,"Setze Start Beregnung "+name+": "+startzeit)
    setState(ID_STARTBEREGNUNG,startzeit,true)
    
     // Endzeitpunkt ist sonnenuntergang + offset - beregnunsdauer
    zeit = getAstroDate('sunset', today, (-1)*offset+beregnungsdauer)
    let stopzeit=zweiStellig(zeit.getHours(),zeit.getMinutes() )
    tolog(logging,"Setze Ende Beregnung "+name+": "+stopzeit)
    setState(ID_ENDEBEREGNUNG,stopzeit,true)
    
    
}


function zweiStellig (hour,minutes) {
        if(hour < 10) hour = "0"+hour;
        if(minutes < 10) minutes = "0"+minutes;
        return (hour+":"+minutes)
        
    }
