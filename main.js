const cepField = document.querySelector('#cep');
const cepErrorField = document.querySelector('#cepError');
const streetField = document.querySelector('#street');
const numberField = document.querySelector('#number');
const neighborhoodField = document.querySelector('#neighborhood');
const cityField = document.querySelector('#city');
const stateField = document.querySelector('#state');
const loadingField = document.querySelector('img#loading');
const formField = document.querySelector('form');

// Limpa o erro do CEP ao focar no campo
cepField.addEventListener('focus', cleanCepError);

// Verifica o formato do CEP ao pressionar Enter
cepField.addEventListener('keypress', (event) => {
  if (event.key === "Enter") {
    const cep = cepField.value.trim(); // Remove espaços extras

    if (/^\d{5}-?\d{3}$/.test(cep)) {
      loadCepInfo(cep);
    } else {
      showCepError();
    }
  }
});

// Carrega as informações do CEP
function loadCepInfo(cep) {
  toggleLoading(true);
  const url = `https://viacep.com.br/ws/${cep}/json/`;

  fetch(url)
    .then(response => response.json())
    .then(cepInfo => {
      if (cepInfo.erro || !cepInfo.logradouro) { // Verifica se a API retornou erro
        showCepError();
      } else {
        updateAddressFields(cepInfo);
      }
    })
    .catch(() => {
      showCepError(); // Mostra erro caso a requisição falhe
    })
    .finally(() => {
      toggleLoading(false);
    });
}

// Atualiza os campos de endereço com as informações do CEP
function updateAddressFields(cepInfo) {
  streetField.value = cepInfo.logradouro;
  neighborhoodField.value = cepInfo.bairro;
  cityField.value = cepInfo.localidade;
  stateField.value = cepInfo.uf;

  numberField.focus();
  cleanCepError();
}

// Limpa o erro do CEP
function cleanCepError() {
  cepField.classList.remove('input-cep-error');
  cepErrorField.classList.add('hidden');
}

// Mostra o erro do CEP
function showCepError() {
  cepField.classList.add('input-cep-error');
  cepErrorField.classList.remove('hidden');
  cleanAddressFields();
}

// Limpa os campos de endereço
function cleanAddressFields() {
  streetField.value = '';
  numberField.value = '';
  neighborhoodField.value = '';
  cityField.value = '';
  stateField.value = '';
}

// Alterna a visibilidade do indicador de carregamento
function toggleLoading(isLoading) {
  loadingField.classList.toggle('hidden', !isLoading);
  formField.classList.toggle('loading', isLoading);
}
