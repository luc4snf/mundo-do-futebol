# Mundo do Futebol

Site acadêmico responsivo feito com HTML, CSS e JavaScript.

## Persona

**Rafa, 16 anos**, estudante e torcedor que acompanha futebol pelo celular. Quer encontrar conteúdo rápido e fácil de ler sobre notícias, clubes e curiosidades, sem precisar conhecer termos técnicos. Por isso, o site usa navegação curta, linguagem direta e um layout que se adapta ao celular.

## O que já está no projeto

- Cinco links no menu: Início, Notícias, Times, Curiosidades e Contato.
- Layout adaptável a celular e computador.
- Menu hamburger para telas menores.
- Formulário com validação do navegador e exibição dos dados digitados.
- Mini-jogo Chute ao Gol, com personagem, goleiro animado, pontuação e cinco tentativas.
- Acessibilidade básica: rótulos, foco visível, atalho para conteúdo e suporte a reduzir movimento.

## Abrir no VS Code

1. Abra o VS Code.
2. Selecione **Arquivo > Abrir Pasta...** e escolha a pasta deste projeto.
3. Abra `index.html` para explorar a página. Para ver alterações enquanto edita, use uma extensão de servidor local, como Live Server, ou abra o arquivo no navegador.

## Publicar no GitHub Pages

O workflow em `.github/workflows/pages.yml` publica o site quando há uma atualização na branch `main`. No GitHub, abra **Settings > Pages** e confirme que a fonte está definida como **GitHub Actions**. Depois acompanhe a execução em **Actions**; quando terminar, o endereço do site aparece em **Settings > Pages**.

## Roteiro para recriar o jogo em Low Code (Construct 3)

O mini-jogo desta versão funciona diretamente no navegador e foi programado em JavaScript. Se a avaliação exigir que o jogo seja criado dentro de uma ferramenta Low Code, use este roteiro no Construct 3:

1. Crie um projeto vazio em paisagem e uma cena de 720 x 340.
2. Adicione os objetos `Campo`, `Gol`, `Jogador`, `Goleiro`, `Bola`, `Alvo`, `TextoGols`, `TextoChutes` e `BotaoChutar`. Use sprites ou formas simples desenhadas no editor.
3. Crie variáveis globais `gols = 0`, `chutes = 5` e `chutando = falso`.
4. No início da cena, posicione os personagens e mostre os valores das variáveis nos textos.
5. A cada instante, mova o goleiro suavemente de um lado para o outro. Ao clicar em `BotaoChutar`, se ainda houver chutes e a bola não estiver em movimento, diminua `chutes`, aplique velocidade à bola na direção do alvo e marque `chutando = verdadeiro`.
6. Quando a bola tocar o goleiro, mostre “Defesa” e reposicione a bola. Quando tocar a área do gol sem tocar no goleiro, some um gol e mostre “Gol”. Quando sair do campo, mostre “Pra fora”. Em todos os casos, pare a bola e atualize os textos.
7. Ao terminar os cinco chutes, mostre o resultado e um botão para reiniciar. Anime o goleiro e a bola para dar movimento ao cenário.

Esses eventos usam condições, variáveis, colisões e ações visuais do editor. O jogo em JavaScript já permite testar a mecânica; o roteiro descreve como montar a versão Low Code pedida pela rubrica.

> O formulário valida e mostra os dados somente nesta página. Para receber mensagens de verdade, será necessário conectar um serviço ou servidor.

