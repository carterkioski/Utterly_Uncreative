function updateVis3(){
    var sentiment = new Sentiment();
    var result = sentiment.analyze('Cats are stupid.');
    console.log(result)
}
updateVis3()