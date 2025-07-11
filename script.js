
document.addEventListener('DOMContentLoaded', () => {
  const yearSelect = document.getElementById('vehicle-year');
  const makeSelect = document.getElementById('vehicle-make');
  const modelSelect = document.getElementById('vehicle-model');

  // Populate years from 1981 to 2025
  for (let y = 2025; y >= 1981; y--) {
    yearSelect.add(new Option(y, y));
  }

  // Fetch passenger car makes once
  let passengerCarMakes = [];
  fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/passenger%20car?format=json')
    .then(res => res.json())
    .then(data => {
      passengerCarMakes = data.Results.map(item => item.MakeName || item.Make_Name).sort();
    });

  yearSelect.addEventListener('change', () => {
    // Load makes for selected year (filtered to passenger car makes)
    makeSelect.innerHTML = '<option value="">Select Make</option>';
    modelSelect.innerHTML = '<option value="">Select Model</option>';
    passengerCarMakes.forEach(make => {
      makeSelect.add(new Option(make, make));
    });
  });

  makeSelect.addEventListener('change', () => {
    const year = yearSelect.value;
    const make = makeSelect.value;
    modelSelect.innerHTML = '<option value="">Loading...</option>';
    if (year && make) {
      fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`)
        .then(res => res.json())
        .then(data => {
          modelSelect.innerHTML = '<option value="">Select Model</option>';
          data.Results.forEach(item => {
            modelSelect.add(new Option(item.Model_Name, item.Model_Name));
          });
        })
        .catch(() => {
          modelSelect.innerHTML = '<option value="">Failed to load models</option>';
        });
    }
  });
});
