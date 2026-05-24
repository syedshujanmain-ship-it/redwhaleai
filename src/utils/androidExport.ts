import JSZip from 'jszip';
import { saveAs } from 'file-saver';

async function fetchAppFile(path: string): Promise<string | ArrayBuffer | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('image') || ct.includes('font') || ct.includes('octet') || ct.includes('svg')) {
      return await res.arrayBuffer();
    }
    return await res.text();
  } catch {
    return null;
  }
}

function fixHtmlPaths(html: string): string {
  return html
    .replace(/(src|href)="\/assets\//g, '$1="assets/')
    .replace(/(src|href)="\/favicon/g, '$1="favicon')
    .replace(/(src|href)="\/images\//g, '$1="images/')
    .replace(/(src|href)="\/nano-bot-logo/g, '$1="nano-bot-logo');
}

function fixAssetPaths(content: string, filename: string): string {
  if (!filename.endsWith('.js') && !filename.endsWith('.css')) return content;
  return content
    .replace(/"\/assets\//g, '"assets/')
    .replace(/"\/images\//g, '"images/')
    .replace(/"\/favicon/g, '"favicon')
    .replace(/"\/nano-bot-logo/g, '"nano-bot-logo');
}

async function discoverDistFiles(): Promise<Record<string, string | ArrayBuffer>> {
  const files: Record<string, string | ArrayBuffer> = {};
  const html = await fetchAppFile('/index.html');
  if (!html || typeof html !== 'string') return files;
  files['index.html'] = fixHtmlPaths(html);

  const rootAssets = ['favicon.png', 'nano-bot-logo.png'];
  for (const name of rootAssets) {
    const content = await fetchAppFile('/' + name);
    if (content) files[name] = content;
  }

  const assetMatches = html.matchAll(/(?:src|href)="\/assets\/([^"]+)"/g);
  for (const m of assetMatches) {
    const name = m[1];
    const content = await fetchAppFile('/assets/' + name);
    if (content) {
      files['assets/' + name] = typeof content === 'string' ? fixAssetPaths(content, name) : content;
    }
  }

  const imgMatches = html.matchAll(/(?:src|href)="\/images\/([^"]+)"/g);
  for (const m of imgMatches) {
    const path = 'images/' + m[1];
    const content = await fetchAppFile('/' + path);
    if (content) files[path] = content;
  }

  return files;
}

export function getAndroidProject(appName: string, packageName: string): Record<string, string> {
  const safeName = appName.replace(/\s+/g, '');
  const pkgPath = packageName.replace(/\./g, '/');

  const buildGradle = [
    "plugins {",
    "    id 'com.android.application' version '8.2.0' apply false",
    "}",
  ].join('\n');

  const settingsGradle = [
    "pluginManagement {",
    "    repositories {",
    "        google()",
    "        mavenCentral()",
    "        gradlePluginPortal()",
    "    }",
    "}",
    "dependencyResolutionManagement {",
    "    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)",
    "    repositories {",
    "        google()",
    "        mavenCentral()",
    "    }",
    "}",
    'rootProject.name = "' + safeName + '"',
    "include ':app'",
  ].join('\n');

  const gradleProps = [
    "org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8",
    "android.useAndroidX=true",
    "android.nonTransitiveRClass=true",
  ].join('\n');

  const appBuildGradle = [
    "plugins {",
    "    id 'com.android.application'",
    "}",
    "",
    "android {",
    "    namespace '" + packageName + "'",
    "    compileSdk 34",
    "",
    "    defaultConfig {",
    '        applicationId "' + packageName + '"',
    "        minSdk 24",
    "        targetSdk 34",
    "        versionCode 1",
    '        versionName "1.0"',
    "    }",
    "",
    "    buildTypes {",
    "        release {",
    "            minifyEnabled false",
    "            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'",
    "        }",
    "    }",
    "    compileOptions {",
    "        sourceCompatibility JavaVersion.VERSION_17",
    "        targetCompatibility JavaVersion.VERSION_17",
    "    }",
    "}",
    "",
    "dependencies {",
    "    implementation 'androidx.appcompat:appcompat:1.6.1'",
    "    implementation 'com.google.android.material:material:1.11.0'",
    "    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'",
    "    implementation 'androidx.webkit:webkit:1.9.0'",
    "}",
  ].join('\n');

  const proguard = "# ProGuard rules\n";

  const mainActivity = [
    "package " + packageName + ";",
    "",
    "import android.os.Bundle;",
    "import android.webkit.WebChromeClient;",
    "import android.webkit.WebResourceRequest;",
    "import android.webkit.WebResourceResponse;",
    "import android.webkit.WebSettings;",
    "import android.webkit.WebView;",
    "import android.webkit.WebViewClient;",
    "import androidx.appcompat.app.AppCompatActivity;",
    "import androidx.webkit.WebViewAssetLoader;",
    "",
    "public class " + safeName + "Activity extends AppCompatActivity {",
    "",
    "    private WebView webView;",
    "    private WebViewAssetLoader assetLoader;",
    "",
    "    @Override",
    "    protected void onCreate(Bundle savedInstanceState) {",
    "        super.onCreate(savedInstanceState);",
    "        setContentView(R.layout.activity_main);",
    "",
    "        webView = findViewById(R.id.webview);",
    "        WebSettings settings = webView.getSettings();",
    "",
    "        settings.setJavaScriptEnabled(true);",
    "        settings.setDomStorageEnabled(true);",
    "        settings.setDatabaseEnabled(true);",
    "        settings.setCacheMode(WebSettings.LOAD_DEFAULT);",
    "        settings.setAllowFileAccess(true);",
    "        settings.setAllowContentAccess(true);",
    "        settings.setMediaPlaybackRequiresUserGesture(false);",
    "        settings.setUseWideViewPort(true);",
    "        settings.setLoadWithOverviewMode(true);",
    "",
    "        assetLoader = new WebViewAssetLoader.Builder()",
    '            .addPathHandler("/", new WebViewAssetLoader.AssetsPathHandler(this))',
    "            .build();",
    "",
    "        webView.setWebViewClient(new WebViewClient() {",
    "            @Override",
    "            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {",
    "                return assetLoader.shouldInterceptRequest(request.getUrl());",
    "            }",
    "        });",
    "        webView.setWebChromeClient(new WebChromeClient());",
    "",
    '        webView.loadUrl("https://appassets.androidplatform.net/index.html");',
    "    }",
    "",
    "    @Override",
    "    public void onBackPressed() {",
    "        if (webView != null && webView.canGoBack()) {",
    "            webView.goBack();",
    "        } else {",
    "            super.onBackPressed();",
    "        }",
    "    }",
    "}",
  ].join('\n');

  const activityLayout = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<androidx.constraintlayout.widget.ConstraintLayout',
    '    xmlns:android="http://schemas.android.com/apk/res/android"',
    '    xmlns:app="http://schemas.android.com/apk/res-auto"',
    '    android:layout_width="match_parent"',
    '    android:layout_height="match_parent">',
    '    <WebView',
    '        android:id="@+id/webview"',
    '        android:layout_width="0dp"',
    '        android:layout_height="0dp"',
    '        app:layout_constraintTop_toTopOf="parent"',
    '        app:layout_constraintBottom_toBottomOf="parent"',
    '        app:layout_constraintStart_toStartOf="parent"',
    '        app:layout_constraintEnd_toEndOf="parent" />',
    '</androidx.constraintlayout.widget.ConstraintLayout>',
  ].join('\n');

  const stringsXml = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<resources>',
    '    <string name="app_name">' + appName + '</string>',
    '</resources>',
  ].join('\n');

  const colorsXml = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<resources>',
    '    <color name="purple_500">#FF6200EE</color>',
    '    <color name="purple_700">#FF3700B3</color>',
    '    <color name="black">#FF000000</color>',
    '    <color name="white">#FFFFFFFF</color>',
    '</resources>',
  ].join('\n');

  const themesXml = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<resources>',
    '    <style name="Theme.' + safeName + '" parent="Theme.Material3.Dark.NoActionBar">',
    '        <item name="colorPrimary">@color/purple_500</item>',
    '        <item name="colorPrimaryVariant">@color/purple_700</item>',
    '        <item name="android:statusBarColor">@color/black</item>',
    '        <item name="android:navigationBarColor">@color/black</item>',
    '    </style>',
    '</resources>',
  ].join('\n');

  const icForeground = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<vector xmlns:android="http://schemas.android.com/apk/res/android"',
    '    android:width="108dp"',
    '    android:height="108dp"',
    '    android:viewportWidth="108"',
    '    android:viewportHeight="108">',
    '    <path android:fillColor="#EF4444" android:pathData="M30,54 L44,30 L58,54 L44,78 Z" />',
    '    <path android:fillColor="#3B82F6" android:pathData="M58,54 L72,30 L86,54 L72,78 Z" />',
    '</vector>',
  ].join('\n');

  const icLauncher = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">',
    '    <background android:drawable="@color/purple_500"/>',
    '    <foreground android:drawable="@drawable/ic_launcher_foreground"/>',
    '</adaptive-icon>',
  ].join('\n');

  const manifest = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<manifest xmlns:android="http://schemas.android.com/apk/res/android">',
    '    <uses-permission android:name="android.permission.INTERNET" />',
    '    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />',
    '    <application',
    '        android:allowBackup="true"',
    '        android:icon="@mipmap/ic_launcher"',
    '        android:label="@string/app_name"',
    '        android:roundIcon="@mipmap/ic_launcher"',
    '        android:supportsRtl="true"',
    '        android:theme="@style/Theme.' + safeName + '"',
    '        android:usesCleartextTraffic="true">',
    '        <activity',
    '            android:name=".' + safeName + 'Activity"',
    '            android:exported="true"',
    '            android:configChanges="orientation|screenSize|keyboardHidden|smallestScreenSize">',
    '            <intent-filter>',
    '                <action android:name="android.intent.action.MAIN" />',
    '                <category android:name="android.intent.category.LAUNCHER" />',
    '            </intent-filter>',
    '        </activity>',
    '    </application>',
    '</manifest>',
  ].join('\n');

  const readme = [
    '# ' + appName + ' - Android App',
    '',
    '**Generated by Red Whale V1**',
    '',
    '## Build Steps',
    '',
    '1. Extract ZIP',
    '2. Open Android Studio (latest version)',
    '3. File -> Open -> Select extracted folder',
    '4. Wait for Gradle Sync (2-3 min first time)',
    '5. Connect phone or start emulator',
    '6. Click Run (green play button)',
    '',
    '## How It Works',
    '',
    'This app uses AndroidX WebViewAssetLoader - the official modern API for running web apps inside Android. It serves your web app over a secure local HTTPS URL, so all features work identically (chat, AI, settings, themes). BrowserRouter, localStorage, fetch(), and JavaScript all work perfectly.',
    '',
    '## Requirements',
    '',
    '- Android Studio Hedgehog+ (2023.1.1)',
    '- Android SDK 34',
    '- JDK 17',
    '',
    '## Troubleshooting',
    '',
    'Blank screen?',
    '- Make sure ALL files were extracted from the ZIP',
    '- Check app/src/main/assets/ has index.html and asset files',
    '- Try Build -> Clean Project -> Rebuild Project',
    '',
    'Gradle sync fails?',
    '- Update Android Studio to latest version',
    '- Install SDK 34 via Tools -> SDK Manager',
  ].join('\n');

  return {
    'build.gradle': buildGradle,
    'settings.gradle': settingsGradle,
    'gradle.properties': gradleProps,
    'app/build.gradle': appBuildGradle,
    'app/proguard-rules.pro': proguard,
    ['app/src/main/java/' + pkgPath + '/' + safeName + 'Activity.java']: mainActivity,
    'app/src/main/res/layout/activity_main.xml': activityLayout,
    'app/src/main/res/values/strings.xml': stringsXml,
    'app/src/main/res/values/colors.xml': colorsXml,
    'app/src/main/res/values/themes.xml': themesXml,
    'app/src/main/res/drawable/ic_launcher_foreground.xml': icForeground,
    'app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml': icLauncher,
    'app/src/main/AndroidManifest.xml': manifest,
    'README.md': readme,
  };
}

export async function exportAndroidApp(
  appName: string = 'Red Whale',
  packageName: string = 'com.redwhale.app',
  onProgress?: (msg: string, current: number, total: number) => void
): Promise<{ success: boolean; filename?: string; message: string }> {
  try {
    const zip = new JSZip();
    const safeName = appName.replace(/\s+/g, '');

    onProgress?.('Creating Android project...', 5, 100);
    const androidFiles = getAndroidProject(appName, packageName);
    for (const [path, content] of Object.entries(androidFiles)) {
      zip.file(safeName + '/' + path, content);
    }

    onProgress?.('Scanning web app files...', 15, 100);
    const webFiles = await discoverDistFiles();
    const entries = Object.entries(webFiles);

    if (entries.length === 0) {
      return {
        success: false,
        message: 'Could not read web app files. Make sure the project is built (npm run build).'
      };
    }

    let idx = 0;
    for (const [path, content] of entries) {
      zip.file(safeName + '/app/src/main/assets/' + path, content);
      idx++;
      onProgress?.('Adding ' + path + '...', 20 + Math.round((idx / entries.length) * 70), 100);
    }

    onProgress?.('Creating ZIP...', 95, 100);
    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    });

    const filename = safeName + '-Android-' + new Date().toISOString().split('T')[0] + '.zip';
    saveAs(blob, filename);

    onProgress?.('Done!', 100, 100);
    return {
      success: true,
      filename,
      message: 'Android Studio project exported! Extract, open in Android Studio, and click Run.'
    };
  } catch (error: any) {
    return { success: false, message: 'Export failed: ' + (error.message || 'Unknown error') };
  }
}
