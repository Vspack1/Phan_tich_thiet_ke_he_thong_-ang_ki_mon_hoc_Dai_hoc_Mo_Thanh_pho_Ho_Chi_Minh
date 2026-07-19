import javax.swing.*;
import javax.swing.table.AbstractTableModel;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.*;

/**
 * Demo hệ thống Đăng ký môn học.
 * Môn: Phân tích thiết kế hệ thống
 *
 * Chạy:
 *   javac DangKyMonHocApp.java
 *   java DangKyMonHocApp
 */
public class DangKyMonHocApp extends JFrame {

    // ============== MODEL ==============
    static class LopHocPhan {
        String maLHP, maMH, tenMH, giangVien, nhomTo, phong;
        double soTinChi;
        int siSoToiDa, siSoHienTai;
        int thu;          // 2..7, 8 = Chủ nhật
        int tietBatDau, tietKetThuc;

        LopHocPhan(String maLHP, String maMH, String tenMH, double soTinChi, String giangVien,
                   String nhomTo, int siSoToiDa, int siSoHienTai,
                   int thu, int tietBatDau, int tietKetThuc, String phong) {
            this.maLHP = maLHP; this.maMH = maMH; this.tenMH = tenMH; this.soTinChi = soTinChi;
            this.giangVien = giangVien; this.nhomTo = nhomTo;
            this.siSoToiDa = siSoToiDa; this.siSoHienTai = siSoHienTai;
            this.thu = thu; this.tietBatDau = tietBatDau; this.tietKetThuc = tietKetThuc;
            this.phong = phong;
        }

        String tenThu() { return thu == 8 ? "CN" : "Thứ " + thu; }
        String lich() { return tenThu() + ", tiết " + tietBatDau + "-" + tietKetThuc + ", " + phong; }
        int conLai() { return siSoToiDa - siSoHienTai; }
        boolean trungLich(LopHocPhan o) {
            return this.thu == o.thu && this.tietBatDau <= o.tietKetThuc && o.tietBatDau <= this.tietKetThuc;
        }
    }

    // ============== DỮ LIỆU MẪU ==============
    private final List<LopHocPhan> danhSachLHP = new ArrayList<>(List.of(
        new LopHocPhan("LHP01", "ITEC3401", "Phân tích thiết kế hệ thống", 4, "TS. Nguyễn Văn A", "N01-T01", 40, 38, 2, 1, 3, "A101"),
        new LopHocPhan("LHP02", "ITEC3401", "Phân tích thiết kế hệ thống", 4, "TS. Nguyễn Văn A", "N02-T01", 40, 40, 3, 1, 3, "A101"),
        new LopHocPhan("LHP03", "ITEC1311", "Mẫu thiết kế hướng đối tượng", 3, "ThS. Trần Thị B", "N01-T01", 45, 30, 4, 4, 6, "B203"),
        new LopHocPhan("LHP04", "ITEC4403", "Quản trị mạng", 3, "ThS. Lê Văn C", "N01-T01", 40, 25, 2, 7, 9, "C305"),
        new LopHocPhan("LHP05", "POLI1207", "Lịch sử Đảng Cộng sản Việt Nam", 2, "ThS. Phạm Thị D", "N01-T01", 60, 55, 5, 1, 2, "D102"),
        new LopHocPhan("LHP06", "POLI1208", "Tư tưởng Hồ Chí Minh", 2, "ThS. Phạm Thị D", "N01-T01", 60, 20, 6, 1, 2, "D102"),
        new LopHocPhan("LHP07", "PEDU0201", "GDTC1 - Thể dục phát triển chung", 1.5, "GV. Đỗ Văn E", "N01-T01", 50, 50, 3, 7, 8, "Sân TDTT")
    ));

    // ============== TRẠNG THÁI ==============
    private final LinkedHashSet<LopHocPhan> daDangKy = new LinkedHashSet<>();
    private static final double TIN_CHI_TOI_DA = 24.0;

    private OpenTableModel modelMoLop;
    private DangKyTableModel modelDaDangKy;
    private JLabel lblTongTC;

    public DangKyMonHocApp() {
        super("Đăng ký môn học - Demo (Phân tích thiết kế hệ thống)");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(980, 700);
        setLocationRelativeTo(null);

        JPanel root = new JPanel(new BorderLayout(0, 10));
        root.setBorder(new EmptyBorder(12, 12, 12, 12));
        setContentPane(root);

        JLabel title = new JLabel("Danh sách lớp học phần mở đăng ký");
        title.setFont(title.getFont().deriveFont(Font.BOLD, 15f));
        root.add(title, BorderLayout.NORTH);

        modelMoLop = new OpenTableModel();
        JTable tblMoLop = new JTable(modelMoLop);
        tblMoLop.setRowHeight(26);
        tblMoLop.getColumnModel().getColumn(0).setMaxWidth(70);
        JScrollPane spTop = new JScrollPane(tblMoLop);
        spTop.setPreferredSize(new Dimension(900, 260));

        modelDaDangKy = new DangKyTableModel();
        JTable tblDaDangKy = new JTable(modelDaDangKy);
        tblDaDangKy.setRowHeight(24);
        JScrollPane spBottom = new JScrollPane(tblDaDangKy);

        JPanel bottomHeader = new JPanel(new BorderLayout());
        JLabel lblDsDaDk = new JLabel("Danh sách môn đã đăng ký");
        lblDsDaDk.setFont(lblDsDaDk.getFont().deriveFont(Font.BOLD, 15f));
        lblTongTC = new JLabel("Tổng số tín chỉ: 0 / " + fmt(TIN_CHI_TOI_DA));
        lblTongTC.setFont(lblTongTC.getFont().deriveFont(Font.BOLD));
        bottomHeader.add(lblDsDaDk, BorderLayout.WEST);
        bottomHeader.add(lblTongTC, BorderLayout.EAST);

        JButton btnXuatPhieu = new JButton("Xuất phiếu đăng ký");
        btnXuatPhieu.addActionListener(e -> xuatPhieu());
        JPanel bottomFooter = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        bottomFooter.add(btnXuatPhieu);

        JPanel bottomPanel = new JPanel(new BorderLayout(0, 6));
        bottomPanel.add(bottomHeader, BorderLayout.NORTH);
        bottomPanel.add(spBottom, BorderLayout.CENTER);
        bottomPanel.add(bottomFooter, BorderLayout.SOUTH);

        JSplitPane split = new JSplitPane(JSplitPane.VERTICAL_SPLIT, spTop, bottomPanel);
        split.setResizeWeight(0.5);
        root.add(split, BorderLayout.CENTER);
    }

    private String fmt(double d) {
        return d == Math.floor(d) ? String.valueOf((long) d) : String.valueOf(d);
    }

    private void capNhatTongTC() {
        double tong = daDangKy.stream().mapToDouble(l -> l.soTinChi).sum();
        lblTongTC.setText("Tổng số tín chỉ: " + fmt(tong) + " / " + fmt(TIN_CHI_TOI_DA));
        modelDaDangKy.fireTableDataChanged();
    }

    private void dangKy(LopHocPhan lhp) {
        if (lhp.conLai() <= 0) {
            JOptionPane.showMessageDialog(this, "Lớp \"" + lhp.tenMH + " (" + lhp.nhomTo + ")\" đã hết chỗ.",
                "Không thể đăng ký", JOptionPane.WARNING_MESSAGE);
            return;
        }
        double tongSauKhiThem = daDangKy.stream().mapToDouble(l -> l.soTinChi).sum() + lhp.soTinChi;
        if (tongSauKhiThem > TIN_CHI_TOI_DA) {
            JOptionPane.showMessageDialog(this, "Vượt quá số tín chỉ tối đa (" + fmt(TIN_CHI_TOI_DA) + " TC) cho phép trong học kỳ.",
                "Không thể đăng ký", JOptionPane.WARNING_MESSAGE);
            return;
        }
        for (LopHocPhan da : daDangKy) {
            if (da.maMH.equals(lhp.maMH)) {
                JOptionPane.showMessageDialog(this, "Bạn đã đăng ký môn \"" + lhp.tenMH + "\" ở nhóm khác rồi.",
                    "Không thể đăng ký", JOptionPane.WARNING_MESSAGE);
                return;
            }
            if (da.trungLich(lhp)) {
                JOptionPane.showMessageDialog(this,
                    "Trùng lịch học với môn \"" + da.tenMH + "\" (" + da.lich() + ").",
                    "Không thể đăng ký", JOptionPane.WARNING_MESSAGE);
                return;
            }
        }
        lhp.siSoHienTai++;
        daDangKy.add(lhp);
        capNhatTongTC();
    }

    private void huyDangKy(LopHocPhan lhp) {
        if (daDangKy.remove(lhp)) {
            lhp.siSoHienTai--;
            capNhatTongTC();
        }
    }

    private void xuatPhieu() {
        if (daDangKy.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Bạn chưa đăng ký môn nào.", "Phiếu đăng ký", JOptionPane.INFORMATION_MESSAGE);
            return;
        }
        StringBuilder sb = new StringBuilder();
        sb.append("PHIẾU ĐĂNG KÝ MÔN HỌC\n");
        sb.append("Thời gian xuất: ").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))).append("\n");
        sb.append("----------------------------------------\n");
        int i = 1;
        double tong = 0;
        for (LopHocPhan l : daDangKy) {
            sb.append(i++).append(". ").append(l.maMH).append(" - ").append(l.tenMH)
              .append(" (").append(fmt(l.soTinChi)).append(" TC)\n")
              .append("   Nhóm-Tổ: ").append(l.nhomTo).append(" | ").append(l.lich()).append("\n");
            tong += l.soTinChi;
        }
        sb.append("----------------------------------------\n");
        sb.append("Tổng số tín chỉ: ").append(fmt(tong));

        JTextArea area = new JTextArea(sb.toString());
        area.setEditable(false);
        area.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 13));
        JOptionPane.showMessageDialog(this, new JScrollPane(area), "Phiếu đăng ký", JOptionPane.PLAIN_MESSAGE);
    }

    // ============== TABLE MODEL: DANH SÁCH MỞ LỚP ==============
    class OpenTableModel extends AbstractTableModel {
        private final String[] cols = {"Đăng ký", "Mã LHP", "Môn học", "Nhóm-Tổ", "Số TC", "Giảng viên", "Còn lại", "Thời khóa biểu"};

        @Override public int getRowCount() { return danhSachLHP.size(); }
        @Override public int getColumnCount() { return cols.length; }
        @Override public String getColumnName(int c) { return cols[c]; }
        @Override public Class<?> getColumnClass(int c) { return c == 0 ? Boolean.class : String.class; }
        @Override public boolean isCellEditable(int r, int c) { return c == 0; }

        @Override
        public Object getValueAt(int r, int c) {
            LopHocPhan l = danhSachLHP.get(r);
            switch (c) {
                case 0: return daDangKy.contains(l);
                case 1: return l.maLHP;
                case 2: return l.tenMH;
                case 3: return l.nhomTo;
                case 4: return fmt(l.soTinChi);
                case 5: return l.giangVien;
                case 6: return l.conLai() + "/" + l.siSoToiDa;
                case 7: return l.lich();
                default: return "";
            }
        }

        @Override
        public void setValueAt(Object value, int r, int c) {
            if (c != 0) return;
            LopHocPhan l = danhSachLHP.get(r);
            boolean checked = Boolean.TRUE.equals(value);
            if (checked) dangKy(l); else huyDangKy(l);
            fireTableRowsUpdated(r, r);
        }
    }

    // ============== TABLE MODEL: ĐÃ ĐĂNG KÝ ==============
    class DangKyTableModel extends AbstractTableModel {
        private final String[] cols = {"Mã MH", "Môn học", "Nhóm-Tổ", "Số TC", "Thời khóa biểu"};

        @Override public int getRowCount() { return daDangKy.size(); }
        @Override public int getColumnCount() { return cols.length; }
        @Override public String getColumnName(int c) { return cols[c]; }

        @Override
        public Object getValueAt(int r, int c) {
            LopHocPhan l = new ArrayList<>(daDangKy).get(r);
            switch (c) {
                case 0: return l.maMH;
                case 1: return l.tenMH;
                case 2: return l.nhomTo;
                case 3: return fmt(l.soTinChi);
                case 4: return l.lich();
                default: return "";
            }
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); } catch (Exception ignored) {}
            new DangKyMonHocApp().setVisible(true);
        });
    }
}
