/*

Erstellt eine Objekt Struktur fuer
die Beregnung

*/


const path = 'Beregnung.0.';
var delay=0;

maxBeregnungszeit();
aktuell_beregnet();

startBeregnung("RasenL"),
startBeregnung("RasenR"),
Beregnungszeit("RasenL");
Beregnungszeit("RasenR");
autoBeregnung("RasenL");
autoBeregnung("RasenR")
aktuelleBeregnunsdauer("RasenL");
aktuelleBeregnunsdauer("RasenR");

startBeregnung("Seite");
Beregnungszeit("Seite");
autoBeregnung("Seite");
aktuelleBeregnunsdauer("Seite");
manStartBeregnung("Seite");

startBeregnung("Tropfer");
Beregnungszeit("Tropfer");
autoBeregnung("Tropfer");
aktuelleBeregnunsdauer("Tropfer");

function startBeregnung (raum){
   var id = path + raum+ '.startBeregnung';
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'BeregnungsStartZeitpunkt';
   obj.common.type = 'string';
   obj.common.role = 'state';
   obj.common.desc = 'BeregnungsStartZeitpunkt';
   obj.common.read = true;
   obj.common.write = true;
   setzeObject(id, obj);
}

function aktuelleBeregnunsdauerRasen (seite){
   var id = path + "Rasen.AktuelleBeregnungsdauer"+ seite;
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'aktuelleBeregnungsDauer';
   obj.common.type = 'number';
   obj.common.role = 'state';
   obj.common.desc = 'aktuelleBeregnungsDauer';
   obj.common.read = true;
   obj.common.write = true;
   obj.common.unit = 'min';
   setzeObject(id, obj);
   setStateDelayed(id,0,1000)
}

function aktuelleBeregnunsdauer (raum){
   var id = path + raum+ '.AktuelleBeregnungsdauer';
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'aktuelleBeregnungsDauer';
   obj.common.type = 'number';
   obj.common.role = 'state';
   obj.common.desc = 'aktuelleBeregnungsDauer';
   obj.common.read = true;
   obj.common.write = true;
   obj.common.unit = 'min';
   setzeObject(id, obj);
   setStateDelayed(id,0,1000)
}

function maxBeregnungszeit (){
   var id = path + 'MaxBeregnungsdauer';
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'maximaleBeregnungszeit';
   obj.common.type = 'number';
   obj.common.role = 'state';
   obj.common.desc = 'maximale Beregnungszeit fuer alle Beregner';
   obj.common.read = true;
   obj.common.write = true;
   obj.common.def = 0;
   setzeObject(id, obj);
   setStateDelayed(id,45,true)
} 

function manStartBeregnung (raum){
   var id = path + raum+'.manStart';
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'manuellerStartBeregung';
   obj.common.type = 'boolean';
   obj.common.role = 'switch';
   obj.common.desc = 'manueller Start Beregnung';
   obj.common.read = true;
   obj.common.write = true;
   obj.common.def = true;
   setzeObject(id, obj);
} 

function autoBeregnung (raum){
   var id = path + raum+'.Automatik';
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'automatische Beregung';
   obj.common.type = 'boolean';
   obj.common.role = 'switch';
   obj.common.desc = 'automatische Beregnung';
   obj.common.read = true;
   obj.common.write = true;
   obj.common.def = true;
   setzeObject(id, obj);
} 

function Beregnungszeit (raum){
   var id = path + raum+'.Beregnungsdauer';
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'Beregnungszeit Rasen in Minuten';
   obj.common.type = 'number';
   obj.common.role = 'state';
   obj.common.desc = 'Beregnungszeit Rasen in Minuten';
   obj.common.read = true;
   obj.common.write = true;
   obj.common.def = 0;
   setzeObject(id, obj);
} 

function aktuell_beregnet (){
   var id = path + 'aktiveBeregnungen';
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'beregnungAktuell';
   obj.common.type = 'number';
   obj.common.role = 'state';
   obj.common.desc = 'aktiveBeregnungen';
   obj.common.read = true;
   obj.common.write = true;
   obj.common.def = true;
   setzeObject(id, obj);
} 


function setzeObject(id, obj) {
   log("ID: "+id);
   if (getObject(id)) {
            log("Objekt: "+id+" existiert lege es nicht erneut an");
    } else {
        log("Objekt: "+id+" existiert nicht, lege es an");
        setObject(id, obj, function(err) {
            if(err) log('Cannot write object: ' + err);
            else setState(id, obj.common.def);
        }); 
    }
    
}
