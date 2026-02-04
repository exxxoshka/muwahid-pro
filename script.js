// === Переключение вкладок ===
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
    const tabId = btn.dataset.tab;
    document.getElementById(tabId).classList.add('active');
  });
});

// === Тасбих ===
let count = 0;
let goal = 33;

function updateCounter() {
  const counterEl = document.getElementById('counter');
  counterEl.textContent = count;
  if (count >= goal) {
    counterEl.style.color = 'green';
  } else {
    counterEl.style.color = 'black';
  }
}

document.getElementById('tap-area').addEventListener('click', () => {
  count++;
  updateCounter();
});

document.getElementById('reset').addEventListener('click', () => {
  count = 0;
  updateCounter();
});

document.querySelectorAll('input[name="goal"]').forEach(radio => {
  radio.addEventListener('change', () => {
    goal = parseInt(radio.value);
    if (radio.value === '33' || radio.value === '100') {
      document.getElementById('custom-goal').value = goal;
    }
    updateCounter();
  });
});

document.getElementById('custom-goal').addEventListener('input', e => {
  goal = parseInt(e.target.value) || 33;
  updateCounter();
});

// === Азан ===
const AZAN_FILES = [
  { name: "Азан 1", file: "azan1.mp3" },
  { name: "Азан 2", file: "azan2.mp3" },
  {  }
  // добавь столько, сколько у тебя файлов
];
const azanList = document.getElementById('azan-list');
const azanPlayer = document.getElementById('azan-player');

AZAN_FILES.forEach(azan => {
  const btn = document.createElement('button');
  btn.textContent = azan.name;
  btn.onclick = () => {
    azanPlayer.src = azan.file;
    azanPlayer.play();
  };
  azanList.appendChild(btn);
});

// === Время намаза (используем API) ===
async function fetchPrayerTimes(lat, lon) {
try {
// Метод 15 — ФМОР (Федерация мусульманских организаций России)
// Метод 5 — ДУМ России (Москва)
// Метод 8 — Татарстан (ДУМ РТ)
const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=15`);
const data = await res.json();
const times = data.data.timings;
let html = '<ul>';
for (const [name, time] of Object.entries(times)) {
html += `<li>${name}: ${time}</li>`;
}
html += '</ul>';
document.getElementById('prayer-times').innerHTML = html;
} catch (e) {
document.getElementById('prayer-times').textContent = 'Ошибка загрузки времени намаза.';
}
}
// === Геолокация ===
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    document.getElementById('location').textContent = `Ваше местоположение: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    fetchPrayerTimes(latitude, longitude);
  }, err => {
    document.getElementById('location').textContent = 'Не удалось определить местоположение.';
  });
} else {
  document.getElementById('location').textContent = 'Геолокация не поддерживается.';
}

// === Кибла ===
function calculateQibla(lat, lon) {
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;
  const kLat = 21.4225 * Math.PI / 180; // Мекка широта
  const kLon = 39.8262 * Math.PI / 180; // Мекка долгота

  const y = Math.sin(kLon - lonRad);
  const x = Math.cos(latRad) * Math.tan(kLat) - Math.sin(latRad) * Math.cos(kLon - lonRad);
  let qiblaAngle = (Math.atan2(y, x) * 180) / Math.PI;
  if (qiblaAngle < 0) qiblaAngle += 360;

  return qiblaAngle;
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const angle = calculateQibla(pos.coords.latitude, pos.coords.longitude);
    document.getElementById('qibla-info').textContent = `Направление на Киблу: ${angle.toFixed(1)}°`;
    document.querySelector('#compass').style.transform = `rotate(${angle}deg)`;
  }, () => {
    document.getElementById('qibla-info').textContent = 'Не удалось определить направление.';
  });
}