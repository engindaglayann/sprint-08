import mongoose from "mongoose";
import "dotenv/config";
import Event from "./models/event.js";

const dbURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kampus";

export const initialEvents = [
  {
    title: "Yazılım Sektöründe Kariyer Zirvesi 2026",
    category: "Seminer",
    capacity: 150,
    date: "2026-10-15",
    time: "13:30",
    location: "Merkez Amfi 1",
    description: "Büyük teknoloji şirketlerinden kıdemli mühendislerle kariyer planlama, mülakat teknikleri ve staj fırsatları üzerine interaktif söyleşi.",
  },
  {
    title: "Modern Web Mimarileri ve Mikroservis Atölyesi",
    category: "Atölye",
    capacity: 35,
    date: "2026-10-22",
    time: "10:00",
    location: "Mühendislik Fakültesi Lab 3",
    description: "Node.js, Express ve Docker ile ölçeklenebilir RESTful mikroservis mimarileri ve canlı kodlama uygulaması.",
  },
  {
    title: "Üretken Yapay Zeka ve LLM Geliştirme Konferansı",
    category: "Konferans",
    capacity: 200,
    date: "2026-11-02",
    time: "14:00",
    location: "Kongre ve Kültür Merkezi",
    description: "Büyük dil modellerinin mimarisi, yapay zeka ajanları ve modern yazılım süreçlerine entegrasyon yöntemleri.",
  },
  {
    title: "Etik Hackerlık ve Ağ Güvenliği Pratikleri",
    category: "Atölye",
    capacity: 40,
    date: "2026-11-12",
    time: "11:00",
    location: "Siber Güvenlik Laboratuvarı",
    description: "Web uygulamalarında yaygın güvenlik açıkları (OWASP Top 10), sızma testi temelleri ve güvenli kodlama teknikleri.",
  },
  {
    title: "Teknoloji Girişimciliği ve Tohum Yatırım Paneli",
    category: "Söyleşi",
    capacity: 90,
    date: "2026-11-20",
    time: "15:00",
    location: "İnovasyon Merkezi Seminer Salonu",
    description: "Fikirden ürüne geçiş süreci, tohum yatırım arayışı ve girişim hızlandırıcı programlarına kabul stratejileri.",
  },
  {
    title: "Bulut Bilişim ve DevOps Dönüşümü",
    category: "Seminer",
    capacity: 110,
    date: "2026-11-28",
    time: "14:00",
    location: "Mavi Salon",
    description: "CI/CD süreçleri, Kubernetes küme yönetimi ve bulut altyapılarında maliyet optimizasyonu yöntemleri.",
  },
];

async function seedDatabase() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(dbURI);
    }
    console.log("MongoDB bağlantısı başarılı:", dbURI);

    // İki kez veya daha fazla çalıştırılsa bile toplam 6 kayıt kalmasını garanti etmek için
    await Event.deleteMany({});
    console.log("Eski kayıtlar temizlendi.");

    const inserted = await Event.insertMany(initialEvents);
    console.log(`${inserted.length} etkinlik başarıyla eklendi.`);

    const count = await Event.countDocuments();
    console.log(`Güncel toplam etkinlik sayısı: ${count}`);

    await mongoose.connection.close();
    console.log("Mongoose bağlantısı kapatıldı.");
    process.exit(0);
  } catch (err) {
    console.error("Seed işlemi sırasında hata:", err);
    process.exit(1);
  }
}

// Komut satırından çağrıldığında çalıştır
seedDatabase();
