# 🎯 Pensamiento Estratégico

Aplicación móvil para analizar decisiones de forma estratégica, visualizar consecuencias y aprender de los resultados.

## 📱 Características

- ✅ Analiza decisiones con múltiples escenarios
- ✅ Visualiza cadenas de consecuencias (10 pasos)
- ✅ Guarda decisiones pendientes de resultado
- ✅ Registra resultados días/semanas/meses después
- ✅ Estadísticas de tus decisiones
- ✅ Autenticación con email o Google
- ✅ Base de datos en tiempo real con Firebase
- ✅ Optimizada para móvil

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/strategic-thinking-app.git
cd strategic-thinking-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Firebase

#### Crear proyecto en Firebase:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Activa **Authentication**:
   - Ve a Authentication > Sign-in method
   - Habilita "Correo electrónico/Contraseña"
   - Habilita "Google" (opcional)
4. Activa **Firestore Database**:
   - Ve a Firestore Database
   - Crea base de datos en modo producción
   - Selecciona la región más cercana

#### Obtener credenciales:

1. Ve a Configuración del proyecto (⚙️)
2. En "Tus apps", haz clic en el ícono web (</>)
3. Registra la app y copia la configuración

#### Configurar en el proyecto:

Edita `src/config/firebase.js` con tus credenciales:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

#### Configurar reglas de Firestore:

En Firebase Console > Firestore > Reglas, pega:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios solo pueden leer/escribir sus propias decisiones
    match /users/{userId}/decisions/{decisionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador o móvil.

## 📦 Despliegue

### Opción 1: Firebase Hosting (Recomendado)

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar hosting
firebase init hosting

# Construir y desplegar
npm run build
firebase deploy
```

### Opción 2: Vercel

```bash
npm install -g vercel
vercel
```

### Opción 3: Netlify

```bash
npm run build
# Arrastra la carpeta 'dist' a Netlify
```

## 📁 Estructura del proyecto

```
strategic-thinking-app/
├── src/
│   ├── components/
│   │   ├── AnalysisScreen.jsx    # Pantalla de análisis
│   │   ├── HistoryScreen.jsx     # Historial de decisiones
│   │   ├── ProfileScreen.jsx     # Perfil y estadísticas
│   │   ├── LoginScreen.jsx       # Login/Registro
│   │   └── MainApp.jsx           # App principal
│   ├── hooks/
│   │   ├── useAuth.js            # Hook de autenticación
│   │   └── useDecisions.js       # Hook de decisiones
│   ├── config/
│   │   └── firebase.js           # Configuración Firebase
│   ├── styles/
│   │   └── app.css               # Estilos globales
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Tecnologías

- **React 18** - UI
- **Vite** - Build tool
- **Firebase Auth** - Autenticación
- **Firestore** - Base de datos
- **CSS3** - Estilos (optimizados para móvil)

## 📱 Instalar como App (PWA)

En tu móvil:
- **iOS**: Safari > Compartir > "Añadir a pantalla de inicio"
- **Android**: Chrome > Menú > "Añadir a pantalla de inicio"

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcion`)
3. Commit (`git commit -m 'Añadir nueva función'`)
4. Push (`git push origin feature/nueva-funcion`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - usa el código como quieras.

---

Hecho con 💜 para tomar mejores decisiones
