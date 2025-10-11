/* Layout types and other constants */

export const LAYOUT_VERTICAL = 'vertical';
export const LAYOUT_HORIZONTAL = 'topnav';

export const LAYOUT_WIDTH_FLUID = 'fluid';
export const LAYOUT_WIDTH_BOXED = 'boxed';

export const LEFT_SIDEBAR_THEME_DEFAULT = 'default';
export const LEFT_SIDEBAR_THEME_DARK = 'dark';

export const LEFT_SIDEBAR_TYPE_FIXED = 'fixed';
export const LEFT_SIDEBAR_TYPE_CONDENSED = 'condensed';
export const LEFT_SIDEBAR_TYPE_SCROLLABLE = 'scrollable';

export const COLUMN_SERVICE = [
    {
        value: `customer_id.name`,
        status: 1,
        disable: 1,
        title: "Tên bệnh nhân"
    },
    {
        value: 'customer_id.code',
        status: 1,
        title: "Mã bệnh nhân"
    },
    {
        value: `day`,
        status: 1,
        disable: 1,
        title: "Ngày tiếp đón"
    },
    {
        value: `customer_id.birthday`,
        status: 0,
        title: "Tuổi"
    },
    {
        value: `customer_id.sex`,
        status: 0,
        title: "Giới tính"
    },
    {
        value: `customer_id.phone`,
        status: 0,
        title: "Số điện thoại"
    },
    {
        value: `note`,
        status: 0,
        title: "Ghi chú"
    },
    {
        value: `reception_uid.name`,
        status: 0,
        title: "Nhân viên tiếp đón"
    },
    {
        value: `nurse_uid.name`,
        status: 0,
        title: "Điều dưỡng"
    },
    {
        value: `clinic_id.name`,
        status: 1,
        title: "Phòng khám"
    },
    {
        value: `type`,
        status: 1,
        title: "Loại khám"
    },
    {
        value: `form`,
        status: 1,
        title: "Hình thức"
    },
]

export const COLUMN_EXAM = [
    {
        value: `customer_id.name`,
        status: 1,
        disable: 1,
        title: "Tên bệnh nhân"
    },
    {
        value: 'customer_id.code',
        status: 1,
        title: "Mã bệnh nhân"
    },
    {
        value: `customer_id.birthday`,
        status: 1,
        title: "Tuổi"
    },
    {
        value: `birthday`,
        status: 0,
        title: "Năm sinh"
    },
    {
        value: `customer_id.sex`,
        status: 0,
        title: "Giới tính"
    },
    {
        value: `nurse_uid.name`,
        status: 0,
        title: "Điều dưỡng"
    },
    {
        value: `reception_uid.name`,
        status: 0,
        title: "Nhân viên tiếp đón"
    },
    {
        value: `day`,
        status: 1,
        title: "Ngày khám"
    },
    {
        value: `customer_id.phone`,
        status: 0,
        title: "Số điện thoại"
    },
    {
        value: `type`,
        status: 0,
        title: "Loại khám"
    },
    {
        value: `form`,
        status: 0,
        title: "Hình thức"
    },
    {
        value: `clinic_id.name`,
        status: 1,
        title: "Cơ sở khám khám"
    },
    {
        value: `created_time`,
        status: 0,
        title: "Ngày tạo"
    },
    {
        value: `created_uid?.name`,
        status: 0,
        title: "Người tạo"
    },
    {
        value: `medical_history`,
        status: 0,
        title: "Tiền sử"
    },
    {
        value: `diagnose_id?.name`,
        status: 0,
        title: "Chuẩn đoán sơ bộ"
    },
    {
        value: `conclusion_id?.name`,
        status: 0,
        title: "Kết luận"
    },
    {
        value: `note`,
        status: 0,
        title: "Ghi chú"
    },
    {
        value: `status`,
        status: 1,
        disable: 1,
        title: "Trạng thái"
    },
    
]
