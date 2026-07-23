// ── Navigation ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.nav-link');
  const pages = document.querySelectorAll('.page');

  function showPage(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
    const link = document.querySelector('[data-page="' + pageId + '"]');
    if (link) link.classList.add('active');
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      showPage(this.dataset.page);
    });
  });

  showPage('page-home');
  buildTkbTuan();
  buildTkbHK();
  buildPhieu();

  // Initialize all button handlers
  initializeButtons();
});

// ── Tiet time map ─────────────────────────────────────────────────────────────
var TIET_TIMES = {
  1: '07:00', 2: '07:50', 3: '08:40', 4: '09:30',
  5: '10:20', 6: '11:10',
  7: '12:45', 8: '13:35', 9: '14:25', 10: '15:15',
  11: '16:05', 12: '16:55', 13: '17:45'
};

// ── TKB Tuan data ─────────────────────────────────────────────────────────────
var tkbData = [
  {
    thu: 2, tietStart: 7, tietEnd: 11, color: 'red',
    mon: 'Qu\u1ea3n tr\u1ecb m\u1ea1ng', ma: 'ITEC4403',
    nhom: 'IT2401', phong: 'NB.PMA407', dia: 'Khu d\u00e2n c\u01b0 Nh\u01a1n \u0110\u1ee9c',
    gv: 'L\u01b0u Quang Ph\u01b0\u01a1ng', gio: '12:45 \u2192 17:10'
  },
  {
    thu: 3, tietStart: 1, tietEnd: 4, color: 'blue',
    mon: 'Ph\u00e2n t\u00edch thi\u1ebft k\u1ebf h\u1ec7 th\u1ed1ng', ma: 'ITEC3401',
    nhom: 'IT2401', phong: 'NB.B203', dia: 'Khu d\u00e2n c\u01b0 Nh\u01a1n \u0110\u1ee9c, X\u00e3 Hi\u1ec7p Ph\u01b0\u1edbc, Tp.HCM',
    gv: 'D\u01b0\u01a1ng Th\u1ecb H\u1ed3ng H\u00e0', gio: '07:00 \u2192 11:25'
  },
  {
    thu: 4, tietStart: 1, tietEnd: 4, color: 'blue',
    mon: 'T\u01b0 t\u01b0\u1edfng H\u1ed3 Ch\u00ed Minh', ma: 'POLI1208',
    nhom: 'IT2401', phong: 'NB.C203', dia: 'Khu d\u00e2n c\u01b0 Nh\u01a1n \u0110\u1ee9c',
    gv: 'L\u00ea Th\u1ecb B\u00edch Nga', gio: '07:00 \u2192 11:25'
  },
  {
    thu: 5, tietStart: 1, tietEnd: 4, color: 'blue',
    mon: 'Ph\u00e2n t\u00edch thi\u1ebft k\u1ebf h\u1ec7 th\u1ed1ng', ma: 'ITEC3401',
    nhom: 'IT2401', phong: 'NBS_ONLINE002', dia: 'H\u1ecdc tr\u1ef1c tuy\u1ebfn',
    gv: 'D\u01b0\u01a1ng Th\u1ecb H\u1ed3ng H\u00e0', gio: '07:00 \u2192 11:25'
  },
  {
    thu: 5, tietStart: 7, tietEnd: 11, color: 'red',
    mon: 'M\u1eabu thi\u1ebft k\u1ebf h\u01b0\u1edbng \u0111\u1ed1i t\u01b0\u1ee3ng', ma: 'ITEC1311',
    nhom: 'IT2401', phong: 'NB.PMA407', dia: 'Khu d\u00e2n c\u01b0 Nh\u01a1n \u0110\u1ee9c',
    gv: 'D\u01b0\u01a1ng H\u1eefu Th\u00e0nh', gio: '12:45 \u2192 17:10'
  },
  {
    thu: 7, tietStart: 1, tietEnd: 4, color: 'blue',
    mon: 'T\u01b0 t\u01b0\u1edfng H\u1ed3 Ch\u00ed Minh', ma: 'POLI1208',
    nhom: 'IT2401', phong: 'NB.C203', dia: 'Khu d\u00e2n c\u01b0 Nh\u01a1n \u0110\u1ee9c',
    gv: 'L\u00ea Th\u1ecb B\u00edch Nga', gio: '07:00 \u2192 11:25'
  }
];

function makeCard(c) {
  return '<div class="class-card ' + c.color + '">'
    + '<strong>' + c.mon + ' (' + c.ma + ')</strong>'
    + '<span>Nh\u00f3m: ' + c.nhom + '</span><br>'
    + '<span>Ph\u00f2ng: ' + c.phong + '</span><br>'
    + '<small>' + c.dia + '</small><br>'
    + '<small>GV: ' + c.gv + '</small><br>'
    + '<small>' + c.gio + '</small>'
    + '</div>';
}

function buildTkbTuan() {
  var grid = document.getElementById('tkb-grid-body');
  if (!grid) return;

  // cellMap[tiet][thu] = {html, rowspan}
  // skipMap[tiet][thu] = true  (covered by rowspan above)
  var cellMap = {};
  var skipMap = {};

  tkbData.forEach(function (c) {
    for (var t = c.tietStart; t <= c.tietEnd; t++) {
      if (!cellMap[t]) cellMap[t] = {};
      if (t === c.tietStart) {
        cellMap[t][c.thu] = { html: makeCard(c), rowspan: c.tietEnd - c.tietStart + 1 };
      } else {
        if (!skipMap[t]) skipMap[t] = {};
        skipMap[t][c.thu] = true;
      }
    }
  });

  // thu columns: 2,3,4,5,6,7 = Thu2-Thu7, 8 = ChuNhat
  var thuCols = [2, 3, 4, 5, 6, 7, 8];
  var html = '';

  for (var tiet = 1; tiet <= 13; tiet++) {
    html += '<tr>';
    html += '<td class="tiet-col">Ti\u1ebft ' + tiet + '<br><small>' + (TIET_TIMES[tiet] || '') + '</small></td>';
    for (var ci = 0; ci < thuCols.length; ci++) {
      var thu = thuCols[ci];
      if (skipMap[tiet] && skipMap[tiet][thu]) continue;
      var cell = cellMap[tiet] && cellMap[tiet][thu];
      if (cell) {
        html += '<td rowspan="' + cell.rowspan + '" style="vertical-align:top;padding:0;">' + cell.html + '</td>';
      } else {
        html += '<td></td>';
      }
    }
    html += '</tr>';
  }
  grid.innerHTML = html;
}

// ── TKB Hoc ky data ───────────────────────────────────────────────────────────
var tkbHKData = [
  { ma: 'ITEC3401', ten: 'Ph\u00e2n t\u00edch thi\u1ebft k\u1ebf h\u1ec7 th\u1ed1ng', nhom: 'IT2401', tc: 3, lop: 'CNTT', thu: 3, tietbd: 1, sotiet: 4, phong: 'NB.B203', gv: 'D\u01b0\u01a1ng Th\u1ecb H\u1ed3ng H\u00e0' },
  { ma: 'ITEC3401', ten: 'Ph\u00e2n t\u00edch thi\u1ebft k\u1ebf h\u1ec7 th\u1ed1ng', nhom: 'IT2401', tc: 3, lop: 'CNTT', thu: 5, tietbd: 1, sotiet: 4, phong: 'NBS_ONLINE002', gv: 'D\u01b0\u01a1ng Th\u1ecb H\u1ed3ng H\u00e0' },
  { ma: 'POLI1208', ten: 'T\u01b0 t\u01b0\u1edfng H\u1ed3 Ch\u00ed Minh', nhom: 'IT2401', tc: 2, lop: 'CNTT', thu: 4, tietbd: 1, sotiet: 4, phong: 'NB.C203', gv: 'L\u00ea Th\u1ecb B\u00edch Nga' },
  { ma: 'POLI1208', ten: 'T\u01b0 t\u01b0\u1edfng H\u1ed3 Ch\u00ed Minh', nhom: 'IT2401', tc: 2, lop: 'CNTT', thu: 7, tietbd: 1, sotiet: 4, phong: 'NB.C203', gv: 'L\u00ea Th\u1ecb B\u00edch Nga' },
  { ma: 'ITEC4403', ten: 'Qu\u1ea3n tr\u1ecb m\u1ea1ng', nhom: 'IT2401', tc: 3, lop: 'CNTT', thu: 2, tietbd: 7, sotiet: 5, phong: 'NB.PMA407', gv: 'L\u01b0u Quang Ph\u01b0\u01a1ng' },
  { ma: 'ITEC1311', ten: 'M\u1eabu thi\u1ebft k\u1ebf h\u01b0\u1edbng \u0111\u1ed1i t\u01b0\u1ee3ng', nhom: 'IT2401', tc: 3, lop: 'CNTT', thu: 5, tietbd: 7, sotiet: 5, phong: 'NB.PMA407', gv: 'D\u01b0\u01a1ng H\u1eefu Th\u00e0nh' },
  { ma: 'GDQP001', ten: 'Gi\u00e1o d\u1ee5c qu\u1ed1c ph\u00f2ng', nhom: 'IT2401', tc: 0, lop: 'CNTT', thu: 2, tietbd: 1, sotiet: 1, phong: 'LB.GDQP_GDTC1', gv: 'H.V.' }
];

function buildTkbHK() {
  var tbody = document.getElementById('tkbhk-tbody');
  if (!tbody) return;
  var thuMap = { 2: 'Th\u1ee9 2', 3: 'Th\u1ee9 3', 4: 'Th\u1ee9 4', 5: 'Th\u1ee9 5', 6: 'Th\u1ee9 6', 7: 'Th\u1ee9 7', 8: 'Ch\u1ee7 Nh\u1eadt' };
  var html = '';
  tkbHKData.forEach(function (r) {
    html += '<tr>'
      + '<td>' + r.ma + '</td>'
      + '<td>' + r.ten + '</td>'
      + '<td>' + r.nhom + '</td>'
      + '<td style="text-align:center">' + (r.tc || '') + '</td>'
      + '<td>' + r.lop + '</td>'
      + '<td style="text-align:center">' + (thuMap[r.thu] || r.thu) + '</td>'
      + '<td style="text-align:center">' + r.tietbd + '</td>'
      + '<td style="text-align:center">' + r.sotiet + '</td>'
      + '<td>' + r.phong + '</td>'
      + '<td>' + r.gv + '</td>'
      + '</tr>';
  });
  tbody.innerHTML = html;
}

// ── In phieu nop tien data ────────────────────────────────────────────────────
var phieuData = [
  { nhhk: '20253', chungtu: 'S-1781326262', ngay: '13/06/2026' },
  { nhhk: '20253', chungtu: 'S-1781326334', ngay: '13/06/2026' },
  { nhhk: '20252', chungtu: 'S-1770468069', ngay: '07/02/2026' },
  { nhhk: '20251', chungtu: 'S-1760160021', ngay: '11/10/2025' },
  { nhhk: '20251', chungtu: 'S-1760160057', ngay: '11/10/2025' },
  { nhhk: '20243', chungtu: '243BO1406002', ngay: '09/06/2025' },
  { nhhk: '20242', chungtu: 'S-1739684435', ngay: '16/02/2025' },
  { nhhk: '20241', chungtu: 'S-1724316943', ngay: '22/08/2024' },
  { nhhk: '20241', chungtu: 'S-1724320186', ngay: '22/08/2024' },
  { nhhk: '20241', chungtu: '', ngay: '' }
];

function buildPhieu() {
  var tbody = document.getElementById('phieu-tbody');
  if (!tbody) return;
  var html = '';
  phieuData.forEach(function (r) {
    html += '<tr>'
      + '<td><input type="checkbox"></td>'
      + '<td>' + r.nhhk + '</td>'
      + '<td>' + r.chungtu + '</td>'
      + '<td>' + r.ngay + '</td>'
      + '</tr>';
  });
  tbody.innerHTML = html;
}

// ── Button Handlers ──────────────────────────────────────────────────────────
function initializeButtons() {
  // Print buttons - use event delegation for dynamically created content
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn) return;

    // Print buttons
    if (btn.classList.contains('btn-primary') && btn.innerHTML.includes('In')) {
      e.preventDefault();
      handlePrint(btn);
      return;
    }

    // Export Excel buttons
    if (btn.classList.contains('btn-success') && btn.innerHTML.includes('Excel')) {
      e.preventDefault();
      handleExportExcel(btn);
      return;
    }

    // Bank buttons
    if (btn.classList.contains('btn-bidv')) {
      e.preventDefault();
      handleBankPrint('BIDV');
      return;
    }

    if (btn.classList.contains('btn-agri')) {
      e.preventDefault();
      handleBankPrint('Nông Nghiệp');
      return;
    }
  });

  // Master checkbox for phieu table
  var phieuTable = document.querySelector('#page-phieu table');
  if (phieuTable) {
    var masterCheckbox = phieuTable.querySelector('thead input[type="checkbox"]');
    if (masterCheckbox) {
      masterCheckbox.addEventListener('change', function () {
        var checkboxes = phieuTable.querySelectorAll('tbody input[type="checkbox"]');
        checkboxes.forEach(function (cb) {
          cb.checked = masterCheckbox.checked;
        });
      });
    }
  }
}

function handlePrint(button) {
  // Determine which page we're on
  var activePage = document.querySelector('.page.active');
  if (!activePage) {
    alert('Không thể xác định trang hiện tại');
    return;
  }

  var pageId = activePage.id;
  var pageName = '';

  switch (pageId) {
    case 'page-hocphi':
      pageName = 'Học phí';
      break;
    case 'page-tkbtuan':
      pageName = 'Thời khóa biểu tuần';
      break;
    case 'page-tkbhk':
      pageName = 'Thời khóa biểu học kỳ';
      break;
    default:
      pageName = 'Trang hiện tại';
  }

  // Show a friendly message
  alert('Đang chuẩn bị in ' + pageName + '...\n\nTrong ứng dụng thực tế, chức năng này sẽ mở hộp thoại in của trình duyệt.');

  // In a real application, you would use:
  // window.print();
  // Or create a print-specific view
  console.log('Print button clicked for:', pageName);
}

function handleExportExcel(button) {
  var activePage = document.querySelector('.page.active');
  if (!activePage) {
    alert('Không thể xác định trang hiện tại');
    return;
  }

  var pageId = activePage.id;
  var filename = '';

  switch (pageId) {
    case 'page-hocphi':
      filename = 'hoc_phi.xlsx';
      break;
    case 'page-tkbhk':
      filename = 'thoi_khoa_bieu.xlsx';
      break;
    default:
      filename = 'du_lieu.xlsx';
  }

  alert('Đang xuất dữ liệu ra file Excel...\n\nFile: ' + filename + '\n\nTrong ứng dụng thực tế, file sẽ được tải xuống máy tính của bạn.');
  console.log('Export Excel clicked for:', filename);

  // In a real application, you would:
  // 1. Collect table data
  // 2. Use a library like SheetJS or ExcelJS
  // 3. Generate and download the file
}

function handleBankPrint(bankName) {
  // Get selected receipts
  var checkboxes = document.querySelectorAll('#phieu-tbody input[type="checkbox"]:checked');

  if (checkboxes.length === 0) {
    alert('Vui lòng chọn ít nhất một phiếu để in!');
    return;
  }

  var count = checkboxes.length;
  alert('Đang chuẩn bị in ' + count + ' phiếu nộp tiền qua ngân hàng ' + bankName + '...\n\nTrong ứng dụng thực tế, phiếu nộp tiền sẽ được tạo và in ra.');
  console.log('Bank print clicked:', bankName, 'Selected receipts:', count);

  // In a real application, you would:
  // 1. Collect selected receipt data
  // 2. Generate PDF or print-formatted HTML
  // 3. Open print dialog or download PDF
}
