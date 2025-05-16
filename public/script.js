document.addEventListener('DOMContentLoaded', () => {
  // عناصر DOM
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const dashboard = document.getElementById('dashboard');
  const parentPanel = document.getElementById('parentPanel');
  const childPanel = document.getElementById('childPanel');
  const generateCodeBtn = document.getElementById('generateCodeBtn');
  const linkParentForm = document.getElementById('linkParentForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const tabButtons = document.querySelectorAll('.tab-btn');

  // حالة التطبيق
  let currentUser = null;

  // تبديل التبويبات
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (btn.dataset.tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
      } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
      }
    });
  });

  // تسجيل الدخول
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        currentUser = data.data.user;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(currentUser));
        showDashboard();
      } else {
        alert(data.message || 'بيانات الدخول غير صحيحة');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('حدث خطأ في الاتصال بالخادم');
    }
  });

  // التسجيل
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, role })
      });

      const data = await response.json();

      if (response.ok) {
        alert('تم التسجيل بنجاح! يرجى تسجيل الدخول');
        document.querySelector('.tab-btn[data-tab="login"]').click();
        registerForm.reset();
      } else {
        alert(data.message || 'حدث خطأ أثناء التسجيل');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('حدث خطأ في الاتصال بالخادم');
    }
  });

  // إنشاء كود ربط
  generateCodeBtn.addEventListener('click', async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/parent/generate-code', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        document.getElementById('linkCode').textContent = data.data.code;
        document.getElementById('expiryDate').textContent = new Date(data.data.expiresAt).toLocaleString();
        document.getElementById('codeDisplay').classList.remove('hidden');
      } else {
        alert(data.message || 'حدث خطأ أثناء إنشاء الكود');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('حدث خطأ في الاتصال بالخادم');
    }
  });

  // ربط الحساب بالأب
  linkParentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const code = document.getElementById('parentCode').value;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/v1/child/link-parent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();

      if (response.ok) {
        alert('تم الربط بنجاح!');
        linkParentForm.reset();
      } else {
        alert(data.message || 'حدث خطأ أثناء عملية الربط');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('حدث خطأ في الاتصال بالخادم');
    }
  });

  // تسجيل الخروج
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    location.reload();
  });

  // عرض لوحة التحكم
  function showDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('username').textContent = user.username;
    document.getElementById('userRole').textContent = user.role === 'parent' ? 'أب' : 'ابن';

    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');
    dashboard.classList.remove('hidden');

    if (user.role === 'parent') {
      parentPanel.classList.remove('hidden');
    } else {
      childPanel.classList.remove('hidden');
    }
  }

  // التحقق من وجود مستخدم مسجل
  if (localStorage.getItem('token')) {
    showDashboard();
  }
});