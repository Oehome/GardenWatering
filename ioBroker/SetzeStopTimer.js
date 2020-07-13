/*
Setzten eines Stop timer, wenn Ventil
geöffnet wurde
*/



const logging=true
const objpfad='Beregnung.0.'
const ventile=["VentilRasenL","VentilRasenR","VentilTropfer","VentilSeite","VentilTest"]
const idRefresh='Beregnung.0.refreshDisplay'


let ventilIds=[]
for (let name of ventile) {
    ventilIds.push(getState(objpfad+name+".id").val)
}

/*
Setzten eines Stop timers, wenn Ventil
geöffnet wurde
*/

on({id: ventilIds, val: true},function(obj) {
    
    let name=getObject(obj.id).common.name.replace(".STATE","")
    let idBeregnungsdauer=objpfad+name+".Beregnungsdauer"
        
    // feststellen ob beregnungsdauer gesetzt ist
    
    tolog(logging,"idBeregnungsdauer: "+idBeregnungsdauer)
    let beregnungsdauer
    if (existsObject(idBeregnungsdauer)) {
        beregnungsdauer=getState(idBeregnungsdauer).val
    } else {
        beregnungsdauer=1/60
    }
    
    tolog(logging,"Plane Ende der Beregnung durch "+name+" in "+beregnungsdauer+" min")
    setTimeout(function() {
        setState(obj.id,false);
        tolog(logging,"Beende Beregnung durch "+name)    
    }, beregnungsdauer*1000*60);

     setStateDelayed(idRefresh,true,1000)
    
});
