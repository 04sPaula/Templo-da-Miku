document.addEventListener('DOMContentLoaded', () => {
  const db = window.db;
  const doacoesRef = window.collection(db, 'doacoes');

  if (document.getElementById('corpoTabelaDoacoes')) {
    const q = window.query(doacoesRef, window.orderBy('dataDoacao', 'desc'));
    window.onSnapshot(q, snapshot => {
      atualizarTabela(snapshot);
    }, error => {
      console.error("Erro ao carregar doações:", error);
    });
  }
  
  const form = document.getElementById('doacaoForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const nomeDoador = document.getElementById('nomeDoador').value;
      const valorDoacao = document.getElementById('valorDoacao').value;
      const modoPagamento = document.getElementById('modoPagamento').value;
      
      if (!nomeDoador || !valorDoacao || !modoPagamento) {
        alert('Por favor, preencha todos os campos.');
        return;
      }
      
      console.log("Redirecionando para pagamento:", modoPagamento);
      
      localStorage.setItem('doador_nome', nomeDoador);
      localStorage.setItem('doador_valor', valorDoacao);
      localStorage.setItem('doador_modo', modoPagamento);
      
      if (modoPagamento === 'Cartao') {
        window.location.href = '../telas/pagCartao.html';
      } else if (modoPagamento === 'Pix') {
        window.location.href = '../telas/pagPix.html';
      }
    });
  }
});

function atualizarTabela(snapshot) {
  const corpoTabela = document.getElementById('corpoTabelaDoacoes');
  if (corpoTabela) {
    corpoTabela.innerHTML = '';
    snapshot.forEach(doc => {
      const doacao = doc.data();
      const data = doacao.dataDoacao?.toDate() || new Date();
      const valorFormatado = parseFloat(doacao.valorDoacao).toFixed(2);
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${doacao.nomeDoador}</td>
        <td>R$ ${valorFormatado}</td>
        <td>${data.toLocaleString()}</td>
        <td>${doacao.modoPagamento}</td>
      `;
      corpoTabela.appendChild(row);
    });
  }
}