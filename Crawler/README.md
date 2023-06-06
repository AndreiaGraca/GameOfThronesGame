##Executar o crawler
- docker-compose build
- docker-compose up

## Endpoints

#### Swagger
https://localhost:7094/swagger/index.html

#### NewGame
https://localhost:7094/NewGame/Get

Nota: Devolve uma lista de 10 objetos do tipo GameQuestion, que contém a frase (Quote, string) e uma lista de objetos GameQuestionOption, que são as opções; Estes objetos têm o nome do personagem (string Option), se é a personagem correta ou não (bool IsCorrect) e um booleano para guardar se o utilizador selecionou aquela opção (bool IsSelected);

#### Score
https://localhost:7094/UserScore/Post

Recebe um objeto do tipo NewGame, que contém o nome do utilizador (string UserName) e a lista de questões com as respostas do utilizador (lista de objetos GameQuestion); Calcula o score e a personagem que o utilizador "acertou" mais vezes e devolve (Objeto ScoreResult com int Score e string FavoriteCharacter);

#### Top Players
https://localhost:7094/TopPlayers/Get

Recebe uma lista com 3 users que são os jogadores com melhores pontuações (lista de objetos GameStats, que contém username, score, e lista de respostas dadas).
