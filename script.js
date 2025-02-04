class GerenciadorDoacoes {
    constructor() {
        this.doacoesRef = collection(window.db, 'doacoes');
        this.META = 500000;
        this.iniciarListenerDoacoes();
    }

    iniciarListenerDoacoes() {
        const q = window.query(this.doacoesRef, window.orderBy('dataDoacao', 'desc'));
        window.onSnapshot(q, snapshot => {
            if (document.getElementById('corpoTabelaDoacoes')) {
                this.atualizarTabela(snapshot);
            }
            if (document.getElementById('progress')) {
                this.atualizarProgressBar(snapshot);
            }
        }, error => {
            console.error("Erro ao carregar doações:", error);
        });
    }

    atualizarProgressBar(snapshot) {
        let totalArrecadado = 0;
        snapshot.forEach(doc => {
            const doacao = doc.data();
            const valor = parseFloat(doacao.valorDoacao || 0);
            totalArrecadado += valor;
        });

        const percentual = (totalArrecadado / this.META) * 100;
        const percentualLimitado = Math.min(percentual, 100);

        const progressBar = document.getElementById('progress');
        const progressText = document.getElementById('progress-text');

        if (progressBar && progressText) {
            progressBar.style.width = `${percentualLimitado}%`;
            progressText.textContent = `Arrecadado: R$ ${totalArrecadado.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} (${percentual.toFixed(1)}%)`;
        }
    }

    async adicionarDoacao(doacao) {
        try {
            const valorNumerico = parseFloat(doacao.valorDoacao);
            if (isNaN(valorNumerico)) {
                throw new Error('Valor da doação inválido');
            }

            await window.addDoc(this.doacoesRef, {
                ...doacao,
                valorDoacao: valorNumerico,
                dataDoacao: window.Timestamp.now()
            });
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
                valorDoacao: parseFloat(document.getElementById('valorDoacao').value),
                modoPagamento: document.getElementById('modoPagamento').value
            };
            await gerenciador.adicionarDoacao(doacao);
            e.target.reset();
        });
    }
});