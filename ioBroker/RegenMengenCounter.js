/*
Messen und berechnen der Regenmenge zur Bewaesserungssteuerung

Jeder Kontakt den der Regenmesser gibt entspricht 0.2794 mm Niederschlag.
Bei jedem Tick wird der Gesamt-Counter erhöht und die entsprechende Regenmenge errechnet.
Alle 5 Minuten wird die Regenmenge der letzten 48h aus den DB-Daten errechnet und in einen Datenpunkt geschrieben.

*/

const ID_REGEN_COUNTER = 'hm-rpc.1.OEQ0853437.15.STATE'/*RegenMengenZ wippe STATE*/;
const ID_COUNT         = 'Beregnung.0.Regen.WippenCounter'; 
const ID_REGEN         = 'Beregnung.0.Regen.RegenMengeGesamt';
const mm_pro_tick      = 0.2794;
const ID_REGEN_48      = 'Beregnung.0.Regen.RegenMenge48h';
const logging = false;

const query= "SELECT  round(MAX(val) -MIN(val),0) as wert FROM iobroker.ts_number where \
                   timestamp(FROM_UNIXTIME(SUBSTRING(ts, 1, 10))) >= CURRENT_TIMESTAMP - INTERVAL 48 HOUR \
                   and id = (SELECT id FROM iobroker.datapoints WHERE name = '"+ID_REGEN+"')";

// Datenpunkt erstellen

mkCount(ID_COUNT);
mkRegenM(ID_REGEN);
mkRegenMh(ID_REGEN_48);

//. beim start abfrage starten
mysqlAbfrage(query,ID_REGEN_48);

// Regencounter hochzaehlen

on({id: ID_REGEN_COUNTER, change: 'any'}, function (obj) {
   var counter_neu=1+getState(ID_COUNT).val;
   setState(ID_COUNT,counter_neu);
   setState(ID_REGEN,counter_neu*mm_pro_tick);
});

// Regenmenge in den letzten 48h

schedule('*/5 * * * *', function () {
        mysqlAbfrage(query,ID_REGEN_48);
});

function mysqlAbfrage (myQuery,id) {
    var ergebnis
    tolog(logging,"mysqlAbfrage ID:  "+id)
    sendTo('sql.0', 'query', myQuery, function (result) {
        if (result.error) {
            log(result.error);
        } else {
            ergebnis=Number(result.result[0].wert)
            log (ergebnis)
            setState(id,ergebnis,true)
            tolog(logging,"mysqlAbfrage: "+myQuery+"  val: "+ergebnis )
        }
    });
}

function mkCount (id){
    var obj = {};
    obj.type = 'state';
    obj.common = {};
    obj.common.name = 'RegenMengenCounterCount';
    obj.common.type = 'number';
    obj.common.role = 'state';
    obj.common.desc = 'Anzahl der gemessenen Kontakte';
    obj.common.read = true;
    obj.common.write = true;
    setzeObject(id, obj);
 }

 function mkCounth (id){
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'RegenMengenCounterCount48h';
   obj.common.type = 'number';
   obj.common.role = 'state';
   obj.common.desc = 'Anzahl Kontakte 48h';
   obj.common.read = true;
   obj.common.write = true;
   setzeObject(id, obj);
}

 function mkRegenM (id){
    var obj = {};
    obj.type = 'state';
    obj.common = {};
    obj.common.name = 'RegenMengeGesamt';
    obj.common.type = 'number';
    obj.common.role = 'state';
    obj.common.unit = 'mm';
    obj.common.desc = 'Regenmenge gesamt in mm';
    obj.common.read = true;
    obj.common.write = true;
    setzeObject(id, obj);
 }

 function mkRegenMh (id){
   var obj = {};
   obj.type = 'state';
   obj.common = {};
   obj.common.name = 'RegenMenge48';
   obj.common.type = 'number';
   obj.common.role = 'state';
   obj.common.unit = 'mm';
   obj.common.desc = 'Regenmenge 48h mm';
   obj.common.read = true;
   obj.common.write = true;
   setzeObject(id, obj);
}

        