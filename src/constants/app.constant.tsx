import ObjectType, { PositionType, RoleType } from "./app.enum";

export const NATION_OPTIONS = [
  { value: "kinh", label: "Kinh" },
  { value: "tay", label: "Tày" },
  { value: "thai", label: "Thái" },
  { value: "muong", label: "Mường" },
  { value: "hoa", label: "Hoa" },
  { value: "khmer", label: "Khmer" },
  { value: "nung", label: "Nùng" },
  { value: "hmong", label: "H'Mông" },
  { value: "dao", label: "Dao" },
  { value: "gia_rai", label: "Gia Rai" },
  { value: "ede", label: "Ê Đê" },
  { value: "ba_na", label: "Ba Na" },
  { value: "xo_dang", label: "Xơ Đăng" },
  { value: "san_chay", label: "Sán Chay" },
  { value: "co_ho", label: "Cơ Ho" },
  { value: "cham", label: "Chăm" },
  { value: "san_diu", label: "Sán Dìu" },
  { value: "hre", label: "Hrê" },
  { value: "mnong", label: "Mnông" },
  { value: "ra_glai", label: "Ra Glai" },
  { value: "xtieng", label: "Xtiêng" },
  { value: "bru_van_kieu", label: "Bru - Vân Kiều" },
  { value: "tho", label: "Thổ" },
  { value: "cho_ro", label: "Chơ Ro" },
  { value: "kho_mu", label: "Khơ Mú" },
  { value: "chu_ru", label: "Churu" },
  { value: "lao", label: "Lào" },
  { value: "la_chi", label: "La Chí" },
  { value: "la_ha", label: "La Ha" },
  { value: "phu_la", label: "Phù Lá" },
  { value: "co_tu", label: "Cơ Tu" },
  { value: "giay", label: "Giáy" },
  { value: "gie_trieng", label: "Gié - Triêng" },
  { value: "ta_oi", label: "Tà Ôi" },
  { value: "ma", label: "Mạ" },
  { value: "chut", label: "Chứt" },
  { value: "lu", label: "Lự" },
  { value: "ngai", label: "Ngái" },
  { value: "pa_then", label: "Pà Thẻn" },
  { value: "co_lao", label: "Cờ Lao" },
  { value: "cong", label: "Cống" },
  { value: "bo_y", label: "Bố Y" },
  { value: "si_la", label: "Si La" },
  { value: "pu_peo", label: "Pu Péo" },
  { value: "brau", label: "Brâu" },
  { value: "o_du", label: "Ơ Đu" },
  { value: "ro_mam", label: "Rơ Măm" },
  { value: "ha_nhi", label: "Hà Nhì" },
  { value: "lo_lo", label: "Lô Lô" },
  { value: "khang", label: "Kháng" },
  { value: "mang", label: "Mảng" },
];

export const REGILION_OPTIONS = [
  { value: "phat_giao", label: "Phật giáo" },
  { value: "thien_chua_giao", label: "Thiên chúa giáo" },
  { value: "none", label: "Không" },
];
export const STATUS_OPTIONS = [
  { value: "1", label: "Đang công tác" },
  { value: "0", label: "Không còn công tác" },
];
export const OBJECT_OPTIONS = [
  { value: ObjectType.SQ, label: "Sĩ quan" },
  { value: ObjectType.QNCN, label: "Quân nhân chuyên nghiệp" },
  { value: ObjectType.HSQ_BS, label: "Hạ sĩ quan" },
  { value: ObjectType.CS_MOI, label: "Chiến sĩ mới" },
];

export const ROLE_OPTIONS = [
  { value: RoleType.DAI_TUONG, label: "Đại tướng" },
  { value: RoleType.THUONG_TUONG, label: "Thượng tướng" },
  { value: RoleType.TRUNG_TUONG, label: "Trung tướng" },
  { value: RoleType.THIEU_TUONG, label: "Thiếu tướng" },
  { value: RoleType.DAI_TA, label: "Đại tá" },
  { value: RoleType.THUONG_TA, label: "Thượng tá" },
  { value: RoleType.TRUNG_TA, label: "Trung tá" },
  { value: RoleType.THIEU_TA, label: "Thiếu tá" },
  { value: RoleType.DAI_UY, label: "Đại úy" },
  { value: RoleType.THUONG_UY, label: "Thượng úy" },
  { value: RoleType.TRUNG_UY, label: "Trung úy" },
  { value: RoleType.THIEU_UY, label: "Thiếu úy" },
  { value: RoleType.BINH_NHI, label: "Binh nhì" },
  { value: RoleType.BINH_NHAT, label: "Binh nhất" },
  { value: RoleType.HA_SI, label: "Hạ sĩ" },
  { value: RoleType.TRUNG_SI, label: "Trung sĩ" },
  { value: RoleType.THUONG_SI, label: "Thượng sĩ" },
];

export const POSITION_OPTIONS = [
  // CẤP LỮ ĐOÀN
  { value: PositionType.LU_DOAN_TRUONG, label: "Lữ đoàn trưởng" },
  { value: PositionType.CHINH_UY_LU_DOAN, label: "Chính ủy Lữ đoàn" },
  {
    value: PositionType.PHO_LU_DOAN_TRUONG_THAM_MUU_TRUONG,
    label: "Phó Lữ đoàn trưởng kiêm Tham mưu trưởng",
  },
  { value: PositionType.PHO_LU_DOAN_TRUONG, label: "Phó Lữ đoàn trưởng" },
  { value: PositionType.PHO_CHINH_UY_LU_DOAN, label: "Phó Chính ủy Lữ đoàn" },

  // PHÒNG THAM MƯU
  { value: PositionType.THAM_MUU_TRUONG, label: "Tham mưu trưởng" },
  { value: PositionType.PHO_THAM_MUU_TRUONG, label: "Phó Tham mưu trưởng" },

  // PHÒNG CHÍNH TRỊ
  { value: PositionType.CHU_NHIEM_CHINH_TRI, label: "Chủ nhiệm Chính trị" },
  {
    value: PositionType.PHO_CHU_NHIEM_CHINH_TRI,
    label: "Phó Chủ nhiệm Chính trị",
  },

  // PHÒNG HẬU CẦN KỸ THUẬT
  {
    value: PositionType.CHU_NHIEM_HAU_CAN_KY_THUAT,
    label: "Chủ nhiệm Hậu cần Kỹ thuật",
  },
  {
    value: PositionType.PHO_CHU_NHIEM_HAU_CAN_KY_THUAT,
    label: "Phó Chủ nhiệm Hậu cần Kỹ thuật",
  },

  // CẤP TIỂU ĐOÀN
  { value: PositionType.TIEU_DOAN_TRUONG, label: "Tiểu đoàn trưởng" },
  {
    value: PositionType.CHINH_TRI_VIEN_TIEU_DOAN,
    label: "Chính trị viên Tiểu đoàn",
  },
  { value: PositionType.PHO_TIEU_DOAN_TRUONG, label: "Phó Tiểu đoàn trưởng" },
  {
    value: PositionType.CHINH_TRI_VIEN_PHO_TIEU_DOAN,
    label: "Chính trị viên Phó Tiểu đoàn",
  },

  // CẤP ĐẠI ĐỘI
  { value: PositionType.DAI_DOI_TRUONG, label: "Đại đội trưởng" },
  {
    value: PositionType.CHINH_TRI_VIEN_DAI_DOI,
    label: "Chính trị viên Đại đội",
  },
  { value: PositionType.PHO_DAI_DOI_TRUONG, label: "Phó Đại đội trưởng" },
  {
    value: PositionType.CHINH_TRI_VIEN_PHO_DAI_DOI,
    label: "Chính trị viên Phó Đại đội",
  },

  // CẤP TRUNG ĐỘI
  { value: PositionType.TRUNG_DOI_TRUONG, label: "Trung đội trưởng" },
];

export const MISSION_COMPLETE_OPTIONS = [
  { value: "hoan_thanh_xuat_sac", label: "Hoàn thành xuất sắc nhiệm vụ" },
  { value: "hoan_thanh_tot", label: "Hoàn thành tốt nhiệm vụ" },
  { value: "hoan_thanh", label: "Hoàn thành nhiệm vụ" },
  { value: "khong_hoan_thanh", label: "Không hoàn thành nhiệm vụ" },
];

export const RoleByObjectTypeLabel: Record<
  ObjectType,
  { value: RoleType; label: string }[]
> = {
  [ObjectType.SQ]: [
    { value: RoleType.DAI_TA, label: "Đại tá" },
    { value: RoleType.THUONG_TA, label: "Thượng tá" },
    { value: RoleType.TRUNG_TA, label: "Trung tá" },
    { value: RoleType.THIEU_TA, label: "Thiếu tá" },
    { value: RoleType.DAI_UY, label: "Đại úy" },
    { value: RoleType.THUONG_UY, label: "Thượng úy" },
    { value: RoleType.TRUNG_UY, label: "Trung úy" },
    { value: RoleType.THIEU_UY, label: "Thiếu úy" },
  ],
  [ObjectType.QNCN]: [
    { value: RoleType.THUONG_TA, label: "Thượng tá" },
    { value: RoleType.TRUNG_TA, label: "Trung tá" },
    { value: RoleType.THIEU_TA, label: "Thiếu tá" },
    { value: RoleType.DAI_UY, label: "Đại úy" },
    { value: RoleType.THUONG_UY, label: "Thượng úy" },
    { value: RoleType.TRUNG_UY, label: "Trung úy" },
    { value: RoleType.THIEU_UY, label: "Thiếu úy" },
  ],
  [ObjectType.HSQ_BS]: [
    { value: RoleType.BINH_NHI, label: "Binh nhì" },
    { value: RoleType.BINH_NHAT, label: "Binh nhất" },
    { value: RoleType.HA_SI, label: "Hạ sĩ" },
    { value: RoleType.TRUNG_SI, label: "Trung sĩ" },
    { value: RoleType.THUONG_SI, label: "Thượng sĩ" },
  ],
  [ObjectType.CS_MOI]: [{ value: RoleType.BINH_NHI, label: "Binh nhì" }],
};

export const SCHOOL_OPTIONS = [
  { value: 1, label: "Sĩ quan Phòng hoá" },
  { value: 2, label: "Sĩ quan Chính trị" },
  { value: 3, label: "Sĩ quan Lục quân" },
  { value: 4, label: "Sĩ quan Thông tin" },
  { value: 5, label: "Học viện Hậu cần" },
  { value: 6, label: "Học viện Kỹ thuật" },
  { value: 7, label: "Học viện Quân y" },
  { value: 8, label: "Trường khác" },
];

export const CARE_OPTIONS = [
  { value: 1, label: "Hoàn cảnh gia đình" },
  { value: 2, label: "Tư tưởng" },
  { value: 3, label: "Sức khoẻ" },
  { value: 4, label: "Quan hệ xã hội" },
];

