/*
Öffnen der Ventile venn Objekt
auf true gesetzt wurde
*/

const logging=true
const objpfad='Beregnung.0.'

const ventilName='VentilSeite'
const ventilID=getState(objpfad+ventilName+'.id').val
const trigger=objpfad+ventilName+'.jetztStarten'

const ID_ROLLADE1         ='hm-rpc.0.KEQ0094120.1.LEVEL'/*Esszimmer SV*/;
const ID_ROLLADE2         ='hm-rpc.0.KEQ0094233.1.LEVEL'/*Wohnzimmer SV*/;

on({id:trigger, val: true},function() {
    
    // Rolladen runter
        tolog(logging,"Fahre Rolladen Runter");
        var idnam=getObject(ID_ROLLADE1).common.name;
        tolog(logging,"Fahre Rollade "+idnam+" runter")
        setState(ID_ROLLADE1,0);
    
        idnam=getObject(ID_ROLLADE2).common.name;
        tolog(logging,"Fahre Rollade "+idnam+" runter")
        setStateDelayed(ID_ROLLADE2,0,500);
    
        tolog(logging,"Öffne Ventil: "+ventilName+" ("+ventilID+")")
        setStateDelayed(ventilID,true),15*1000;
})