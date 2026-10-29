# Ruang Belajar — Algoritma dan Pemrograman

Ruang belajar interaktif tujuh pertemuan berdasarkan materi PDF yang ada di direktori ini. Data pelajaran berada di `courseData.js`, jawaban kisi-kisi UTS berada di `utsGuide.js`, antarmuka di `app.js`/`visualizations.js`, dan gaya editorial di `styles.css`.

## Menjalankan lokal

```sh
npm start
```

Buka `http://localhost:4174`. Alternatif tanpa Node server khusus: `python3 -m http.server 4174`.

Progress baca, tema, flashcard, dan jawaban kuis tersimpan di localStorage browser. PDF sumber dikecualikan dari Git dan deployment.

## Isi

- 7 modul: konsep algoritma, logika pemrograman, variabel/tipe data/operator, pseudocode/flowchart, IPO, percabangan, dan percabangan ganda/majemuk.
- Diagram berlabel di setiap subbab; tracer langkah demi langkah dengan baris aktif, state variabel, dan output untuk seluruh modul.
- Navigasi topik yang mengikuti posisi baca, progres gulir, kontrol ukuran teks, dan mode baca fokus.
- Simulasi khas tiap materi, pencarian full-text berperingkat yang toleran typo ringan dan melompat ke konsep/simulasi, ringkasan ujian, progres tersimpan, flashcards, kuis, dan tema gelap.
- Tabel kebenaran interaktif AND/OR/NOT dengan pilihan kombinasi dan penjelasan hasil; tab kisi-kisi UTS berisi enam pokok soal, contoh konversi ke Python, dan rujukan langsung ke materi.
