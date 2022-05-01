init();

function init() {
  const colorPicker = document.querySelector('#color');
  let currentColor = localStorage.getItem('bj-dot-com-color');
  
  if (currentColor) {
    setVarColor(currentColor);
  }

  colorPicker.value = currentColor || getComputedStyle(document.documentElement).getPropertyValue('--theme');
  colorPicker.addEventListener('input', handlePickerInput);
  colorPicker.addEventListener('change', handlePickerChange);
}

function setVarColor(color) {
  document.documentElement.style.setProperty('--theme', color);
}

function handlePickerInput(e) {
  setVarColor(e.target.value);
}

function handlePickerChange(e) {
  setVarColor(e.target.value);
  localStorage.setItem('bj-dot-com-color', e.target.value);
}
