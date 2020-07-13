/*

Skript zeigt status der beregnung auf Panel an

*/

const logging=false
const objpfad='Beregnung.0.'
const ventile=["VentilRasenL","VentilRasenR","VentilTropfer","VentilSeite"]
const idRefresh='Beregnung.0.refreshDisplay'

const idAnwesenheitGarten   = 'Raumsteuerung.0.Aussenbereich.Anwesend'/*Anwesend aktiv*/
const lcd_temp              = 'mqtt.0.esp-bewaesserung.LCD.Zeiled10'
const lcd_pumpe             = 'mqtt.0.esp-bewaesserung.LCD.Zeiled11'
const lcd_niederschlag      = 'mqtt.0.esp-bewaesserung.LCD.Zeiled12'
const lcd_datetime          = 'mqtt.0.esp-bewaesserung.LCD.Zeiled13'


const idAktuelleBeregnungen = 'Beregnung.0.aktiveBeregnungen'
const idPumpe               = 'hm-rpc.1.OEQ1530075.13.STATE'/*Tauchpumpe STATE*/;
const idTemp                = 'alias.0.temperatur.Aussenbereich'/*Temperatur Aussenbereich*/
const idNiederschlag        = 'Beregnung.0.Regen.RegenMenge48h'/*RegenMenge48*/
 
const display_button        = 'mqtt.0.esp-bewaesserung.LCD.aktiv'
const raum                  = 'Aussenbereich'
const colour                = 'green'
const idMaxBeregnungszeit   = 'Beregnung.0.MaxBeregnungsdauer'

const z1_seite = 'mqtt.0.esp-bewaesserung.LCD.Zeiled20'
const z2_seite = 'mqtt.0.esp-bewaesserung.LCD.Zeiled21'

const z1_tropfer = 'mqtt.0.esp-bewaesserung.LCD.Zeiled22'
const z2_tropfer = 'mqtt.0.esp-bewaesserung.LCD.Zeiled23'

const z1_rasenl = 'mqtt.0.esp-bewaesserung.LCD.Zeiled30'
const z2_rasenl = 'mqtt.0.esp-bewaesserung.LCD.Zeiled31'

const z1_rasenr = 'mqtt.0.esp-bewaesserung.LCD.Zeiled32'
const z2_rasenr = 'mqtt.0.esp-bewaesserung.LCD.Zeiled33'

schedule('* * * * *', function () {   
    // da Uhrzeit angezeigt wird, kann man direkt alle schreiben
    set_current_val() 
});


on({id: idRefresh, val: true}, function () {
    set_current_val();
    setState(idRefresh,false,true)
})


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
    

    for (let ventil of ventile) {
        set_ventil_info(ventil)
    }

}


function set_ventil_info (ventil) {
    const id=getState(objpfad+ventil+".id").val
    const active=getState(id).val
    let l1=""
    let l2=""

    if (ventil === 'VentilSeite') {
        l1 = z1_seite
        l2 = z2_seite
    } else if (ventil=== 'VentilTropfer') {
        l1 = z1_tropfer
        l2 = z2_tropfer
    } else if (ventil=== 'VentilRasenR') {
        l1 = z1_rasenr
        l2 = z2_rasenr
    } else if (ventil=== 'VentilRasenL') {
        l1 = z1_rasenl
        l2 = z2_rasenl
    } else {
        return
    }
 

    tolog(logging,"L1: "+l1)
    tolog(logging,"L2: "+l2)
    

if (active===true) {
        tolog(logging,ventil+" ist aktiv ")
        const idOffenSeit=objpfad+ventil+".AktuelleBeregnungsdauer"
        setState(l1,ventil+" offen seit:")
        setState(l2,getState(idOffenSeit).val+" min")
    } else {
        tolog(logging,ventil+" ist nicht aktiv ")
        setState(l1,ventil+" Start:")
        const idAuto=objpfad+ventil+".Automatik"
        if (getState(idAuto).val === true) {
            const idZeit=objpfad+ventil+".startBeregnung"
            setState(l2,getState(idZeit).val+" Uhr")
        } else {
            setState(l2,"nichts geplant")
        }
    }
}



