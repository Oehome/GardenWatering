/*
 * 
 * Info-Screen used for gareden watering, 
 * with one PIR and 3 LCD Displays, controlled by MQTT
 * 
 * released under a creative commons "Attribution-NonCommercial-ShareAlike 2.0" license
 * http://creativecommons.org/licenses/by-nc-sa/2.0/de/
 * 
 * PIR part of this script based on: https://gist.github.com/sumantro93/67766cdb0e177567ff97f487b3809316
 * The Parallax PIR Sensor is an easy to use digital infrared motion sensor module. 
 * (http://www.parallax.com/detail.asp?product_id=555-28027)
 * The sensor's output pin goes to HIGH if motion is present.
 * However, even if motion is present it goes to LOW from time to time, 
 * which might give the impression no motion is present. 
 * This program deals with this issue by ignoring LOW-phases shorter than a given time, 
 * assuming continuous motion is present during these phases.
 * 
 * 
 * In order to run more than one of the used I2C displays you have to change the addresses of the
 * displays by soldering the prepered bridge on the 12c modules on the lcd. I found code examples and soldering information on this site:
 * https://funduino.de/nr-06-zwei-i%C2%B2c-displays-gleichzeitig
 * 
 */

 
#include <ESP8266WiFi.h>                        
#include <PubSubClient.h>                       
#include <LiquidCrystal_I2C.h>                                        
#include <Wire.h>                                                     

// defining the 3 displays

LiquidCrystal_I2C lcd1(0x25, 20, 4);
LiquidCrystal_I2C lcd2(0x26, 20, 4);
LiquidCrystal_I2C lcd3(0x27, 20, 4);                             

// WLAN access data

const char* ssid          = "XXXXXXXXXXXX";                                        
const char* password      = "XXXXXXXXXXXX";                                

// MQTT access data

const char* mqtt_server   = "XXXXXXXXXXXX";
const char* mqtt_user     = "XXXXXXXXXXXX";
const char* mqtt_password = "XXXXXXXXXXXX";
const char* mqtt_client   = "XXXXXXXXXXXX";


// Def of the PIR sensor


int calibrationTime = 15;  //the time we give the sensor to calibrate (10-60 secs according to the datasheet)
long unsigned int lowIn; //the time when the sensor outputs a low impulse
long unsigned int pause = 5000; // milliseconds the sensor has to be low before we assume all motion has stopped
boolean lockLow = true;
boolean takeLowTime;
int pirPin = 'D7';  // Digital pin D7


WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;
#define D4 2           

                                                 
//###############################################################################                                                                       
// connect tp wifi net and disable acces point mode

void setup_wifi() {
   delay(100);
   pinMode('D6', OUTPUT);                                                 
   digitalWrite('D6', HIGH);
   Serial.print("Schalte internen Access Port ab");      
   WiFi.mode(WIFI_STA);                                                                     
   Serial.print("Connecting to ");
   Serial.println(ssid);
   WiFi.begin(ssid, password);
   while (WiFi.status() != WL_CONNECTED)
    {
      delay(500);
      Serial.print(".");
    }
  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

//###############################################################################
// mqqt communication

void callback(char* topic, byte* payload, unsigned int length) {
String sTopic = String(topic);

  if (sTopic == "esp-bewaesserung/LCD/Zeiled10") {                       
                                                              
  Serial.print("Command from MQTT broker is : [");            
  Serial.print(topic);                                        
  Serial.println();                                          
  Serial.print(" publish data is:");                          

  {
  lcd1.setCursor(0, 0);                                        
  lcd1.print(F("                    "));                       
  lcd1.setCursor(0, 0);
}
  {
  for(int i=0;i<length;i++)
  {
    Serial.print((char)payload[i]);
    lcd1.setCursor(i, 0);
    lcd1.write((char)payload[i]);
    }
}

} else if (sTopic == "esp-bewaesserung/LCD/Zeiled11"){                    
    Serial.print("Command from MQTT broker is : [");
    Serial.print(topic);
     Serial.println();
    Serial.print(" publish data is:");
    {
    lcd1.setCursor(0, 1);
    lcd1.print(F("                    "));
    lcd1.setCursor(0, 1);
  }
{
    for(int i=0;i<length;i++)
    {
      Serial.print((char)payload[i]);
     lcd1.setCursor(i, 1);
      lcd1.write((char)payload[i]);
      }
  }

} else if (sTopic == "esp-bewaesserung/LCD/Zeiled12"){                    
    Serial.print("Command from MQTT broker is : [");
    Serial.print(topic);
     Serial.println();
    Serial.print(" publish data is:");
    {
    lcd1.setCursor(0, 2);
    lcd1.print(F("                    "));
    lcd1.setCursor(0, 2);
  }
{
    for(int i=0;i<length;i++)
    {
      Serial.print((char)payload[i]);
     lcd1.setCursor(i, 2);
      lcd1.write((char)payload[i]);
      }
  }

} else if (sTopic == "esp-bewaesserung/LCD/Zeiled13"){                    
    Serial.print("Command from MQTT broker is : [");
    Serial.print(topic);
     Serial.println();
    Serial.print(" publish data is:");
    {
    lcd1.setCursor(0, 3);
    lcd1.print(F("                    "));
    lcd1.setCursor(0, 3);
  }
{
    for(int i=0;i<length;i++)
    {
      Serial.print((char)payload[i]);
     lcd1.setCursor(i, 3);
      lcd1.write((char)payload[i]);
      }
  }

} else if (sTopic == "esp-bewaesserung/LCD/Zeiled20"){                    
  Serial.print("Command from MQTT broker is : [");            
  Serial.print(topic);                                        
   Serial.println();                                          
  Serial.print(" publish data is:");                          

  {
  lcd2.setCursor(0, 0);                                        
  lcd2.print(F("                    "));                       
  lcd2.setCursor(0, 0);
}
  {
  for(int i=0;i<length;i++)
  {
    Serial.print((char)payload[i]);
    lcd2.setCursor(i, 0);
    lcd2.write((char)payload[i]);
    }
  }

} else if (sTopic == "esp-bewaesserung/LCD/Zeiled21"){                    
  Serial.print("Command from MQTT broker is : [");            
  Serial.print(topic);                                        
   Serial.println();                                          
  Serial.print(" publish data is:");                          

  {
  lcd2.setCursor(0, 1);                                        
  lcd2.print(F("                    "));                       
  lcd2.setCursor(0, 1);
}
  {
  for(int i=0;i<length;i++)
  {
    Serial.print((char)payload[i]);
    lcd2.setCursor(i, 1);
    lcd2.write((char)payload[i]);
    }
  }

} else if (sTopic == "esp-bewaesserung/LCD/Zeiled22"){                    
  Serial.print("Command from MQTT broker is : [");           
  Serial.print(topic);                                        
   Serial.println();                                          
  Serial.print(" publish data is:");                          

  {
  lcd2.setCursor(0, 2);                                        
  lcd2.print(F("                    "));                       
  lcd2.setCursor(0, 2);
}
  {
  for(int i=0;i<length;i++)
  {
    Serial.print((char)payload[i]);
    lcd2.setCursor(i, 2);
    lcd2.write((char)payload[i]);
    }
  }

} else if (sTopic == "esp-bewaesserung/LCD/Zeiled23"){    
    Serial.print("Command from MQTT broker is : [");
    Serial.print(topic);
    Serial.println();
    Serial.print(" publish data is:");
    {
    lcd2.setCursor(0, 3);
    lcd2.print(F("                    "));
    lcd2.setCursor(0, 3);
  }
{
    for(int i=0;i<length;i++)
    {
      Serial.print((char)payload[i]);
     lcd2.setCursor(i, 3);
      lcd2.write((char)payload[i]);
      }
  }

} else if (sTopic == "esp-bewaesserung/LCD/Zeiled30"){                    
  Serial.print("Command from MQTT broker is : [");            
  Serial.print(topic);                                        
   Serial.println();                                          
  Serial.print(" publish data is:");                          

  {
  lcd3.setCursor(0, 0);                                        
  lcd3.print(F("                    "));                       
  lcd3.setCursor(0, 0);
}
  {
  for(int i=0;i<length;i++)
  {
    Serial.print((char)payload[i]);
    lcd3.setCursor(i, 0);
    lcd3.write((char)payload[i]);
    }
  }

} else if (sTopic == "esp-bewaesserung/LCD/Zeiled31"){                   
  Serial.print("Command from MQTT broker is : [");            
  Serial.print(topic);                                       
   Serial.println();                                          
  Serial.print(" publish data is:");                          

  {
  lcd3.setCursor(0, 1);                                        
  lcd3.print(F("                    "));                       
  lcd3.setCursor(0, 1);
}
  {
  for(int i=0;i<length;i++)
  {
    Serial.print((char)payload[i]);
    lcd3.setCursor(i, 1);
    lcd3.write((char)payload[i]);
    }
  }

} else if (sTopic == "esp-bewaesserung/LCD/Zeiled32"){                    
  Serial.print("Command from MQTT broker is : [");            
  Serial.print(topic);                                        
   Serial.println();                                          
  Serial.print(" publish data is:");                          

  {
  lcd3.setCursor(0, 2);                                        
  lcd3.print(F("                    "));                       
  lcd3.setCursor(0, 2);
}
  {
  for(int i=0;i<length;i++)
  {
    Serial.print((char)payload[i]);
    lcd3.setCursor(i, 2);
    lcd3.write((char)payload[i]);
    }
  }

} else if (sTopic == "esp-bewaesserung/LCD/Zeiled33"){                    
    Serial.print("Command from MQTT broker is : [");
    Serial.print(topic);
    Serial.println();
    Serial.print(" publish data is:");
    {
    lcd3.setCursor(0, 3);
    lcd3.print(F("                    "));
    lcd3.setCursor(0, 3);
  }
{
    for(int i=0;i<length;i++)
    {
      Serial.print((char)payload[i]);
      lcd3.setCursor(i, 3);
      lcd3.write((char)payload[i]);
      }
  }

} else if (sTopic == "esp-bewaesserung/LCD/aktiv"){ 
    Serial.print("Command from MQTT broker is : [");
    Serial.print(topic);
    Serial.println();
    if (!strncmp((char *)payload, "true", length)) {
      Serial.print("true");
      lcd1.backlight();
      lcd2.backlight();
      lcd3.backlight();
    } else {
      Serial.print("false");
      lcd1.noBacklight();
      lcd1.clear();
      lcd2.noBacklight();
      lcd2.clear();
      lcd3.noBacklight();
      lcd3.clear();
    }

  }


  Serial.println();
}


//###############################################################################
// connect or reconnect to mqtt broker and subsribe topics 

void reconnect() {

  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    String clientId = mqtt_client;
    clientId += String(random(0xffff), HEX);

      if (client.connect(clientId.c_str(), mqtt_user, mqtt_password))       
                                                                          
    {
      Serial.println("connected");
      client.subscribe("esp-bewaesserung/LCD/Zeiled10");                              
      client.subscribe("esp-bewaesserung/LCD/Zeiled11");
      client.subscribe("esp-bewaesserung/LCD/Zeiled12");                              
      client.subscribe("esp-bewaesserung/LCD/Zeiled13");
      client.subscribe("esp-bewaesserung/LCD/Zeiled20");
      client.subscribe("esp-bewaesserung/LCD/Zeiled21");
      client.subscribe("esp-bewaesserung/LCD/Zeiled22");
      client.subscribe("esp-bewaesserung/LCD/Zeiled23");
      client.subscribe("esp-bewaesserung/LCD/Zeiled30");
      client.subscribe("esp-bewaesserung/LCD/Zeiled31");
      client.subscribe("esp-bewaesserung/LCD/Zeiled32");
      client.subscribe("esp-bewaesserung/LCD/Zeiled33");
      client.subscribe("esp-bewaesserung/LCD/aktiv");
      client.publish("esp-bewaesserung/Aussenbereich/Bewegungsmelder" , "0");
      digitalWrite(D4, LOW);                                              
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");

      delay(5000);
    }
  }
}

//###############################################################################

void setup() {

  pinMode(D4, OUTPUT);
  Serial.begin(9600);
  setup_wifi();
  client.setServer(mqtt_server, 1883);                                    
  lcd1.init();                                                             
  lcd1.backlight();  // Backlight einschalten
  lcd2.init();                                                             
  lcd2.backlight();
  lcd3.init();                                                             
  lcd3.backlight();

// Bewegungsmelder
  pinMode(pirPin, INPUT);   // declare sensor as input
  digitalWrite(pirPin, HIGH);
  Serial.print("calibrating sensor ");
      for(int i = 0; i < calibrationTime; i++){
        Serial.print(".");
        delay(500);
  }
  Serial.println(" done");
  Serial.println("SENSOR ACTIVE");
  delay(50);

}

//###############################################################################

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.setCallback(callback);
  client.loop();

  if(digitalRead(pirPin) == HIGH){
    if(lockLow){
       client.publish("esp-bewaesserung/Aussenbereich/Bewegungsmelder" , "1");
       lockLow = false;
       Serial.println("---");
       Serial.print("motion detected at ");
       Serial.print(millis()/1000);
       Serial.println(" sec");
       delay(50);
    }
    takeLowTime = true;
  }

  if(digitalRead(pirPin) == LOW){
      if(takeLowTime){
        lowIn = millis();          //save the time of the transition from high to LOW
        takeLowTime = false;       //make sure this is only done at the start of a LOW phase
      }
       //if the sensor is low for more than the given pause,
       //we assume that no more motion is going to happen
       if(!lockLow && millis() - lowIn > pause){
           client.publish("esp-bewaesserung/Aussenbereich/Bewegungsmelder" , "0");
           //makes sure this block of code is only executed again after
           //a new motion sequence has been detected
           lockLow = true;
           Serial.print("motion ended at ");      //output
           Serial.print((millis() - pause)/1000);
           Serial.println(" sec");
           delay(50);
      }
    }
}
