window.matchMedia('(min-width: 770px)').addEventListener('change', () => {
  document.getElementsByClassName('collapse')[0].className = 'collapse';
});

db.collection('users')
  .doc(JSON.parse(localStorage.getItem('user')).email)
  .get()
  .then((doc) => {
    try {
      document.getElementById('nav-city').innerHTML = doc.data().city;
      document.getElementById('nav-city-mob').innerHTML = doc.data().city;
    } catch {}
  });

function salaryNumbersSort() {
  let salaryInput = document.getElementById('salary-vacancy-input').value;
  document.getElementById('salary-vacancy-input').value = salaryInput
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
