/*
Öffnen der Ventile venn Objekt
auf true gesetzt wurde
*/

const logging=true
const objpfad='Beregnung.0.'

const ventilName='VentilTropfer'
const ventilID=getState(objpfad+ventilName+'.id').val
const trigger=objpfad+ventilName+'.jetztStarten'

on({id:trigger, val: true},function() {
    tolog(logging,"Öffne Ventil: "+ventilName+" ("+ventilID+")")
    setState(ventilID,true);
})