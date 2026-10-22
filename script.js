const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '×' : '☰';
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = '☰';
  mainNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
  link.classList.add('active');
}));

document.getElementById('year').textContent = new Date().getFullYear();
const visitDate = document.getElementById('visitDate');
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
visitDate.min = localToday;

const citySearch = document.getElementById('citySearch');
const typeSearch = document.getElementById('typeSearch');
const searchFeedback = document.getElementById('searchFeedback');
function applySearch() {
  const city = citySearch.value;
  const type = typeSearch.value;
  let shown = 0;
  document.querySelectorAll('.city-card').forEach(card => {
    const cityMatch = city === 'all' || card.dataset.city === city;
    const typeMatch = type === 'all' || (card.dataset.type || '').includes(type);
    card.hidden = !(cityMatch && typeMatch);
    if (!card.hidden) shown++;
  });
  document.getElementById('destinations').scrollIntoView({behavior:'smooth', block:'start'});
  searchFeedback.textContent = shown ? `عرضنا لك ${shown} ${shown === 1 ? 'وجهة مناسبة' : 'وجهات مناسبة'} حسب اختيارك.` : 'ما لقينا وجهة بهذا الاختيار. جرب تغيير المدينة أو نوع التجربة.';
}
document.getElementById('searchBtn').addEventListener('click', applySearch);

document.querySelectorAll('[data-city-link]').forEach(link => {
  link.addEventListener('click', () => {
    const city = link.dataset.cityLink;
    citySearch.value = city;
    typeSearch.value = 'all';
    document.querySelectorAll('.city-card').forEach(card => card.hidden = card.dataset.city !== city);
    searchFeedback.textContent = `اخترت ${city}. يمكنك استكشاف الأماكن المقترحة أدناه.`;
  });
});

const filterButtons = document.querySelectorAll('#placeFilters [data-filter]');
const placeCards = [...document.querySelectorAll('.place-card')];
function filterPlaces(filter) {
  let visible = 0;
  placeCards.forEach(card => {
    const show = filter === 'all' || (card.dataset.type || '').includes(filter);
    card.hidden = !show;
    if (show) visible++;
  });
  document.getElementById('emptyPlaces').hidden = visible > 0;
}
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(b => b.classList.remove('selected'));
  button.classList.add('selected');
  filterPlaces(button.dataset.filter);
}));

document.querySelectorAll('.save-btn').forEach(button => {
  button.addEventListener('click', () => {
    const saved = button.classList.toggle('saved');
    button.textContent = saved ? '♥' : '♡';
    button.setAttribute('aria-pressed', String(saved));
    showToast(saved ? 'أُضيف المكان إلى مفضلتك في هذه الجلسة.' : 'أُزيل المكان من المفضلة.');
  });
});

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}
function formDataObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}
document.getElementById('bookingForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = formDataObject(form);
  const message = document.getElementById('bookingMessage');
  message.classList.remove('error');
  message.textContent = `شكرًا ${data.name}، جهزنا ملخص طلبك التجريبي لزيارة ${data.city} بتاريخ ${data.date}. تنبيه: لم يُرسل الطلب إلى جهة خارجية ولم يتم تأكيد أي حجز.`;
  message.scrollIntoView({behavior:'smooth', block:'nearest'});
  form.reset();
  visitDate.min = localToday;
});
document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = formDataObject(form);
  const message = document.getElementById('contactMessage');
  message.classList.remove('error');
  message.textContent = `شكرًا ${data.name}، تم التحقق من النموذج التجريبي بنجاح. لم تُرسل الرسالة إلى بريد إلكتروني؛ يلزم ربط النموذج بخدمة استقبال الرسائل لتفعيل الإرسال الحقيقي.`;
  form.reset();
});
