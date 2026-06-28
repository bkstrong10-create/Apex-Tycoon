# Apex Tycoon v1

Realistic mobile racing management game source.

## Build locally
```bash
npm install
npm run build
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

APK: `android/app/build/outputs/apk/debug/app-debug.apk`

## GitHub Actions
Push this folder to the `Apex-Tycoon` repo. The workflow builds the APK automatically.
