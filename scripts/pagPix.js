import { getFirestore, collection, addDoc, updateDoc, doc, getDoc, setDoc, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

  const nomeDoador = localStorage.getItem('doador_nome');
  const valorDoacao = localStorage.getItem('doador_valor');
  const copyButton = document.getElementById('copyPix');
  const pixCode = document.getElementById('pixCode');
  
  document.getElementById('nome-doador').textContent = nomeDoador || 'N/A';
  document.getElementById('valor-doacao').textContent = valorDoacao || '0.00';
  
  if (!nomeDoador || !valorDoacao) {
    alert('Informações de doação não encontradas. Redirecionando para a página inicial.');
    window.location.href = '../telas/index.html';
    return;
  }
  
  if (copyButton) {
    copyButton.addEventListener('click', function() {
      pixCode.select();
      alert('Código PIX copiado para a área de transferência!');
    });
  }
  
  const confirmButton = document.getElementById('confirmPayment');
  if (confirmButton) {
    confirmButton.addEventListener('click', async function() {
      try {
        const db = window.db;
        const doacoesRef = window.collection(db, 'doacoes');
        
        await window.addDoc(doacoesRef, {
          nomeDoador: nomeDoador,
          valorDoacao: parseFloat(valorDoacao),
          dataDoacao: window.Timestamp.now(),
          modoPagamento: 'Pix'
        });
        
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
        window.location.href = '../telas/agradecimentos.html';
      } catch (error) {
        console.error("Erro ao confirmar pagamento:", error);
        alert('Erro ao confirmar o pagamento. Por favor, tente novamente.');
      }
    });
  }
});