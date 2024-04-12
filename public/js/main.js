document.getElementById("cocktailButton").addEventListener("click", getDrink);

function getDrink() {
  let drink = document.getElementById("cocktailName").value;

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`)
    .then(res => res.json())
    .then(data => {
      console.log(data.drinks[0]);
      document.querySelector("#cocktailTitle").innerText =
        data.drinks[0].strDrink;
      document.querySelector("#cocktailImg").src = data.drinks[0].strDrinkThumb;
      document.querySelector("#cocktailInstructions").innerText =
        data.drinks[0].strInstructions;
    })
    .catch(err => {
      console.log(`Error ${err}`);
    });
}
