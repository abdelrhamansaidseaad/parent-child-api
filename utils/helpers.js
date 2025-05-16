/**
 * utils/helpers.js
 * ملف الدوال المساعدة للنظام
 */

/**
 * توليد كود عشوائي لأغراض الربط
 * @param {number} length - طول الكود المطلوب (افتراضي 6 أحرف)
 * @returns {string} الكود العشوائي
 */
exports.generateRandomCode = (length = 6) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // استثناء الأحرف التي قد تسبب لبساً (O, 0, I, 1, etc.)
  let code = '';
  
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
};

/**
 * تنسيق التاريخ لعرضه للمستخدم
 * @param {Date} date - التاريخ المطلوب تنسيقه
 * @returns {string} التاريخ المنسق
 */
exports.formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Cairo' // توقيت مصر
  };
  return new Date(date).toLocaleDateString('ar-EG', options);
};

/**
 * التحقق من قوة كلمة المرور
 * @param {string} password - كلمة المرور المراد التحقق منها
 * @returns {object} { valid: boolean, message: string }
 */
exports.validatePassword = (password) => {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (password.length < minLength) {
    return {
      valid: false,
      message: `كلمة المرور يجب أن تحتوي على ${minLength} أحرف على الأقل`
    };
  }
  
  if (!hasUpper || !hasLower) {
    return {
      valid: false,
      message: 'يجب أن تحتوي كلمة المرور على أحرف كبيرة وصغيرة'
    };
  }
  
  if (!hasNumber) {
    return {
      valid: false,
      message: 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل'
    };
  }
  
  return { valid: true, message: 'كلمة المرور قوية' };
};

/**
 * إخفاء جزء من البيانات الحساسة (مثل أرقام الهواتف)
 * @param {string} data - البيانات المراد إخفاء جزء منها
 * @param {number} visibleChars - عدد الأحرف المرئية من كل طرف
 * @returns {string} البيانات مع إخفاء الجزء الأوسط
 */
exports.maskSensitiveData = (data, visibleChars = 3) => {
  if (!data || data.length <= visibleChars * 2) return data;
  
  const firstPart = data.substring(0, visibleChars);
  const lastPart = data.substring(data.length - visibleChars);
  const stars = '*'.repeat(data.length - (visibleChars * 2));
  
  return `${firstPart}${stars}${lastPart}`;
};

/**
 * إنشاء رمز تحقق رقمي
 * @param {number} length - طول الرمز (افتراضي 6 أرقام)
 * @returns {string} رمز التحقق
 */
exports.generateVerificationCode = (length = 6) => {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
};

/**
 * حساب العمر بناء على تاريخ الميلاد
 * @param {Date} birthDate - تاريخ الميلاد
 * @returns {number} العمر بالسنوات
 */
exports.calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

module.exports = exports;