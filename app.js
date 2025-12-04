const { createApp } = Vue;

createApp({
    data() {
        return {
            numero1: '',
            numero2: '',
            operacao: 'soma',
            historico: [],
            repoUrl: 'https://github.com/seu-usuario/calculadora-vuejs'
        };
    },
    
    computed: {
        resultado() {
            // Converter para números (float para permitir decimais)
            const num1 = parseFloat(this.numero1) || 0;
            const num2 = parseFloat(this.numero2) || 0;
            
            let resultado;
            
            switch(this.operacao) {
                case 'soma':
                    resultado = num1 + num2;
                    break;
                case 'subtracao':
                    resultado = num1 - num2;
                    break;
                case 'multiplicacao':
                    resultado = num1 * num2;
                    break;
                case 'divisao':
                    // Evitar divisão por zero
                    resultado = num2 !== 0 ? num1 / num2 : 'Indefinido';
                    break;
                case 'potencia':
                    resultado = Math.pow(num1, num2);
                    break;
                case 'resto':
                    resultado = num2 !== 0 ? num1 % num2 : 'Indefinido';
                    break;
                default:
                    resultado = 0;
            }
            
            // Se for um número, formatar para remover zeros desnecessários após a vírgula
            if (typeof resultado === 'number') {
                // Verificar se é um número inteiro
                if (Number.isInteger(resultado)) {
                    return resultado;
                } else {
                    // Arredondar para no máximo 8 casas decimais
                    return parseFloat(resultado.toFixed(8));
                }
            }
            
            return resultado;
        },
        
        resultadoFormatado() {
            if (this.numero1 === '' && this.numero2 === '') {
                return 'Aguardando valores...';
            }
            
            if (this.resultado === 'Indefinido') {
                return 'Indefinido (divisão por zero)';
            }
            
            return this.resultado;
        },
        
        resultClass() {
            if (this.resultado === 'Indefinido') {
                return 'error';
            }
            return '';
        },
        
        expressaoCalculo() {
            const num1 = this.numero1 === '' ? '0' : this.numero1;
            const num2 = this.numero2 === '' ? '0' : this.numero2;
            
            const operadores = {
                soma: '+',
                subtracao: '-',
                multiplicacao: '×',
                divisao: '÷',
                potencia: '^',
                resto: '%'
            };
            
            return `${num1} ${operadores[this.operacao]} ${num2}`;
        }
    },
    
    watch: {
        resultado(newVal, oldVal) {
            // Evitar adicionar ao histórico quando os campos estão vazios
            if (this.numero1 === '' && this.numero2 === '') return;
            
            // Evitar adicionar ao histórico quando o resultado não mudou
            if (newVal === oldVal) return;
            
            // Evitar adicionar "Aguardando valores..." ao histórico
            if (newVal === 'Aguardando valores...') return;
            
            // Adicionar ao histórico apenas se for um cálculo válido
            if (newVal !== undefined && newVal !== 'Indefinido') {
                this.adicionarAoHistorico();
            }
        }
    },
    
    methods: {
        adicionarAoHistorico() {
            // Limitar o histórico aos últimos 10 cálculos
            if (this.historico.length >= 10) {
                this.historico.pop();
            }
            
            this.historico.unshift({
                expressao: this.expressaoCalculo,
                resultado: this.resultadoFormatado,
                timestamp: new Date().toLocaleTimeString()
            });
        },
        
        limparHistorico() {
            this.historico = [];
        }
    },
    
    mounted() {
        // Carregar histórico do localStorage se existir
        const historicoSalvo = localStorage.getItem('calculadoraHistorico');
        if (historicoSalvo) {
            this.historico = JSON.parse(historicoSalvo);
        }
    },
    
    updated() {
        // Salvar histórico no localStorage
        localStorage.setItem('calculadoraHistorico', JSON.stringify(this.historico));
    }
}).mount('#app');
