import Doacao from './doacao.js';

document.addEventListener('DOMContentLoaded', () => {

  const nomeDoador = localStorage.getItem('doador_nome');
  const valorDoacao = localStorage.getItem('doador_valor');
  const copyButton = document.getElementById('copyPix');
  const pixCode = document.getElementById('pixCode');
  
  // Exibir os dados do doador
  document.getElementById('nome-doador').textContent = nomeDoador || 'N/A';
  document.getElementById('valor-doacao').textContent = valorDoacao || '0.00';
  
  // Se não houver dados de doação, redirecionar para a página inicial
  if (!nomeDoador || !valorDoacao) {
    alert('Informações de doação não encontradas. Redirecionando para a página inicial.');
    window.location.href = 'index.html';
    return;
  }
  
  // Botão para copiar código PIX
  if (copyButton) {
    copyButton.addEventListener('click', function() {
      pixCode.select();
      alert('Código PIX copiado para a área de transferência!');
    });
  }
  
  // Botão para confirmar pagamento
  const confirmButton = document.getElementById('confirmPayment');
  if (confirmButton) {
    confirmButton.addEventListener('click', async function() {
      try {
        // Criar e submeter a doação
        const db = window.db;
        const doacoesRef = window.collection(db, 'doacoes');
        
        await window.addDoc(doacoesRef, {
          nomeDoador: nomeDoador,
          valorDoacao: parseFloat(valorDoacao),
          dataDoacao: window.Timestamp.now(),
          modoPagamento: 'Pix'
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
        
        localStorage.removeItem('doador_nome');
        localStorage.removeItem('doador_valor');
        localStorage.removeItem('doador_modo');
        
        alert('Pagamento confirmado com sucesso! Obrigado pela doação.');
        window.location.href = 'agradecimentos.html';
      } catch (error) {
        console.error("Erro ao confirmar pagamento:", error);
        alert('Erro ao confirmar o pagamento. Por favor, tente novamente.');
      }
    });
  }
});