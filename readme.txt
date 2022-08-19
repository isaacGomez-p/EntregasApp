************************************************
Borrar
DT_3k.apk
DT_3k.keystore
************************************************
00
Probablemente no queramos que el complemento 
de la consola de depuración esté habilitado, 
por lo que deberíamos eliminarlo antes de generar 
las versiones de lanzamiento:

ionic cordova plugin rm cordova-plugin-console --verbose
************************************************
01
Para generar una compilación de lanzamiento para Android, podemos usar el siguiente comando cordova cli:
ionic cordova build --release android
************************************************
02
keytool -genkey -v -keystore DT_3k.keystore -alias DT_3k -keyalg RSA -keysize 2048 -validity 10000
************************************************
03
REM cambiar al directorio en donde se encuentra app-release-unsigned
REM ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk 

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore DT_3k.keystore ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk DT_3k

***OR OR OR *********************************************
04
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore DT_3k.keystore ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk DT_3k

************************************************
05

zipalign -v 4 ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk DT_3k.apk
************************************************


*********************************************************

Para generar apk con Capacitor

1. ionic build
2. npx cap init
3. npx cap add android
4. npx cap sync 
5. npx cap open android

//En el AndroidManifest.xml añadir 
<application
    ...
    android:usesCleartextTraffic="true"
    ...
</application>

<uses-feature android:name="android.hardware.camera"
                      android:required="true" />