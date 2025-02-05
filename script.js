import { 
    collection, addDoc, doc, getDoc, setDoc, updateDoc, increment, onSnapshot, query, orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

class GerenciadorDoacoes {
    constructor() {
        this.db = window.db;
        this.doacoesRef = collection(this.db, 'doacoes');
        this.estatisticasRef = doc(this.db, "estatisticas", "doacoes");

        this.iniciarListenerDoacoes();
    }

    iniciarListenerDoacoes() {
        const q = query(this.doacoesRef, orderBy('dataDoacao', 'desc'));

        onSnapshot(q, snapshot => {
            if (document.getElementById('corpoTabelaDoacoes')) {
                this.atualizarTabela(snapshot);
            }
        }, error => {
            console.error("Erro ao carregar doações:", error);
        });
    }

    async adicionarDoacao(doacao) {
        try {
            const valorNumerico = parseFloat(doacao.valorDoacao);
            if (isNaN(valorNumerico)) {
                throw new Error('Valor da doação inválido');
            }

            // Adiciona a nova doação
            await addDoc(this.doacoesRef, {
                ...doacao,
                valorDoacao: valorNumerico,
                dataDoacao: window.Timestamp.now()
            });

            console.log("Doação registrada com sucesso!");

            await updateDoc(this.estatisticasRef, {
                totalArrecadado: increment(valorNumerico)
            });

            console.log("Total arrecadado atualizado no Firestore!");

            this.atualizarProgressBar();

        } catch (error) {
            console.error("Erro ao adicionar doação:", error);
        }
    }

    atualizarTabela(snapshot) {
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
}

document.addEventListener('DOMContentLoaded', () => {
    const gerenciador = new GerenciadorDoacoes();

    const form = document.getElementById('doacaoForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const doacao = {
                nomeDoador: document.getElementById('nomeDoador').value,
                valorDoacao: document.getElementById('valorDoacao').value,
                modoPagamento: document.getElementById('modoPagamento').value
            };
            await gerenciador.adicionarDoacao(doacao);
            e.target.reset();
        });
    }
});