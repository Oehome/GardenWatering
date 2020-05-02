/*

Skript läuft jede Minute und hat folgende Aufgaben:
  - ist eine Beregnung länger aktiv als die maximale Beregnungsdauer wird sie beendet
  - aktualsieren des Bewässerungs Displays

Das Skript sollte in einer anderen Instanz laufen als die Skripte die die einzelnen
Beregnungen steurn - falls einmal eine Instanz abstürzt.

In dem Skript werden die globalen Funktionen "event" und "tolog" genutz, diese müssen als
globale Funktionen verfügbar sein oder in dieses Skript eingefügt werden

*/






const sname=" ("+name.substr(10)+")";
const Path = 'Beregnung.0.';

// Beregnungsventile

const RasenL         = { "id"  :'hm-rpc.1.XXXXXXXXXX.14.STATE', 
                       "name": "RasenL", 
                       "l1"  : 'mqtt.0.esp-bewaesserung.LCD.Zeiled30', 
                       "l2"  : 'mqtt.0.esp-bewaesserung.LCD.Zeiled31'};
const RasenR         = { "id" :'hm-rpc.1.XXXXXXXXXX.13.STATE', 
                        "name": "RasenR", 
                        "l1" : 'mqtt.0.esp-bewaesserung.LCD.Zeiled32', 
                        "l2" : 'mqtt.0.esp-bewaesserung.LCD.Zeiled33'};
const Seite          = {  "id" :'hm-rpc.1.XXXXXXXXXX.18.STATE',  
                        "name": "Seite",  
                        "l1" : 'mqtt.0.esp-bewaesserung.LCD.Zeiled20', 
                        "l2" : 'mqtt.0.esp-bewaesserung.LCD.Zeiled21'};
const Tropfer      = {  "id" :'hm-rpc.0.XXXXXXXXXX.1.STATE',
                        "name": "Tropfer",
                        "l1" : 'mqtt.0.esp-bewaesserung.LCD.Zeiled22', 
                        "l2" : 'mqtt.0.esp-bewaesserung.LCD.Zeiled23'};

// sonstiges 

const idAktuelleBeregnungen = 'Beregnung.0.aktiveBeregnungen';
const idPumpe               = 'hm-rpc.1.XXXXXXXXXX.13.STATE'/*Tauchpumpe STATE*/;
const idTemp                = 'alias.0.temperatur.Aussenbereich'/*Temperatur Aussenbereich*/;
const idNiederschlag        = 'Beregnung.0.Regen.RegenMengeHeute'/*RegenMengeHeute*/;

const lcd_temp              = 'mqtt.0.esp-bewaesserung.LCD.Zeiled10';
const lcd_pumpe             = 'mqtt.0.esp-bewaesserung.LCD.Zeiled11';
const lcd_niederschlag      = 'mqtt.0.esp-bewaesserung.LCD.Zeiled12';
const lcd_datetime          = 'mqtt.0.esp-bewaesserung.LCD.Zeiled13';

const idDisplayButton='mqtt.0.esp-bewaesserung.LCD.aktiv';
const display_button='mqtt.0.esp-bewaesserung.LCD.aktiv';
const logging                   = true;
const raum                      = 'Aussenbereich';
const colour                    = 'green';
const max_beregnungsdauer=getState('Beregnung.0.MaxBeregnungsdauer');

// "NOT-AUS"  - Beregnung aus bei max Beregnungszeit

schedule("* * * *", function () {    
    checkMaxRuntime(RasenL);
    checkMaxRuntime(RasenR);
    checkMaxRuntime(Seite);
    checkMaxRuntime(Tropfer);
    count_beregnung();
    set_current_val();
 });

on ({id: idPumpe,change:'any'}, function (obj) {
    set_current_val()
}) ;

on ({id: idDisplayButton,change:'any'}, function (obj) {
    clear_topcs();
    if (obj.state.val===true) {
        clear_topcs();
        checkMaxRuntime(RasenL);
        checkMaxRuntime(RasenR);
        checkMaxRuntime(Seite);
        checkMaxRuntime(Tropfer);   
    }
    count_beregnung();
    set_current_val()
}) ;

on ({id: RasenL["id"],change:'any'}, function (obj) {
    clear_topcs();
    if (obj.state.val===false){
        var id=obj.id;
        var idname= getObject(id).common.name;
        event("Setze "+idname+" auf 0"+sname,raum,colour);
        setState(Path+RasenL["name"]+".AktuelleBeregnungsdauer",0);
    } 
    count_beregnung();
    set_current_val();
});

on ({id: RasenR["id"],change:'any'}, function (obj) {
    clear_topcs();
    if (obj.state.val===false){
        var id=obj.id;
        var idname= getObject(id).common.name;
        event("Setze "+idname+" auf 0"+sname,raum,colour);
        setState(Path+RasenR["name"]+".AktuelleBeregnungsdauer",0);
    }
    count_beregnung();
    set_current_val();
}) ;

on ({id: Seite["id"],change:'any'}, function (obj) {
    clear_topcs();
    if (obj.state.val===false){
        var id=obj.id;
        var idname= getObject(id).common.name;
        event("Setze "+idname+" auf 0"+sname,raum,colour);
        setState(Path+Seite["name"]+".AktuelleBeregnungsdauer",0);
    }
    count_beregnung();
    set_current_val();
}) ;

on ({id: Tropfer["id"],change:'any'}, function (obj) {
    clear_topcs();
    if (obj.state.val===false){
        var id=obj.id;
        var idname= getObject(id).common.name;
        event("Setze "+idname+" auf 0"+sname,raum,colour);
        setState(Path+Tropfer["name"]+".AktuelleBeregnungsdauer",0);
    } else {
        setState(Tropfer["l1"] , Tropfer["name"]+": eingeschaltet");
        setState(Tropfer["l2"] , " Starte Beregnung");
    }
    count_beregnung();
    set_current_val();
}) ;

function clear_topcs() {
    setState(lcd_pumpe , "");
    setState(lcd_temp,"");
    setState(lcd_niederschlag,"");
    setState(lcd_datetime,"");
    setState(RasenL["l1"],"");
    setState(RasenR["l1"],"");
    setState(Seite["l1"],"");
    setState(Tropfer["l1"],"");
    setState(RasenL["l2"],"");
    setState(RasenR["l2"],"");
    setState(Seite["l2"],"");
    setState(Tropfer["l2"],"");
}

function set_current_val() {
    
    // Pumpe
    if (getState(idPumpe).val === true) {
        setState(lcd_pumpe , "Tauchpumpe:   an");
    } else {
        setState(lcd_pumpe , "Tauchpumpe:   aus");
    }

    // Temperatur
    var temp=round(getState(idTemp).val,1);
    setState(lcd_temp,"Temp:         "+temp+" C");

    // Niederschlag
    var niederschlag=round(getState(idNiederschlag).val,1);
    setState(lcd_niederschlag,"Niederschlag: "+niederschlag+" mm");

    // Datum:
    var date = new Date();
    var aktualisiert=formatDate(date, "TT.MM.JJJJ SS:mm");
    setState(lcd_datetime,aktualisiert);
    
}

function checkMaxRuntime(ventil) {
    var id                        = ventil["id"];
    var status                    = getState(ventil["id"]).val
    //var beregnungsdauer         = getState(Path+ventil["name"]+".Beregnungsdauer").val;
    var beregnungsdauer           = max_beregnungsdauer;
    var idAktuelleBeregnungsdauer = Path+ventil["name"]+".AktuelleBeregnungsdauer";
    var aktuelleBeregnungsdauer   = getState(idAktuelleBeregnungsdauer).val;
    var status_pumpe              = getState(idPumpe).val;
  
    var lcd1;
    var lcd2;
    
    if (status === true) {
        var deltats_min=round((new Date().getTime()-getState(id).lc)/(60*1000),1);
        
        if (deltats_min > beregnungsdauer) {
            tolog(logging,name+" ist ueber max laufzeit "+deltats_min+" min >= "+beregnungsdauer+" min , schalte ab");
            event("Maximale Beregnungsdauer ("+beregnungsdauer+")min von "+id+" ("+id+") erreicht, schliesse Ventil"+sname,raum,'red');
            setState(id,false);
            lcd1=ventil["name"]+": Ende erreicht";
            lcd2=" dauer "+round(deltats_min,1)+" min von "+beregnungsdauer+" min";
        } else {
            tolog(logging,"Beregnungsdauer von "+id+" = "+round(deltats_min,2)+"min < Maximale Beregnungsdauer "+beregnungsdauer+"min ok");
            tolog(logging,"setzte "+aktuelleBeregnungsdauer+" auf "+deltats_min+" min");
            setState(idAktuelleBeregnungsdauer,deltats_min);
            lcd1=ventil["name"]+": aktiv";
            lcd2=" Dauer: "+deltats_min+"/"+beregnungsdauer+" min";
        }
    } else {

        if (getState(Path+ventil["name"]+".Automatik").val===true) {
            lcd1=ventil["name"]+": Auto an";
            lcd2=" Start: "+getState(Path+ventil["name"]+".startBeregnung").val+" Uhr";
            
        } else {
            lcd1=ventil["name"]+": Auto aus";
            lcd2="";
        }
    }
    setState(ventil["l1"] , lcd1);
    setState(ventil["l2"] , lcd2);
}

function count_beregnung() {
    var count=0;
    if (getState(RasenL["id"]).val===true) {
        count++
    }
    if (getState(RasenL["id"]).val===true) {
        count++
    }
    if (getState(Seite["id"]).val===true) {
        count++
    }
    if (getState(Tropfer["id"]).val===true) {
        count++
    }
    setState(idAktuelleBeregnungen,count)
}

