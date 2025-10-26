# MobileDe Clone - Auto Marketplace

O platformă simplă de marketplace auto construită cu HTML, CSS și JavaScript vanilla, inspirată de mobile.de.

## 📁 Structura Proiectului

```
mobilede-clone/
├── index.html          # Pagina principală cu formular căutare și carousel
├── results.html        # Pagina rezultate cu filtrare și sortare
├── details.html        # Pagina detalii vehicul cu galerie și contact
├── post.html           # Pagina adăugare anunț nou
├── css/
│   └── style.css       # Stiluri CSS complete cu responsive design
├── js/
│   ├── main.js         # Funcții utilitare și navbar
│   ├── home.js         # Logica paginii principale
│   ├── results.js      # Logica paginii rezultate
│   ├── details.js      # Logica paginii detalii
│   └── post.js         # Logica paginii adăugare anunț
├── data/
│   └── cars.json       # Date mock cu 8 mașini
└── images/             # Directorul pentru imagini (placeholder)
```

## 🚀 Funcționalități Implementate

### ✅ Etapa 1: Configurare Proiect
- [x] Structură directoare completă
- [x] HTML boilerplate pentru toate paginile
- [x] Linking CSS și JS în toate paginile

### ✅ Etapa 2: Navbar și Footer Comun
- [x] Navbar sticky cu logo
- [x] Linkuri: Căutare, Adaugă Anunț, Autentificare
- [x] Meniu hamburger responsive pentru mobil
- [x] Footer cu link-uri, termeni, politici, social media

### ✅ Etapa 3: Pagina Principală (index.html)
- [x] Formular căutare cu filtre multiple
- [x] Dropdown-uri: Marcă, Model, Combustibil, Transmisie
- [x] Range-uri: Preț, Kilometraj, An fabricație
- [x] Carousel imagini promo (auto-advance + control manual)
- [x] Secțiune mașini recomandate
- [x] Redirect către results.html cu parametri URL

### ✅ Etapa 4: Pagina Rezultate (results.html)
- [x] Parsare parametri URL cu URLSearchParams
- [x] Încărcare mock data din cars.json
- [x] Filtrare dinamică pe baza parametrilor
- [x] Afișare carduri auto cu imagine, titlu, preț, detalii
- [x] Link către details.html?id=X
- [x] Filtrare activă fără reload
- [x] Sortare după: preț, an, km (crescător/descrescător)
- [x] Display filtre active cu opțiune de ștergere

### ✅ Etapa 5: Pagina Detalii (details.html)
- [x] Citire ID din query string
- [x] Încărcare date din cars.json
- [x] Galerie imagini cu thumbnails
- [x] Descriere detaliată
- [x] Specificații tehnice în grid
- [x] Buton "Contactează Vânzătorul"
- [x] Modal popup contact cu formular

### ✅ Etapa 6: Pagina Adăugare Anunț (post.html)
- [x] Formular complet cu toate câmpurile
- [x] Input-uri: marcă, model, an, km, combustibil, transmisie, preț, descriere
- [x] Upload imagini cu preview local
- [x] Drag & drop pentru imagini
- [x] Validare JS completă
- [x] Verificare câmpuri obligatorii
- [x] Validare range-uri (an, km, preț)
- [x] Simulare trimitere (console.log + localStorage)

### ✅ Etapa 7: Responsive Design
- [x] Mobile-first approach
- [x] Media queries pentru toate dimensiunile
- [x] Navbar hamburger menu pe mobil
- [x] Grid adaptiv pentru carduri
- [x] Form responsive cu coloane adaptive

### ✅ Etapa 8: Testare și Finalizare
- [x] Navigare completă: homepage → rezultate → detalii → back
- [x] Toate filtrele și sortările funcționale
- [x] Lazy loading pentru imagini (onerror handlers)
- [x] Optimizare cod (funcții reutilizabile în main.js)

## 🎯 Cum să Folosești

### 1. Deschide Proiectul

Simplu deschide `index.html` în browser:

```bash
# Navighează în directorul mobilede-clone
cd mobilede-clone

# Deschide cu browser
open index.html  # macOS
start index.html  # Windows
xdg-open index.html  # Linux
```

Sau folosește un server local:

```bash
# Cu Python 3
python -m http.server 8000

# Cu Node.js
npx serve

# Apoi deschide http://localhost:8000
```

### 2. Testează Funcționalitățile

**Pagina Principală:**
- Completează formularul de căutare
- Testează carousel-ul (auto-advance și butoane)
- Click pe "Caută Mașini"

**Pagina Rezultate:**
- Vezi rezultatele filtrate
- Testează sortarea
- Șterge filtre active
- Click pe "Vezi Detalii"

**Pagina Detalii:**
- Vezi galeria imagini
- Click pe thumbnails
- Click pe "Contactează Vânzătorul"
- Completează formularul contact

**Pagina Adăugare Anunț:**
- Completează formularul
- Upload imagini (drag & drop sau click)
- Testează validarea
- Trimite formularul

## 📦 Date Mock

Fișierul `data/cars.json` conține 8 mașini cu:
- ID unic
- Marcă, model, an, kilometraj
- Combustibil, transmisie
- Preț, descriere
- Array de imagini
- Specificații tehnice complete
- Informații contact vânzător

## 🎨 Design Features

- **Culori:** Paletă modernă (albastru #3498db, verde #27ae60, dark #2c3e50)
- **Animații:** Hover effects, transitions smooth
- **Tipografie:** Segoe UI, fallback la sans-serif
- **Layout:** Grid și Flexbox modern
- **Icons:** Emoji pentru rapid prototyping

## 🔧 Tehnologii Folosite

- **HTML5:** Semantic markup
- **CSS3:** Grid, Flexbox, Animations, Media Queries
- **JavaScript ES6+:** Async/await, Arrow functions, Template literals
- **LocalStorage:** Pentru salvare temporară anunțuri
- **URLSearchParams:** Pentru managementul parametrilor URL
- **Fetch API:** Pentru încărcare JSON

## 🌟 Bonus Features Implementate

- [x] Carousel auto-advance
- [x] Loading states
- [x] Error handling
- [x] Image error fallbacks (placeholder)
- [x] Drag & drop upload
- [x] Active filters display
- [x] Modal popup
- [x] LocalStorage persistence
- [x] Smooth scrolling
- [x] Form validation în timp real

## 🚀 Îmbunătățiri Viitoare (Opțional)

- [ ] Dark mode toggle
- [ ] LocalStorage pentru favorite
- [ ] Infinite scroll în results
- [ ] Advanced filters (culoare, dotări)
- [ ] Comparare mașini side-by-side
- [ ] Integrare cu API real
- [ ] User authentication
- [ ] Backend pentru salvare anunțuri

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Licență

MIT License - Free to use for learning and personal projects.

## 👤 Author

Created as a learning project following the Romanian MobileDe Clone specification.

---

**Enjoy exploring the code! 🚗💨**
