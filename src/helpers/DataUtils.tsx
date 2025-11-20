export default class TextUtils {
  /**
   * 🧩 Format dữ liệu để gửi API
   * - Nếu object có { label, value, key } → lấy value
   * - Nếu object có { id, name } → lấy id
   * - Nếu là mảng → map từng phần tử áp dụng quy tắc trên, convert string số → number
   * - Các object khác hoặc kiểu dữ liệu cơ bản → giữ nguyên
   */
  static formatDataForAPI = (obj: Record<string, any>): Record<string, any> => {
    const newObj: Record<string, any> = {};

    for (const key in obj) {
      const value = obj[key];

      if (Array.isArray(value)) {
        newObj[key] = value.map((item) => {
          if (item && typeof item === "object" && !(item instanceof Date)) {
            if ("label" in item && "value" in item && "key" in item) {
              return item.value;
            } else if ("id" in item && "name" in item) {
              return item.id;
            }
          }
          // Convert string số sang number
          if (
            typeof item === "string" &&
            !isNaN(Number(item)) &&
            item.trim() !== ""
          ) {
            return Number(item);
          }
          return item;
        });
      } else if (
        value &&
        typeof value === "object" &&
        !(value instanceof Date)
      ) {
        if ("label" in value && "value" in value && "key" in value) {
          newObj[key] = value.value;
        } else if ("id" in value && "name" in value) {
          newObj[key] = value.id;
        } else {
          newObj[key] = value;
        }
      } else {
        newObj[key] = value;
      }
    }

    return newObj;
  };

  /**
   * 🔍 Convert chuỗi sang kiểu dữ liệu tương ứng
   * - "true"/"false" → boolean
   * - "null"/"undefined" → null/undefined
   * - Chuỗi số → number
   */
  static parseValue = (value: any): any => {
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "null") return null;
    if (value === "undefined") return undefined;

    if (
      typeof value === "string" &&
      !isNaN(Number(value)) &&
      value.trim() !== ""
    ) {
      return Number(value);
    }

    return value;
  };

  /**
   * ⚙️ Convert object params (vd: searchPrams) thành filter object
   * - Bỏ qua các key trong excludeKeys
   * - Convert giá trị string sang đúng kiểu dữ liệu
   */
  static convertSearchParams = (
    params: Record<string, any>,
    excludeKeys: string[] = []
  ): Record<string, any> => {
    const filter: Record<string, any> = {};

    Object.keys(params).forEach((key) => {
      if (!excludeKeys.includes(key)) {
        const value = TextUtils.parseValue(params[key]);
        if (value !== null && value !== undefined && value !== "") {
          filter[key] = value;
        }
      }
    });

    return filter;
  };
}

