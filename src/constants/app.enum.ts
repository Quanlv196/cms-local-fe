export enum PositionType {
  // CẤP LỮ ĐOÀN
  LU_DOAN_TRUONG = "lu_doan_truong",
  CHINH_UY_LU_DOAN = "chinh_uy_lu_doan",
  PHO_LU_DOAN_TRUONG_THAM_MUU_TRUONG = "pho_lu_doan_truong_tham_muu_truong",
  PHO_LU_DOAN_TRUONG = "pho_lu_doan_truong",
  PHO_CHINH_UY_LU_DOAN = "pho_chinh_uy_lu_doan",

  // PHÒNG THAM MƯU
  THAM_MUU_TRUONG = "tham_muu_truong",
  PHO_THAM_MUU_TRUONG = "pho_tham_muu_truong",

  // PHÒNG CHÍNH TRỊ
  CHU_NHIEM_CHINH_TRI = "chu_nhiem_chinh_tri",
  PHO_CHU_NHIEM_CHINH_TRI = "pho_chu_nhiem_chinh_tri",

  // PHÒNG HẬU CẦN KỸ THUẬT
  CHU_NHIEM_HAU_CAN_KY_THUAT = "chu_nhiem_hau_can_ky_thuat",
  PHO_CHU_NHIEM_HAU_CAN_KY_THUAT = "pho_chu_nhiem_hau_can_ky_thuat",

  // CẤP TIỂU ĐOÀN
  TIEU_DOAN_TRUONG = "tieu_doan_truong",
  CHINH_TRI_VIEN_TIEU_DOAN = "chinh_tri_vien_tieu_doan",
  PHO_TIEU_DOAN_TRUONG = "pho_tieu_doan_truong",
  CHINH_TRI_VIEN_PHO_TIEU_DOAN = "chinh_tri_vien_pho_tieu_doan",

  // CẤP ĐẠI ĐỘI
  DAI_DOI_TRUONG = "dai_doi_truong",
  CHINH_TRI_VIEN_DAI_DOI = "chinh_tri_vien_dai_doi",
  PHO_DAI_DOI_TRUONG = "pho_dai_doi_truong",
  CHINH_TRI_VIEN_PHO_DAI_DOI = "chinh_tri_vien_pho_dai_doi",

  //CẤP TRUNG ĐỘI
  TRUNG_DOI_TRUONG = "trung_doi_truong",

  // QUÂN NHÂN CHUYÊN NGHIỆP
  LAI_XE = "lai_xe",
  QUAN_LY = "quan_ly",
  NHAN_VIEN_TAI_CHINH = "nhan_vien_tai_chinh",
  Y_SI = "y_si",
  NHAN_VIEN_NAU_AN = "nhan_vien_nau_an",
  BEP_TRUONG = "bep_truong",
  NHAN_VIEN_QUAN_NHU = "nhan_vien_quan_nhu",
  NHAN_VIEN_XANG_DAU = "nhan_vien_xang_dau",
  NHAN_VIEN_DOAN_TRAI = "nhan_vien_doan_trai",
  DUOC_SI = "duoc_si",
  NHAN_VIEN_THONG_KE = "nhan_vien_thong_ke",
  NHAN_VIEN_HOA_NGHIEM = "nhan_vien_hoa_nghiem",
  THO_SUA_CHUA_KHI_TAI = "tho_sua_chua_khi_tai",
  THO_SUA_CHUA_O_TO = "tho_sua_chua_o_to",
  THU_KHO = "thu_kho",
  THO_SUA_CHUA_THONG_TIN = "tho_sua_chua_thong_tin",
  DAI_TRUONG_BAO_VU = "dai_truong_bao_vu",
  NHAN_VIEN_BAO_VU = "nhan_vien_bao_vu",
  NHAN_VIEN_BAO_MAT = "nhan_vien_bao_mat",
  NHAN_VIEN_CO_YEU = "nhan_vien_co_yeu",
  NHAN_VIEN_LUC = "nhan_vien_luc",
  NHAN_VIEN_CONG_NGHE_THONG_TIN = "nhan_vien_cong_nghe_thong_tin",
  NHAN_VIEN_DO_BAN = "nhan_vien_do_ban",

  // HẠ SĨ QUAN
  TIEU_DOI_TRUONG = "tieu_doi_truong",
  Y_TA = "y_ta",
  BAO_VU = "bao_vu",

  // CHIẾN SĨ MỚI
  CHIEN_SI_MOI = "chien_si_moi",
}

export enum RoleType {
  // Cấp Tướng
  DAI_TUONG = "dai_tuong",
  THUONG_TUONG = "thuong_tuong",
  TRUNG_TUONG = "trung_tuong",
  THIEU_TUONG = "thieu_tuong",

  // Cấp Tá
  DAI_TA = "dai_ta",
  THUONG_TA = "thuong_ta",
  TRUNG_TA = "trung_ta",
  THIEU_TA = "thieu_ta",

  // Cấp Úy
  DAI_UY = "dai_uy",
  THUONG_UY = "thuong_uy",
  TRUNG_UY = "trung_uy",
  THIEU_UY = "thieu_uy",

  // Hạ sĩ quan, binh sĩ
  BINH_NHI = "binh_nhi",
  BINH_NHAT = "binh_nhat",
  HA_SI = "ha_si",
  TRUNG_SI = "trung_si",
  THUONG_SI = "thuong_si",
}

enum ObjectType {
  SQ = "sq",
  QNCN = "qncn",
  HSQ_BS = "hsq_bs",
  CS_MOI = "cs_moi",
}
export default ObjectType;

