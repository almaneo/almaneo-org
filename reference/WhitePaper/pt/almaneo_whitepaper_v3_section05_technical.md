## 5. Arquitetura Técnica

### Mesmo que a tecnologia seja complexa, a experiência deve ser simples.

O princípio de design técnico da AlmaNEO é claro: **Os usuários não precisam saber nada sobre blockchain.** A tecnologia complexa opera nos bastidores e os usuários utilizam o serviço de forma intuitiva.

---
### 5.1 Visão Geral do Sistema

**Arquitetura de 4 Camadas do Sistema AlmaNEO:**

| Camadas | Componentes | Funções |

|:---:|:---|:---|

| **1. Camada do Usuário** | Aplicativo AlmaNEO, Web3Auth, interface de chat com IA | Interação direta com o usuário |

| **2. Camada de Inteligência** | Fornecimento de modelos de IA, rede DePIN, localização de modelos | Fornecimento de serviços de IA |

| **3. Camada de Confiança** | Pontuação de Bondade, autenticação biométrica, emissão de Jeong-SBT | Verificação de identidade e contribuição |

| **4. Camada Blockchain** | Rede Polygon, Token ALMAN, Contratos Inteligentes | Infraestrutura Descentralizada |

**Fluxo de Dados:** Interação com o Usuário → Inteligência → Confiança → Blockchain (Comunicação Bidirecional entre Camadas)

---

### 5.2 Blockchain: Por que Polygon?

O AlmaNEO é construído na **Rede Polygon**.

#### Motivos da Escolha

| Critérios | Vantagens da Polygon |

|------|---------------|

| **Taxa de Gás** | Menos de US$ 0,01 por transação — Acessível mesmo para usuários no Sul Global |

| **Velocidade** | Confirmação de transação em até 2 segundos — Interação em tempo real |

| **Ecossistema** | Ecossistema DeFi e NFT maduro — Escalável |

| **Compatibilidade** | Totalmente compatível com Ethereum — Fácil de expandir |

| **Meio Ambiente** | Eficiente em termos de energia com base em PoS — Sustentável |

### Estrutura do Contrato Inteligente

### Estrutura do Contrato Inteligente

| Contrato | Descrição | Função Principal | | :--- | :--- | :--- |

| **Token ALMAN** | Token padrão ERC-20 | Fornecimento total: 8 bilhões, utilidade de crédito/staking/governança de IA |

| **Jeong-SBT** | ERC-5484 (SBT) | Token de alma intransferível, registro on-chain de Pontuação de Bondade |

| **Registro de Bondade** | Contrato de Verificação de Atividade | Verificação e registro de atividades de Bondade, sistema de votação com verificação por pares |

| **Acordo de Computação** | Contrato de Compartilhamento de Recursos | Registro e recompensas de nós DePIN, alocação automatizada de recursos computacionais |

| **Governança** | Contrato DAO | Proposta e votação da DAO, direitos de voto ponderados pela Pontuação de Bondade |

---

### 5.3 Experiência do Usuário: Design sem Barreiras

#### Web3Auth: Inicialização em 5 Segundos

A maior barreira de entrada nos serviços de blockchain existentes é a "criação de carteira". Anote suas 12 frases-semente, nunca as perca e mantenha suas chaves privadas em segurança. A maioria das pessoas desiste aqui.

**AlmaNEO é diferente.**

![AlmaNEO Technical](../assets/images/05.webp)

### Comparação entre o processo de integração tradicional e o processo de integração com AlmaNEO

| Categoria | Integração tradicional em blockchain | Integração com AlmaNEO |

| :--- | :--- | :--- |

| **Procedimento** | Instalar carteira → Gerar frase-semente → Armazenar em segurança → Copiar endereço → Comprar tokens → Enviar → Pagar taxa de gás → Usar o serviço (8 etapas) | Clicar em "Entrar com o Google" → Concluir (2 etapas) |

| **Tempo necessário** | 30 minutos a 1 hora | **5 segundos** |

| **Taxa de rejeição** | 90% ou mais | Mínima |

**Como funciona:**
- O Web3Auth cria automaticamente uma carteira não custodial com base na conta de mídia social do usuário.

- As chaves privadas são armazenadas de forma descentralizada, tornando-as inacessíveis tanto para o usuário quanto para a AlmaNEO.

- Os usuários podem usar todos os recursos sem precisar saber da existência da carteira.

#### Transações sem Gas: Sem Preocupações com Taxas

Outra barreira para a adoção do blockchain são as "taxas de gás". Ter que pagar uma taxa para cada transação, por menor que seja, pode ser um fardo significativo para novos usuários.

**Solução da AlmaNEO:**
- O padrão ERC-4337 (Abstração de Conta) é aplicado.

- A infraestrutura cobre a taxa de gás para transações básicas.

- Os usuários podem usar o serviço sem taxas.

---

### 5.4 Infraestrutura de IA: Distribuída e Otimizada

#### Otimização de Modelos

O AlmaNEO AI Hub fornece modelos de IA de código aberto otimizados.

| Tecnologia | Descrição | Efeito |
|------|------|------|
| **Quantização** | Ajuste de Precisão do Modelo | Redução de 70% na capacidade, 99% no desempenho |

| **LoRA** | Ajuste fino leve | Otimização de linguagem local |

| **Computação de Borda** | Computação no dispositivo | Disponível mesmo com internet instável |

#### Operação do Nó DePIN

Usuários do mundo todo conectam seus computadores à rede AlmaNEO para fornecer recursos computacionais.

Como Participar de um Nó:

1. Instale o software AlmaNEO Node (Windows, Mac, Linux)
2. Defina a quantidade de recursos a serem compartilhados (GPU, CPU, armazenamento)
3. Conecte-se à rede
4. Receba recompensas em tokens ALMAN com base na quantidade de recursos fornecidos.

**Segurança:**
- Todas as computações são executadas em um ambiente isolado dentro de um contêiner Docker.

- Os dados do usuário são protegidos com criptografia de ponta a ponta (E2EE).

- Nem mesmo os operadores do nó podem visualizar as consultas do usuário.

---

### 5.5 Verificação de Identidade: Humanos, Não Bots

Fornecer recursos de IA gratuitamente inevitavelmente leva a tentativas de abuso. Bots criarão dezenas de milhares de contas para monopolizar os recursos.

A AlmaNEO implementa o princípio de **"Uma Pessoa, Uma Conta"** por meio da tecnologia.

---

---

---

### 5.5 Verificação de Identidade: Humanos, Não Bots

O fornecimento gratuito de recursos de IA inevitavelmente leva a tentativas de abuso. Bots criarão dezenas de milhares de contas para monopolizar os recursos.

A AlmaNEO implementa o princípio de **"Uma Pessoa, Uma Conta"** por meio da tecnologia. #### Prova de Personalidade em Múltiplas Camadas

### Prova de Personalidade em Múltiplas Camadas

1. **Camada 1: Autenticação de Dispositivo**
- Detecção de dispositivos duplicados usando a impressão digital do dispositivo
2. **Camada 2: Autenticação Social**
- Verificação básica de identidade vinculando contas de redes sociais
3. **Camada 3: Autenticação Biométrica (Opcional)**
- Obtenha classificações mais altas com Face ID e outros métodos de autenticação
4. **Camada 4: Análise Comportamental**

- Distingue entre bots e humanos com base em padrões de uso
5. **Camada 5: Endosso da Comunidade**
- Maior confiança por meio de recomendações de membros existentes

**Sistema de Classificação:**

|Classificação | Nível de Autenticação | Créditos Diários Gratuitos de IA |

|------|----------|-------------------|

| Básico | Somente Login Social | 10 vezes |

| Verificado | Dispositivo + Social | 50 vezes |

| Confiável | Autenticação biométrica adicionada | 200 vezes |

| Guardião | Alta Pontuação de Bondade | Ilimitado |

---

### 5.6 Privacidade: Seus dados pertencem a você

A AlmaNEO não coleta dados do usuário.

#### Princípios de Privacidade

| Princípios | Implementação |

|------|------|

| **Conversas sem armazenamento** | As conversas com IA não são armazenadas em servidores |

| **Criptografia local** | Os dados do usuário são criptografados no dispositivo com AES-256 |

| **Análise anônima** | Os dados são totalmente anonimizados para aprimoramento do serviço |

| **Utilização do Protocolo de Conhecimento Zero** | Proteção da privacidade ao verificar a Pontuação de Bondade |

> *"Não sabemos o que você perguntou. Tudo o que sabemos é o quão gentil você é."*

---

### 5.7 Resumo do Roteiro Tecnológico

| Fase | Período | Principais Desenvolvimentos |

|------|------|----------|

| **Alpha** | 1º-2º trimestre de 2025 | Implantação da Testnet, Verificação das Funções Principais |
| **Beta** | 3º-4º trimestre de 2025 | Implantação da Mainnet, Expansão dos Nós DePIN |

| **V1.0** | 1º trimestre de 2026 | Lançamento Oficial, Suporte Multilíngue |

| **V2.0** | 2º semestre de 2026 | Recursos Avançados, Expansão do Ecossistema |

---

*A seção a seguir detalha a estrutura econômica do token ALMAN.*

