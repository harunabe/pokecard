// カードリストのDOM
const cardlist = document.querySelector(".cardlist");

// ボタンのDOM
const button = document.querySelector(".button");

// 「カードを引く」ボタンを押したら表示
button.addEventListener("click",function(){
    getPokemon();
});

// ポケモンのAPI取得
async function getPokemon(){
   const promises = [];

//    5つのランダムな数値を配列に代入
   const randomNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 151) + 1);
   
    // ポケモンのAPIランダムに５つ取得
   for(const num of randomNumbers) {
    const url = `https:pokeapi.co/api/v2/pokemon/${num}`;

    // Promiseの配列に結果を代入
    promises.push(await fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('ネットワークエラーが発生しました');
        }
        return response.json();
    }))
};

   Promise.all(promises).then( results => {
       const pokemon = results.map((data) => ({
           name: data.name,
           id: data.id,
           image: data.sprites.other['official-artwork'].front_default,
           ex: data.base_experience,
           type: data.types.map((type) => type.type.name).join(' '),
           moves: data.moves.map((move) => move.move)
       }));
    
    //    日本語名取得
       japaneseName(pokemon);
   });
};

// ポケモンの表示
async function displayPokemon(pokemon){
    console.log(pokemon);
    let pokemonHTNLString = "";
    for( poke of pokemon ){
        pokemonHTNLString +=
        `<li class="card  ${poke.type}">
        <h2 class="card-name">${poke.name}</h2>
        <p class="card-hp ${poke.type}"><span>HP</span> ${poke.ex}</p>
        <div class="card-image"><img src="${poke.image}"/></div>
        <p class="card-move">${poke.moves} </p>
        </li>  `
    }


   cardlist.innerHTML = pokemonHTNLString;
};

// 日本語名の取得
async function japaneseName(pokemon){
    for( poke of pokemon ){
        // 日本語名
        const nameurl = `https://pokeapi.co/api/v2/pokemon-species/${poke.name}`;
        await fetch(nameurl)
        .then(response => {
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました');
            }
            return response.json();
        }).then(results => {
            for(info of results["names"]){
                if(info["language"]["name"] == 'ja-Hrkt'){
                    poke.name = info['name']; 
                    break;
                }
            }
        })
        .catch(error => {
            console.error('Fetchエラー', error);
        });

        // 技の日本語名
        // 2つのランダムな数値を配列に代入
        const randMoves = Array.from({ length: 2 }, () => Math.floor(Math.random() * poke.moves.length) + 1);
        poke.moves = "";
        for(i in randMoves){
                const moveurl = `https://pokeapi.co/api/v2/move/${randMoves[i]}`;
                await fetch(moveurl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('ネットワークエラーが発生しました');
                    }
                    return response.json();
                }).then(results => {
                    for(info of results["names"]){
                        if(info["language"]["name"] == 'ja-Hrkt'){
                            poke.moves += info['name'] + "<br>"; 
                            break;
                        }
                    }
                })
                .catch(error => {
                    console.error('Fetchエラー', error);
                });
        }
    }

    // カードを表示
    await displayPokemon(pokemon);
}