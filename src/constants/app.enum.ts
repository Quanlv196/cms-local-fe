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
