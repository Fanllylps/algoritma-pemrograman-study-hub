const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const pill = (label, action, value, active) => `<button class="pill-button ${active ? 'active' : ''}" data-action="${action}" data-value="${esc(value)}">${esc(label)}</button>`;
const head = (title, copy, tag = 'SIMULASI') => `<div class="visual-panel-head"><div><h3>${title}</h3><p>${copy}</p></div><span class="visual-label">${tag}</span></div>`;
const detail = (title, copy) => `<div class="detail-box"><strong>${esc(title)}</strong><p>${esc(copy)}</p></div>`;
const field = (label, key, value, type = 'number', attrs = '') => `<label class="sim-field"><span>${label}</span><input type="${type}" data-state="${key}" value="${esc(value)}" ${attrs}/></label>`;
const money = value => `Rp${Number(value || 0).toLocaleString('id-ID', { maximumFractionDigits: 2 })}`;

export function renderVisuals(mod, ui) {
  const renderer = { m1: m1, m2: m2, m3: m3, m4: m4, m5: m5, m6: m6, m7: m7 }[mod.id];
  return renderer ? renderer(mod, ui) : '';
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
      <div class="characteristic-grid">${mod.characteristics.map(item => `<button class="characteristic-node ${item.id === selected.id ? 'active' : ''}" data-action="characteristic" data-value="${item.id}"><span>${esc(item.name)}</span></button>`).join('')}</div>
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
      <div class="pillar-grid">${mod.pillars.map((item, i) => `<button class="pillar-card ${item.id === pillar.id ? 'active' : ''}" data-action="pillar" data-value="${item.id}"><span>0${i + 1}</span><strong>${esc(item.name)}</strong></button>`).join('')}</div>
      ${detail(pillar.name, `${pillar.detail} Contoh: ${pillar.example}`)}
    </section>
    <section class="visual-panel span-2">${head('Dari masalah menuju program', 'Pilih tahap untuk meninjau tujuan, keluaran dan cara memeriksanya.')}
      <div class="stage-track">${mod.stages.map((item, i) => `<button class="stage-step ${i === Number(ui.stage) ? 'active' : ''}" data-action="stage" data-value="${i}"><span>${String(i + 1).padStart(2, '0')}</span><strong>${esc(item.title)}</strong></button>`).join('')}</div>
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
      <div class="type-picker">${mod.types.map(item => `<button class="type-card ${item.id === type.id ? 'active' : ''}" data-action="data-type" data-value="${item.id}"><span>${esc(item.name)}</span><code>${esc(item.sample)}</code></button>`).join('')}</div>
      ${detail(type.name, `${type.detail} Contoh: ${type.sample}.`)}
    </section>
    <section class="visual-panel">${head('Operator explorer', 'Masukkan dua operand dan pilih operator untuk melihat hasil ekspresi.')}
      <div class="pill-row">${pill('Aritmatika', 'operator-family', 'arithmetic', family === 'arithmetic')}${pill('Relasional', 'operator-family', 'relational', family === 'relational')}${pill('Logika', 'operator-family', 'logical', family === 'logical')}</div>
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
    <section class="visual-panel span-2">${head('Pseudocode → flowchart', 'Pilih contoh algoritma, kemudian klik simbol alur untuk menyorot tahap yang sedang dipelajari.')}
      <div class="pill-row">${mod.examples.map(example => pill(`${example.name} · ${example.type}`, 'flow-example', example.id, item.id === example.id)).join('')}</div>
      <div class="pseudocode-flow"><div class="pseudocode-pane"><span class="visual-label">PSEUDOCODE</span><pre>${esc(item.pseudocode.join('\n'))}</pre></div><div class="flow-pane"><span class="visual-label">FLOWCHART · KLIK SIMBOL</span><div class="flowchart-list">${item.nodes.map((node, i) => `<button class="flowchart-node ${i === activeNode ? 'active' : ''} ${node.startsWith('Ya') || node.startsWith('Tidak') ? 'branch' : ''}" data-action="flow-node" data-value="${i}"><span class="flow-shape ${i === 0 || i === item.nodes.length - 1 ? 'terminator' : i === 1 || node.startsWith('Input') || node.startsWith('Output') ? 'io' : node.includes('?') ? 'decision' : 'process'}">${esc(node)}</span>${i < item.nodes.length - 1 ? '<i>↓</i>' : ''}</button>`).join('')}</div></div></div>
      ${detail(`Langkah ${activeNode + 1}`, nodeText)}
    </section>
    <section class="visual-panel span-2">${head('Simbol flowchart', 'Pilih simbol untuk mengingat fungsi dan bentuk konvensionalnya.')}
      <div class="symbol-grid">${mod.symbols.map(item => `<button class="symbol-card ${item.id === symbol.id ? 'active' : ''}" data-action="flow-symbol" data-value="${item.id}"><span class="flow-shape ${item.shape}">${item.shape === 'diamond' ? '?' : item.shape === 'oval' ? 'Mulai' : item.shape === 'arrow' ? '→' : item.shape === 'circle' ? 'A' : item.shape === 'parallelogram' ? 'I/O' : 'f(x)'}</span><strong>${esc(item.name)}</strong></button>`).join('')}</div>
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
      <div class="pill-row">${mod.conditions.map(item => pill(item.name, 'condition', item.id, item.id === condition.id)).join('')}</div>
      <div class="condition-expression">${esc(condition.condition)}</div>
      <div class="logic-controls">${pill('AND', 'bool-operator', 'and', op === 'and')}${pill('OR', 'bool-operator', 'or', op === 'or')}${pill('NOT A', 'bool-operator', 'not', op === 'not')}<button class="logic-input ${ui.boolA ? 'true' : ''}" data-action="bool-toggle" data-value="boolA">A · ${ui.boolA ? 'True' : 'False'}</button>${op !== 'not' ? `<button class="logic-input ${ui.boolB ? 'true' : ''}" data-action="bool-toggle" data-value="boolB">B · ${ui.boolB ? 'True' : 'False'}</button>` : ''}</div>
      <div class="operator-result"><span class="visual-label">HASIL</span><strong>${logical ? 'True' : 'False'}</strong><code>${logicExpression}</code></div>
      <div class="truth-mini"><span>A</span><span>B</span><span>A AND B</span><span>True</span><span>True</span><b>True</b><span>True</span><span>False</span><b>False</b><span>False</span><span>True</span><b>False</b><span>False</span><span>False</span><b>False</b></div>
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
      <div class="pill-row">${branchTypes.map(([key, label]) => pill(label, 'branch-type', key, ui.branchType === key)).join('')}</div>
      <div class="sim-fields">${field('Total belanja (Rp)', 'branchTotal', ui.branchTotal)}<button class="member-toggle ${member ? 'active' : ''}" data-action="member-toggle">Member / VIP: ${member ? 'Ya' : 'Tidak'}</button></div>
      <button class="pill-button active run-sim" data-action="simulate-branch">Jalankan percabangan →</button>
      <div class="branch-tree">${trace.map((item, i) => `<div class="tree-step ${i === trace.length - 1 ? 'chosen' : ''}"><span>${String(i + 1).padStart(2, '0')}</span>${esc(item)}</div>`).join('')}<div class="tree-output"><span>DISKON</span><strong>${percent}% · ${money(cut)}</strong><small>Total setelah diskon: ${money(total - cut)}</small></div></div>
      <p class="effect-note">Ambang dan aturan mengikuti contoh pada slide: diskon bertingkat, member bertingkat, atau VIP dengan total ≥Rp500.000 dan status VIP.</p>
    </section>
    <section class="visual-panel">${head('Grade + status · if-elif lalu if', 'Ubah nilai untuk melihat kondisi pertama yang terpenuhi dan keputusan bersarang berikutnya.')}
      ${field('Nilai', 'gradeValue', ui.gradeValue)}
      <button class="pill-button active run-sim" data-action="simulate-grade">Evaluasi grade →</button>
      <div class="grade-ladder">${[['≥ 85', 'A'], ['≥ 70', 'B'], ['≥ 55', 'C'], ['Selain itu', 'D']].map(([test, letter]) => `<div class="grade-rung ${grade === letter ? 'active' : ''}"><span>${test}</span><strong>${letter}</strong></div>`).join('')}</div>
      <div class="grade-outcome"><div><span class="visual-label">KONDISI PERTAMA YANG BENAR</span><strong>${esc(firstTrue)}</strong></div><div><span class="visual-label">HASIL BERSARANG</span><strong>${grade} · ${status}</strong></div></div>
      ${detail('Urutan eksekusi', `If-elif menentukan grade ${grade}; lalu if grade == "D" memilih Tidak Lulus, selain itu Lulus.`)}
    </section>
  </div>`;
}
