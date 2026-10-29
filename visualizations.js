const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const pill = (label, action, value, active, id = '') => `<button ${id ? `id="${esc(id)}"` : ''} class="pill-button ${active ? 'active' : ''} ${id ? 'search-result-target' : ''}" data-action="${action}" data-value="${esc(value)}">${esc(label)}</button>`;
const head = (title, copy, tag = 'SIMULASI') => `<div class="visual-panel-head"><div><h3>${title}</h3><p>${copy}</p></div><span class="visual-label">${tag}</span></div>`;
const detail = (title, copy) => `<div class="detail-box"><strong>${esc(title)}</strong><p>${esc(copy)}</p></div>`;
const field = (label, key, value, type = 'number', attrs = '') => `<label class="sim-field"><span>${label}</span><input type="${type}" data-state="${key}" value="${esc(value)}" ${attrs}/></label>`;
const money = value => `Rp${Number(value || 0).toLocaleString('id-ID', { maximumFractionDigits: 2 })}`;

export function renderVisuals(mod, ui) {
  const renderer = { m1: m1, m2: m2, m3: m3, m4: m4, m5: m5, m6: m6, m7: m7 }[mod.id];
  return renderer ? `${renderer(mod, ui)}${renderTracer(mod, ui)}` : '';
}

const inlineMaps = {
  m1: [
    { title: 'Dari masalah menjadi program', layout: 'flow', legend: 'Ikuti panah dari masalah sampai solusi dapat dijalankan.', nodes: [['Masalah', 'Tujuan yang perlu diselesaikan', 'input'], ['Algoritma', 'Langkah logis dan terhingga', 'process'], ['Pseudocode / flowchart', 'Rancangan yang mudah ditinjau', 'process'], ['Program', 'Implementasi pada komputer', 'output']] },
    { title: 'Lima karakteristik algoritma', layout: 'cards', legend: 'Semua sifat ini membantu memeriksa apakah langkah dapat dijalankan.', nodes: [['Input', 'Data yang dibutuhkan', 'input'], ['Output', 'Hasil yang diharapkan', 'output'], ['Jelas', 'Tidak ambigu', 'decision'], ['Berhingga', 'Pasti berakhir', 'process'], ['Efektif', 'Dapat dikerjakan', 'output']] },
    { title: 'Siklus pemecahan masalah', layout: 'flow', legend: 'Setiap tahap memeriksa dan memperbaiki kualitas solusi.', nodes: [['Pahami', 'Input · proses · output', 'input'], ['Rancang', 'Susun langkah', 'process'], ['Uji', 'Periksa kondisi', 'decision'], ['Optimalkan', 'Buang langkah tak perlu', 'process'], ['Implementasikan', 'Algoritma → program', 'output']] },
    { title: 'Aturan voucher e-commerce', layout: 'branches', legend: 'Keputusan menghasilkan satu cabang: Ya atau Tidak.', decision: 'Total belanja ≥ Rp500.000 DAN pelanggan terdaftar?', branches: [['YA', 'Voucher 10%', 'Kedua syarat terpenuhi', 'yes'], ['TIDAK', 'Tanpa voucher', 'Satu atau lebih syarat tidak terpenuhi', 'no']] },
  ],
  m2: [
    { title: 'Tiga pola dasar logika', layout: 'cards', legend: 'Urutan, pilihan, dan pengulangan dapat digabung dalam satu algoritma.', nodes: [['Sequence', 'Instruksi berurutan', 'input'], ['Selection', 'Pilih aksi dari kondisi', 'decision'], ['Repetition', 'Ulangi proses', 'process']] },
    { title: 'Empat pilar computational thinking', layout: 'flow', legend: 'Pilar bergerak dari memahami masalah ke prosedur solusi.', nodes: [['Dekomposisi', 'Bagi masalah', 'input'], ['Pola', 'Cari kemiripan', 'decision'], ['Abstraksi', 'Saring detail penting', 'process'], ['Algoritma', 'Rangkai langkah solusi', 'output']] },
    { title: 'Dekomposisi aktivitas', layout: 'flow', legend: 'Subtugas kecil dapat dikerjakan dan diperiksa satu per satu.', nodes: [['Masalah besar', 'Contoh: menyiapkan nasi goreng', 'input'], ['Subtugas', 'Bahan · bumbu · memasak', 'process'], ['Urutan kerja', 'Susun dependensi', 'decision'], ['Hasil', 'Sajian siap', 'output']] },
    { title: 'Siklus membangun program', layout: 'cards', legend: 'Pengujian mencakup data normal dan kasus batas.', nodes: [['Pahami', 'Input, output, batasan', 'input'], ['Rancang', 'Pseudocode / flowchart', 'process'], ['Coding', 'Terjemahkan solusi', 'process'], ['Uji & debug', 'Bandingkan hasil', 'decision'], ['Dokumentasi', 'Pelihara dan kembangkan', 'output']] },
  ],
  m3: [
    { title: 'Nilai tersimpan di variabel bernama', layout: 'flow', legend: 'Assignment memperbarui isi variabel; identifier tetap menjadi labelnya.', nodes: [['Identifier', 'umur', 'input'], ['Isi memori', '20 → 21', 'process'], ['Dipakai', 'dalam ekspresi', 'output']] },
    { title: 'Pilih tipe sesuai nilai', layout: 'cards', legend: 'Tipe data memengaruhi operasi yang sesuai untuk sebuah nilai.', nodes: [['int', '42 · bilangan bulat', 'input'], ['float', '3.75 · desimal', 'process'], ['str', '"Halo" · teks', 'output'], ['bool', 'True / False', 'decision']] },
    { title: 'Operator mengubah atau membandingkan nilai', layout: 'cards', legend: 'Hasil perbandingan dan logika berupa boolean: True atau False.', nodes: [['Aritmatika', '+ − × ÷ % **', 'process'], ['Relasional', '== != > < >= <=', 'decision'], ['Logika', 'and · or · not', 'output']] },
    { title: 'Urutan evaluasi operator', layout: 'flow', legend: 'Gunakan tanda kurung untuk memperjelas urutan yang diinginkan.', nodes: [['( )', 'Kelompokkan dahulu', 'input'], ['**', 'Pangkat', 'process'], ['× ÷ // %', 'Kali / bagi', 'process'], ['+ −', 'Tambah / kurang', 'process'], ['Perbandingan', 'Hasil boolean', 'decision'], ['not → and → or', 'Logika', 'output']] },
  ],
  m4: [
    { title: 'Representasi solusi', layout: 'flow', legend: 'Rancangan berada di antara masalah dan implementasi program.', nodes: [['Masalah', 'Pahami tujuan', 'input'], ['Algoritma', 'Urutan langkah', 'process'], ['Pseudocode / flowchart', 'Representasikan alur', 'decision'], ['Program', 'Implementasikan', 'output']] },
    { title: 'Anatomi pseudocode', layout: 'cards', legend: 'Pemisahan bagian membuat data dan urutan aksi mudah ditinjau.', nodes: [['Judul', 'Nama algoritma', 'input'], ['Deklarasi', 'Variabel dan tipe', 'process'], ['Deskripsi', 'Langkah penyelesaian', 'output']] },
    { title: 'Simbol menunjukkan jenis langkah', layout: 'cards', legend: 'Gunakan bentuk sesuai fungsi: awal/akhir, data, proses, atau keputusan.', nodes: [['Terminator', 'Mulai / Selesai', 'output'], ['Input / Output', 'Baca / tampilkan', 'input'], ['Process', 'Hitung / tetapkan', 'process'], ['Decision', 'Kondisi Ya / Tidak', 'decision'], ['Flowline', 'Arah aliran', 'process']] },
    { title: 'Tiga struktur kontrol', layout: 'cards', legend: 'Pseudocode dan flowchart dapat menggambarkan ketiga struktur ini.', nodes: [['Sekuensial', 'Lanjut berurutan', 'input'], ['Seleksi', 'Pilih cabang', 'decision'], ['Perulangan', 'Ulangi sampai berhenti', 'process']] },
  ],
  m5: [
    { title: 'Transformasi IPO', layout: 'flow', legend: 'Data masuk diolah menjadi hasil atau informasi.', nodes: [['INPUT', 'harga · jumlah', 'input'], ['PROCESS', 'total = harga × jumlah', 'process'], ['OUTPUT', 'total pembayaran', 'output']] },
    { title: 'Rancang dari hasil yang diminta', layout: 'flow', legend: 'Mulai dari output, lalu telusuri data dan proses yang dibutuhkan.', nodes: [['Output', 'Apa yang harus ditampilkan?', 'output'], ['Input', 'Data apa yang diperlukan?', 'input'], ['Process', 'Aturan / rumus apa?', 'process'], ['Uji', 'Apakah hasil sesuai?', 'decision']] },
    { title: 'Tahapan nilai transaksi', layout: 'flow', legend: 'Setiap hasil proses menjadi masukan bagi hitungan berikutnya.', nodes: [['Harga × jumlah', 'Subtotal', 'input'], ['Subtotal × diskon%', 'Nilai diskon', 'process'], ['Subtotal − diskon', 'Total bayar', 'output']] },
    { title: 'Alur problem-based learning', layout: 'flow', legend: 'Kasus KampusMart bergerak dari pemahaman masalah ke evaluasi solusi.', nodes: [['Orientasi', 'Pahami kebutuhan', 'input'], ['Penyelidikan', 'Rumus dan data uji', 'process'], ['Kembangkan', 'Pseudocode / program', 'decision'], ['Evaluasi', 'Periksa hasil', 'output']] },
  ],
  m6: [
    { title: 'Kondisi menghasilkan True atau False', layout: 'branches', legend: 'Operator relasional/logika menghasilkan nilai boolean untuk percabangan.', decision: 'Apakah semua kondisi yang dibutuhkan terpenuhi?', branches: [['TRUE', 'Jalankan aksi', 'Masuk ke blok if', 'yes'], ['FALSE', 'Lewati blok', 'If tunggal tidak punya jalur else', 'no']] },
    { title: 'If tunggal', layout: 'branches', legend: 'Satu kondisi, satu aksi; kondisi False melewati aksi.', decision: 'nilai ≥ 60?', branches: [['YA · TRUE', 'Tampilkan “Lulus”', 'Aksi di dalam if dijalankan', 'yes'], ['TIDAK · FALSE', 'Lewati blok if', 'Tidak ada aksi alternatif', 'no']] },
    { title: 'Tiga pemeriksaan sintaks', layout: 'cards', legend: 'Operator, titik dua, dan indentasi menentukan makna blok if.', nodes: [['Perbandingan', '== bukan =', 'decision'], ['Titik dua', 'if kondisi:', 'input'], ['Indentasi', 'Aksi menjorok', 'process']] },
  ],
  m7: [
    { title: 'If-else menyediakan dua jalur', layout: 'branches', legend: 'Tepat satu cabang dijalankan untuk setiap evaluasi kondisi.', decision: 'Kondisi bernilai True?', branches: [['TRUE', 'Aksi if', 'Jalur ketika syarat terpenuhi', 'yes'], ['FALSE', 'Aksi else', 'Jalur untuk semua kasus lainnya', 'no']] },
    { title: 'Klasifikasi grade · cek batas tertinggi dahulu', layout: 'flow', legend: 'if-elif berhenti di kondisi pertama yang benar.', nodes: [['≥ 85', 'A', 'decision'], ['≥ 70', 'B', 'process'], ['≥ 55', 'C', 'process'], ['Selain itu', 'D', 'output']] },
    { title: 'Majemuk dan nested berbeda alur', layout: 'comparison', legend: 'Majemuk = kondisi sejajar; nested = keputusan lanjutan di dalam cabang.', columns: [['IF-ELIF', 'Nilai ≥85? → A', 'Nilai ≥70? → B', 'Nilai ≥55? → C'], ['NESTED', 'Member?', 'Ya → cek total belanja', 'Tidak → diskon 0%']] },
    { title: 'Grade lalu status kelulusan', layout: 'flow', legend: 'Keputusan kedua memakai hasil kategori yang ditentukan sebelumnya.', nodes: [['Nilai', 'Input skor', 'input'], ['if-elif', 'Tentukan grade A/B/C/D', 'decision'], ['Grade D?', 'Kondisi lanjutan', 'process'], ['Status', 'Lulus / Tidak Lulus', 'output']] },
  ],
};

export function renderInlineVisual(mod, sectionIndex) {
  const spec = inlineMaps[mod.id]?.[sectionIndex];
  if (!spec) return '';
  const content = spec.layout === 'branches'
    ? `<div class="inline-decision"><div class="decision-question"><span class="shape-icon" aria-hidden="true">?</span><strong>${esc(spec.decision)}</strong></div><div class="inline-branches">${spec.branches.map(([label, title, text, kind]) => `<div class="inline-branch ${kind}"><span>${esc(label)}</span><strong>${esc(title)}</strong><small>${esc(text)}</small></div>`).join('')}</div></div>`
    : spec.layout === 'comparison'
      ? `<div class="inline-comparison">${spec.columns.map(([title, ...items]) => `<div class="comparison-column"><strong>${esc(title)}</strong>${items.map(item => `<span>${esc(item)}</span>`).join('')}</div>`).join('')}</div>`
      : spec.layout === 'cards'
        ? `<div class="inline-card-grid">${spec.nodes.map(([title, text, kind]) => `<div class="inline-diagram-card ${kind}"><span class="diagram-mark" aria-hidden="true">${kind === 'decision' ? '?' : kind === 'input' ? 'IN' : kind === 'output' ? 'OUT' : '•'}</span><strong>${esc(title)}</strong><small>${esc(text)}</small></div>`).join('')}</div>`
        : `<div class="inline-flow">${spec.nodes.map(([title, text, kind], i) => `<div class="inline-flow-node ${kind}"><span class="flow-index">${String(i + 1).padStart(2, '0')}</span><strong>${esc(title)}</strong><small>${esc(text)}</small></div>${i < spec.nodes.length - 1 ? '<span class="inline-flow-arrow" aria-hidden="true">→</span>' : ''}`).join('')}</div>`;
  return `<figure class="inline-visual ${spec.layout === 'branches' ? 'branch-visual' : ''}" aria-label="${esc(spec.title)}"><div class="inline-visual-head"><span class="visual-label">PETA VISUAL · ${mod.no}.${String(sectionIndex + 1).padStart(2, '0')}</span><span class="visual-label">${spec.layout === 'branches' ? 'KEPUTUSAN' : spec.layout === 'cards' ? 'PETA KONSEP' : 'ALUR'}</span></div>${content}<div class="inline-visual-legend"><span><i class="legend-dot input"></i>Masukan / awal</span><span><i class="legend-dot process"></i>Proses</span><span><i class="legend-dot decision"></i>Keputusan</span><span><i class="legend-dot output"></i>Hasil</span></div><figcaption><strong>${esc(spec.title)}</strong><span>${esc(spec.legend)}</span></figcaption></figure>`;
}

const traceRow = (code, explanation, values = [], output = '') => ({ code, explanation, values, output });

export function getTraceSteps(mod, ui) {
  if (mod.id === 'm1') return mod.coffeeSteps.map((step, i) => traceRow(`${String(i + 1).padStart(2, '0')}. ${step.title}`, step.detail, [['langkah', `${i + 1} dari ${mod.coffeeSteps.length}`], ['tahap', step.kind]], i === mod.coffeeSteps.length - 1 ? 'Kopi siap disajikan' : ''));
  if (mod.id === 'm2') return [
    traceRow('n = 7', 'Terima bilangan bulat sebagai input.', [['n', '7']]),
    traceRow('sisa = n % 2', 'Hitung sisa bagi untuk menentukan genap atau ganjil.', [['n', '7'], ['sisa', '1']]),
    traceRow('if sisa == 0:', 'Uji kondisi. Nilai 1 tidak sama dengan 0, jadi kondisi False.', [['n', '7'], ['sisa', '1'], ['kondisi', 'False']]),
    traceRow('else: print("Ganjil")', 'Jalankan cabang else karena bilangan memiliki sisa pembagian.', [['n', '7'], ['sisa', '1'], ['kondisi', 'False']], 'Ganjil'),
  ];
  if (mod.id === 'm3') {
    const harga = 15000, jumlah = 3, ppn = 0.11, total = harga * jumlah, bayar = total + total * ppn;
    return [
      traceRow('harga = 15000', 'Tetapkan harga barang sebagai integer.', [['harga', '15000']]),
      traceRow('jumlah = 3', 'Tetapkan banyak barang yang dibeli.', [['harga', '15000'], ['jumlah', '3']]),
      traceRow('PPN = 0.11', 'Simpan tarif pajak sebagai float.', [['harga', '15000'], ['jumlah', '3'], ['PPN', '0.11']]),
      traceRow('total = harga * jumlah', 'Kalikan harga dengan jumlah barang.', [['harga', '15000'], ['jumlah', '3'], ['PPN', '0.11'], ['total', '45000']]),
      traceRow('bayar = total + total * PPN', 'Tambahkan PPN pada total transaksi.', [['total', '45000'], ['PPN', '0.11'], ['bayar', '49950.0']]),
      traceRow('print("Total bayar:", bayar)', 'Tampilkan hasil akhir kepada pengguna.', [['bayar', '49950.0']], 'Total bayar: 49950.0'),
    ];
  }
  if (mod.id === 'm4') {
    if (ui.example === 'selection') return [
      traceRow('baca(n) → n = 7', 'Baca nilai bilangan yang akan diuji.', [['n', '7']]),
      traceRow('n mod 2 = 0?', 'Hitung 7 mod 2 = 1; kondisi sama dengan 0 bernilai False.', [['n', '7'], ['sisa', '1'], ['kondisi', 'False']]),
      traceRow('SELAIN ITU tulis("Ganjil")', 'Pilih cabang selain kondisi benar.', [['n', '7'], ['sisa', '1']], 'Ganjil'),
    ];
    if (ui.example === 'loop') return [
      traceRow('baca(n) → n = 3', 'Jumlah perulangan ditentukan dari input.', [['n', '3']]),
      traceRow('i <- 1', 'Inisialisasi pencacah sebelum mengulang.', [['n', '3'], ['i', '1']]),
      traceRow('i <= n → True; tulis(i)', 'Cetak nilai pencacah pertama.', [['n', '3'], ['i', '1']], '1'),
      traceRow('i <- i + 1 → 2', 'Naikkan pencacah agar perulangan bergerak maju.', [['n', '3'], ['i', '2']]),
      traceRow('i <= n → True; tulis(i)', 'Kondisi masih benar; cetak nilai berikutnya.', [['n', '3'], ['i', '2']], '2'),
      traceRow('i <- i + 1 → 3', 'Naikkan pencacah satu langkah.', [['n', '3'], ['i', '3']]),
      traceRow('i <= n → True; tulis(i)', 'Cetak angka terakhir dalam rentang.', [['n', '3'], ['i', '3']], '3'),
      traceRow('i <- i + 1 → 4', 'Pencacah melewati batas yang diminta.', [['n', '3'], ['i', '4']]),
      traceRow('i <= n → False', 'Kondisi salah, maka perulangan berakhir.', [['n', '3'], ['i', '4']], 'Selesai'),
    ];
    return [
      traceRow('baca(p) → p = 5', 'Baca panjang persegi panjang.', [['p', '5']]),
      traceRow('baca(l) → l = 3', 'Baca lebar persegi panjang.', [['p', '5'], ['l', '3']]),
      traceRow('luas <- p * l', 'Kalikan panjang dan lebar.', [['p', '5'], ['l', '3'], ['luas', '15']]),
      traceRow('tulis(luas)', 'Kirim hasil perhitungan sebagai output.', [['luas', '15']], '15'),
    ];
  }
  if (mod.id === 'm5') {
    const price = Math.max(0, Number(ui.price) || 0), quantity = Math.max(0, Number(ui.quantity) || 0), rate = Math.min(100, Math.max(0, Number(ui.discount) || 0));
    const subtotal = price * quantity, cut = subtotal >= 100000 ? subtotal * rate / 100 : 0, payable = subtotal - cut;
    return [
      traceRow(`harga = ${price}`, 'Harga satu barang masuk ke sistem.', [['harga', money(price)]]),
      traceRow(`jumlah = ${quantity}`, 'Jumlah barang menjadi data masukan berikutnya.', [['harga', money(price)], ['jumlah', String(quantity)]]),
      traceRow('total = harga * jumlah', 'Proses pertama menghasilkan subtotal.', [['harga', money(price)], ['jumlah', String(quantity)], ['total', money(subtotal)]]),
      traceRow(`if total >= 100000 → ${subtotal >= 100000 ? 'True' : 'False'}`, 'Bandingkan subtotal dengan ambang diskon KampusMart.', [['total', money(subtotal)], ['kondisi', subtotal >= 100000 ? 'True' : 'False']]),
      traceRow(`diskon = total * ${rate} / 100 → ${money(cut)}`, subtotal >= 100000 ? 'Hitung diskon karena ambang terpenuhi.' : 'Ambang belum terpenuhi, sehingga diskon bernilai nol.', [['total', money(subtotal)], ['diskon', money(cut)]]),
      traceRow('bayar = total - diskon', 'Kurangi subtotal dengan diskon untuk mendapat total bayar.', [['total', money(subtotal)], ['diskon', money(cut)], ['bayar', money(payable)]]),
      traceRow('tampilkan(bayar)', 'Hasil akhir ditampilkan kepada pelanggan.', [['bayar', money(payable)]], money(payable)),
    ];
  }
  if (mod.id === 'm6') {
    const value = Number(ui.ifValue) || 0, threshold = Number(ui.ifThreshold) || 0, passed = value >= threshold;
    return [
      traceRow(`nilai = ${value}`, 'Baca nilai sebagai input kondisi.', [['nilai', String(value)]]),
      traceRow(`if nilai >= ${threshold}:`, 'Evaluasi ekspresi perbandingan.', [['nilai', String(value)], ['batas', String(threshold)], ['kondisi', passed ? 'True' : 'False']]),
      traceRow(passed ? 'print("Lulus")' : 'blok if dilewati', passed ? 'Kondisi True, jalankan isi blok if.' : 'Kondisi False, if tunggal tidak menjalankan aksi dan tidak memiliki else.', [['nilai', String(value)], ['hasil kondisi', passed ? 'True' : 'False']], passed ? 'Lulus' : 'Tidak ada output'),
    ];
  }
  if (mod.id === 'm7') {
    const value = Number(ui.gradeValue) || 0;
    const checks = [
      { code: 'nilai >= 85?', result: value >= 85, grade: 'A' },
      { code: 'nilai >= 70?', result: value >= 70, grade: 'B' },
      { code: 'nilai >= 55?', result: value >= 55, grade: 'C' },
    ];
    const steps = [traceRow(`nilai = ${value}`, 'Masukkan skor yang akan diklasifikasikan.', [['nilai', String(value)]])];
    let grade = 'D';
    for (const check of checks) {
      steps.push(traceRow(check.code, `Kondisi ${check.result ? 'True' : 'False'}; if-elif hanya lanjut jika kondisi sebelumnya salah.`, [['nilai', String(value)], ['uji', check.code], ['hasil', check.result ? 'True' : 'False']]));
      if (check.result) { grade = check.grade; break; }
    }
    steps.push(traceRow(`grade = "${grade}"`, `Kategori nilai ditetapkan sebagai ${grade}.`, [['nilai', String(value)], ['grade', grade]]));
    steps.push(traceRow(`if grade == "D" → ${grade === 'D'}`, 'Keputusan kedua memeriksa kategori hasil dari if-elif.', [['grade', grade], ['kondisi', grade === 'D' ? 'True' : 'False']]));
    steps.push(traceRow(grade === 'D' ? 'print("Tidak Lulus")' : 'print("Lulus")', 'Tampilkan status kelulusan.', [['grade', grade], ['status', grade === 'D' ? 'Tidak Lulus' : 'Lulus']], grade === 'D' ? 'Tidak Lulus' : 'Lulus'));
    return steps;
  }
  return [];
}

function renderTracer(mod, ui) {
  const steps = getTraceSteps(mod, ui);
  if (!steps.length) return '';
  const index = Math.max(0, Math.min(steps.length - 1, Number(ui.traceStep) || 0));
  const active = steps[index];
  return `<section class="visual-panel span-2 execution-tracer" aria-label="Tracer langkah algoritma">${head('Tracer · jalankan algoritma', 'Tekan langkah atau tombol berikutnya untuk melihat baris aktif, perubahan nilai, dan output.', 'LANGKAH DEMI LANGKAH')}<div class="tracer-toolbar"><span class="trace-counter">LANGKAH ${String(index + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}</span><div><button class="pill-button" data-action="trace-reset">Mulai ulang</button><button class="pill-button" data-action="trace-prev" ${index === 0 ? 'disabled' : ''}>← Sebelumnya</button><button class="pill-button active" data-action="trace-next" ${index === steps.length - 1 ? 'disabled' : ''}>Berikutnya →</button></div></div><div class="trace-layout"><ol class="trace-code-list">${steps.map((step, i) => `<li><button class="trace-line ${i === index ? 'active' : ''} ${i < index ? 'passed' : ''}" data-action="trace-set" data-value="${i}" aria-current="${i === index ? 'step' : 'false'}"><span>${String(i + 1).padStart(2, '0')}</span><code>${esc(step.code)}</code></button></li>`).join('')}</ol><div class="trace-state" aria-live="polite" aria-atomic="true"><span class="visual-label">${active.output ? 'OUTPUT SAAT INI' : 'STATE SETELAH LANGKAH INI'}</span><pre><code>${esc(active.code)}</code></pre><p>${esc(active.explanation)}</p>${active.values.length ? `<div class="trace-memory">${active.values.map(([name, value]) => `<div><span>${esc(name)}</span><strong>${esc(value)}</strong></div>`).join('')}</div>` : ''}${active.output ? `<div class="trace-output"><span>OUTPUT</span><strong>${esc(active.output)}</strong></div>` : ''}</div></div><div class="trace-legend"><span><i class="legend-dot active-dot"></i>Baris aktif</span><span><i class="legend-dot passed-dot"></i>Sudah dijalankan</span><span>State = nilai variabel setelah langkah tersebut</span></div></section>`;
}

function m1(mod, ui) {
  const stepIndex = Math.max(0, Math.min(mod.coffeeSteps.length - 1, Number(ui.coffeeStep) || 0));
  const step = mod.coffeeSteps[stepIndex];
  const selected = mod.characteristics.find(item => item.id === ui.characteristic) || mod.characteristics[0];
  return `<div class="visual-grid accent-terracotta">
    <section class="visual-panel">${head('Algoritma sehari-hari · membuat kopi', 'Jalankan resep sebagai urutan langkah. Geser tahap untuk melihat fungsi tiap instruksi.')}
      <div class="algorithm-track">${mod.coffeeSteps.map((item, i) => `<button class="algorithm-step ${i === stepIndex ? 'active' : ''} ${i < stepIndex ? 'passed' : ''}" data-action="coffee-step" data-value="${i}"><span>${String(i + 1).padStart(2, '0')}</span><strong>${esc(item.title)}</strong></button>`).join('')}</div>
      <div class="stepper-detail"><div><span class="visual-label">LANGKAH ${String(stepIndex + 1).padStart(2, '0')} · ${esc(step.kind)}</span><h4>${esc(step.title)}</h4><p>${esc(step.detail)}</p></div><div class="stepper-controls"><button class="pill-button" data-action="coffee-prev" ${stepIndex === 0 ? 'disabled' : ''}>← Sebelumnya</button><button class="pill-button active" data-action="coffee-next" ${stepIndex === mod.coffeeSteps.length - 1 ? 'disabled' : ''}>Berikutnya →</button></div></div>
      <div class="flow-diagram compact-flow"><div class="flow-node">Tujuan<br/>kopi siap</div><span class="flow-arrow">→</span><div class="flow-node">Langkah<br/>berurutan</div><span class="flow-arrow">→</span><div class="flow-node platform-node">Output<br/>kopi</div></div>
    </section>
    <section class="visual-panel">${head('Peta karakteristik algoritma', 'Pilih karakteristik untuk melihat definisi dan contoh uji pada resep.')}
       <div class="characteristic-grid">${mod.characteristics.map(item => `<button id="algo-characteristic-${item.id}" class="characteristic-node search-result-target ${item.id === selected.id ? 'active' : ''}" data-action="characteristic" data-value="${item.id}"><span>${esc(item.name)}</span></button>`).join('')}</div>
      ${detail(selected.name, `${selected.detail} Contoh: ${selected.example}`)}
    </section>
  </div>`;
}

function m2(mod, ui) {
  const scenes = {
    nasi: { label: 'Membuat nasi goreng', steps: ['Menyiapkan bahan', 'Memotong bumbu', 'Memanaskan minyak', 'Menumis bumbu', 'Mencampur nasi', 'Menyajikan'], detail: 'Contoh dekomposisi dari materi: aktivitas besar dipecah menjadi urutan tugas yang dapat dikerjakan.' },
    program: { label: 'Program besar', steps: ['Menerima input', 'Validasi data', 'Hitung transaksi', 'Proses pembayaran', 'Kirim notifikasi'], detail: 'Dalam pemrograman, bagian program dapat disusun sebagai fungsi/modul yang menangani satu tugas.' },
    atm: { label: 'Transaksi ATM', steps: ['Masukkan kartu dan PIN', 'Pilih transaksi', 'Cek saldo', 'Perbarui saldo', 'Cetak struk / keluarkan uang'], detail: 'Masalah transaksi dipecah ke langkah layanan yang saling bergantung.' },
  };
  const scene = scenes[ui.scenario] || scenes.nasi;
  const selectedStep = Math.max(0, Math.min(scene.steps.length - 1, Number(ui.decompositionStep) || 0));
  const pillar = mod.pillars.find(item => item.id === ui.pillar) || mod.pillars[0];
  const stage = mod.stages[Number(ui.stage) || 0];
  return `<div class="visual-grid accent-indigo">
    <section class="visual-panel">${head('Decomposition builder', 'Pilih masalah, lalu telusuri bagaimana masalah kompleks dipecah menjadi bagian yang lebih kecil.')}
      <div class="pill-row">${Object.entries(scenes).map(([key, item]) => pill(item.label, 'scenario', key, ui.scenario === key)).join('')}</div>
      <div class="decomposition-list">${scene.steps.map((item, i) => `<button class="decomposition-step ${i === Number(ui.decompositionStep || 0) ? 'active' : ''}" data-action="decomposition-step" data-value="${i}"><span>0${i + 1}</span><strong>${esc(item)}</strong><i>${i < scene.steps.length - 1 ? '↓' : '✓'}</i></button>`).join('')}</div>
      ${detail(`Langkah ${selectedStep + 1} · ${scene.label}`, `${scene.steps[selectedStep]}. ${scene.detail}`)}
    </section>
    <section class="visual-panel">${head('Computational thinking · empat pilar', 'Klik satu pilar untuk melihat peran dan contohnya dalam merancang solusi.')}
       <div class="pillar-grid">${mod.pillars.map((item, i) => `<button id="algo-pillar-${item.id}" class="pillar-card search-result-target ${item.id === pillar.id ? 'active' : ''}" data-action="pillar" data-value="${item.id}"><span>0${i + 1}</span><strong>${esc(item.name)}</strong></button>`).join('')}</div>
      ${detail(pillar.name, `${pillar.detail} Contoh: ${pillar.example}`)}
    </section>
    <section class="visual-panel span-2">${head('Dari masalah menuju program', 'Pilih tahap untuk meninjau tujuan, keluaran dan cara memeriksanya.')}
       <div class="stage-track">${mod.stages.map((item, i) => `<button id="algo-stage-${i}" class="stage-step search-result-target ${i === Number(ui.stage) ? 'active' : ''}" data-action="stage" data-value="${i}"><span>${String(i + 1).padStart(2, '0')}</span><strong>${esc(item.title)}</strong></button>`).join('')}</div>
      <div class="stage-detail"><strong>${esc(stage.title)}</strong><p>${esc(stage.detail)}</p></div>
    </section>
  </div>`;
}

function evaluateOperator(ui) {
  const a = Number(ui.left), b = Number(ui.right), op = ui.operator;
  const out = {
    '+': () => a + b, '-': () => a - b, '*': () => a * b, '/': () => b === 0 ? 'Tidak dapat membagi dengan nol' : a / b,
    '//': () => b === 0 ? 'Tidak dapat membagi dengan nol' : Math.floor(a / b), '%': () => b === 0 ? 'Tidak dapat menghitung modulus dengan nol' : ((a % b) + b) % b,
    '**': () => a ** b, '==': () => a === b, '!=': () => a !== b, '>': () => a > b, '<': () => a < b, '>=': () => a >= b, '<=': () => a <= b,
    and: () => Boolean(ui.boolA) && Boolean(ui.boolB), or: () => Boolean(ui.boolA) || Boolean(ui.boolB), not: () => !Boolean(ui.boolA),
  };
  return out[op]?.() ?? 'Pilih operator';
}

function m3(mod, ui) {
  const type = mod.types.find(item => item.id === ui.dataType) || mod.types[0];
  const family = ui.operatorFamily || 'arithmetic';
  const sets = { arithmetic: ['+', '-', '*', '/', '//', '%', '**'], relational: ['==', '!=', '>', '<', '>=', '<='], logical: ['and', 'or', 'not'] };
  const operators = sets[family];
  const op = operators.includes(ui.operator) ? ui.operator : operators[0];
  const result = evaluateOperator({ ...ui, operator: op });
  const operatorExpression = family === 'logical'
    ? (op === 'not' ? `not ${ui.boolA ? 'True' : 'False'}` : `${ui.boolA ? 'True' : 'False'} ${op} ${ui.boolB ? 'True' : 'False'}`)
    : `${esc(ui.left)} ${op} ${esc(ui.right)}`;
  const name = ui.variableName || 'umur';
  const original = ui.variableValue ?? '20';
  const next = ui.variableNext ?? '21';
  return `<div class="visual-grid accent-emerald">
    <section class="visual-panel">${head('Variable & assignment lab', 'Ubah nama dan nilai, lalu jalankan penugasan untuk melihat isi variabel berubah.')}
      <div class="variable-controls">${field('Nama variabel', 'variableName', name, 'text', 'placeholder="mis. umur"')}${field('Nilai baru', 'variableNext', next, 'text', 'placeholder="nilai"')}<button class="pill-button active" data-action="assign-variable">Jalankan assignment</button></div>
      <div class="memory-cell"><span class="visual-label">NILAI SAAT INI</span><strong>${esc(name)} <i>→</i> ${esc(original)}</strong><span class="assignment-code">${esc(name)} = ${esc(original)}</span></div>
       <div class="type-picker">${mod.types.map(item => `<button id="algo-type-${item.id}" class="type-card search-result-target ${item.id === type.id ? 'active' : ''}" data-action="data-type" data-value="${item.id}"><span>${esc(item.name)}</span><code>${esc(item.sample)}</code></button>`).join('')}</div>
      ${detail(type.name, `${type.detail} Contoh: ${type.sample}.`)}
    </section>
    <section class="visual-panel">${head('Operator explorer', 'Masukkan dua operand dan pilih operator untuk melihat hasil ekspresi.')}
      <div class="pill-row">${pill('Aritmatika', 'operator-family', 'arithmetic', family === 'arithmetic', 'algo-operator-family-arithmetic')}${pill('Relasional', 'operator-family', 'relational', family === 'relational', 'algo-operator-family-relational')}${pill('Logika', 'operator-family', 'logical', family === 'logical', 'algo-operator-family-logical')}</div>
      <div class="pill-row operator-row">${operators.map(item => pill(item, 'operator', item, item === op)).join('')}</div>
      <div class="operator-inputs">${family === 'logical' ? `<button class="logic-input ${ui.boolA ? 'true' : ''}" data-action="bool-toggle" data-value="boolA">A = ${ui.boolA ? 'True' : 'False'}</button>${op !== 'not' ? `<button class="logic-input ${ui.boolB ? 'true' : ''}" data-action="bool-toggle" data-value="boolB">B = ${ui.boolB ? 'True' : 'False'}</button>` : ''}` : `${field('Operand A', 'left', ui.left)}<span class="operator-symbol">${esc(op)}</span>${field('Operand B', 'right', ui.right)}`}</div>
      ${family !== 'logical' ? '<button class="pill-button active run-sim" data-action="calculate-operator">Hitung ekspresi →</button>' : ''}
      <div class="operator-result"><span class="visual-label">HASIL EKSPRESI</span><strong>${esc(String(result))}</strong><code>${operatorExpression}</code></div>
      <p class="effect-note"><code>=</code> adalah penugasan; <code>==</code> adalah perbandingan. Untuk <code>/</code>, <code>//</code>, dan <code>%</code>, penyebut tidak boleh nol.</p>
    </section>
  </div>`;
}

function m4(mod, ui) {
  const item = mod.examples.find(value => value.id === ui.example) || mod.examples[0];
  const activeNode = Number(ui.flowNode) || 0;
  const nodeText = item.nodes[activeNode] || item.nodes[0];
  const symbol = mod.symbols.find(value => value.id === ui.symbol) || mod.symbols[0];
  return `<div class="visual-grid accent-terracotta">
     <section id="algo-visual-pseudocode-flowchart" class="visual-panel span-2 search-result-target" tabindex="-1">${head('Pseudocode → flowchart', 'Pilih contoh algoritma, kemudian klik simbol alur untuk menyorot tahap yang sedang dipelajari.')}
       <div class="pill-row">${mod.examples.map(example => pill(`${example.name} · ${example.type}`, 'flow-example', example.id, item.id === example.id, `algo-example-${example.id}`)).join('')}</div>
      <div class="pseudocode-flow"><div class="pseudocode-pane"><span class="visual-label">PSEUDOCODE</span><pre>${esc(item.pseudocode.join('\n'))}</pre></div><div class="flow-pane"><span class="visual-label">FLOWCHART · KLIK SIMBOL</span><div class="flowchart-list">${item.nodes.map((node, i) => `<button class="flowchart-node ${i === activeNode ? 'active' : ''} ${node.startsWith('Ya') || node.startsWith('Tidak') ? 'branch' : ''}" data-action="flow-node" data-value="${i}"><span class="flow-shape ${i === 0 || i === item.nodes.length - 1 ? 'terminator' : i === 1 || node.startsWith('Input') || node.startsWith('Output') ? 'io' : node.includes('?') ? 'decision' : 'process'}">${esc(node)}</span>${i < item.nodes.length - 1 ? '<i>↓</i>' : ''}</button>`).join('')}</div></div></div>
      ${detail(`Langkah ${activeNode + 1}`, nodeText)}
    </section>
    <section class="visual-panel span-2">${head('Simbol flowchart', 'Pilih simbol untuk mengingat fungsi dan bentuk konvensionalnya.')}
       <div class="symbol-grid">${mod.symbols.map(item => `<button id="algo-symbol-${item.id}" class="symbol-card search-result-target ${item.id === symbol.id ? 'active' : ''}" data-action="flow-symbol" data-value="${item.id}"><span class="flow-shape ${item.shape}">${item.shape === 'diamond' ? '?' : item.shape === 'oval' ? 'Mulai' : item.shape === 'arrow' ? '→' : item.shape === 'circle' ? 'A' : item.shape === 'parallelogram' ? 'I/O' : 'f(x)'}</span><strong>${esc(item.name)}</strong></button>`).join('')}</div>
      ${detail(symbol.name, `${symbol.detail} Contoh: ${symbol.example}.`)}
    </section>
  </div>`;
}

function m5(mod, ui) {
  const price = Math.max(0, Number(ui.price) || 0), quantity = Math.max(0, Number(ui.quantity) || 0), percent = Math.min(100, Math.max(0, Number(ui.discount) || 0));
  const subtotal = price * quantity;
  const discount = subtotal >= 100000 ? subtotal * percent / 100 : 0;
  const total = subtotal - discount;
  const stages = [
    { title: 'Input', text: `harga ${money(price)} · jumlah ${quantity} · diskon ${percent}%` },
    { title: 'Proses 1', text: `total = ${money(price)} × ${quantity} = ${money(subtotal)}` },
    { title: 'Proses 2', text: `total ${subtotal >= 100000 ? '≥' : '<'} Rp100.000 → diskon ${money(discount)}` },
    { title: 'Output', text: `total bayar = ${money(total)}` },
  ];
  const focused = stages[Number(ui.ipoStage) || 0];
  const pbl = [
    ['Orientasi masalah', 'Pahami kebutuhan kasir KampusMart dan aturan diskon.'], ['Organisasi belajar', 'Tentukan pembagian input, proses, output, dan aturan yang perlu dijawab.'], ['Penyelidikan', 'Uji rumus, nilai ambang, dan data contoh.'], ['Kembangkan solusi', 'Susun pseudocode/flowchart dan implementasi.'], ['Evaluasi', 'Jalankan data uji dan periksa apakah total pembayaran sesuai.'],
  ];
  return `<div class="visual-grid accent-indigo">
    <section class="visual-panel">${head('IPO transaction sandbox', 'Ubah harga, jumlah, dan persentase. Diskon 10% pada materi berlaku mulai total belanja Rp100.000.')}
      <div class="sim-fields">${field('Harga barang (Rp)', 'price', ui.price)}${field('Jumlah barang', 'quantity', ui.quantity)}${field('Diskon (%)', 'discount', ui.discount)}</div>
      <button class="pill-button active run-sim" data-action="run-ipo">Jalankan simulasi →</button>
      <div class="ipo-flow"><div class="ipo-stage"><span>INPUT</span><strong>${money(price)} × ${quantity}</strong></div><i>→</i><div class="ipo-stage"><span>PROSES</span><strong>${money(subtotal)}</strong><small>${subtotal >= 100000 ? `− ${money(discount)} diskon` : 'belum mencapai batas diskon'}</small></div><i>→</i><div class="ipo-stage output"><span>OUTPUT</span><strong>${ui.ipoRun ? money(total) : '—'}</strong><small>${ui.ipoRun ? 'total bayar' : 'jalankan simulasi'}</small></div></div>
      <div class="stage-detail"><strong>${esc(focused.title)}</strong><p>${esc(focused.text)}</p></div>
      <div class="stage-track compact-stages">${stages.map((item, i) => `<button class="stage-step ${i === Number(ui.ipoStage) ? 'active' : ''}" data-action="ipo-stage" data-value="${i}"><span>0${i + 1}</span><strong>${esc(item.title)}</strong></button>`).join('')}</div>
      <p class="effect-note">PPN opsional pada slide dihitung terpisah: <code>ppn = total × 0.11</code>; contoh harga 15.000 × 3 menghasilkan subtotal 45.000 dan total dengan PPN 49.950.</p>
    </section>
    <section class="visual-panel">${head('PBL · kasus KampusMart', 'Pilih tahapan problem-based learning untuk melihat pekerjaan di setiap fase.')}
      <div class="pbl-list">${pbl.map(([title], i) => `<button class="pbl-step ${i === Number(ui.pblStage || 0) ? 'active' : ''}" data-action="pbl-stage" data-value="${i}"><span>0${i + 1}</span><strong>${esc(title)}</strong></button>`).join('')}</div>
      ${detail(pbl[Number(ui.pblStage) || 0][0], pbl[Number(ui.pblStage) || 0][1])}
      <div class="ipo-dependency"><strong>Dependensi proses</strong><span>harga, jumlah</span><i>↓</i><span>total</span><i>↓</i><span>diskon</span><i>↓</i><span>total bayar</span></div>
    </section>
  </div>`;
}

function m6(mod, ui) {
  const value = Number(ui.ifValue) || 0, threshold = Number(ui.ifThreshold) || 0;
  const passed = value >= threshold;
  const condition = mod.conditions.find(item => item.id === ui.condition) || mod.conditions[0];
  const op = ui.boolOperator || 'and';
  const logical = op === 'and' ? Boolean(ui.boolA) && Boolean(ui.boolB) : op === 'or' ? Boolean(ui.boolA) || Boolean(ui.boolB) : !Boolean(ui.boolA);
  const logicExpression = op === 'not' ? `not ${ui.boolA ? 'True' : 'False'}` : `${ui.boolA ? 'True' : 'False'} ${op} ${ui.boolB ? 'True' : 'False'}`;
  return `<div class="visual-grid accent-emerald">
    <section class="visual-panel">${head('If-condition playground', 'Ubah nilai dan batas, lalu evaluasi kondisi. Perhatikan aksi pada cabang True dan False.')}
      <div class="sim-fields">${field('Nilai', 'ifValue', ui.ifValue)}${field('Batas lulus', 'ifThreshold', ui.ifThreshold)}</div>
      <button class="pill-button active run-sim" data-action="simulate-if">Evaluasi kondisi →</button>
      <div class="condition-expression">nilai ≥ batas <span>${value} ≥ ${threshold}</span></div>
      <div class="branch-result"><div class="branch-path ${passed ? 'chosen' : ''}"><span>TRUE</span><strong>${passed ? 'print("Lulus")' : 'blok aksi dijalankan jika True'}</strong></div><div class="branch-path ${!passed ? 'chosen muted-path' : ''}"><span>FALSE</span><strong>${!passed ? 'blok dilewati' : 'tidak ada jalur else'}</strong></div></div>
      ${detail('Hasil evaluasi', `${value} >= ${threshold} bernilai ${passed ? 'True' : 'False'}. ${passed ? 'Aksi di dalam if dijalankan.' : 'Blok if tunggal dilewati.'}`)}
    </section>
    <section class="visual-panel">${head('Kondisi logika', 'Pilih jenis kondisi, lalu klik A/B untuk mengubah nilai boolean.')}
       <div class="pill-row">${mod.conditions.map(item => pill(item.name, 'condition', item.id, item.id === condition.id, `algo-condition-${item.id}`)).join('')}</div>
      <div class="condition-expression">${esc(condition.condition)}</div>
      <div class="logic-controls">${pill('AND', 'bool-operator', 'and', op === 'and')}${pill('OR', 'bool-operator', 'or', op === 'or')}${pill('NOT A', 'bool-operator', 'not', op === 'not')}<button class="logic-input ${ui.boolA ? 'true' : ''}" data-action="bool-toggle" data-value="boolA">A · ${ui.boolA ? 'True' : 'False'}</button>${op !== 'not' ? `<button class="logic-input ${ui.boolB ? 'true' : ''}" data-action="bool-toggle" data-value="boolB">B · ${ui.boolB ? 'True' : 'False'}</button>` : ''}</div>
      <div class="operator-result"><span class="visual-label">HASIL</span><strong>${logical ? 'True' : 'False'}</strong><code>${logicExpression}</code></div>
       <div class="truth-mini" role="table" aria-label="Tabel kebenaran AND, OR, dan NOT A"><span role="columnheader">A</span><span role="columnheader">B</span><span role="columnheader">A AND B</span><span role="columnheader">A OR B</span><span role="columnheader">NOT A</span><span role="cell">True</span><span role="cell">True</span><b role="cell">True</b><b role="cell">True</b><b role="cell">False</b><span role="cell">True</span><span role="cell">False</span><b role="cell">False</b><b role="cell">True</b><b role="cell">False</b><span role="cell">False</span><span role="cell">True</span><b role="cell">False</b><b role="cell">True</b><b role="cell">True</b><span role="cell">False</span><span role="cell">False</span><b role="cell">False</b><b role="cell">False</b><b role="cell">True</b></div>
    </section>
  </div>`;
}

function m7(mod, ui) {
  const total = Math.max(0, Number(ui.branchTotal) || 0);
  const member = Boolean(ui.member);
  let percent = 0, trace = [];
  if (ui.branchType === 'nested') {
    trace = [member ? 'status == member → True' : 'status == member → False'];
    if (member) { percent = total >= 200000 ? 20 : 10; trace.push(`total ${total >= 200000 ? '≥' : '<'} 200000 → diskon ${percent}%`); }
    else trace.push('kondisi dalam tidak dievaluasi → diskon 0%');
  } else if (ui.branchType === 'vip') {
    const eligible = total >= 500000 && member;
    percent = eligible ? 20 : 0;
    trace = [`total >= 500000 → ${total >= 500000}`, `is_vip == True → ${member}`, `AND → ${eligible}`];
  } else if (ui.branchType === 'ifelse') {
    percent = total >= 100000 ? 10 : 0;
    trace = [`total >= 100000 → ${total >= 100000}`, `if-else memilih diskon ${percent}%`];
  } else {
    const tier = mod.discountTiers.find(item => total >= item.min) || mod.discountTiers.at(-1);
    percent = tier.percent;
    trace = mod.discountTiers.map(item => `${item.label} → ${total >= item.min && item.percent === percent ? 'terpilih' : total >= item.min ? 'sudah terlewati' : 'cek berikutnya'}`);
  }
  const cut = total * percent / 100;
  const gradeValue = Number(ui.gradeValue) || 0;
  const grade = gradeValue >= 85 ? 'A' : gradeValue >= 70 ? 'B' : gradeValue >= 55 ? 'C' : 'D';
  const status = grade === 'D' ? 'Tidak Lulus' : 'Lulus';
  const firstTrue = gradeValue >= 85 ? 'nilai >= 85' : gradeValue >= 70 ? 'nilai >= 70' : gradeValue >= 55 ? 'nilai >= 55' : 'else';
  const branchTypes = [['elif', 'if-elif-else'], ['nested', 'Nested member'], ['vip', 'VIP + AND'], ['ifelse', 'if-else']];
  return `<div class="visual-grid accent-terracotta">
    <section class="visual-panel">${head('Branching simulator · klasifikasi diskon', 'Pilih pola keputusan dan ubah total/member untuk menelusuri jalur yang terpilih.')}
       <div class="pill-row">${branchTypes.map(([key, label]) => pill(label, 'branch-type', key, ui.branchType === key, `algo-branch-${key}`)).join('')}</div>
      <div class="sim-fields">${field('Total belanja (Rp)', 'branchTotal', ui.branchTotal)}<button class="member-toggle ${member ? 'active' : ''}" data-action="member-toggle">Member / VIP: ${member ? 'Ya' : 'Tidak'}</button></div>
      <button class="pill-button active run-sim" data-action="simulate-branch">Jalankan percabangan →</button>
      <div class="branch-tree">${trace.map((item, i) => `<div class="tree-step ${i === trace.length - 1 ? 'chosen' : ''}"><span>${String(i + 1).padStart(2, '0')}</span>${esc(item)}</div>`).join('')}<div class="tree-output"><span>DISKON</span><strong>${percent}% · ${money(cut)}</strong><small>Total setelah diskon: ${money(total - cut)}</small></div></div>
      <p class="effect-note">Ambang dan aturan mengikuti contoh pada slide: diskon bertingkat, member bertingkat, atau VIP dengan total ≥Rp500.000 dan status VIP.</p>
    </section>
     <section id="algo-branching-simulator" class="visual-panel search-result-target" tabindex="-1">${head('Grade + status · if-elif lalu if', 'Ubah nilai untuk melihat kondisi pertama yang terpenuhi dan keputusan bersarang berikutnya.')}
      ${field('Nilai', 'gradeValue', ui.gradeValue)}
      <button class="pill-button active run-sim" data-action="simulate-grade">Evaluasi grade →</button>
      <div class="grade-ladder">${[['≥ 85', 'A'], ['≥ 70', 'B'], ['≥ 55', 'C'], ['Selain itu', 'D']].map(([test, letter]) => `<div class="grade-rung ${grade === letter ? 'active' : ''}"><span>${test}</span><strong>${letter}</strong></div>`).join('')}</div>
      <div class="grade-outcome"><div><span class="visual-label">KONDISI PERTAMA YANG BENAR</span><strong>${esc(firstTrue)}</strong></div><div><span class="visual-label">HASIL BERSARANG</span><strong>${grade} · ${status}</strong></div></div>
      ${detail('Urutan eksekusi', `If-elif menentukan grade ${grade}; lalu if grade == "D" memilih Tidak Lulus, selain itu Lulus.`)}
    </section>
  </div>`;
}
