class Doacao {
    constructor(nomeDoador, valorDoacao, modoPagamento) {
        this.idDoacao = null;
        this.nomeDoador = nomeDoador;
        this.valorDoacao = valorDoacao;
        this.dataDoacao = new Date();
        this.modoPagamento = modoPagamento;

        if (this.valorDoacao <= 0) {
            throw new Error('Valor da doação deve ser maior que zero');
        }
    }

    static get MODOS_PAGAMENTO() {
        return {
            CARTAO: 'Cartao',
            PIX: 'Pix',
        };
    }

        // Getters
        get idDoacao() {
            return this._idDoacao;
        }
    
        get nomeDoador() {
            return this._nomeDoador;
        }
    
        get valorDoacao() {
            return this._valorDoacao;
        }
    
        get dataDoacao() {
            return this._dataDoacao;
        }
    
        get modoPagamento() {
            return this._modoPagamento;
        }
    
        // Setters
        set idDoacao(value) {
            this._idDoacao = value;
        }
    
        set nomeDoador(value) {
            this._nomeDoador = value;
        }
    
        set valorDoacao(value) {
            if (value <= 0) {
                throw new Error('Valor da doação deve ser maior que zero');
            }
            this._valorDoacao = value;
        }
    
        set modoPagamento(value) {
            const validModos = ['Cartao', 'Pix', 'Especie', 'Boleto'];
            if (!validModos.includes(value)) {
                throw new Error('Modo de pagamento inválido');
            }
            this._modoPagamento = value;
        }
}

export default Doacao;