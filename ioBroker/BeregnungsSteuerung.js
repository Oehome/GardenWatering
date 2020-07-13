/*
V2 !!!!
Steuern der Beregnung, setzten der Timer für
die Automatik und Prüfen vor dem eigentlichen
Start.

Es wird nicht beregnet, wenn:
automatik != true und/oder
regenmenge in den letzen 48h >5

*/

const logging=true
const objpfad='Beregnung.0.'
const ID_AKTIVE_BEREGNUNGEN=objpfad+".aktiveBeregnungen"
const ventile=["VentilRasenL","VentilRasenR","VentilTropfer","VentilSeite","VentilTest"]
const idRefresh='Beregnung.0.refreshDisplay'

let ventilIds=[]
for (let name of ventile) {
    ventilIds.push(getState(objpfad+name+".id").val)
}


/*
Rasen L
*/

let ID_VENTIL_LINKS             = 'Beregnung.0.VentilRasenL.id'
let timeShiftRasenL             = Number(getState('Beregnung.0.VentilRasenL.minutenVorSonnenuntergang').val)
let ID_Ventil_RASEN_LINKS_EIN   = 'Beregnung.0.VentilRasenL.jetztStarten'
let ID_AUTOMATIK_VENTIL_RASEN_L = 'Beregnung.0.VentilRasenL.Automatik'

schedule({astro: "sunset", shift: (-1)*timeShiftRasenL} , function () {
    
    if (check_rules_ventile(ID_AUTOMATIK_VENTIL_RASEN_L) === true ) {
        setState(ID_Ventil_RASEN_LINKS_EIN,true,true)
        setStateDelayed(ID_Ventil_RASEN_LINKS_EIN,false,1000,true)
    }
}) 

/*
Rasen R
*/

let ID_VENTIL_RASEN_RECHTS       = 'Beregnung.0.VentilRasenR.id'
let timeShiftRasenR              = Number(getState('Beregnung.0.VentilRasenR.minutenVorSonnenuntergang').val)
let ID_Ventil_RASEN_RECHTS_EIN   = 'Beregnung.0.VentilRasenR.jetztStarten'
let ID_AUTOMATIK_VENTIL_RASEN_R  = 'Beregnung.0.VentilRasenR.Automatik'

schedule({astro: "sunset", shift: (-1)*timeShiftRasenR} , function () {
    if (check_rules_ventile(ID_AUTOMATIK_VENTIL_RASEN_R) === true ) {
        setState(ID_Ventil_RASEN_RECHTS_EIN,true,true)
        setStateDelayed(ID_Ventil_RASEN_RECHTS_EIN,false,1000,true)
    }
}) 

/*
Seite
*/

let ID_VENTIL_SEITE       = 'Beregnung.0.VentilSeite.id'
let timeShiftSeite        = Number(getState('Beregnung.0.VentilSeite.minutenVorSonnenuntergang').val)
let ID_Ventil_SEITE_EIN   = 'Beregnung.0.VentilSeite.jetztStarten'
let ID_AUTOMATIK_SEITE    = 'Beregnung.0.VentilSeite.Automatik'

schedule({astro: "sunset", shift: (-1)*timeShiftSeite} , function () {
    if (check_rules_ventile(ID_AUTOMATIK_SEITE) === true ) {
        setState(ID_Ventil_SEITE_EIN,true,true)
        setStateDelayed(ID_Ventil_SEITE_EIN,false,1000,true)
    }
}) 

/*
Tropfer
*/

let ID_VENTIL_TROPFER       = 'Beregnung.0.VentilTropfer.id'
let timeShiftTropfer        = Number(getState('Beregnung.0.VentilTropfer.minutenVorSonnenuntergang').val)
let ID_Ventil_TROPFER_EIN   = 'Beregnung.0.VentilTropfer.jetztStarten'
let ID_AUTOMATIK_TROPFER    = 'Beregnung.0.VentilTropfer.Automatik'

schedule({astro: "sunset", shift: (-1)*timeShiftTropfer} , function () {
    
    if (check_rules_ventile(ID_AUTOMATIK_TROPFER) === true ) {
        setState(ID_Ventil_TROPFER_EIN,true,true)
        setStateDelayed(ID_Ventil_TROPFER_EIN,false,1000,true)
    }
}) 


/*
Test
*/

let ID_VENTIL_TEST       = 'Beregnung.0.VentilTest.id'
let timeShiftTest        = Number(getState('Beregnung.0.VentilTest.minutenVorSonnenuntergang').val)
let ID_Ventil_TEST_EIN   = 'Beregnung.0.VentilTest.jetztStarten'
let ID_AUTOMATIK_TEST    = 'Beregnung.0.VentilTest.Automatik'

schedule({astro: "sunset", shift: (-1)*timeShiftTest} , function () {
   
    if (check_rules_ventile(ID_AUTOMATIK_TEST) === true ) {
        setState(ID_Ventil_TEST_EIN,true,true)
        setStateDelayed(ID_Ventil_TEST_EIN,false,1000,true)
    }
}) 

/*
Regelüberprüfung ob beregnet werden soll, abhängig ob
- automatic mode = true
- regenmenge < 15
*/

function check_rules_ventile(automatic) {
    
    tolog(logging,"Function: check_rules_ventile param: "+automatic)
    const idRegenidRegenMenge='Beregnung.0.Regen.RegenMenge48h'/*RegenMenge48*/
    
    if (getState(automatic).val != true) {
        tolog(logging, "Automatik ist nicht aktiviert, schalte Bewässerung nicht ein")
        return false 
    }
    tolog(logging, "Automatik ist aktiviert")
    
    if (getState(idRegenidRegenMenge).val > 15) {
       tolog(logging, "Regenmenge > 15 schalte Bewässerung nicht ein") 
       return false
    }
    tolog(logging, "Regenmenge < 15 schalte Bewässerung") 

    return true
    
}


/* 
Anzahl der momentan aktiven Beregnungen
*/

on({id: ventilIds, val: true},function() {
    let count=0
    for (let ventil of ventilIds) {
        if (getState(ventil).val === true) {
            count++
        }
    }
    return count
});

