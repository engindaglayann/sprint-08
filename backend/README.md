# Kampüs Etkinlikleri — Backend REST API (Sprint 8: MongoDB & Mongoose)

- **Öğrenci Adı:** Engin Dağlayan  
- **Öğrenci Numarası:** 2416501069  

Bu proje, Kampüs Etkinlikleri platformunun Express ve Mongoose tabanlı RESTful API sunucusudur. Sprint 8 kapsamında etkinlik verileri bellek içi (in-memory) diziden çıkarılarak **MongoDB** veritabanına taşınmış ve kalıcı hale getirilmiştir.

---

## 🚀 Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükleme
```bash
cd backend
npm install
```

### 2. Veritabanını Doldurma (Seed)
Aşağıdaki komut koleksiyonu sıfırlar ve 6 başlangıç etkinliğini MongoDB'ye ekler (iki kez çalıştırıldığında da kayıt sayısı 6 kalır):
```bash
npm run seed
```

### 3. Geliştirme Sunucusunu Başlatma
Sunucu `node --watch` desteğiyle kod değişikliklerinde otomatik yeniden başlar:
```bash
npm run dev
```
Sunucu varsayılan olarak `http://localhost:3000` adresinde dinlemeye başlar.

### 4. Testleri Çalıştırma
Tüm Sprint 8 isterlerini doğrulayan otomatik test paketi:
```bash
npm test
```

---

## ⚙️ Ortam Değişkenleri (.env)

Sunucu yapılandırması `backend/.env` dosyası üzerinden yapılır:

| Değişken | Açıklama | Varsayılan Değer |
|---|---|---|
| `PORT` | API sunucusunun çalışacağı port | `3000` |
| `MONGODB_URI` | MongoDB bağlantı dizesi (Yerel veya Atlas) | `mongodb://127.0.0.1:27017/kampus` |

Örnek `.env` dosyası repoda `.env.example` olarak yer almaktadır:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/kampus?retryWrites=true&w=majority
```
Gerçek `.env` dosyası ve `node_modules` klasörü `.gitignore` ile korunmaktadır.

---

## 🗄️ Mongoose Şeması ve Modeli

`backend/src/models/event.js` içinde tanımlanan şema:

- **`title`**: String, `required: true`, `trim: true`, `minlength: 3` (kısıt)
- **`category`**: String, `required: true`, `trim: true`, `enum: ["Seminer", "Atölye", "Konferans", "Söyleşi", "Yarışma"]` (kısıt)
- **`date`**: String, `required: true`, `trim: true`
- **`capacity`**: Number, `required: true`, `min: 0` (kısıt)
- **`time`**: String, `trim: true`
- **`location`**: String, `trim: true`
- **`description`**: String, `trim: true`
- **`image`**: String, `trim: true`
- **`timestamps`**: `{ timestamps: true }` (Otomatik `createdAt` ve `updatedAt`)

---

## 📜 REST API Sözleşmesi

| Yöntem | Endpoint | Amaç | Başarılı Yanıt | Hata Yanıtı | Durum |
|---|---|---|---|---|---|
| `GET` | `/health` | Sunucu sağlık ve öğrenci bilgisi kontrolü | `200 OK` | — | Aktif |
| `GET` | `/events` | MongoDB'deki etkinlikleri listeler (kategori filtresi destekler) | `200 OK` | `500 Server Error` | Aktif (Sprint 8) |
| `GET` | `/events/:id` | ID'si verilen etkinliğin detaylarını getirir | `200 OK` | `404 Not Found` (Olmayan / Geçersiz ID) | Aktif (Sprint 8) |
| `POST` | `/events` | MongoDB'ye yeni etkinlik oluşturur (Kalıcı veri) | `201 Created` | `400 Bad Request` (Eksik / Hatalı veri) | Aktif (Sprint 8) |

---

## ⚠️ Hata Yanıtları ve Çökme Koruması

Tüm hata yanıtları standart JSON şemasında iletilir ve sunucu asla çökmez:

```json
{
  "error": {
    "message": "Hata açıklaması"
  }
}
```

Örnek Senaryolar:
1. **Olmayan ID veya Geçersiz ID (404):** `GET /events/yok` veya `GET /events/507f1f77bcf86cd799439011`
   ```json
   {
     "error": {
       "message": "Event not found"
     }
   }
   ```
2. **Eksik Veri (400):** `POST /events` gövdesinde `title`, `category` veya `date` eksik olduğunda:
   ```json
   {
     "error": {
       "message": "title, category and date are required"
     }
   }
   ```

---

## 🧪 Postman İstek Koleksiyonu (15/15 Test)

`backend/requests/kampus-api.json` dosyası hocanın test ettiği 6 istek ve 15 test assertion'ı ile birebir uyumludur:
1. `GET 1 Health` (3 test: Status 200, status 'ok', öğrenci numarası doğrulaması)
2. `GET 2 Etkinlik listesi` (3 test: Status 200, dizi kontrolü, _id ve createdAt varlığı)
3. `GET 3 Tek etkinlik` (3 test: Status 200, istenen _id eşleşmesi, başlık ve kategori varlığı)
4. `GET 4 Olmayan etkinlik (404)` (2 test: Status 404, 'Event not found' hata mesajı)
5. `POST 5 Etkinlik oluştur (201)` (2 test: Status 201, yeni etkinlik _id ve doğru başlık)
6. `POST 6 Eksik veri (400)` (2 test: Status 400, doğrulama hata mesajı)
