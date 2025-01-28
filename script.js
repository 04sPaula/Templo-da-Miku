class GerenciadorDoacoes {
    constructor() {
        this.doacoesRef = collection(window.db, 'doacoes');
        this.iniciarListenerDoacoes();
    }

    iniciarListenerDoacoes() {
        const q = window.query(this.doacoesRef, window.orderBy('dataDoacao', 'desc'));
        window.onSnapshot(q, snapshot => {
            this.atualizarTabela(snapshot);
        }, error => {
            console.error("Erro ao carregar doações:", error);
        });
    }

    async adicionarDoacao(doacao) {
        try {
            await window.addDoc(this.doacoesRef, {
                ...doacao,
                dataDoacao: window.Timestamp.now()
            });
        } catch (error) {
            console.error("Erro ao adicionar doação:", error);
        }
    }

    atualizarTabela(snapshot) {
        const corpoTabela = document.getElementById('corpoTabelaDoacoes');
        corpoTabela.innerHTML = '';

        snapshot.forEach(doc => {
            const doacao = doc.data();
            // Converter o timestamp do Firestore para Date
            const data = doacao.dataDoacao?.toDate() || new Date();
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doacao.nomeDoador}</td>
                <td>R$ ${parseFloat(doacao.valorDoacao).toFixed(2)}</td>
                <td>${data.toLocaleString()}</td>
                <td>${doacao.modoPagamento}</td>
            `;
            corpoTabela.appendChild(row);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gerenciador = new GerenciadorDoacoes();

    document.getElementById('doacaoForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const doacao = {
            nomeDoador: document.getElementById('nomeDoador').value,
            valorDoacao: parseFloat(document.getElementById('valorDoacao').value),
            modoPagamento: document.getElementById('modoPagamento').value
        };

        await gerenciador.adicionarDoacao(doacao);
        e.target.reset();
    });
});