/*

Erstellt eine Objekt Struktur fuer
die Beregnung

*/

const path = 'Beregnung.0.';
var delay=0;
const ventile=["VentilRasenL","VentilRasenR","VentilTropfer","VentilSeite","VentilTest"]

// füer alle Ventile

/*
maxBeregnungszeit();
aktuell_beregnet();
automode();
maxRegenFuerBeregnung();
refreshDisplay(); 
*/
// individuell pro ventil

for (let ventil of ventile) {
     /*
    endeBeregnung(ventil)
    jetztStarten(ventil)
    startBeregnung(ventil)
    idBeregnung (ventil)
    startBeregnung(ventil)
    Beregnungszeit(ventil)
    autoBeregnung(ventil)
    aktuelleBeregnunsdauer(ventil)
    startMinutenVorSonnenuntergang(ventil)
    */
}
/*
setState("Beregnung.0.MaxBeregnungsdauer",65,true)
setState("Beregnung.0.maxRegenFuerBeregnung",10,true)
setState("Beregnung.0.refreshDisplay",true,true)
setState("Beregnung.0.automatikbetrieb",false,true) 

setState("Beregnung.0.VentilRasenL.id",'hm-rpc.1.OEQ0861976.14.STATE',true)
setState("Beregnung.0.VentilRasenL.Beregnungsdauer",15,true)
setState("Beregnung.0.VentilRasenL.minutenVorSonnenuntergang",15,true)
setState("Beregnung.0.VentilRasenL.Automatik",false,true)

setState("Beregnung.0.VentilRasenR.id",'hm-rpc.1.OEQ0861976.13.STATE',true)
setState("Beregnung.0.VentilRasenR.Beregnungsdauer",15,true)
setState("Beregnung.0.VentilRasenR.minutenVorSonnenuntergang",15,true)
setState("Beregnung.0.VentilRasenR.Automatik",false,true)

setState("Beregnung.0.VentilSeite.id",'hm-rpc.1.OEQ0861811.18.STATE',true)
setState("Beregnung.0.VentilSeite.Beregnungsdauer",20,true)
setState("Beregnung.0.VentilSeite.minutenVorSonnenuntergang",21,true)
setState("Beregnung.0.VentilSeite.Automatik",false,true)

setState("Beregnung.0.VentilTropfer.id",'hm-rpc.0.DEQ0011287.1.STATE',true)
setState("Beregnung.0.VentilTropfer.Beregnungsdauer",60,true)
setState("Beregnung.0.VentilTropfer.minutenVorSonnenuntergang",61,true)
setState("Beregnung.0.VentilTropfer.Automatik",false,true)

setState("Beregnung.0.VentilTest.id",'hm-rpc.0.NEQ1459489.1.STATE',true)
setState("Beregnung.0.VentilTest.Beregnungsdauer",60,true)
setState("Beregnung.0.VentilTest.minutenVorSonnenuntergang",601,true)
setState("Beregnung.0.VentilTest.Automatik",false,true)
*/

function refreshDisplay() {
   var id = path + "refreshDisplay"
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'refreshDisplay';
   obj.common.type = 'boolean';
   obj.common.role = 'switch';
   obj.common.desc = 'refres Display';
   obj.common.read = true;
   obj.common.write = true;
   obj.common.def = false;
   setzeObject(id, obj);
} 

function idDisplayL1 (raum){
   var id = path + raum+ '.L1';
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'L1';
   obj.common.type = 'string';
   obj.common.role = 'state';
   obj.common.desc = 'Display Line 1';
   obj.common.read = true;
   obj.common.write = true;
   setzeObject(id, obj);
}

function idDisplayL2 (raum){
   var id = path + raum+ '.L2';
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'L2';
   obj.common.type = 'string';
   obj.common.role = 'state';
   obj.common.desc = 'Display Line 2';
   obj.common.read = true;
   obj.common.write = true;
   setzeObject(id, obj);
}


function idBeregnung (raum){
   var id = path + raum+ '.id';
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'ventilID';
   obj.common.type = 'string';
   obj.common.role = 'state';
   obj.common.desc = 'ID des Ventils';
   obj.common.read = true;
   obj.common.write = true;
   setzeObject(id, obj);
}

function beregnungTimerGestellt (raum){
   var id = path + raum+'.jetztStarten';
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'timerGestellt';
   obj.common.type = 'boolean';
   obj.common.role = 'switch';
   obj.common.desc = 'ist Timer gestellt';
   obj.common.read = true;
   obj.common.write = true;
   obj.common.def = false;
   setzeObject(id, obj);
} 

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

function endeBeregnung (raum){
   var id = path + raum+ '.endeBeregnung';
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'BeregnungsEndeZeitpunkt';
   obj.common.type = 'string';
   obj.common.role = 'state';
   obj.common.desc = 'BeregnungsEndeZeitpunkt';
   obj.common.read = true;
   obj.common.write = true;
   setzeObject(id, obj);
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
   //setStateDelayed(id,0,1000)
}

function startMinutenVorSonnenuntergang (raum){
   var id = path + raum+ '.minutenVorSonnenuntergang';
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'minutenVorSonnenuntergang';
   obj.common.type = 'number';
   obj.common.role = 'state';
   obj.common.desc = 'Statzeit vor Sonnenuntergnang in min';
   obj.common.read = true;
   obj.common.write = true;
   obj.common.unit = 'min';
   setzeObject(id, obj);
   //setStateDelayed(id,0,2000)
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
   setStateDelayed(id,60,true)
} 

function jetztStarten (raum){
   var id = path + raum+'.jetztStarten';
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'beregnungJetztStarten';
   obj.common.type = 'boolean';
   obj.common.role = 'switch';
   obj.common.desc = 'Beregnung soll jetzt gestartet werden';
   obj.common.read = true;
   obj.common.write = true;
   obj.common.def = false;
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
   obj.common.def = 20;
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

function maxRegenFuerBeregnung () {
    var id = path + 'maxRegenFuerBeregnung';
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'maxRegenFuerBeregnung';
   obj.common.type = 'number';
   obj.common.role = 'state';
   obj.common.desc = 'max Regenmenge fuer Beregnung';
   obj.common.read = true;
   obj.common.write = true;
   obj.common.def = true;
    obj.common.unit = 'mm';
   setzeObject(id, obj);
}

function automode (){
   var id = path + 'automatikbetrieb';
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'automatikbetrieb';
   obj.common.type = 'boolean';
   obj.common.role = 'switch';
   obj.common.desc = 'automatik Betrieb';
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