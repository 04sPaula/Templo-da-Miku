import Doacao from './doacao.js';

document.addEventListener('DOMContentLoaded', () => {
  // Recuperar dados do localStorage
  const nomeDoador = localStorage.getItem('doador_nome');
  const valorDoacao = localStorage.getItem('doador_valor');
  
  // Exibir os dados do doador
  document.getElementById('nome-doador').textContent = nomeDoador || 'N/A';
  document.getElementById('valor-doacao').textContent = valorDoacao || '0.00';
  
  // Se não houver dados de doação, redirecionar para a página inicial
  if (!nomeDoador || !valorDoacao) {
    alert('Informações de doação não encontradas. Redirecionando para a página inicial.');
    window.location.href = 'index.html';
    return;
  }
  
  // Eventos para cartão de crédito
  const cardForm = document.getElementById('cardForm');
  const cardNumberInput = document.getElementById('cardNumber');
  const cardNameInput = document.getElementById('cardName');
  const cardExpiryInput = document.getElementById('cardExpiry');
  
  // Formatar número do cartão
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      value = value.replace(/(.{4})/g, '$1 ').trim();
      e.target.value = value;
      
      // Atualizar visualização
      document.querySelector('.card-number-display').textContent = 
        value || '**** **** **** ****';
    });
  }
  
  // Atualizar nome do titular
  if (cardNameInput) {
    cardNameInput.addEventListener('input', function(e) {
      document.querySelector('.card-holder').textContent = 
        e.target.value || 'Nome do Titular';
    });
  }
  
  // Formatar data de validade
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      
      e.target.value = value;
      document.querySelector('.card-expiry').textContent = 
        value || 'MM/AA';
    });
  }
  
  // Submissão do formulário de pagamento
  if (cardForm) {
    cardForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Validações básicas
      const cardNumber = cardNumberInput.value.replace(/\s/g, '');
      const cardName = cardNameInput.value;
      const cardExpiry = cardExpiryInput.value;
      const cardCVV = document.getElementById('cardCVV').value;
      
      if (cardNumber.length < 16 || !cardName || cardExpiry.length < 5 || cardCVV.length < 3) {
        alert('Por favor, preencha todos os campos do cartão corretamente.');
        return;
      }
      
      try {
        // Criar e submeter a doação
        const db = window.db;
        const doacoesRef = window.collection(db, 'doacoes');
        
        await window.addDoc(doacoesRef, {
          nomeDoador: nomeDoador,
          valorDoacao: parseFloat(valorDoacao),
          dataDoacao: window.Timestamp.now(),
          modoPagamento: 'Cartao'
        });
        
        // Atualizar estatísticas
        const estatisticasRef = window.doc(db, "estatisticas", "doacoes");
        try {
          const estatisticasDoc = await window.getDoc(estatisticasRef);
          if (!estatisticasDoc.exists()) {
            await window.setDoc(estatisticasRef, { totalArrecadado: parseFloat(valorDoacao) });
          } else {
            await window.updateDoc(estatisticasRef, {
              totalArrecadado: window.increment(parseFloat(valorDoacao))
            });
          }
        } catch (error) {
          console.error("Erro ao atualizar estatísticas:", error);
        }
        
        // Limpar localStorage e redirecionar
        localStorage.removeItem('doador_nome');
        localStorage.removeItem('doador_valor');
        localStorage.removeItem('doador_modo');
        
        alert('Pagamento processado com sucesso! Obrigado pela doação.');
        window.location.href = 'agradecimentos.html';
      } catch (error) {
        console.error("Erro ao processar pagamento:", error);
        alert('Erro ao processar o pagamento. Por favor, tente novamente.');
      }
    });
  }
});