
# CineScope - Projeto Firebase Studio

Este é um projeto Next.js criado e customizado no Firebase Studio. Abaixo estão as instruções para configurar e rodar o projeto localmente.

## Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados:

- [Node.js](https://nodejs.org/en) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) (geralmente instalado junto com o Node.js)
- [Git](https://git-scm.com/downloads)

## Como Iniciar o Projeto Localmente

Siga estes passos para ter o projeto rodando na sua máquina.

### 1. Clone o Repositório

Primeiro, clone o repositório para o seu computador. Você pode obter a URL de clone diretamente da interface do Firebase Studio.

```bash
git clone [URL_DO_SEU_REPOSITÓRIO]
```

### 2. Navegue até a Pasta do Projeto

Entre na pasta que foi criada pelo comando `clone`:

```bash
cd nome-do-projeto
```

### 3. Instale as Dependências

Use o `npm` para instalar todos os pacotes necessários para o projeto.

```bash
npm install
```

Este comando lerá o arquivo `package.json` e baixará todas as bibliotecas listadas, como React, Next.js, Tailwind, etc.

### 4. Inicie o Servidor de Desenvolvimento

Após a instalação, inicie o servidor de desenvolvimento com o seguinte comando:

```bash
npm run dev
```

O terminal indicará que o servidor está rodando. Geralmente, ele estará acessível no seguinte endereço:

**[http://localhost:3000](http://localhost:3000)**

### 5. Abra no Navegador

Abra seu navegador e acesse `http://localhost:3000`. Você verá a aplicação CineScope funcionando! Qualquer alteração que você fizer nos arquivos do projeto será refletida automaticamente no navegador.
